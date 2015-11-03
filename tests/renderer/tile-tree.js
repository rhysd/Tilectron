import TileTree, {TileLeaf, ContainerKnot, SplitType} from '../../renderer/tile-tree';
import {assert} from 'chai';

describe('TileTree', () => {
    describe('#new', () => {
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

    describe('#clone', () => {
        it('creates clone of the tree', () => {
            const t = new TileTree();
            t.split(0, SplitType.Horizontal);
            const c = t.clone();
            assert.equal(t.root.id, undefined);
            assert.instanceOf(t.root, ContainerKnot);
            assert.instanceOf(t.root.left, TileLeaf);
            assert.equal(t.root.left.id, 0);
            assert.instanceOf(t.root.right, TileLeaf);
            assert.equal(t.root.right.id, 1);
        });
    });
});
