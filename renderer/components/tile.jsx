import React from 'react';
import WebPage from './web-page.jsx';
import {changeFocus} from '../actions';
import StartPage from './start-page.jsx';

export default function Tile(p) {
    const {current_id, leaf, pages, dispatch, searches, style} = p;
    const focused = current_id === leaf.id;
    const page = pages.get(leaf.id);

    const props = {
        className: focused ? 'tile focused' : 'tile',
        style,
        onMouseOver: () => dispatch(changeFocus(leaf.id))
    };

    if (page) {
        return (
            <div {...props}>
                <WebPage page={page} focused={focused}/>
            </div>
        );
    } else {
        return (
            <div {...props}>
                <StartPage tileId={leaf.id} focused={focused} search={searches.get(leaf.id)} dispatch={dispatch}/>
            </div>
        );
    }
}
