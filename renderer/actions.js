export const SPLIT_VERTICAL = Symbol('action-split-vertical');
export const SPLIT_HORIZONTAL = Symbol('action-split-horizontal');

export function splitVertical() {
    return {type: SPLIT_VERTICAL};
}

export function splitHorizontal() {
    return {type: SPLIT_HORIZONTAL};
}
