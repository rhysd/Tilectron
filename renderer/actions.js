export const SPLIT_VERTICAL = Symbol('action-split-vertical');
export const SPLIT_HORIZONTAL = Symbol('action-split-horizontal');
export const OPEN_WEBVIEW = Symbol('action-open-webview');

export function splitVertical() {
    return {type: SPLIT_VERTICAL};
}

export function splitHorizontal() {
    return {type: SPLIT_HORIZONTAL};
}

export function openWebView(url) {
    return {
        type: OPEN_WEBVIEW,
        url
    };
}
