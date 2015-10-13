import React from 'react'
import {openWebView} from '../actions'
import AddressBar from './address-bar.jsx'

// TODO:
// Use stateless container (react v0.14)
export default class Tile extends React.Component {

    getURL(input) {
        if (input.startsWith('http://') || input.startsWith('https://')) {
            return input;
        } else {
            return 'https://www.google.co.jp/search?q=' + input; // TODO: Escape
        }
    }

    onInputChar(event) {
        if (String.fromCharCode(event.charCode) !== '\r') {
            return;
        }

        const input = event.target.value;
        if (!input) {
            return;
        }

        this.props.dispatch(
            openWebView(this.getURL(input))
        );
    }

    getClass() {
        const {current_id, leaf} = this.props;
        if (current_id === leaf.id) {
            return "tile focused";
        } else {
            return "tile";
        }
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
        return (
            <div className={this.getClass()} style={this.props.style} ref="tile">
                <AddressBar/>
                {children}
            </div>
        )
    }

    render() {
        const {leaf, views} = this.props;
        this.view = views[leaf.id];

        if (!this.view) {
            return this.renderFrame(
                <div className="new-window">
                    <input className="initial-input" type="search" placeholder="URL or words..." onKeyPress={this.onInputChar.bind(this)}/>
                </div>
            );
        }

        return this.renderFrame(undefined);
    }
}
