import Immutable from 'immutable';
import {SPLIT_VERTICAL, SPLIT_HORIZONTAL, OPEN_PAGE, CHANGE_FOCUS, CLOSE_TILE, FOCUS_LEFT, FOCUS_RIGHT, FOCUS_UP, FOCUS_DOWN, SWITCH_SPLIT, SWAP_TILES, NOTIFY_START_LOADING, NOTIFY_END_LOADING, UPDATE_SEARCH} from './actions';
import TileTree, {SplitType} from './tile-tree';
import History from './history';

// When splitting the reducer logically, combine it by combineReducers()
// import {combineReducers} from 'redux'

// TODO:
// Look addresses in process.argv and open them.

let init = {
    tree: new TileTree(),
    current_id: 0,
    pages: Immutable.Map(),
    searches: Immutable.Map()
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
    const next_state = {...state};
    const survived_tile_id = next_state.tree.remove(target_id);
    if (survived_tile_id === null) {
        return next_state;
    }

    if (next_state.current_id === target_id) {
        next_state.current_id = survived_tile_id;
    }

    if (state.pages.has(target_id)) {
        next_state.pages = state.pages.delete(target_id);
    }

    return next_state;
}

function openPage(state, page, from_start_page) {
    const next_state = {...state};
    next_state.pages = state.pages.set(page.tile_id, page);
    if (from_start_page) {
        next_state.searches = state.searches.delete(page.tile_id);
    }
    return next_state;
}

function changeFocus(state, new_id) {
    if (state.current_id === new_id) {
        return state;
    }
    let next_state = {...state};
    next_state.current_id = new_id;
    return next_state;
}

function focusNeighbor(state, next_current_id) {
    let next_state = {...state};
    if (next_current_id === null) {
        return next_state;
    }

    next_state.current_id = next_current_id;
    return next_state;
}

function switchSplit(state, id) {
    let next_state = {...state};
    next_state.tree = next_state.tree.switchSplitType(id);
    return next_state;
}

function swapTiles(state, id) {
    let next_state = {...state};
    next_state.tree = next_state.tree.swapTiles(id);
    return next_state;
}

function notifyStartLoading(state, id, url) {
    const next_state = {...state};
    next_state.pages = state.pages.update(id, p => {
        p.loading = true;
        p.url = url;
        return p;
    });
    return next_state;
}

function notifyEndLoading(state, id) {
    const next_state = {...state};
    next_state.pages = state.pages.update(id, p => {
        p.updateStatus();
        History.add(p.url, p.title);
        return p;
    });
    return next_state;
}

function updateSearch(state, new_result, id) {
    const next_state = {...state};
    next_state.searches = state.searches.set(id, new_result);
    return next_state;
}

export default function tilectron(state = init, action) {
    console.log(action.type);
    const id = action.tile_id !== undefined ? action.tile_id : state.current_id;
    switch (action.type) {
    case CHANGE_FOCUS:
        return changeFocus(state, id);
    case NOTIFY_START_LOADING:
        return notifyStartLoading(state, id, action.url);
    case NOTIFY_END_LOADING:
        return notifyEndLoading(state, id);
    case UPDATE_SEARCH:
        return updateSearch(state, action.result, id);
    case SPLIT_VERTICAL:
        return splitTile(state, SplitType.Vertical);
    case SPLIT_HORIZONTAL:
        return splitTile(state, SplitType.Horizontal);
    case OPEN_PAGE:
        return openPage(state, action.page, action.from_start_page);
    case CLOSE_TILE:
        return closeTile(state, id);
    case FOCUS_LEFT:
        return focusNeighbor(state, state.tree.getLeftOf(state.current_id));
    case FOCUS_RIGHT:
        return focusNeighbor(state, state.tree.getRightOf(state.current_id));
    case FOCUS_UP:
        return focusNeighbor(state, state.tree.getUpOf(state.current_id));
    case FOCUS_DOWN:
        return focusNeighbor(state, state.tree.getDownOf(state.current_id));
    case SWITCH_SPLIT:
        return switchSplit(state, id);
    case SWAP_TILES:
        return swapTiles(state, id);
    default:
        console.log('Unknown action: ' + action.type);
        return state;
    }
}
