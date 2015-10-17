import React, {Component, PropTypes} from 'react';

export default class WebPage extends Component {
    componentDidMount() {
        this.mountWebView();
    }

    componentDidUpdate() {
        this.mountWebView();
    }

    mountWebView() {
        const {focused, webview} = this.props;
        this.refs.body.appendChild(webview);
        if (focused) {
            webview.focus();
        }
    }

    render() {
        const height = this.props.focused ? 'calc(100% - 30px)' : '100%';
        return (
            <div className="web-page" style={{height}} ref="body">
            </div>
        );
    }
}

WebPage.propTypes = {
    focused: PropTypes.bool,
    webview: PropTypes.object
};
