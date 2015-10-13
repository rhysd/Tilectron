export const SplitType = {
    Horizontal: Symbol('horizontal'),
    Vertical: Symbol('vertical')
};

export default class ContainerNode {
    constructor(parent, left, right, type) {
        this.left = left;
        this.right = right;
        this.left.parent = this;
        this.right.parent = this;
        this.split_type = type;
    }

    hasChild() {
        return this.left && this.right;
    }

    replaceChild(id, new_child) {
        if (this.left.id !== undefined && this.left.id === id) {
            this.left = new_child;
        } else if (this.right.id !== undefined && this.right.id === id) {
            this.right = new_child;
        } else {
            console.log('Invalid id: ' + id);
        }
    }

    searchLeaf(id) {
        return this.left.searchLeaf(id) || this.right.searchLeaf(id);
    }
}
