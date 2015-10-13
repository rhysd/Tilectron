export const SplitType = {
    Horizontal: Symbol('horizontal'),
    Vertical: Symbol('vertical')
};

export default class ContainerNode {
    constructor(parent, left, right, type) {
        this.parent = parent;
        this.left = left;
        this.right = right;
        this.left.parent = this;
        this.right.parent = this;
        this.split_type = type;
    }

    hasChild() {
        return this.left && this.right;
    }

    replaceChild(old_child, new_child) {
        if (this.left === old_child) {
            this.left = new_child;
            new_child.parent = this;
        } else if (this.right === old_child) {
            this.right = new_child;
            new_child.parent = this;
        } else {
            console.log('Invalid old child', old_child);
        }
    }

    getAnotherChild(child) {
        if (this.left === child) {
            return this.right;
        } else if (this.right === child) {
            return this.left;
        } else {
            console.log('Not a child', child);
            return null;
        }
    }

    searchLeaf(id) {
        return this.left.searchLeaf(id) || this.right.searchLeaf(id);
    }
}
