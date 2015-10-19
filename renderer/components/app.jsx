import React,{PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {TileLeaf, ContainerKnot} from '../tile-tree';
import Tile from './tile.jsx';
import Container from './container.jsx';
import KeyHandler from '../key-handler';
import {PageHistory} from '../history';
import PageState from '../page-state';

class App extends Component {
    constructor(props) {
        super(props);
        KeyHandler.start(this.props.dispatch); // eslint-disable-line react/prop-types
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
    histories: PropTypes.instanceOf(PageHistory),
    pages: PropTypes.objectOf(PropTypes.instanceOf(PageState)),
    root: PropTypes.oneOfType([
        PropTypes.instanceOf(TileLeaf),
        PropTypes.instanceOf(ContainerKnot)
    ])
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
