import React from 'react';
import {createRenderer, Simulate} from 'react-addons-test-utils';
import {assert} from 'chai';
import StartPage from '../../renderer/components/start-page.jsx';
import History from '../../renderer/history';

describe('<StartPage> (shallow renderer)', () => {
    it('renders <div> component', () => {
        const renderer = createRenderer();
        renderer.render(
            <StartPage
                dispatch={() => {}}
                search={[]}
                tileId={0}
            />
        );
        const tree = renderer.getRenderOutput();
        assert.strictEqual(tree.type, 'div');
        assert.strictEqual(tree.props.className, 'start-page');
        const c = tree.props.children;
        assert.strictEqual(c[0].props.className, 'favorites');
        assert.strictEqual(c[1].props.className, 'history-input');
        assert.strictEqual(c[2].props.className, 'history-candidates');
    });

    it('renderers search results', () => {
        const renderer = createRenderer();
        renderer.render(
            <StartPage
                dispatch={() => {throw new Error('foo!');}}
                search={[
                    {url: 'https://github.com', title: 'GitHub', created_at: Date.now()}
                ]}
                tileId={0}
            />
        );
        const tree = renderer.getRenderOutput();
        const search_node = tree.props.children[2];
        assert.strictEqual(search_node.props.children.length, 1);
        const item_node = search_node.props.children[0];
        assert.strictEqual(item_node.props.className, 'history-item');
        const url_node = item_node.props.children[1];
        assert.strictEqual(url_node.props.className, 'history-url');
        assert.strictEqual(url_node.props.href, 'https://github.com');
        Simulate.click(url_node);
    });

    it('renderers all histories on no search input', done => {
        const renderer = createRenderer();
        renderer.render(
            <StartPage
                dispatch={() => {}}
                tileId={0}
            />
        );
        const tree = renderer.getRenderOutput();
        const items = tree.props.children[2].props.children;
        History.all().then(data => {
            assert.strictEqual(data.length, items.length);
            for (const i in data) {
                assert.strictEqual(data[i].url, items[i].props.children[1].props.href);
            }
            done();
        }).catch(err => done(err));
    });
});

