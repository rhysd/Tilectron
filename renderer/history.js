import loki from 'lokijs';

export class PageHistory {
    constructor() {
        const opts = {
            persistenceMethod: 'localStorage'
        };
        this.loaded = false;
        this.db = new loki('histories.db', opts);
        this.db.loadDatabase(opts, () => {this.loaded = true;});
        global.db = this.db;
    }

    getCollection() {
        if (this.histories) {
            return this.histories;
        }
        if (!this.loaded) {
            console.log('Warning!: Database hasn\'t been not loaded yet.');
        }

        this.histories = this.db.getCollection('histories');
        if (this.histories === null) {
            this.histories = this.db.addCollection('histories', {
                indices: ['url', 'title'],
                unique: 'url'
            });
        }

        return this.histories;
    }

    add(url, title) {
        // Note:
        // This expression emits 'Duplicate key' error log on inserting entry which already exists.
        // Now it is simply ignored.
        // Attempt to insert duplicate key -> Check uniqueness -> Rollback -> emit error
        this.getCollection().insert({
            url,
            title,
            created_at: (new Date(Date.now())).toLocaleString()
        });
        this.db.saveDatabase(err => console.log(err));
    }

    all() {
        return this.getCollection().data;
    }

    search(word) {
        return this.getCollection().where(entry =>
            entry.url.indexOf(word) !== -1 || entry.title.indexOf(word) !== -1
        ).data();
    }
}

const HistorySinglton = new PageHistory();
export default HistorySinglton;
