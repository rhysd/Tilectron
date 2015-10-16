import {notifyStartLoading, notifyEndLoading} from './actions';

export default class PageState {
    constructor(start_url, tile_id, dispatch) {
        this.tile_id = tile_id;
        this.webview = document.createElement('webview');
        this.webview.className = 'inner-view';

        // TODO: Inject JavaScript here using 'preload'

        this.webview.src = start_url;
        this.url = start_url;
        this.loading = true;
        this.can_go_back = false;
        this.can_go_forward = false;
        this.is_crashed = false;

        this.registerCallbacks(dispatch);
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
    }

    updateStatus() {
        this.can_go_back = this.webview.canGoBack();
        this.can_go_forward = this.webview.canGoForward();
        this.is_crashed = this.webview.isCrashed();
        this.loading = this.webview.isLoading();
        this.url = this.webview.getUrl();
    }

    openURL(url) {
        this.url = url;
        this.webview.src = url;
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
