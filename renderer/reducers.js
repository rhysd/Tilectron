import {SPLIT_VERTICAL, SPLIT_HORIZONTAL, OPEN_URL, CHANGE_FOCUS, CLOSE_TILE} from './actions';
import TileLeaf from './tile-leaf';
import ContainerNode, {SplitType} from './container-node';
// When splitting the reducer logically, combine it by combineReducers()
// import {combineReducers} from 'redux'

// TODO:
// Look addresses in process.argv and open them.

let init = {
    next_id: 1,
    tree: new TileLeaf(null, 0),
    current_id: 0,
    views: {}
};

function splitTile(state, type) {
    let next_state = {...state};
    let target_leaf = state.tree.searchLeaf(state.current_id);

    if (target_leaf === null) {
        console.log('Invalid id: ' + state.current_id);
        return next_state;
    }

    let new_leaf = new TileLeaf(null, next_state.next_id++);

    let target_parent = target_leaf.parent;
    let new_container = new ContainerNode(target_parent, target_leaf, new_leaf, type);

    if (target_parent === null) {
        next_state.tree = new_container;
    } else {
        target_parent.replaceChild(target_leaf, new_container);
    }

    next_state.current_id = new_leaf.id;

    return next_state;
}

function closeTile(state, target_id) {
    let next_state = {...state};
    let target_leaf = state.tree.searchLeaf(target_id);

    if (target_leaf === null) {
        console.log('Invalid id: ' + target_id);
        return next_state; // Error
    }

    let target_parent = target_leaf.parent;
    if (target_parent === null) {
        return next_state; // Root
    }

    let opposite_child = target_parent.getAnotherChild(target_leaf);
    if (opposite_child === null) {
        return next_state; // Error
    }

    let parent_of_parent = target_parent.parent;
    if (parent_of_parent === null) {
        next_state.tree = opposite_child;
        opposite_child.parent = null;
    } else {
        parent_of_parent.replaceChild(target_parent, opposite_child);
    }

    if (next_state.current_id === target_id) {
        next_state.current_id = opposite_child.id;
    }

    if (state.views[opposite_child.id]) {
        next_state.views = {...next_state.views};
        delete next_state.views[opposite_child.id];
    }

    return next_state;
}

function openWebView(state, url) {
    let next_state = {...state};
    let webview = document.createElement('webview');
    webview.className = 'inner-view';

    // Inject JavaScript here
    // webview.addEventListener('dom-ready', e => {});

    // TODO: Set secure options

    webview.src = url;
    next_state.views = {...state.views};
    next_state.views[state.current_id] = webview;
    return next_state;
}

function openURL(state, url) {
    let webview = state.views[state.current_id];
    if (!webview) {
        return openWebView(state, url);
    }
    webview.src = url;
    return {...state};
}

function changeFocus(state, new_id) {
    let next_state = {...state};
    next_state.current_id = new_id;
    return next_state;
}

export default function tilectron(state = init, action) {
    switch (action.type) {
    case CHANGE_FOCUS:
        return changeFocus(state, action.tile_id);
    case SPLIT_VERTICAL:
        return splitTile(state, SplitType.Vertical);
    case SPLIT_HORIZONTAL:
        return splitTile(state, SplitType.Horizontal);
    case OPEN_URL:
        return openURL(state, action.url);
    case CLOSE_TILE:
        return closeTile(state, action.tile_id);
    default:
        console.log('Unknown action: ' + action.type);
        return state;
    }
}
