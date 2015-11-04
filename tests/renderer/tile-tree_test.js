import TileTree, {TileLeaf, ContainerKnot, SplitType} from '../../renderer/tile-tree';
import {assert} from 'chai';

describe('TileLeaf', () => {
    let l;

    beforeEach(() => {
        l = new TileLeaf(null, 99);
    });

    describe('constructor', () => {
        it('generates new leaf', () => {
            assert.strictEqual(l.id, 99);
            assert.strictEqual(l.parent, null);
        });
    });

    describe('clone()', () => {
        it('generates clone of itself', () => {
            const c = l.clone();
            assert.strictEqual(l.id, c.id);
            assert.strictEqual(l.parent, c.parent);
            assert.notStrictEqual(c, l);
        });
    });

    describe('searchLeaf()', () => {
        it('returns itself if it is a target', () => {
            const r = l.searchLeaf(99);
            assert.strictEqual(l, r);
        });

        it('returns null if it is not a target', () => {
            const r = l.searchLeaf(999);
            assert.strictEqual(r, null);
        });
    });
});

describe('ContainerKnot', () => {
    let l, r, k;

    beforeEach(() => {
        l = new TileLeaf(null, 1);
        r = new TileLeaf(null, 2);
        k = new ContainerKnot(null, l, r, SplitType.Vertical);
    });

    describe('constructor', () => {
        it('generates new knot', () => {
            assert.strictEqual(k.left, l);
            assert.strictEqual(k.right, r);
            assert.strictEqual(k.parent, null);
            assert.strictEqual(k.split_type, SplitType.Vertical);
            assert.strictEqual(l.parent, k);
            assert.strictEqual(r.parent, k);
        });
    });

    describe('clone()', () => {
        it('generates clone of itself', () => {
            const c = k.clone();
            assert.strictEqual(c.left, k.left);
            assert.strictEqual(c.right, k.right);
            assert.strictEqual(c.parent, k.parent);
            assert.strictEqual(c.split_type, k.split_type);
            assert.notStrictEqual(c, k);
        });
    });

    describe('replaceChild()', () => {
        it('replaces a child', () => {
            const other = new TileLeaf(null, 3);
            k.replaceChild(l, other);
            assert.strictEqual(k.left, other);
            k.replaceChild(r, other);
            assert.strictEqual(k.right, other);
        });

        it('does nothing if argument is not a child', () => {
            const other = new TileLeaf(null, 3);
            const left = k.left;
            const right = k.right;
            k.replaceChild(other, other);
            assert.strictEqual(k.left, left);
            assert.strictEqual(k.right, right);
        });
    });

    describe('getSiblingOf()', () => {
        it('returns sibling of the child', () => {
            const other = new TileLeaf(null, 3);
            assert.strictEqual(k.getSiblingOf(l), r);
            assert.strictEqual(k.getSiblingOf(r), l);
            assert.strictEqual(k.getSiblingOf(other), null);
        });
    });

    describe('searchLeaf()', () => {
        it('returns child if it is a target', () => {
            const a = k.searchLeaf(1);
            assert.strictEqual(a, k.left);
            const b = k.searchLeaf(2);
            assert.strictEqual(b, k.right);
        });

        it('returns null if children are not target', () => {
            const a = k.searchLeaf(3);
            assert.strictEqual(a, null);
        });

        it('searches children recursively', () => {
            const other_leaf = new TileLeaf(null, 3);
            const k2 = new ContainerKnot(null, k, other_leaf, SplitType.Horizontal);
            const a = k2.searchLeaf(1);
            assert.strictEqual(a, k.left);
            const b = k2.searchLeaf(2);
            assert.strictEqual(b, k.right);
            const c = k2.searchLeaf(4);
            assert.strictEqual(c, null);
        });
    });
});

