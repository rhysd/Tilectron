import React, {Component, PropTypes} from 'react';
import PageState from '../page-state';
import {openPage, updateSearch} from '../actions';
import History,{HistoryEntryType} from '../history';

export default class StartPage extends Component {
    start(input) {
        if (!input) {
            return;
        }
        const {dispatch, tileId} = this.props;
        dispatch(openPage(new PageState(input, tileId, dispatch), true));
    }

    checkEnter(event) {
        if (String.fromCharCode(event.charCode) !== '\r') {
            return;
        }
        event.preventDefault();

        const {search} = this.props;
        const candidates = search || [];
        const input = candidates.length === 0 ? event.target.value : candidates[0].url;
        this.start(input);
    }

    onInputChar(event) {
        const {dispatch, tileId, search} = this.props;
        const input = event.target.value;
        if (!input || search === undefined) {
            History.all().then(cs => dispatch(updateSearch(tileId, cs)));
        } else {
            History.search(input).then(cs => dispatch(updateSearch(tileId, cs)));
        }
    }

    openLink(event) {
        event.preventDefault();
        this.start(event.target.href);
    }

    calculateMaxItems() {
        if (this.refs.candidates === undefined) {
            return 3; // Fallback
        }
        const items_area_height = this.refs.candidates.clientHeight;
        const item_height = 40;
        return Math.floor(items_area_height / item_height);
    }

    renderCandidates() {
        const max_items_by_space = this.calculateMaxItems();
        const items = [];
        const {search} = this.props;
        const candidates = search || [];
        const max_items = Math.min(candidates.length, max_items_by_space);
        for (let i = max_items - 1; i >= 0; --i) {
            const h = candidates[i];
            items.push(
                <div className="history-item" key={i}>
                    <a className="history-title" href={h.url} onClick={this.openLink.bind(this)}>{h.title}</a>
                    <a className="history-url" href={h.url} onClick={this.openLink.bind(this)}>{h.url}</a>
                    <span className="history-visited-at">({new Date(h.created_at).toLocaleString()})</span>
                </div>
            );
        }
        return items;
    }

    render() {
        const {search, dispatch, tileId} = this.props;
        if (!search) {
            History.all().then(cs => dispatch(updateSearch(tileId, cs)));
        }
        return (
            <div className="start-page">
                <div className="favorites">
                    <img src="resources/tilectron.svg"/>
                </div>
                <input
                    className="history-input"
                    type="search"
                    placeholder="Search history"
                    onInput={this.onInputChar.bind(this)}
                    onKeyPress={this.checkEnter.bind(this)}
                    autoFocus
                />
                <div className="history-candidates" ref="candidates">
                    {this.renderCandidates()}
                </div>
            </div>
        );
    }
}

StartPage.propTypes = {
    dispatch: PropTypes.func,
    search: PropTypes.arrayOf(HistoryEntryType),
    tileId: PropTypes.number
};
