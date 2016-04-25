'use strict';

var parser = require('../lib/parser');


exports.config = {
    setUp: function(done) {
        this.origData = parser.data;
        parser.init({
            meta: require('./fixtures/test.json'),
            foo: '<%= meta.foo %>',
            foo2: '<%= foo %>',
            obj: {
                foo: '<%= meta.foo %>',
                foo2: '<%= obj.foo %>',
                Arr: ['foo', '<%= obj.foo2 %>'],
                arr2: ['<%= arr %>', '<%= obj.Arr %>'],
            },
            bar: 'bar',
            arr: ['foo', '<%= obj.foo2 %>'],
            arr2: ['<%= arr %>', '<%= obj.Arr %>'],
            buffer: new Buffer('test')
        });
        done();
    },
    tearDown: function(done) {
        parser.data = this.origData;
        done();
    },
    'parser.escape': function(test) {
        test.expect(2);
        test.equal(parser.escape('foo'), 'foo', 'Should do nothing if no . chars.');
        test.equal(parser.escape('foo.bar.baz'), 'foo\\.bar\\.baz', 'Should escape all . chars.');
        test.done();
    },
    'parser.getPropString': function(test) {
        test.expect(4);
        test.equal(parser.getPropString('foo'), 'foo', 'Should do nothing if already a string.');
        test.equal(parser.getPropString('foo.bar.baz'), 'foo.bar.baz', 'Should do nothing if already a string.');
        test.equal(parser.getPropString(['foo', 'bar']), 'foo.bar', 'Should join parts into a dot-delimited string.');
        test.equal(parser.getPropString(['foo.bar', 'baz.qux.zip']), 'foo\\.bar.baz\\.qux\\.zip', 'Should join parts into a dot-delimited string, escaping . chars in parts.');
        test.done();
    },
    'parser.getRaw': function(test) {
        test.expect(4);
        test.equal(parser.getRaw('foo'), '<%= meta.foo %>', 'Should not process templates.');
        test.equal(parser.getRaw('obj.foo2'), '<%= obj.foo %>', 'Should not process templates.');
        test.equal(parser.getRaw(['obj', 'foo2']), '<%= obj.foo %>', 'Should not process templates.');
        test.deepEqual(parser.getRaw('arr'), ['foo', '<%= obj.foo2 %>'], 'Should not process templates.');
        test.done();
    },
    'parser.process': function(test) {
        test.expect(7);
        test.equal(parser.process('<%= meta.foo %>'), 'bar', 'Should process templates.');
        test.equal(parser.process('<%= foo %>'), 'bar', 'Should process templates recursively.');
        test.equal(parser.process('<%= obj.foo %>'), 'bar', 'Should process deeply nested templates recursively.');
        test.deepEqual(parser.process(['foo', '<%= obj.foo2 %>']), ['foo', 'bar'], 'Should process templates in arrays.');
        test.deepEqual(parser.process(['<%= arr %>', '<%= obj.Arr %>']), [['foo', 'bar'], ['foo', 'bar']], 'Should expand <%= arr %> and <%= obj.Arr %> values as objects if possible.');
        var buf = parser.process('<%= buffer %>');
        test.ok(Buffer.isBuffer(buf), 'Should retrieve Buffer instances as Buffer.');
        test.deepEqual(buf, new Buffer('test'), 'Should return buffers as-is.');
        test.done();
    },
    'parser.get': function(test) {
        test.expect(10);
        test.equal(parser.get('foo'), 'bar', 'Should process templates.');
        test.equal(parser.get('foo2'), 'bar', 'Should process templates recursively.');
        test.equal(parser.get('obj.foo2'), 'bar', 'Should process deeply nested templates recursively.');
        test.equal(parser.get(['obj', 'foo2']), 'bar', 'Should process deeply nested templates recursively.');
        test.deepEqual(parser.get('arr'), ['foo', 'bar'], 'Should process templates in arrays.');
        test.deepEqual(parser.get('obj.Arr'), ['foo', 'bar'], 'Should process templates in arrays.');
        test.deepEqual(parser.get('arr2'), [['foo', 'bar'], ['foo', 'bar']], 'Should expand <%= arr %> and <%= obj.Arr %> values as objects if possible.');
        test.deepEqual(parser.get(['obj', 'arr2']), [['foo', 'bar'], ['foo', 'bar']], 'Should expand <%= arr %> and <%= obj.Arr %> values as objects if possible.');
        var buf = parser.get('buffer');
        test.ok(Buffer.isBuffer(buf), 'Should retrieve Buffer instances as Buffer.');
        test.deepEqual(buf, new Buffer('test'), 'Should return buffers as-is.');
        test.done();
    },
    'parser.set': function(test) {
        test.expect(6);
        test.equal(parser.set('foo3', '<%= foo2 %>'), '<%= foo2 %>', 'Should set values.');
        test.equal(parser.getRaw('foo3'), '<%= foo2 %>', 'Should have set the value.');
        test.equal(parser.data.foo3, '<%= foo2 %>', 'Should have set the value.');
        test.equal(parser.set('a.b.c', '<%= foo2 %>'), '<%= foo2 %>', 'Should create interim objects.');
        test.equal(parser.getRaw('a.b.c'), '<%= foo2 %>', 'Should have set the value.');
        test.equal(parser.data.a.b.c, '<%= foo2 %>', 'Should have set the value.');
        test.done();
    },
    'parser.merge': function(test) {
        test.expect(4);
        test.deepEqual(parser.merge({}), parser.getRaw(), 'Should return internal data object.');
        parser.set('obj', {a: 12});
        parser.merge({
            foo: 'test',
            baz: '123',
            obj: {a: 34, b: 56},
        });
        test.deepEqual(parser.getRaw('foo'), 'test', 'Should overwrite existing properties.');
        test.deepEqual(parser.getRaw('baz'), '123', 'Should add new properties.');
        test.deepEqual(parser.getRaw('obj'), {a: 34, b: 56}, 'Should deep merge.');
        test.done();
    },
    'parser': function(test) {
        test.expect(10);
        test.equal(parser('foo'), 'bar', 'Should retrieve processed data.');
        test.equal(parser('obj.foo2'), 'bar', 'Should retrieve processed data.');
        test.equal(parser(['obj', 'foo2']), 'bar', 'Should retrieve processed data.');
        test.deepEqual(parser('arr'), ['foo', 'bar'], 'Should process templates in arrays.');

        test.equal(parser('foo3', '<%= foo2 %>'), '<%= foo2 %>', 'Should set values.');
        test.equal(parser.getRaw('foo3'), '<%= foo2 %>', 'Should have set the value.');
        test.equal(parser.data.foo3, '<%= foo2 %>', 'Should have set the value.');
        test.equal(parser('a.b.c', '<%= foo2 %>'), '<%= foo2 %>', 'Should create interim objects.');
        test.equal(parser.getRaw('a.b.c'), '<%= foo2 %>', 'Should have set the value.');
        test.equal(parser.data.a.b.c, '<%= foo2 %>', 'Should have set the value.');
        test.done();
    }
};
