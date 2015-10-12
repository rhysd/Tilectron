import React from 'react'
import ReactDOM from 'react-dom'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import tilectron from './reducers'
import App from './components/app.jsx'

require('electron-cookies');

let store = createStore(tilectron);

ReactDOM.render(
        <Provider store={store}>
            <App/>
        </Provider>,
        document.querySelector('.app')
    );
