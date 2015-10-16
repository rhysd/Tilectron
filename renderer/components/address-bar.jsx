import React from 'react';
import OmniInput from './omni-input.jsx';
import {splitVertical, splitHorizontal, closeTile} from '../actions';

function disabledClass(attr, enabled) {
    if (enabled) {
        return attr;
    } else {
        return attr + ' disabled';
    }
}

function renderRefreshButton(page) {
    if (page && page.loading) {
        return <i className={disabledClass('fa fa-times icon-button', !!page)} onClick={() => page && page.stop()}/>;
    } else {
        return <i className={disabledClass('fa fa-refresh icon-button', !!page)} onClick={() => page && page.reload()}/>;
    }
}

export default function AddressBar(props) {
    const {dispatch, page, tileId} = props;
    return (
        <div className="address-bar">
            <div className="split leftside-button" onClick={() => dispatch(splitVertical())}>
                <i className="fa fa-arrows-h"/>
            </div>
            <div className="split rightside-button" onClick={() => dispatch(splitHorizontal())}>
                <i className="fa fa-arrows-v"/>
            </div>
            <div className={disabledClass('leftside-button', page && page.can_go_back)} onClick={() => page && page.goBack()}>
                <i className="fa fa-arrow-left"/>
            </div>
            <div className={disabledClass('rightside-button', page && page.can_go_forward)} onClick={() => page && page.goForward()}>
                <i className="fa fa-arrow-right"/>
            </div>
            {renderRefreshButton(page)}
            <OmniInput dispatch={dispatch} tileId={tileId} page={page}/>
            <i className="fa fa-times icon-button" onClick={() => dispatch(closeTile(tileId))}/>
        </div>
    );
}

