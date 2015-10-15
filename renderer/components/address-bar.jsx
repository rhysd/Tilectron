import React, {Component, PropTypes} from 'react';
import OmniInput from './omni-input.jsx';
import {splitVertical, splitHorizontal, closeTile} from '../actions';

export default class AddressBar extends Component {
    render() {
        const {dispatch, webview, tileId} = this.props;
        return (
            <div className="address-bar">
                <div className="split leftside-button" onClick={() => dispatch(splitVertical())}>
                    <i className="fa fa-arrows-h"/>
                </div>
                <div className="split rightside-button" onClick={() => dispatch(splitHorizontal())}>
                    <i className="fa fa-arrows-v"/>
                </div>
                <div className="leftside-button" onClick={() => webview && webview.canGoBack() && webview.goBack()}>
                    <i className="fa fa-arrow-left"/>
                </div>
                <div className="rightside-button" onClick={() => webview && webview.canGoForward() && webview.goForward()}>
                    <i className="fa fa-arrow-right"/>
                </div>
                <i className="fa fa-refresh icon-button" onClick={() => webview && webview.reload()}/>
                <OmniInput dispatch={dispatch}/>
                <i className="fa fa-times icon-button" onClick={() => dispatch(closeTile(tileId))}/>
            </div>
        );
    }
}

AddressBar.propTypes = {
    dispatch: PropTypes.func,
    tileId: PropTypes.number,
    webview: PropTypes.object
};
