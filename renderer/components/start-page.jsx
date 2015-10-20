import React, {Component, PropTypes} from 'react';
import PageState from '../page-state';
import {openPage} from '../actions';
import {PageHistory} from '../history';

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

    checkEnter(event) {
        if (String.fromCharCode(event.charCode) !== '\r') {
            return;
        }
        event.preventDefault();

        const {dispatch, tileId} = this.props;

        const input = this.state.candidates.length === 0 ?
                        event.target.value : this.state.candidates[0].url;
        if (input) {
            dispatch(openPage(new PageState(input, tileId, dispatch)));
        }
    }

    onInputChar(event) {
        const input = event.target.value;
        if (!input) {
            this.setState({
                candidates: this.props.histories.all(),
                search_input: input
            });
            return;
        }

        if (this.state.search_input === input) {
            return;
        }

        if (input.startsWith(this.state.search_input)) {
            if (this.state.candidates.length === 0) {
                return;
            }

            // Narrow candidates
            this.setState({
                candidates: this.state.candidates.filter(
                                c => c.url.indexOf(input) !== -1 || c.title.indexOf(input) !== -1
                            ),
                search_input: input
            });
        } else {
            // Fallback to querying DB
            this.setState({
                candidates: this.props.histories.search(input),
                search_input: input
            });
        }

    }

    openLink(event) {
        event.preventDefault();
        const url = event.target.href;
        if (!url) {
            return;
        }
        const {dispatch, tileId} = this.props;
        dispatch(openPage(new PageState(url, tileId, dispatch)));
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
        const max_items = Math.min(this.state.candidates.length, max_items_by_space);
        for (let i = max_items - 1; i >= 0; --i) {
            const h = this.state.candidates[i];
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
    tileId: PropTypes.number
};
