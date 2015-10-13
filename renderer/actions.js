export const SPLIT_VERTICAL = Symbol('action-split-vertical');
export const SPLIT_HORIZONTAL = Symbol('action-split-horizontal');
export const OPEN_URL = Symbol('action-open-url');

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
