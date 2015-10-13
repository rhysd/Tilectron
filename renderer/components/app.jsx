import React from 'react'
import {connect} from 'react-redux'
import {splitVertical, splitHorizontal} from '../actions'
import TileLeaf from '../tile-leaf'
import Tile from './tile.jsx'
import Container from './container.jsx'

class App extends React.Component {
    renderTree() {
        const {dispatch, tree, current_id, views} = this.props;
        const common_props = {
            style: {flex: 'auto'},
            current_id,
            views,
            dispatch
        };

        if (tree instanceof TileLeaf) {
            return <Tile leaf={tree} {...common_props}/>;
        } else {
            return <Container knot={tree} {...common_props}/>;
        }
    }

    render() {
        return (
            <div className="root">
                {this.renderTree()}
            </div>
        );
    }
}

function select(state) {
    return state;
}

export default connect(select)(App);
