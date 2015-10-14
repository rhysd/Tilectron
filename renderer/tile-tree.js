export class TileLeaf {
    constructor(parent, id) {
        this.id = id;
        this.parent = parent;
    }

    searchLeaf(id) {
        return this.id === id ? this : null;
    }
}

export const SplitType = {
    Horizontal: Symbol('horizontal'),
    Vertical: Symbol('vertical')
};

export class ContainerKnot {
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

export default class TileTree {
    constructor() {
        this.root = new TileLeaf(null, 0);
        this.next_id = 1;
    }

    split(id, split_type) {
        let target_leaf = this.root.searchLeaf(id);
        if (target_leaf === null) {
            console.log('Invalid id: ' + id);
            return null;
        }

        let new_leaf = new TileLeaf(null, this.next_id++);
        let target_parent = target_leaf.parent;
        let new_container = new ContainerKnot(target_parent, target_leaf, new_leaf, split_type);

        if (target_parent === null) {
            this.root = new_container;
        } else {
            target_parent.replaceChild(target_leaf, new_container);
        }

        return new_leaf.id;
    }

    remove(id) {
        let target_leaf = this.root.searchLeaf(id);
        if (target_leaf === null) {
            console.log('Invalid id: ' + id);
            return null; // Error
        }

        let target_parent = target_leaf.parent;
        if (target_parent === null) {
            return null; // Root
        }

        let opposite_child = target_parent.getAnotherChild(target_leaf);
        if (opposite_child === null) {
            return null; // Error
        }

        let parent_of_parent = target_parent.parent;
        if (parent_of_parent === null) {
            this.root = opposite_child;
            opposite_child.parent = null;
        } else {
            parent_of_parent.replaceChild(target_parent, opposite_child);
        }

        return opposite_child.id;
    }
}
