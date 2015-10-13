import React from 'react'
import AddressBar from './address-bar.jsx'
import OmniInput from './omni-input.jsx'

// TODO:
// Use stateless container (react v0.14)
export default class Tile extends React.Component {

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
                <AddressBar dispatch={this.props.dispatch}/>
                {children}
            </div>
        )
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
