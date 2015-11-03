import React from 'react';
import OmniInput from './omni-input.jsx';
import {splitVertical, splitHorizontal, closeTile} from '../actions';

const bar_style = {
    paddingLeft: global.process.platform === 'darwin' ? '80px' : undefined
};

function getButtonClass(enabled) {
    if (enabled) {
        return 'btn btn-default';
    } else {
        return 'btn btn-default disabled';
    }
}

function renderRefreshButton(page) {
    if (page && page.loading) {
        return (
            <button className={getButtonClass(!!page)} onClick={() => page && page.stop()}>
                <span className="icon icon-cancel"/>
            </button>
        );
    } else {
        return (
            <button className={getButtonClass(!!page)} onClick={() => page && page.reload()}>
                <span className="icon icon-arrows-ccw"/>
            </button>
        );
    }
}

export default function AddressBar(props) {
    const {dispatch, page, tileId} = props;
    // TODO:
    // When platform is not OS X, remove the padding
    return (
        <header className="toolbar toolbar-header" style={bar_style}>
            <div className="toolbar-actions">
                <div className="btn-group">
                    <button className="btn btn-default" onClick={() => dispatch(splitVertical())}>
                        <span className="icon icon-arrow-combo vertical"/>
                    </button>
                    <button className="btn btn-default" onClick={() => dispatch(splitHorizontal())}>
                        <span className="icon icon-arrow-combo"/>
                    </button>
                </div>
                <div className="btn-group">
                    <button className={getButtonClass(page && page.can_go_back)} onClick={() => page && page.goBack()}>
                        <span className="icon icon-left-bold"/>
                    </button>
                    <button className={getButtonClass(page && page.can_go_forward)} onClick={() => page && page.goForward()}>
                        <span className="icon icon-right-bold"/>
                    </button>
                </div>
                {renderRefreshButton(page)}
                <OmniInput dispatch={dispatch} tileId={tileId} page={page}/>
                <div className="flatbutton" onClick={() => dispatch(closeTile(tileId))}>
                    <span className="icon icon-cancel-circled"/>
                </div>
                <div className="flatbutton">
                    <span className="icon icon-menu"/>
                </div>
            </div>
        </header>
    );
}

