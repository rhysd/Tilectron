import React from 'react';
import AddressBar from './address-bar.jsx';
import OmniInput from './omni-input.jsx';
import {changeFocus} from '../actions';

// TODO:
// Use stateless container (react v0.14)
export default class Tile extends React.Component {

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

    // XXX
    mountWebView() {
        if (this.page) {
            // When <webview> is already open.
            this.refs.tile.appendChild(this.page.webview);
            if (this.isFocused()) {
                this.page.webview.focus();
            }
        } else {
            if (this.isFocused()) {
                this.refs.tile.focus();
            }
        }

    }

    componentDidMount() {
        this.mountWebView();
    }

    componentDidUpdate() {
        this.mountWebView();
    }

    renderFrame(children) {
        const addr_style = {
            display: this.isFocused() ? '' : 'none'
        };

        return (
            <div className={this.getClass()} style={this.props.style} onMouseOver={this.focusMe.bind(this)} ref="tile">
                <div className="addr-bar-wrapper animated fadeInDown" style={addr_style}>
                    <AddressBar dispatch={this.props.dispatch} tile_id={this.props.leaf.id} page={this.page}/>
                </div>
                {children}
            </div>
        );
    }

    render() {
        const {leaf, pages, dispatch} = this.props;
        this.page = pages[leaf.id];

        if (!this.page) {
            return this.renderFrame(
                <div className="new-window">
                    <OmniInput dispatch={dispatch} autoFocus/>
                </div>
            );
        }

        return this.renderFrame(undefined);
    }
}
