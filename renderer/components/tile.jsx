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

    renderContent(page, dispatch, leaf) {
        if (page) {
            return <WebPage webview={page.webview} focused={this.isFocused()}/>;
        } else {
            return (
                <div className="new-window">
                    <OmniInput dispatch={dispatch} tileId={leaf.id} autoFocus/>
                </div>
            );
        }
    }

    render() {
        const {leaf, pages, dispatch, style} = this.props;
        const page = pages[leaf.id];
        return (
            <div className={this.getClass()} style={style} onMouseOver={this.focusMe.bind(this)}>
                {this.renderAddressBar(dispatch, leaf)}
                {this.renderContent(page, dispatch, leaf)}
            </div>
        );
    }
}

Tile.propTypes = {
    current_id: PropTypes.number,
    dispatch: PropTypes.func,
    leaf: PropTypes.object,
    pages: PropTypes.object,
    style: PropTypes.object
};
