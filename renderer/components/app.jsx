import React from 'react'
import {connect} from 'react-redux'
import {splitVertical, splitHorizontal} from '../actions'
import TileLeaf from '../tile-leaf'
import Tile from './tile.jsx'
import Container from './container.jsx'

class App extends React.Component {
    renderTree(tree, current_id) {
        if (tree instanceof TileLeaf) {
            return <Tile leaf={tree} current_id={current_id}/>;
        } else {
            return <Container knot={tree} current_id={current_id}/>;
        }
    }

    render() {
        // Note: Get states as props here
        const {dispatch, tree, current_id} = this.props;

        return (
            <div className="root">
                <button type="button" onClick={() => dispatch(splitVertical())}>
                    Split Vertical
                </button>
                <button type="button" onClick={() => dispatch(splitHorizontal())}>
                    Split Horizontal
                </button>
                {this.renderTree(tree, current_id)}
            </div>
        );
    }
}

function select(state) {
    return state;
}

export default connect(select)(App);
