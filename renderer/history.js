import loki from 'lokijs';

export class PageHistory {
    constructor() {
        this.db = new loki('History');
        this.histories = this.db.addCollection('histories', {indices: ['url', 'title']});
    }

    add(url, title) {
        this.histories.insert({
            url,
            title
        });
    }

    all() {
        return this.histories.data();
    }

    search(word) {
        return this.histories.where(entry =>
            entry.url.indexOf(word) !== -1 || entry.title.indexOf(word) !== -1
        ).data();
    }
}

const HistorySinglton = new PageHistory();
export default HistorySinglton;
