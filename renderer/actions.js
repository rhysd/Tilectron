export const SPLIT_VERTICAL = Symbol('action-split-vertical');
export const SPLIT_HORIZONTAL = Symbol('action-split-horizontal');
export const OPEN_URL = Symbol('action-open-url');
export const CHANGE_FOCUS = Symbol('action-change-focus');
export const CLOSE_TILE = Symbol('action-close-tile');
export const FOCUS_LEFT = Symbol('action-focus-left');
export const FOCUS_RIGHT = Symbol('action-focus-right');
export const FOCUS_UP = Symbol('action-focus-up');
export const FOCUS_DOWN = Symbol('action-focus-down');
export const SWITCH_SPLIT = Symbol('action-switch-split');

export function splitVertical() {
    return {type: SPLIT_VERTICAL};
}

export function splitHorizontal() {
    return {type: SPLIT_HORIZONTAL};
}

export function openURL(url) {
    return {
        type: OPEN_URL,
        url
    };
}

export function changeFocus(tile_id) {
    return {
        type: CHANGE_FOCUS,
        tile_id
    };
}

export function closeTile(tile_id) {
    return {
        type: CLOSE_TILE,
        tile_id
    };
}

export function focusLeft() {
    return {type: FOCUS_LEFT};
}
export function focusRight() {
    return {type: FOCUS_RIGHT};
}
export function focusUp() {
    return {type: FOCUS_UP};
}
export function focusDown() {
    return {type: FOCUS_DOWN};
}

export function switchSplit(tile_id) {
    return {
        type: SWITCH_SPLIT,
        tile_id
    };
}
