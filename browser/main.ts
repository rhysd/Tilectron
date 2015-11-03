import * as path from 'path';
import * as app from 'app';
import * as BrowserWindow from 'browser-window';

const index_html = 'file://' + path.join(__dirname, '..', '..', 'index.html');

app.on('ready', () => {
    const display_size = require('screen').getPrimaryDisplay().workAreaSize;

    let win = new BrowserWindow({
        width: display_size.width,
        height: display_size.height,
        'title-bar-style': 'hidden-inset',
    });

    win.on('closed', () => {
        win = null;
        app.quit();
    });

    win.loadUrl(index_html);
});
