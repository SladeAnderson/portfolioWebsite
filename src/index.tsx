/* @refresh reload */
import { ErrorBoundary, render } from 'solid-js/web';
import { Router, Route } from '@solidjs/router';
import 'solid-devtools';
import "./index.scss"
import App from './App';
import { registerServiceWorker } from './pwa/register';
import { RootApp } from './components/rootApp';
import ReloadPrompt from './ReloadPrompt';
import { Projects } from './components/projects/project';

const root = document.getElementById('root');
if (!root) {
  console.error("ROOT ELEMENT NOT FOUND! Application cannot mount!");
  document.body.innerHTML = `
    <div style="color: red; background: white; padding: 20px; font-family: sans-serif;">
      <h1>Critical Error</h1>
      <p>The application could not find the root element to mount on.</p>
    </div>
  `;
} else {
  console.log("Root element found, continuing initialization");
}

if (root) {
  root.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; flex-direction: column;">
      <h2>Loading application...</h2>
      <p>Please wait while the app initializes</p>
    </div>
  `;

  setTimeout(()=>{
    root.innerHTML = '';
    render(() => (
      <ErrorBoundary fallback={(err)=> (
        <div style="padding: 20px; color: red; background: white;">
          <h2>Something went wrong rendering the application</h2>
          <pre>{err.toString()}</pre>
          <button onClick={() => window.location.reload()}>Reload Application</button>
        </div>
      )}>
        <ReloadPrompt />
        <Router root={RootApp}>
          <Route path="/" component={App} />
          <Route path="/Projects" component={Projects}/>
        </Router>
      </ErrorBoundary>
    ), root); 
  },100)
}

if (root) registerServiceWorker();