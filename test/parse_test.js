var parse = require('../lib/parse');

exports.config = {
    setUp: function (done) {
        done();
    },
    tearDown: function (done) {
        done();
    },
    'parse': function (test) {
        test.expect(4);
        var parsed = parse({
            meta: require('./fixtures/test.json'),
            foo: '<%= meta.foo %>',
            foo2: '<%= foo %>',
            obj: {
                foo: '<%= meta.foo %>',
                foo2: '<%= obj.foo %>',
                Arr: ['foo', '<%= obj.foo2 %>'],
                arr2: ['<%= arr %>', '<%= obj.Arr %>']
            },
            bar: 'bar',
            arr: ['foo', '<%= obj.foo2 %>'],
            arr2: ['<%= arr %>', '<%= obj.Arr %>'],
            buffer: new Buffer('test')
        });

        test.equal(parsed.foo, 'bar', 'Should retrieve processed data.');
        test.equal(parsed.obj.foo2, 'bar', 'Should retrieve processed data.');
        test.deepEqual(parsed.arr, ['foo', 'bar'], 'Should process templates in arrays.');
        test.deepEqual(parsed.arr2, [[ 'foo', 'bar' ], [ 'foo', 'bar' ]], 'Should process templates in  nested arrays.');
        test.done();
    }
};
