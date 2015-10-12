import {SPLIT_VERTICAL} from './actions'
import TileLeaf from './tile-leaf'
import ContainerNode from './container-node'
// When splitting the reducer logically, combine it by combineReducers()
// import {combineReducers} from 'redux'

const init = {
    current_tile_id: -1
};

export default function tilectron(state = init, action) {
    switch (action.type) {
    case SPLIT_VERTICAL:
        return state; // TODO: Temporary
    default:
        console.log('Unknown action: ' + action.type);
        return state;
    }
}
