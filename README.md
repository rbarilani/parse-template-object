# Template Object Parser

Parse template objects (like grunt config)

### Install

```
npm install template-object-parser
```

### Usage

```javascript

var parse = require('template-object-parser');

var object = {
    meta: { version: 1.1.0 },
    package: {
        name: '<%= meta.version %> '
    }   
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
// }
//
```

