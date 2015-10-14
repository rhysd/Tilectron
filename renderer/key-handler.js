import Mousetrap from 'mousetrap';
import {splitVertical, splitHorizontal, closeTile, focusLeft, focusRight, focusUp, focusDown, switchSplit} from './actions';

export const ActionMap = {
    splitVertical,
    splitHorizontal,
    closeTile,
    focusLeft,
    focusRight,
    focusUp,
    focusDown,
    switchSplit
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
            if (!ActionMap[action_name]) {
                console.log('Invalid action name: ' + action_name);
                continue;
            }

            Mousetrap.bind(key, () => {
                console.log(key);
                dispatch(ActionMap[action_name]());
            });
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
    's v': 'splitVertical',
    's h': 'splitHorizontal',
    'x': 'closeTile',
    'h': 'focusLeft',
    'l': 'focusRight',
    'j': 'focusDown',
    'k': 'focusUp',
    'ctrl+s': 'switchSplit'
});

export default KeyHandlerSinglton;
