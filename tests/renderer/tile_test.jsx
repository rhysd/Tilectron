import React from 'react';
import Immutable from 'immutable';
import {createRenderer} from 'react-addons-test-utils';
import {assert} from 'chai';
import Tile from '../../renderer/components/tile.jsx';
import StartPage from '../../renderer/components/start-page.jsx';
import WebPage from '../../renderer/components/web-page.jsx';
import {TileLeaf} from '../../renderer/tile-tree';
import PageState from '../../renderer/page-state';

function render(component) {
    const renderer = createRenderer();
    renderer.render(component);
    return renderer.getRenderOutput();
}

describe('<Tile> (shallow renderer)', () => {
    it('renders <StartPage> on no page information', () => {
        const tree = render(
            <Tile
                current_id={42}
                style={{}}
                onMouseOver={() => {}}
                leaf={new TileLeaf(null, 10)}
                pages={Immutable.Map()}
                searches={Immutable.Map()}
            />
        );
        assert.strictEqual(tree.type, 'div');
        const child = tree.props.children;
        assert.strictEqual(child.type, StartPage);
        assert.strictEqual(child.props.tileId, 10);
        assert.strictEqual(child.props.focused, false);
    });

    it('renders <WebPage> on page information', () => {
        const pages = Immutable.Map().set(42, new PageState());
        const tree = render(
            <Tile
                current_id={10}
                style={{}}
                onMouseOver={() => {}}
                leaf={new TileLeaf(null, 42)}
                pages={pages}
                searches={Immutable.Map()}
            />
        );
        const child = tree.props.children;
        assert.strictEqual(child.type, WebPage);
    });

    it('check the tile is focused', () => {
        const tree = render(
            <Tile
                current_id={42}
                style={{}}
                onMouseOver={() => {}}
                leaf={new TileLeaf(null, 42)}
                pages={Immutable.Map()}
                searches={Immutable.Map()}
            />
        );
        const child = tree.props.children;
        assert.strictEqual(child.props.focused, true);
    });
});

