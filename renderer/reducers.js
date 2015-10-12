import {SPLIT_VERTICAL, SPLIT_HORIZONTAL} from './actions'
import TileLeaf from './tile-leaf'
import ContainerNode, {SplitType} from './container-node'
// When splitting the reducer logically, combine it by combineReducers()
// import {combineReducers} from 'redux'

const init = {
    next_id: 1,
    tree: new TileLeaf(null, 0),
    current_id: 0,
};

function splitTile(state, type) {
    let next_state = {...state};
    let target_leaf = state.tree.searchLeaf(state.current_id);

    console.log('tareget_leaf', target_leaf);

    if (!target_leaf) {
        console.log('Invalid id: ' + state.current_id);
        return next_state;
    }

    let new_leaf = new TileLeaf(null, next_state.next_id++);

    let target_parent = target_leaf.parent;
    let new_container = new ContainerNode(target_parent, target_leaf, new_leaf, type);

    if (target_parent === null) {
        next_state.tree = new_container;
    } else {
        target_parent.replaceChild(target_leaf.id, new_container);
    }

    next_state.current_id = new_leaf.id;

    console.log(next_state);

    return next_state;
}

export default function tilectron(state = init, action) {
    switch (action.type) {
    case SPLIT_VERTICAL:
        return splitTile(state, SplitType.Vertical);
    case SPLIT_HORIZONTAL:
        return splitTile(state, SplitType.Horizontal);
    default:
        console.log('Unknown action: ' + action.type);
        return state;
    }
}
