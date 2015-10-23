import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import App from './components/app.tsx';
import Store from './store';

require('electron-cookies');

ReactDOM.render(
        <Provider store={Store}>
            <App/>
        </Provider>,
        document.querySelector('.app')
    );
