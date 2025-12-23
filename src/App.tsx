import styles from './App.module.scss';
import { Component, createSignal } from 'solid-js';
import ReloadPrompt from './ReloadPrompt';

const App: Component = () => {
  const [counter, setCounter] = createSignal(0);
  setInterval(setCounter, 1000, (c: number) => c + 1);

  return <div class={`${styles.AppBody}`}>
    <div>
      <h1>Slade B. Anderson</h1>
      <h2>"Success is not final; failure is not fatal: it is the courage to continue that counts" - Winston Churchill</h2>
    </div>
  </div>
};

export default App;
