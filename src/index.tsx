import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import {defineCustomElements} from '@ionic/pwa-elements/loader'

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

serviceWorkerRegistration.unregister();

reportWebVitals();

defineCustomElements(window)
