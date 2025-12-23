import { createSignal } from 'solid-js';

export const [needRefresh, setNeedRefresh] = createSignal(false);
export const [offlineReady, setOfflineReady] = createSignal(false);
export const [swVersion, setSwVersion] = createSignal<string | undefined>();
export const [swBuildTime, setSwBuildTime] = createSignal<string | undefined>();
export const [waiting, setWaiting] = createSignal<ServiceWorker | null>(null);
export const [logs, setLogs] = createSignal<string[]>([]);

let updateFn: () => Promise<void> = () => Promise.resolve();

function log(msg: string) {
  setLogs(l => [...l.slice(-199), msg]);
  console.log(msg);
}

export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    log('[sw-reg] serviceWorker not supported');
    return;
  }
  import('virtual:pwa-register/solid').then(({ useRegisterSW }) => {
    const { updateServiceWorker } = useRegisterSW({
      immediate: false,
      onRegisteredSW(_url, reg) {
        log(`[sw-reg] registered ${_url}`);
        if (reg?.waiting) {
          setNeedRefresh(true);
          setWaiting(reg.waiting);
        }
        reg?.addEventListener('updatefound', () => {
          const ins = reg.installing;
          if (ins) ins.addEventListener('statechange', () => {
            if (ins.state === 'installed' && reg.waiting) {
              log('[sw-reg] new version waiting');
              setNeedRefresh(true);
              setWaiting(reg.waiting);
            }
          });
        });
      },
      onRegisterError(e) {
        log('[sw-reg] register error ' + e);
        fallbackManual();
      },
      onNeedRefresh() {
        log('[sw-reg] need refresh');
        setNeedRefresh(true);
      },
      onOfflineReady() {
        log('[sw-reg] offline ready');
        setOfflineReady(true);
      }
    });
    updateFn = updateServiceWorker;
    attachMessaging();
    setTimeout(() => {
      if (!navigator.serviceWorker.controller) {
        log('[sw-reg] no controller after delay -> manual fallback');
        fallbackManual();
      }
    }, 2500);
  }).catch(err => {
    log('[sw-reg] dynamic import failed ' + err);
    fallbackManual();
  });
}

async function fallbackManual() {
  try {
    const swUrl = '/claims-sw.js';
    const reg = await navigator.serviceWorker.register(swUrl, { type: 'module' });
    log('[sw-reg][fallback] success');
    attachMessaging();
    reg.update();
  } catch (e) {
    log('[sw-reg][fallback] failed ' + e);
  }
}

function attachMessaging() {
  if ((attachMessaging as any)._attached) return;
  (attachMessaging as any)._attached = true;
  navigator.serviceWorker.addEventListener('message', (e) => {
    const d = e.data || {};
    if (d.type === 'SW_ACTIVATED') {
      if (d.version) setSwVersion(d.version);
      if (d.buildTime) setSwBuildTime(d.buildTime);
      if (!offlineReady()) setOfflineReady(true);
      log(`[sw-msg] activated v=${d.version}`);
    } else if (d.type === 'PONG' && d.version) {
      setSwVersion(d.version);
      log('[sw-msg] pong ' + d.version);
    }
  });
  navigator.serviceWorker.ready.then(reg => {
    reg.active?.postMessage({ type: 'PING' });
    setTimeout(() => {
      if (!offlineReady()) {
        log('[sw-reg] forcing offline ready after timeout');
        setOfflineReady(true);
      }
    }, 2000);
  });
}

export async function applyUpdateAndReload() {
  if (waiting()) {
    waiting()!.postMessage({ type: 'SKIP_WAITING' });
  }
  await updateFn();
  window.location.reload();
}

export function dismissOfflineToast() {
  setOfflineReady(false);
  setNeedRefresh(false);
}