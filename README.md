# Parse Template Object

Parse objects that use templates as values (like grunt config).
It's actually based/derived on [grunt config mechanism](https://github.com/gruntjs/grunt).

[![Build Status](https://travis-ci.org/rbarilani/parse-template-object.svg?branch=master)](https://travis-ci.org/rbarilani/parse-template-object)

### Install

```
npm install parse-template-object --save
```

### Usage

```javascript

//
// Basic usage
//
var parse = require('parse-template-object');

var object = {
    meta: { version: '1.1.0' },
    package: {
        name: 'awesome-<%= meta.version %>'
    },
    arr: ['foo', '<%= package.name %>']
};

console.log(parse(object));

// OUT:
//
// {
//     meta: { version: '1.1.0' },
//     package: {
//         name: 'awesome-1.1.0'
//     }
//     arr: ['foo', 'awesome-1.1.0']
// }
// ------------------------------------

//
// Importing object into the template as free variables.
//
var object2 = {
    package: {
        name: 'awesome-<%= meta.version %>'
    },
    arr: ['foo', '<%= package.name %>']
};

var parsed2 = parse(object2, {
  imports: {
    meta: { version: '1.1.0'}
  }
});

console.log(parsed2);

// OUT:
//
// {
//     package: {
//         name: 'awesome-1.1.0'
//     }
//     arr: ['foo', 'awesome-1.1.0']
// }
// ------------------------------------
```
