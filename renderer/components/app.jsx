import React from 'react'
import {connect} from 'react-redux'
import {splitVertical, splitHorizontal} from '../actions'
import TileLeaf from '../tile-leaf'
import Tile from './tile.jsx'
import Container from './container.jsx'
import DebugButtons from './debug-buttons.jsx'

class App extends React.Component {
    renderTree() {
        const {dispatch, tree, current_id, views} = this.props;

        if (tree instanceof TileLeaf) {
            return <Tile leaf={tree} current_id={current_id} views={views} dispatch={dispatch}/>;
        } else {
            return <Container knot={tree} current_id={current_id} views={views} dispatch={dispatch}/>;
        }
    }

    render() {
        return (
            <div className="root">
                <DebugButtons {...this.props}/>
                {this.renderTree()}
            </div>
        );
    }
}

function select(state) {
    return state;
}

export default connect(select)(App);