describe('TileTree', () => {

    let t, l1, l2, r;

    //      t
    //      |
    //      k1
    //      /\
    //   l1:0  k2
    //        /\
    //     l2:1  r:2

    // --------------
    // |     l1     |
    // --------------
    // |  l2  |  r  |
    // --------------

    beforeEach(() => {
        t = new TileTree();
        t.split(0, SplitType.Horizontal);
        t.split(1, SplitType.Vertical);
        l1 = t.root.left;
        l2 = t.root.right.left;
        r = t.root.right.right;
    });

    describe('constructor', () => {
        it('creates new empty tree', () => {
            const t = new TileTree();
            assert.instanceOf(t.root, TileLeaf);
            assert.equal(t.root.id, 0);
            assert.equal(t.parent, null);
        });

        it('creates specified root and id', () => {
            const l = new TileLeaf(null, 99);
            const t = new TileTree(l, 1234);
            assert.instanceOf(t.root, TileLeaf);
            assert.equal(t.root.id, 99);
            assert.equal(t.root.parent, null);
            const new_id = t.split(99, SplitType.Vertical);
            assert.equal(new_id, 1234);
        });
    });

    describe('clone()', () => {
        it('creates clone of the tree', () => {
            const c = t.clone();
            assert.equal(c.root.id, undefined);
            assert.instanceOf(c.root, ContainerKnot);
            assert.instanceOf(c.root.left, TileLeaf);
            assert.equal(c.root.left.id, 0);
            assert.instanceOf(c.root.right, ContainerKnot);
            assert.notStrictEqual(c, t);
        });
    });

    describe('split()', () => {
        it('splits a tile specified by id', () => {
            t.split(0, SplitType.Horizontal);
            const k = t.root.left
            assert.instanceOf(k, ContainerKnot);
            assert.strictEqual(k.left.id, 0);
            assert.strictEqual(k.right.id, 3);

            t.split(2, SplitType.Vertical);
            const k2 = t.root.right.right
            assert.instanceOf(k2, ContainerKnot);
            assert.strictEqual(k2.left.id, 2);
            assert.strictEqual(k2.right.id, 4);
        });

        it('returns id of generated tile', () => {
            const i = t.split(1, SplitType.Horizontal);
            assert.strictEqual(i, 3);
        });
    });

    describe('remove()', () => {
        it('returns the id of sibling of removed leaf', () => {
            let i = t.remove(2);
            assert.notStrictEqual(r, null);
            assert.strictEqual(i, 1);
        });

        it('can remove tile of terminal knot', () => {
            let i = t.remove(2);
            assert.strictEqual(t.root.right.id, 1);
            i = t.remove(0);
            assert.strictEqual(t.root.id, 1);
        });

        it('can remove tile of non-terminal knot', () => {
            t.remove(0);
            assert.strictEqual(t.root.left.id, 1);
            assert.strictEqual(t.root.right.id, 2);
        });

        it('returns null if id is not found', () => {
            const i = t.remove(100);
            assert.strictEqual(i, null);
        });

        it('does not remove last tile and returns null', () => {
            let t = new TileTree();
            const i = t.remove(0);
            assert.strictEqual(i, null);
            assert.notStrictEqual(t.root, null);
            assert.strictEqual(t.root.id, 0);
        });
    });

    describe('getLeftOf()', () => {
        it('returns the left child of specified tile', () => {
            let i = t.getLeftOf(r.id);
            assert.strictEqual(i, l2.id);
            i = t.split(r.id, SplitType.Horizontal);
            i = t.getLeftOf(i);
            assert.strictEqual(i, l2.id);
        });

        it('returns null if neighbor is not found', () => {
            let i = t.getLeftOf(l1.id);
            assert.strictEqual(i, null);
            i = t.getLeftOf(l2.id);
            assert.strictEqual(i, null);
        });

        it('returns null if the id is not found', () => {
            let i = t.getLeftOf(99);
            assert.strictEqual(i, null);
        });
    });

    describe('getRightOf()', () => {
        it('returns the right child of specified tile', () => {
            let i = t.getRightOf(l2.id);
            assert.strictEqual(i, r.id);
            i = t.split(l2.id, SplitType.Horizontal);
            i = t.getRightOf(i);
            assert.strictEqual(i, r.id);
        });

        it('returns null if neighbor is not found', () => {
            let i = t.getRightOf(l1.id);
            assert.strictEqual(i, null);
            i = t.getRightOf(r.id);
            assert.strictEqual(i, null);
        });

        it('returns null if the id is not found', () => {
            let i = t.getRightOf(99);
            assert.strictEqual(i, null);
        });
    });

    describe('getUpOf()', () => {
        it('returns the upper child of specified tile', () => {
            let i = t.getUpOf(l2.id);
            assert.strictEqual(i, l1.id);
            i = t.getUpOf(r.id);
            assert.strictEqual(i, l1.id);
            i = t.split(l2.id, SplitType.Horizontal);
            i = t.getUpOf(i);
            assert.strictEqual(i, l2.id);
        });

        it('returns null if neighbor is not found', () => {
            let i = t.getUpOf(l1.id);
            assert.strictEqual(i, null);
        });

        it('returns null if the id is not found', () => {
            let i = t.getUpOf(99);
            assert.strictEqual(i, null);
        });
    });

    describe('getDownOf()', () => {
        it('returns the upper child of specified tile', () => {
            let i = t.getDownOf(l1.id);
            assert.strictEqual(i, l2.id);
            i = t.split(l2.id, SplitType.Horizontal);
            let i2 = t.getDownOf(l2.id);
            assert.strictEqual(i, i2);
        });

        it('returns null if neighbor is not found', () => {
            let i = t.getDownOf(l2.id);
            assert.strictEqual(i, null);
            i = t.getDownOf(r.id);
            assert.strictEqual(i, null);
        });

        it('returns null if the id is not found', () => {
            let i = t.getDownOf(99);
            assert.strictEqual(i, null);
        });
    });

    describe('switchSplitType()', () => {
        it('returns new tree', () => {
            const t2 = t.switchSplitType(l1.id);
            assert.notStrictEqual(t2, t);
        });

        it('switches type from horizontal to vertical', () => {
            const t2 = t.switchSplitType(l1.id);
            assert.strictEqual(t2.root.split_type, SplitType.Vertical);
        });

        it('switches type from vertical to horizontal', () => {
            const t2 = t.switchSplitType(r.id);
            assert.strictEqual(t2.root.split_type, SplitType.Horizontal);
            const t3 = t.switchSplitType(l2.id);
            assert.strictEqual(t3.root.split_type, SplitType.Horizontal);
        });
    });

    describe('swapTiles()', () => {
        it('returns new tree', () => {
            const t2 = t.swapTiles(l1.id);
            assert.notStrictEqual(t2, t);
        });

        it('swaps between left and right in horizontal split', () => {
            const left = t.root.left;
            const right = t.root.right;
            const t2 = t.swapTiles(l1.id);
            assert.strictEqual(left, t2.root.right);
            assert.strictEqual(right, t2.root.left);
        });

        it('swaps between left and right in vertical split', () => {
            const left = t.root.right.left;
            const right = t.root.right.right;
            const t2 = t.swapTiles(l2.id);
            assert.strictEqual(left, t2.root.right.right);
            assert.strictEqual(right, t2.root.right.left);
            const t3 = t2.swapTiles(r.id);
            assert.strictEqual(left, t3.root.right.left);
            assert.strictEqual(right, t3.root.right.right);
        });
    });
});
