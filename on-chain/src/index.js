import React from 'react';
import ReactDOM from 'react-dom';

import { DrizzleProvider } from 'drizzle-react';

import { store } from './store';
import drizzleOptions from './drizzleOptions';

import App from './containers/App';
import './styles/main.scss';

import registerServiceWorker from './registerServiceWorker';

ReactDOM.render((
    <DrizzleProvider options={drizzleOptions} store={store}>
        <App />
    </DrizzleProvider>
), document.getElementById('root'));
registerServiceWorker();
