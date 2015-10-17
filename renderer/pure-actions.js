import Store from './store';

function getCurrentWebview() {
    const {pages, current_id} = Store.getState();
    const page = pages[current_id];
    if (!page) {
        return null;
    }
    return page.webview;
}

function scrollCurrentPage(scroll_args) {
    const webview = getCurrentWebview();
    if (webview !== null) {
        webview.executeJavaScript(`window.scrollBy(${scroll_args})`);
    }
}

export function scrollDownPage() {
    scrollCurrentPage('0, window.innerHeight / 5');
}
export function scrollUpPage() {
    scrollCurrentPage('0, -window.innerHeight / 5');
}
export function scrollRightPage() {
    scrollCurrentPage('window.innerWidth / 5, 0');
}
export function scrollLeftPage() {
    scrollCurrentPage('-window.innerWidth / 5, 0');
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
