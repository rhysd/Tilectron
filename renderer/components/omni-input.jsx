import React, {PropTypes, Component} from 'react';
import {openPage} from '../actions';
import PageState from '../page-state';

export default class OmniInput extends Component {

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

        event.preventDefault();

        const {dispatch, page, tileId} = this.props;
        const url = this.getURL(input);

        if (page) {
            page.openURL(url);
        } else {
            dispatch(openPage(new PageState(url, tileId, dispatch)));
        }
    }

    render() {
        return (
            <input className="omni-input" type="search" placeholder="URL or words..." onKeyPress={this.onInputChar.bind(this)} autoFocus={this.props.autoFocus}/>
        );
    }
}

OmniInput.defaultProps = {
    autoFocus: false
};

OmniInput.propTypes = {
    autoFocus: PropTypes.bool,
    dispatch: PropTypes.func,
    page: PropTypes.instanceOf(PageState),
    tileId: PropTypes.number
};
