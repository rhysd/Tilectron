import {assert} from 'chai';
import History from '../../renderer/history';

describe('History', () => {
        afterEach(
            done =>
                History.histories.clear()
                .then(() => done())
                .catch(err => done(err))
        );

    describe('constructor', () => {
        it('opens empty DB', done => {
            History.all().then(data => {
                assert.strictEqual(data.length, 0);
                done();
            }).catch(err => done(err));
        });
    });

    describe('add()', () => {
        it('adds entry and returns promise', done => {
            History.add('https://example.com/1', 'Example 1')
                .then(() => History.add('https://example.com/2', 'Example 2'))
                .then(() => History.add('https://example.com/3', 'Example 3'))
                .then(() => History.all())
                .then(data => {
                    assert.strictEqual(data.length, 3);
                    assert.deepEqual(data[0].url, 'https://example.com/1');
                    assert.deepEqual(data[1].url, 'https://example.com/2');
                    assert.deepEqual(data[2].url, 'https://example.com/3');
                    done();
                }).catch(err => done(err));
        });

        it('does not make duplicate in DB entries', () => {
            History.add('https://example.com/1', 'Example Foo')
                .then(() => History.add('https://example.com/1', 'Example Bar'))
                .then(() => History.add('https://example.com/1', 'Example Yo'))
                .then(() => History.all())
                .then(data => {
                    assert.strictEqual(data.length, 1);
                    assert.deepEqual(data[0].url, 'https://example.com/1');
                    assert.deepEqual(data[0].title, 'Example Foo');
                    done();
                }).catch(err => done(err));
        });
    });

    describe('search()', () => {
        it('can search DB with specified word', done => {
            History.add('https://github.com', 'GitHub')
                .then(() => History.add('https://gist.github.com', 'Gist'))
                .then(() => History.add('https://google.com', 'Google'))
                .then(() => History.search('github'))
                .then(result => {
                    assert.strictEqual(result.length, 2);
                    assert.strictEqual(result[0].url, 'https://github.com');
                    assert.strictEqual(result[1].url, 'https://gist.github.com');
                }).then(() => History.search('gist'))
                .then(result => {
                    assert.strictEqual(result.length, 1);
                    assert.strictEqual(result[0].url, 'https://gist.github.com');
                }).then(() => History.search('g'))
                .then(result => {
                    assert.strictEqual(result.length, 3);
                    assert.strictEqual(result[0].url, 'https://github.com');
                    assert.strictEqual(result[1].url, 'https://gist.github.com');
                    assert.strictEqual(result[2].url, 'https://google.com');
                }).then(() => History.search('foooooOOOO!!!!!'))
                .then(result => {
                    assert.strictEqual(result.length, 0);
                    done();
                }).catch(err => done(err));
        });
    });
});
