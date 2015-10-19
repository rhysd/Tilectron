import React from 'react';
import AddressBar from './address-bar.jsx';
import WebPage from './web-page.jsx';
import {changeFocus} from '../actions';
import StartPage from './start-page.jsx';

function renderAddressBar(page, dispatch, leaf, focused) {
    if (!focused) {
        return undefined;
    }

    return (
        <div className="addr-bar-wrapper animated fadeInUp">
            <AddressBar page={page} dispatch={dispatch} tileId={leaf.id}/>
        </div>
    );
}

function renderContent(page, dispatch, leaf, focused, histories) {
    if (page) {
        return <WebPage webview={page.webview} focused={focused}/>;
    } else {
        return (
            <StartPage tileId={leaf.id} focused={focused} histories={histories} dispatch={dispatch}/>
        );
    }
}

export default function Tile(props) {
    const {current_id, leaf, pages, dispatch, style, histories} = props;
    const focused = current_id === leaf.id;
    const name = focused ? 'tile focused' : 'tile';
    const page = pages[leaf.id];

    return (
        <div className={name} style={style} onMouseOver={() => dispatch(changeFocus(leaf.id))}>
            {renderContent(page, dispatch, leaf, focused, histories)}
            {renderAddressBar(page, dispatch, leaf, focused)}
        </div>
    );
}
