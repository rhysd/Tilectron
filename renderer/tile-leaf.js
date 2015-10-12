export default class TileLeaf {
    constructor(parent, id) {
        this.id = id;
        this.parent = parent;
    }

    searchLeaf(id) {
        return this.id === id ? this : null;
    }
}
