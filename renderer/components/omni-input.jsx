import React, {PropTypes, Component} from 'react';
import {openPage} from '../actions';
import PageState from '../page-state';

export default class OmniInput extends Component {
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
        if (page) {
            page.open(input);
        } else {
            dispatch(openPage(new PageState(input, tileId, dispatch)));
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
