import Dexie from 'dexie';
import {PropTypes} from 'react';

export const HistoryEntryType = PropTypes.objectOf(
    PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ])
);

export class PageHistory {
    constructor() {
        this.db = new Dexie('Tilectron');
        this.db.on('error', err => console.error(err));
        this.db.version(1).stores({
            histories: '++id,&url,title,created_at'
        });
        this.db.open();
        this.histories = this.db.histories;
        global.__hist = this.histories;
    }

    add(url, title) {
        return this.histories.add({
            url,
            title,
            created_at: Date.now()
        }).then(() => console.log('History added: ' + url))
          .catch(err => console.log(`Error on add URL ${url}: ${err.message}`));
    }

    all() {
        return this.histories.toArray();
    }

    search(word) {
        return this
                .histories
                .filter(h => h.url.indexOf(word) !== -1 || h.title.indexOf(word) !== -1)
                .toArray();
    }
}

const HistorySinglton = new PageHistory();
export default HistorySinglton;
