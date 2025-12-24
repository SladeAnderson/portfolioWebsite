import styles from './App.module.scss';
import { Accessor, Component, createEffect, createSignal } from 'solid-js';
import ReloadPrompt from './ReloadPrompt';
import { useSlideTransition } from './shared/customHooks/PageTransition';

const App: Component = () => {
  const [SlideClass, setSlideClass] = createSignal<string>('');

  const { slideDirection, isSliding, slideClass } = useSlideTransition();

  const animationClass = slideClass();


  return <div class={`${styles.AppBody} ${animationClass()}`}>
    <div>
      <h1>Slade B. Anderson</h1>
      <h2>"Success is not final; failure is not fatal: it is the courage to continue that counts" - Winston Churchill</h2>
    </div>
  </div>
};

export default App;
