import React, {Component, PropTypes} from 'react';
import PageState from '../page-state';
import {notifyStartLoading, notifyEndLoading, closeTile} from '../actions';

export default class WebPage extends Component {
    componentDidMount() {
        const {dispatch, focused, page} = this.props;
        const w = this.refs.webview;

        if (focused) {
            w.focus();
        }

        w.addEventListener('load-commit', event => {
            if (event.isMainFrame) {
                dispatch(notifyStartLoading(page.tile_id, event.url));
            }
        });

        w.addEventListener(
            'did-finish-load',
            () => dispatch(notifyEndLoading(
                page.tile_id,
                new PageState(w.getUrl(), page.tile_id, w)
            ))
        );

        w.addEventListener('did-fail-load', event => {
            if (event.errorCode) {
                console.log(`Failed loading: ${event.validatedUrl}: ${event.errorDescription}`);
            }
        });

        w.addEventListener(
            'close',
            () => dispatch(closeTile(page.tile_id))
        );
    }

    componentDidUpdate() {
        if (this.props.focused) {
            this.refs.webview.focus();
        }
    }

    render() {
        const height = this.props.focused ? 'calc(100% - 30px)' : '100%';
        return (
            <div className="web-page" style={{height}} ref="body">
                <webview
                    className="inner-view"
                    src={this.url}
                    ref="webview"
                />
            </div>
        );
    }
}

WebPage.propTypes = {
    dispatch: PropTypes.func,
    focused: PropTypes.bool,
    page: PropTypes.instanceOf(PageState),
    tile_id: PropTypes.number
};
