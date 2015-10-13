import React from 'react'
import {openURL} from '../actions'

export default class OmniInput extends React.Component {

    getURL(input) {
        if (!input.startsWith('?') && (input.startsWith('http://') || input.startsWith('https://'))) {
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
            openURL(this.getURL(input))
        );
    }

    render() {
        return (
            <input className="omni-input" type="search" placeholder="URL or words..." onKeyPress={this.onInputChar.bind(this)}/>
        );
    }
}