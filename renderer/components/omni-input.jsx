import React, {PropTypes, Component} from 'react';
import {openPage} from '../actions';
import PageState from '../page-state';

export default class OmniInput extends Component {
    componentDidMount() {
        this.setURL();
    }
    componentDidUpdate() {
        this.setURL();
    }

    setURL() {
        // Note:
        // <input value=""/> is unavailable because <input> is stateful component.
        // ref: http://qiita.com/koba04/items/40cc217ab925ef651113
        if (this.props.page) {
            this.refs.body.value = this.props.page.url;
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
        if (page) {
            page.open(input);
        } else {
            dispatch(openPage(new PageState(input, tileId, dispatch)));
        }
        this.refs.body.blur();
    }

    render() {
        return (
            <input
                className="omni-input"
                type="search"
                placeholder="URL or words..."
                onKeyPress={this.onInputChar.bind(this)}
                ref="body"
            />
        );
    }
}

OmniInput.propTypes = {
    dispatch: PropTypes.func,
    page: PropTypes.instanceOf(PageState),
    tileId: PropTypes.number
};
