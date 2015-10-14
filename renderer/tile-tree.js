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

const Direction = {
    Left: Symbol('left'),
    Right: Symbol('right')
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

    getChild(direction) {
        if (direction === Direction.Left) {
            return this.left;
        } else {
            return this.right;
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
        const target_leaf = this.root.searchLeaf(id);
        if (target_leaf === null) {
            console.log('Invalid id: ' + id);
            return null;
        }

        const new_leaf = new TileLeaf(null, this.next_id++);
        const target_parent = target_leaf.parent;
        const new_container = new ContainerKnot(target_parent, target_leaf, new_leaf, split_type);

        if (target_parent === null) {
            this.root = new_container;
        } else {
            target_parent.replaceChild(target_leaf, new_container);
        }

        return new_leaf.id;
    }

    remove(id) {
        const target_leaf = this.root.searchLeaf(id);
        if (target_leaf === null) {
            console.log('Invalid id: ' + id);
            return null; // Error
        }

        const target_parent = target_leaf.parent;
        if (target_parent === null) {
            return null; // Root
        }

        const opposite_child = target_parent.getAnotherChild(target_leaf);
        if (opposite_child === null) {
            return null; // Error
        }

        const parent_of_parent = target_parent.parent;
        if (parent_of_parent === null) {
            this.root = opposite_child;
            opposite_child.parent = null;
        } else {
            parent_of_parent.replaceChild(target_parent, opposite_child);
        }

        return opposite_child.id;
    }

    getNeighborImpl(target_node, direction, split_type) {
        const parent = target_node.parent;
        if (parent === null) {
            // Reached root; not found
            return null;
        }

        console.log(target_node);

        if (parent.split_type === split_type) {
            const c = parent.getChild(
                    direction === Direction.Left ?
                        Direction.Right :
                        Direction.Left
                );

            if (c === target_node) {
                // Found!
                return parent.getChild(direction).id;
            }
        }

        return this.getNeighborImpl(parent, direction, split_type);
    }

    getNeighbor(id, direction, split_type) {
        let target_leaf = this.root.searchLeaf(id);
        if (target_leaf === null) {
            console.log('Invalid id: ' + id);
            return null; // Error
        }
        return this.getNeighborImpl(target_leaf, direction, split_type);
    }

    getLeftOf(id) {
        return this.getNeighbor(id, Direction.Left, SplitType.Vertical);
    }
    getRightOf(id) {
        return this.getNeighbor(id, Direction.Right, SplitType.Vertical);
    }
    getUpOf(id) {
        return this.getNeighbor(id, Direction.Left, SplitType.Horizontal);
    }
    getDownOf(id) {
        return this.getNeighbor(id, Direction.Right, SplitType.Horizontal);
    }
}
