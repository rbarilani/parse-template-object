'use strict';

var parser = require('./parser');

module.exports = function (object) {
    parser.init(object);
    return parser.get();
};
