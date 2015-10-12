import React from 'react'
import {connect} from 'react-redux'
import {splitVertical} from '../actions'

class App extends React.Component {
    render() {
        // Note: Get states as props here
        const {dispatch} = this.props;
        return (
            <div>
                <button type="button" onClick={() => dispatch(splitVertical())}>
                    Split Vertical
                </button>
                <button type="button" onClick={() => dispatch(splitHorizontal())}>
                    Split Horizontal
                </button>
            </div>
        );
    }
}

export default connect()(App);
