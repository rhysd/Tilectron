export class TileLeaf {
    constructor(parent, id) {
        this.parent = parent;
        this.id = id;
    }

    clone() {
        return new TileLeaf(this.parent, this.id);
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

    clone() {
        return new ContainerKnot(
            this.parent,
            this.left,
            this.right,
            this.split_type
        );
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

    getSiblingOf(child) {
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
    constructor(root, next_id) {
        this.root = root || new TileLeaf(null, 0);
        this.next_id = next_id || 1;
    }

    // Note:
    // Clone both self and its root because react component detects different properties.
    // <App/> component takes the root as property, not tree.
    clone() {
        return new TileTree(this.root.clone(), this.next_id);
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

        const sibling = target_parent.getSiblingOf(target_leaf);
        const closer_dir = target_parent.left === sibling ?
                                Direction.Right :
                                Direction.Left;

        if (sibling === null) {
            return null; // Error
        }

        const parent_of_parent = target_parent.parent;
        if (parent_of_parent === null) {
            this.root = sibling;
            sibling.parent = null;
        } else {
            parent_of_parent.replaceChild(target_parent, sibling);
        }

        let c = sibling;
        while (c.id === undefined) {
            c = c.getChild(closer_dir);
        }

        return c.id;
    }

    getNeighborImpl(target_node, direction, split_type) {
        const parent = target_node.parent;
        if (parent === null) {
            // Reached root; not found
            return null;
        }

        if (parent.split_type === split_type) {
            const opposite_dir = direction === Direction.Left ?
                        Direction.Right :
                        Direction.Left;
            const sibling = parent.getChild(opposite_dir);

            if (sibling === target_node) {
                // Found!
                let c = parent.getChild(direction);
                while (c instanceof ContainerKnot) {
                    if (c.split_type === split_type) {
                        c = c.getChild(opposite_dir);
                    } else {
                        c = c.left;
                    }
                }
                return c.id;
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

    switchSplitType(id) {
        let target_leaf = this.root.searchLeaf(id);
        if (target_leaf === null || target_leaf.parent === null) {
            return;
        }

        target_leaf.parent.split_type =
            target_leaf.parent.split_type === SplitType.Vertical ?
                SplitType.Horizontal : SplitType.Vertical;

        // Return new tree for updating react component
        return this.clone();
    }

    swapTiles(id) {
        const t = this.root.searchLeaf(id);
        if (t === null || t.parent === null) {
            return;
        }

        const p = t.parent;
        const tmp = p.right;
        p.right = p.left;
        p.left = tmp;

        // Return new tree for updating react component
        return this.clone();
    }
}
