'use strict';

var template = require('../lib/template');

exports.template = {
  'process': function(test) {
    test.expect(4);
    var obj = {
      foo: 'c',
      bar: 'b<%= foo %>d',
      baz: 'a<%= bar %>e'
    };

    test.equal(template.process('<%= foo %>', {data: obj}), 'c', 'should retrieve value.');
    test.equal(template.process('<%= bar %>', {data: obj}), 'bcd', 'should recurse.');
    test.equal(template.process('<%= baz %>', {data: obj}), 'abcde', 'should recurse.');

    obj.foo = '<% oops %';
    test.equal(template.process('<%= baz %>', {data: obj}), 'ab<% oops %de', 'should not explode.');
    test.done();
  },

  'custom delimiters': function(test) {
    test.expect(6);
    var obj = {
      foo: 'c',
      bar: 'b{%= foo %}d',
      baz: 'a{%= bar %}e'
    };

    test.equal(template.process('{%= foo %}', {data: obj, delimiters: 'custom'}), '{%= foo %}', 'custom delimiters have yet to be defined.');

    // Define custom delimiters.
    template.addDelimiters('custom', '{%', '%}');

    test.equal(template.process('{%= foo %}', {data: obj, delimiters: 'custom'}), 'c', 'should retrieve value.');
    test.equal(template.process('{%= bar %}', {data: obj, delimiters: 'custom'}), 'bcd', 'should recurse.');
    test.equal(template.process('{%= baz %}', {data: obj, delimiters: 'custom'}), 'abcde', 'should recurse.');

    test.equal(template.process('{%= foo %}<%= foo %>', {data: obj, delimiters: 'custom'}), 'c<%= foo %>', 'should ignore default delimiters');

    obj.foo = '{% oops %';
    test.equal(template.process('{%= baz %}', {data: obj, delimiters: 'custom'}), 'ab{% oops %de', 'should not explode.');

    test.done();
  }
};
