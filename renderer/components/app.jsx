import React,{PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import Immutable from 'immutable';
import Tile from './tile.jsx';
import Container from './container.jsx';
import AddressBar from './address-bar.jsx';
import {TileLeaf, ContainerKnot} from '../tile-tree';
import KeyHandler from '../key-handler';

class App extends Component {
    constructor(props) {
        super(props);
        KeyHandler.start(this.props.dispatch);
    }

    renderTree() {
        const {dispatch, root, current_id, pages, searches} = this.props;
        const common_props = {
            style: {flex: 'auto'},
            current_id,
            dispatch,
            pages,
            searches
        };

        if (root instanceof TileLeaf) {
            return <Tile leaf={root} {...common_props}/>;
        } else {
            return <Container knot={root} {...common_props}/>;
        }
    }

    render() {
        const {current_id, dispatch, pages} = this.props;
        return (
            <div className="root">
                <AddressBar page={pages.get(current_id)} dispatch={dispatch} tileId={current_id} />
                <div className="pages">
                    {this.renderTree()}
                </div>
            </div>
        );
    }
}

App.propTypes = {
    current_id: PropTypes.number,
    dispatch: PropTypes.func,
    pages: PropTypes.instanceOf(Immutable.Map),
    root: PropTypes.oneOfType([
        PropTypes.instanceOf(TileLeaf),
        PropTypes.instanceOf(ContainerKnot)
    ]),
    searches: PropTypes.instanceOf(Immutable.Map)
};

function select(state) {
    const {current_id, dispatch, tree, pages, searches} = state;
    return {
        root: tree.root,
        current_id,
        dispatch,
        pages,
        searches
    };
}

export default connect(select)(App);
