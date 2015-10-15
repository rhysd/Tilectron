import React, {Component, PropTypes} from 'react';
import AddressBar from './address-bar.jsx';
import OmniInput from './omni-input.jsx';
import WebPage from './web-page.jsx';
import {changeFocus} from '../actions';

export default class Tile extends Component {

    isFocused() {
        const {current_id, leaf} = this.props;
        return current_id === leaf.id;
    }

    getClass() {
        return this.isFocused() ? 'tile focused' : 'tile';
    }

    focusMe() {
        const {dispatch, leaf} = this.props;
        dispatch(changeFocus(leaf.id));
    }

    renderAddressBar(dispatch, leaf) {
        if (!this.isFocused()) {
            return undefined;
        }

        return (
            <div className="addr-bar-wrapper animated fadeInDown">
                <AddressBar dispatch={dispatch} tileId={leaf.id}/>
            </div>
        );
    }

    renderContent(view, dispatch) {
        if (view) {
            return <WebPage webview={view} focused={this.isFocused()}/>;
        } else {
            return (
                <div className="new-window">
                    <OmniInput dispatch={dispatch} autoFocus/>
                </div>
            );
        }
    }

    render() {
        const {leaf, views, dispatch, style} = this.props;
        const view = views[leaf.id];
        return (
            <div className={this.getClass()} style={style} onMouseOver={this.focusMe.bind(this)}>
                {this.renderAddressBar(dispatch, leaf)}
                {this.renderContent(view, dispatch)}
            </div>
        );
    }
}

Tile.propTypes = {
    current_id: PropTypes.number,
    dispatch: PropTypes.func,
    leaf: PropTypes.object,
    style: PropTypes.object,
    views: PropTypes.object
};
