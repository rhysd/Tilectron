import React, {Component, PropTypes} from 'react';

// XXX:
// This component has local state.
// It should be preserved to central state because some histories may be added to store
// after this component is firstly added.

export default class StartPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            candidates: ['foo', 'bar', 'baz'],
            search_input: ''
        };
    }

    onInputChar(event) {
        console.log(event);
    }

    renderCandidates() {
        // TODO:
        // Calculate the number of histories to display.
        const max_items_by_space = 5;

        const items = [];
        const max_items = Math.min(this.state.candidates.length, max_items_by_space);
        for (let i = 0; i < max_items; ++i) {
            items.push(
                <div className="history-item" key={i}>test candidate</div>
            );
        }
        return items;
    }

    render() {
        return (
            <div className="start-page">
                <div className="favorites"/>
                <input className="history-input"type="search" placeholder="Search history" onKeyPress={this.onInputChar.bind(this)}/>
                <div className="history-candidates">
                    {this.renderCandidates()}
                </div>
            </div>
        );
    }
}

StartPage.propTypes = {
    histories: PropTypes.object
};
