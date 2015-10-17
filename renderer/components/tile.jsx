import React from 'react';
import AddressBar from './address-bar.jsx';
import OmniInput from './omni-input.jsx';
import WebPage from './web-page.jsx';
import {changeFocus} from '../actions';

function renderAddressBar(dispatch, leaf, focused) {
    if (!focused) {
        return undefined;
    }

    return (
        <div className="addr-bar-wrapper animated fadeInUp">
            <AddressBar dispatch={dispatch} tileId={leaf.id}/>
        </div>
    );
}

function renderContent(page, dispatch, leaf, focused) {
    if (page) {
        return <WebPage webview={page.webview} focused={focused}/>;
    } else {
        return (
            <div className="new-window">
                <OmniInput dispatch={dispatch} tileId={leaf.id} autoFocus/>
            </div>
        );
    }
}

export default function Tile(props) {
    const {current_id, leaf, pages, dispatch, style} = props;
    const focused = current_id === leaf.id;
    const name = focused ? 'tile focused' : 'tile';
    const page = pages[leaf.id];
    return (
        <div className={name} style={style} onMouseOver={() => dispatch(changeFocus(leaf.id))}>
            {renderContent(page, dispatch, leaf, focused)}
            {renderAddressBar(dispatch, leaf, focused)}
        </div>
    );
}
