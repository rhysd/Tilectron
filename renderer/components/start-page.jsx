import React, {Component, PropTypes} from 'react';
import PageState from '../page-state';
import {openPage, updateSearch} from '../actions';
import {PageHistory} from '../history';
import Search from '../search';

export default class StartPage extends Component {
    start(input) {
        if (!input) {
            return;
        }
        const {dispatch, tileId} = this.props;
        dispatch(openPage(new PageState(input, tileId, dispatch)));
        setTimeout(() => dispatch(updateSearch(tileId, undefined, true)), 1);
    }

    checkEnter(event) {
        if (String.fromCharCode(event.charCode) !== '\r') {
            return;
        }
        event.preventDefault();

        const {search} = this.props;
        const candidates = search ? search.candidates : [];
        const input = candidates.length === 0 ? event.target.value : candidates[0].url;
        this.start(input);
    }

    onInputChar(event) {
        const {dispatch, tileId} = this.props;
        // Send action asynchronously
        dispatch(updateSearch(tileId, event.target.value));
    }

    openLink(event) {
        event.preventDefault();
        this.start(event.target.href);
    }

    calculateMaxItems() {
        const body_height = document.body.clientHeight;
        const items_area_height = (body_height - (8 + 20 + 8)) / 2;
        const item_height = 40;
        return Math.floor(items_area_height / item_height);
    }

    renderCandidates() {
        const max_items_by_space = this.calculateMaxItems();
        const items = [];
        const {search, histories} = this.props;
        const candidates = search ? search.candidates : histories.all();
        const max_items = Math.min(candidates.length, max_items_by_space);
        for (let i = max_items - 1; i >= 0; --i) {
            const h = candidates[i];
            items.push(
                <div className="history-item" key={i}>
                    <a className="history-title" href={h.url} onClick={this.openLink.bind(this)}>{h.title}</a>
                    <a className="history-url" href={h.url} onClick={this.openLink.bind(this)}>{h.url}</a>
                    <span className="history-visited-at">({h.created_at})</span>
                </div>
            );
        }
        return items;
    }

    render() {
        const height = this.props.focused ? 'calc(100% - 30px)' : '100%';
        return (
            <div className="start-page" style={{height}}>
                <div className="favorites">
                    <img src="resources/tilectron.svg"/>
                </div>
                <input className="history-input"type="search" placeholder="Search history" onInput={this.onInputChar.bind(this)} onKeyPress={this.checkEnter.bind(this)}/>
                <div className="history-candidates">
                    {this.renderCandidates()}
                </div>
            </div>
        );
    }
}

StartPage.propTypes = {
    dispatch: PropTypes.func,
    focused: PropTypes.bool,
    histories: PropTypes.instanceOf(PageHistory),
    search: PropTypes.instanceOf(Search),
    tileId: PropTypes.number
};
