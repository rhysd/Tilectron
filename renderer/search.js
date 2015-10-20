export default class Search {
    constructor(candidates, prev_input) {
        this.candidates = candidates || [];
        this.prev_input = prev_input || '';
    }

    narrowDownBy(input) {
        return new Search(
                this.candidates.filter(
                    c => c.url.indexOf(input) !== -1 || c.title.indexOf(input) !== -1
                ),
                input
            );
    }
}
