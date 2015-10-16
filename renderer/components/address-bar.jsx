import React, {Component, PropTypes} from 'react';
import OmniInput from './omni-input.jsx';
import {splitVertical, splitHorizontal, closeTile} from '../actions';

export default class AddressBar extends Component {
    render() {
        const {dispatch, page, tileId} = this.props;
        return (
            <div className="address-bar">
                <div className="split leftside-button" onClick={() => dispatch(splitVertical())}>
                    <i className="fa fa-arrows-h"/>
                </div>
                <div className="split rightside-button" onClick={() => dispatch(splitHorizontal())}>
                    <i className="fa fa-arrows-v"/>
                </div>
                <div className="leftside-button" onClick={() => page && page.goBack()}>
                    <i className="fa fa-arrow-left"/>
                </div>
                <div className="rightside-button" onClick={() => page && page.goForward()}>
                    <i className="fa fa-arrow-right"/>
                </div>
                <i className="fa fa-refresh icon-button" onClick={() => page && page.reload()}/>
                <OmniInput dispatch={dispatch} tileId={tileId} page={page}/>
                <i className="fa fa-times icon-button" onClick={() => dispatch(closeTile(tileId))}/>
            </div>
        );
    }
}

AddressBar.propTypes = {
    dispatch: PropTypes.func,
    page: PropTypes.object,
    tileId: PropTypes.number
};
