import Mousetrap from 'mousetrap';
import {
    splitVertical,
    splitHorizontal,
    closeTile,
    focusLeft,
    focusRight,
    focusUp,
    focusDown,
    switchSplit,
    swapTiles,
    splitVerticalWithCurrentPage,
    splitHorizontalWithCurrentPage,
    moveCursorLeft,
    moveCursorRight,
    moveCursorUp,
    moveCursorDown,
    moveCursorUpHalfPage,
    moveCursorDownHalfPage
} from './actions';
import {
    scrollDownPage,
    scrollUpPage,
    scrollRightPage,
    scrollLeftPage,
    scrollToTop,
    scrollToBottom,
    toggleDevTools
} from './page-actions';

export const ActionMap = {
    splitVertical,
    splitHorizontal,
    splitVerticalWithCurrentPage,
    splitHorizontalWithCurrentPage,
    closeTile,
    focusLeft,
    focusRight,
    focusUp,
    focusDown,
    switchSplit,
    swapTiles,
    moveCursorLeft,
    moveCursorRight,
    moveCursorUp,
    moveCursorDown,
    moveCursorUpHalfPage,
    moveCursorDownHalfPage
};

export const PageActionMap = {
    toggleDevTools,
    scrollDownPage,
    scrollUpPage,
    scrollRightPage,
    scrollLeftPage,
    scrollToTop,
    scrollToBottom
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

            if (PageActionMap[action_name]) {
                Mousetrap.bind(key, PageActionMap[action_name]);
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
    'g g': 'scrollToTop',
    'G': 'scrollToBottom',
    's v': 'splitVertical',
    's h': 'splitHorizontal',
    's V': 'splitVerticalWithCurrentPage',
    's H': 'splitHorizontalWithCurrentPage',
    'x': 'closeTile',
    'ctrl+h': 'focusLeft',
    'ctrl+l': 'focusRight',
    'ctrl+j': 'focusDown',
    'ctrl+k': 'focusUp',
    'ctrl+s': 'switchSplit',
    's s': 'swapTiles',
    'H': 'moveCursorLeft',
    'J': 'moveCursorDown',
    'K': 'moveCursorUp',
    'L': 'moveCursorRight',
    'ctrl+d': 'moveCursorDownHalfPage',
    'ctrl+u': 'moveCursorUpHalfPage',
    'mod+shift+i': 'toggleDevTools'
});

export default KeyHandlerSinglton;

