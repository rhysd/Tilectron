export default class PageState {
    constructor(start_url, tile_id, webview) {
        if (!start_url && !tile_id && !webview) {
            // For cloning
            return;
        }

        this.tile_id = tile_id;
        this.webview = webview;
        // TODO: Inject JavaScript here using 'preload'

        this.url = this.getURL(start_url);
        this.title = '';
        this.loading = true;
        this.can_go_back = false;
        this.can_go_forward = false;
        this.is_crashed = false;
    }

    clone() {
        const cloned = new PageState();
        for (const prop in this) {
            cloned[prop] = this[prop];
        }
        return cloned;
    }

    getURL(input) {
        if (!input.startsWith('?') && (input.startsWith('http://') || input.startsWith('https://'))) {
            return input;
        } else {
            return 'https://www.google.com/search?q=' + encodeURIComponent(input);
        }
    }

    updateStatus() {
        this.can_go_back = this.webview.canGoBack();
        this.can_go_forward = this.webview.canGoForward();
        this.is_crashed = this.webview.isCrashed();
        this.url = this.webview.getUrl();
        this.title = this.webview.getTitle();
        return this;
    }

    open(url) {
        this.url = this.getURL(url);
        this.webview.src = this.url;
    }

    goBack() {
        if (this.webview.canGoBack()) {
            this.webview.goBack();
        }
    }

    goForward() {
        if (this.webview.canGoForward()) {
            this.webview.goForward();
        }
    }

    reload() {
        this.webview.reload();
    }

    stop() {
        this.webview.stop();
    }
}
