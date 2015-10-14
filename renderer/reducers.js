import {SPLIT_VERTICAL, SPLIT_HORIZONTAL, OPEN_URL, CHANGE_FOCUS, CLOSE_TILE} from './actions';
import TileTree, {SplitType} from './tile-tree';
// When splitting the reducer logically, combine it by combineReducers()
// import {combineReducers} from 'redux'

// TODO:
// Look addresses in process.argv and open them.

let init = {
    tree: new TileTree(),
    current_id: 0,
    views: {}
};

function splitTile(state, type) {
    let next_state = {...state};
    let created_tile_id = next_state.tree.split(state.current_id, type);
    if (created_tile_id !== null) {
        next_state.current_id = created_tile_id;
    }
    return next_state;
}

function closeTile(state, target_id) {
    let next_state = {...state};
    let survived_tile_id = next_state.tree.remove(target_id);
    if (survived_tile_id === null) {
        return next_state;
    }

    if (next_state.current_id === target_id) {
        next_state.current_id = survived_tile_id;
    }

    if (state.views[survived_tile_id]) {
        next_state.views = {...next_state.views};
        delete next_state.views[survived_tile_id];
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
