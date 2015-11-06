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
        return (
            <div className="web-page" ref="body"/>
        );
    }
}

WebPage.propTypes = {
    focused: PropTypes.bool,
    webview: PropTypes.instanceOf(HTMLElement)
};
