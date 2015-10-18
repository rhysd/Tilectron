import React,{PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {TileLeaf} from '../tile-tree';
import Tile from './tile.jsx';
import Container from './container.jsx';
import KeyHandler from '../key-handler';

class App extends Component {
    constructor(props) {
        super(props);
        KeyHandler.start(this.props.dispatch);
    }
    renderTree() {
        const {dispatch, histories, root, current_id, pages} = this.props;
        const common_props = {
            style: {flex: 'auto'},
            current_id,
            dispatch,
            histories,
            pages
        };

        if (root instanceof TileLeaf) {
            return <Tile leaf={root} {...common_props}/>;
        } else {
            return <Container knot={root} {...common_props}/>;
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

App.propTypes = {
    current_id: PropTypes.number,
    dispatch: PropTypes.func,
    histories: PropTypes.object,
    pages: PropTypes.object,
    root: PropTypes.object
};

function select(state) {
    const {current_id, dispatch, histories, tree, pages} = state;
    return {
        root: tree.root,
        current_id,
        dispatch,
        histories,
        pages
    };
}

export default connect(select)(App);
