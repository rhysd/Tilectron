import {notifyStartLoading, notifyEndLoading, closeTile} from './actions';

export default class PageState {
    constructor(start_url, tile_id, dispatch) {
        if (!start_url && !tile_id && !dispatch) {
            // For cloning
            return;
        }

        this.tile_id = tile_id;
        this.webview = document.createElement('webview');
        this.webview.className = 'inner-view';

        // TODO: Inject JavaScript here using 'preload'

        this.url = this.getURL(start_url);
        this.webview.src = this.url;
        this.title = '';
        this.loading = true;
        this.can_go_back = false;
        this.can_go_forward = false;
        this.is_crashed = false;
        this.dispatch = dispatch;

        this.registerCallbacks(dispatch);
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

    // Note:
    // This class preserves first dispatch function.  But dispatch function is passed from
    // redux runtime every update.  So preserving dispatch function may occur some problems
    // if dispatch function is updated by redux runtime.
    registerCallbacks(dispatch) {
        this.webview.addEventListener('load-commit', event => {
            if (event.isMainFrame) {
                dispatch(notifyStartLoading(this.tile_id, event.url));
            }
        });

        this.webview.addEventListener(
            'did-finish-load',
            () => dispatch(notifyEndLoading(this.tile_id))
        );

        this.webview.addEventListener('did-fail-load', event => {
            if (event.errorCode) {
                console.log(`Failed loading: ${event.validatedUrl}: ${event.errorDescription}`);
            }
        });

        this.webvew.addEventListener(
            'close',
            () => dispatch(closeTile(this.tile_id))
        );
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
