# Parse Template Object

Parse objects that use templates as values (like grunt config).
It's actually based/derived on [grunt config mechanism](https://github.com/gruntjs/grunt).

### Install

```
npm install parse-template-object --save
```

### Usage

```javascript

var parse = require('parse-template-object');

var object = {
    meta: { version: 1.1.0 },
    package: {
        name: 'awesome-<%= meta.version %>'
    },
    arr: ['foo', '<%= package.name %>']
};

var parsed = parse(object);

console.log(parsed);

// OUT:
//
// {
//     meta: { version: '1.1.0' },
//     package: {
//         name: '1.1.0'
//     }
//     arr: ['foo', 'awesome-1.1.0']
// }
//
```

