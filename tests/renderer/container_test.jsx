import React from 'react';
import {createRenderer} from 'react-addons-test-utils';
import {assert} from 'chai';
import Container from '../../renderer/components/container.jsx';
import Tile from '../../renderer/components/tile.jsx';
import {TileLeaf, ContainerKnot, SplitType} from '../../renderer/tile-tree';

const {Horizontal, Vertical} = SplitType;

function makeKnot(type) {
    const lhs = new TileLeaf(null, 0);
    const rhs = new TileLeaf(null, 1);
    return new ContainerKnot(null, lhs, rhs, type);
}

describe('<Container/> (shallow renderer)', () => {
    it('renders <Tile> if child is terminal', () => {
        const renderer = createRenderer();
        renderer.render(
            <Container
                dispatch={() => {}}
                style={{}}
                current_id={0}
                knot={makeKnot(Horizontal)}
            />
        );
        const tree = renderer.getRenderOutput();
        tree.props.children.forEach(c => {
            assert.strictEqual(c.type, Tile);
        });
    });

    it('renders <Container> if child is non-terminal', () => {
        const k = makeKnot(Horizontal);
        const l = makeKnot(Vertical);
        const r = makeKnot(Vertical);
        [k.left, k.right, l.parent, r.parent] = [l, r, k, k];
        const renderer = createRenderer();
        renderer.render(
            <Container
                dispatch={() => {}}
                style={{}}
                current_id={0}
                knot={k}
            />
        );
        const tree = renderer.getRenderOutput();
        tree.props.children.forEach(c => {
            assert.strictEqual(c.type, Container);
        });
    });

    it('renders horizontally split container', () => {
        const renderer = createRenderer();
        renderer.render(
            <Container
                dispatch={() => {}}
                style={{}}
                current_id={0}
                knot={makeKnot(Horizontal)}
            />
        );
        const tree = renderer.getRenderOutput();
        assert.strictEqual(tree.props.className, 'knot');
        assert.deepEqual(
            tree.props.style,
            {flexDirection: 'column'}
        );
        tree.props.children.forEach(c => {
            assert.deepEqual(
                c.props.style,
                {width: '100%', height: '50%'}
            );
        });
    });

    it('renders vertically split container', () => {
        const renderer = createRenderer();
        renderer.render(
            <Container
                dispatch={() => {}}
                style={{}}
                current_id={0}
                knot={makeKnot(Vertical)}
            />
        );
        const tree = renderer.getRenderOutput();
        assert.strictEqual(tree.props.className, 'knot');
        assert.deepEqual(
            tree.props.style,
            {flexDirection: 'row'}
        );
        tree.props.children.forEach(c => {
            assert.deepEqual(
                c.props.style,
                {width: '50%', height: '100%'}
            );
        });
    });
});
