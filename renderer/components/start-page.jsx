import React, {Component, PropTypes} from 'react';
import PageState from '../page-state';
import {openPage} from '../actions';

// XXX:
// This component has local state.
// It should be preserved to central state because some histories may be added to store
// after this component is firstly added.

export default class StartPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            candidates: this.props.histories.all(),
            search_input: ''
        };
    }

    onInputChar(event) {
        const input = event.target.value;
        if (!input) {
            return;
        }

        const {dispatch, histories, tileId} = this.props;

        if (String.fromCharCode(event.charCode) === '\r') {
            event.preventDefault();

            if (this.state.candidates.length === 0) {
                return;
            }

            const c = this.state.candidates[0];
            dispatch(openPage(new PageState(c.url, tileId, dispatch)));
            return;
        }

        if (this.state.search_input === input) {
            return;
        }

        this.setState({
            candidates: histories.search(input),
            search_input: input
        });
    }

    renderCandidates() {
        // TODO:
        // Calculate the number of histories to display.
        const max_items_by_space = 5;

        const items = [];
        const max_items = Math.min(this.state.candidates.length, max_items_by_space);
        for (let i = 0; i < max_items; ++i) {
            const h = this.state.candidates[i];
            items.push(
                <div className="history-item" key={i}>
                    <a className="history-title" href={h.url}>{h.title}</a>
                    <a className="history-url" href={h.url}>{h.url}</a>
                    <span className="history-visited-at">({h.created_at})</span>
                </div>
            );
        }
        return items;
    }

    render() {
        return (
            <div className="start-page">
                <div className="favorites">
                    <h1 className="temporary-message">Favorite URLs Here</h1>
                </div>
                <input className="history-input"type="search" placeholder="Search history" onKeyPress={this.onInputChar.bind(this)}/>
                <div className="history-candidates">
                    {this.renderCandidates()}
                </div>
            </div>
        );
    }
}

StartPage.propTypes = {
    dispatch: PropTypes.func,
    histories: PropTypes.object,
    tileId: PropTypes.number
};
