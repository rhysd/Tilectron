import Mousetrap from 'mousetrap';
import {splitVertical, splitHorizontal, closeTile, focusLeft, focusRight, focusUp, focusDown, switchSplit, swapTiles} from './actions';
import {scrollDownPage, scrollUpPage, scrollRightPage, scrollLeftPage, toggleDevTools} from './pure-actions';

export const ActionMap = {
    splitVertical,
    splitHorizontal,
    closeTile,
    focusLeft,
    focusRight,
    focusUp,
    focusDown,
    switchSplit,
    swapTiles
};

export const PureActionMap = {
    toggleDevTools,
    scrollDownPage,
    scrollUpPage,
    scrollRightPage,
    scrollLeftPage
};

export class KeyHandler {
    constructor(default_maps) {
        this.keymaps = default_maps;
    }

    register(map) {
        for (const key in map) {
            this.keymaps[key] = map[key];
        }
    }

    start(dispatch) {
        for (const key in this.keymaps) {
            const action_name = this.keymaps[key];
            if (ActionMap[action_name]) {
                Mousetrap.bind(key, () => dispatch(ActionMap[action_name]()));
                continue;
            }

            if (PureActionMap[action_name]) {
                Mousetrap.bind(key, PureActionMap[action_name]);
                continue;
            }

            console.log('Invalid action name: ' + action_name);
        }
    }

    unregister(key) {
        Mousetrap.unbind(key);
    }

    unregisterAll() {
        Mousetrap.reset();
    }
}

const KeyHandlerSinglton = new KeyHandler({
    'h': 'scrollLeftPage',
    'j': 'scrollDownPage',
    'k': 'scrollUpPage',
    'l': 'scrollRightPage',
    's v': 'splitVertical',
    's h': 'splitHorizontal',
    'x': 'closeTile',
    'ctrl+h': 'focusLeft',
    'ctrl+l': 'focusRight',
    'ctrl+j': 'focusDown',
    'ctrl+k': 'focusUp',
    'ctrl+s': 'switchSplit',
    's s': 'swapTiles',
    'mod+shift+i': 'toggleDevTools'
});

export default KeyHandlerSinglton;
