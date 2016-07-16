var R        = require('ramda');
var traverse = require('traverse');

var TAGNAME_KEY = require('./xml2js-name-key');

module.exports = R.curry(function sanitize (opts, tree) {
    opts = opts || {};

    var tagkey  = opts.tagkey;
    var filters = opts.propFilters;

    return traverse.map(tree, function (value) {
        var ctx     = this;
        var path    = this.path;
        var isProps = path[path.length - 2] === 'props';
        var prop    = isProps && path[path.length - 1];

        if (this.notLeaf && TAGNAME_KEY in value) {
            Object.assign(value, R.objOf(tagkey, value[TAGNAME_KEY]));
            delete value[TAGNAME_KEY];
        }

        if (this.isLeaf && prop) {
            filters.
                forEach(function (fn) {
                    fn(prop, value, ctx);
                });
        }
    });
});
