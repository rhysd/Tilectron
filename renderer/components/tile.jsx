import React from 'react'
import {openWebView} from '../actions'

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
        let node = this.refs.tile;

        // When <webview> is already open.
        if (!node.hasChildNodes() && this.view) {
            node.appendChild(this.view);
        }
    }

    componentDidMount() {
        this.mountWebView();
    }

    componentDidUpdate() {
        this.mountWebView();
    }

    render() {
        const {leaf, views} = this.props;
        const view = views[leaf.id];

        if (!view) {
            return (
                <div className={this.getClass()} style={this.props.style} ref="tile">
                    <div className="new-window">
                        <input className="initial-input" type="search" placeholder="URL or words..." onKeyPress={this.onInputChar.bind(this)}/>
                    </div>
                </div>
            );
        }

        this.view = view;
        return (
            <div className={this.getClass()} style={this.props.style} ref="tile">
            </div>
        );
    }
}
