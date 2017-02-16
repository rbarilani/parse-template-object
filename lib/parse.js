var parser = require('./parser');

module.exports = function (object, options) {
    parser.init(object, options);
    return parser.get();
};
