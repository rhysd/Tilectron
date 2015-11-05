import Store from './store';

function getCurrentWebview() {
    const {pages, current_id} = Store.getState();
    const page = pages.get(current_id);
    if (!page) {
        return null;
    }
    return page.webview;
}

function scrollCurrentPageBy(scroll_args) {
    const webview = getCurrentWebview();
    if (webview !== null) {
        webview.executeJavaScript(`window.scrollBy(${scroll_args})`);
    }
}

function scrollCurrentPageTo(scroll_args) {
    const webview = getCurrentWebview();
    if (webview !== null) {
        webview.executeJavaScript(`window.scrollTo(${scroll_args})`);
    }
}

export function scrollDownPage() {
    scrollCurrentPageBy('0, window.innerHeight / 5');
}
export function scrollUpPage() {
    scrollCurrentPageBy('0, -window.innerHeight / 5');
}
export function scrollRightPage() {
    scrollCurrentPageBy('window.innerWidth / 5, 0');
}
export function scrollLeftPage() {
    scrollCurrentPageBy('-window.innerWidth / 5, 0');
}
export function scrollToTop() {
    scrollCurrentPageTo('0, 0');
}
export function scrollToBottom() {
    scrollCurrentPageTo('0, document.body.clientHeight');
}

export function toggleDevTools() {
    const webview = getCurrentWebview();
    if (webview === null) {
        return;
    }

    if (webview.isDevToolsOpened()) {
        webview.closeDevTools();
    } else {
        webview.openDevTools({detach: true});
    }
}
