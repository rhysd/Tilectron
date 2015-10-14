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
        // When <webview> is already open.
        if (this.view) {
            this.refs.tile.appendChild(this.view);
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
            <div className={this.getClass()} style={this.props.style} ref="tile" onMouseOver={this.focusMe.bind(this)}>
                <div className="addr-bar-wrapper" style={addr_style} ref="address_bar">
                    <AddressBar dispatch={this.props.dispatch} tile_id={this.props.leaf.id}/>
                </div>
                {children}
            </div>
        );
    }

    render() {
        const {leaf, views, dispatch} = this.props;
        this.view = views[leaf.id];

        if (!this.view) {
            return this.renderFrame(
                <div className="new-window">
                    <OmniInput dispatch={dispatch}/>
                </div>
            );
        }

        return this.renderFrame(undefined);
    }
}
