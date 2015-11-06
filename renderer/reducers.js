import Immutable from 'immutable';
import * as A from './actions';
import TileTree, {SplitType} from './tile-tree';
import History from './history';
import PageState from './page-state';

// When splitting the reducer logically, combine it by combineReducers()
// import {combineReducers} from 'redux'

// TODO:
// Look addresses in process.argv and open them.

let init = {
    tree: new TileTree(),
    current_id: 0,
    cursor: Immutable.Map({x: 0, y: 0}),
    pages: Immutable.Map(),
    searches: Immutable.Map()
};

function splitTile(state, id, type) {
    const next_state = {...state};
    const created_tile_id = next_state.tree.split(id, type);
    if (created_tile_id !== null) {
        next_state.current_id = created_tile_id;
    }
    return next_state;
}

function splitTileWithCurrentPage(state, id, type) {
    const created_id = state.tree.split(id, type);
    if (created_id === null) {
        return state;
    }

    const next_state = {...state};
    next_state.current_id = created_id;

    const p = state.pages.get(id);
    if (!p) {
        return next_state;
    }

    const new_page = new PageState(p.url, created_id, p.dispatch);
    next_state.pages = state.pages.set(created_id, new_page);
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
    const p = state.pages.get(id);
    p.updateStatus();
    p.loading = false;
    History.add(p.url, p.title);
    next_state.pages = state.pages.set(id, p.clone());
    return next_state;
}

function updateSearch(state, new_result, id) {
    const next_state = {...state};
    next_state.searches = state.searches.set(id, new_result);
    return next_state;
}

function moveCursor(state, delta_x, delta_y) {
    const c = state.cursor;
    const width = document.body.clientWidth;
    const height = document.body.clientHeight;
    let x = c.get('x') + delta_x;
    let y = c.get('y') + delta_y;

    if (x < 0) {
        x = 0;
    } else if (width < x) {
        x = width;
    }

    if (y < 0) {
        y = 0;
    } else if (height < y) {
        y = height;
    }

    // TODO:
    // Scroll page to continue to show the cursor
    const next_state = {...state};
    next_state.cursor = c.set('x', x).set('y', y);
    return next_state;
}

function click(state, x, y) {
    const w = state.pages[state.current_id].webview;
    if (!w) {
        return state;
    }

    w.sendInputEvent({
        type: 'mouseDown',
        button: 'left',
        x, y
    });
    w.sendInputEvent({
        type: 'mouseUp',
        button: 'left',
        x, y
    });

    return state;
}

export default function tilectron(state = init, action) {
    console.log(action.type);
    const id = action.tile_id !== undefined ? action.tile_id : state.current_id;
    switch (action.type) {
    case A.CHANGE_FOCUS:
        return changeFocus(state, id);
    case A.NOTIFY_START_LOADING:
        return notifyStartLoading(state, id, action.url);
    case A.NOTIFY_END_LOADING:
        return notifyEndLoading(state, id);
    case A.UPDATE_SEARCH:
        return updateSearch(state, action.result, id);
    case A.SPLIT_VERTICAL:
        return splitTile(state, id, SplitType.Vertical);
    case A.SPLIT_HORIZONTAL:
        return splitTile(state, id, SplitType.Horizontal);
    case A.SPLIT_VERTICAL_WITH_CURRENT_PAGE:
        return splitTileWithCurrentPage(state, id, SplitType.Vertical);
    case A.SPLIT_HORIZONTAL_WITH_CURRENT_PAGE:
        return splitTileWithCurrentPage(state, id, SplitType.Horizontal);
    case A.OPEN_PAGE:
        return openPage(state, action.page, action.from_start_page);
    case A.CLOSE_TILE:
        return closeTile(state, id);
    case A.FOCUS_LEFT:
        return focusNeighbor(state, state.tree.getLeftOf(state.current_id));
    case A.FOCUS_RIGHT:
        return focusNeighbor(state, state.tree.getRightOf(state.current_id));
    case A.FOCUS_UP:
        return focusNeighbor(state, state.tree.getUpOf(state.current_id));
    case A.FOCUS_DOWN:
        return focusNeighbor(state, state.tree.getDownOf(state.current_id));
    case A.SWITCH_SPLIT:
        return switchSplit(state, id);
    case A.SWAP_TILES:
        return swapTiles(state, id);
    case A.MOVE_CURSOR_LEFT:
        return moveCursor(state, -5, 0);
    case A.MOVE_CURSOR_RIGHT:
        return moveCursor(state, 5, 0);
    case A.MOVE_CURSOR_UP:
        return moveCursor(state, 0, -5);
    case A.MOVE_CURSOR_DOWN:
        return moveCursor(state, 0, 5);
    case A.MOVE_CURSOR_UP_HALF_PAGE:
        return moveCursor(state, 0, -(document.body.clientHeight - 35) / 2);
    case A.MOVE_CURSOR_DOWN_HALF_PAGE:
        return moveCursor(state, 0, (document.body.clientHeight - 35) / 2);
    case A.CLICK_AT_CURSOR:
        return click(state, state.cursor.get('x'), state.cursor.get('y'));
    default:
        console.log('Unknown action: ' + action.type);
        return state;
    }
}
