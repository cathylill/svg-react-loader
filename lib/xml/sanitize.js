var R        = require('ramda');
var traverse = require('traverse');

var TAGNAME_KEY = '#name';

var DEFAULTS = {
    tagname: 'tagname',
    propFilters: [
        function xmlns (prop, value, context) {
            switch (prop) {
                case 'xmlns':
                case 'xmlnsXlink':
                    context.delete();
            }
        }
    ]
};

module.exports = R.curry(function sanitize (opts, tree) {
    opts = opts || {};

    if (opts.propFilters) {
        opts.propFilters = DEFAULTS.filters.slice().concat(opts.propFilters);
    }

    var options = R.merge(DEFAULTS, opts);
    var tagname = options.tagname;
    var filters = options.propFilters;

    return traverse.map(tree, function (value) {
        var ctx     = this;
        var path    = this.path;
        var isProps = path[path.length - 2] === 'props';
        var prop    = isProps && path[path.length - 1];

        if (this.notLeaf && TAGNAME_KEY in value) {
            Object.assign(value, R.objOf(tagname, value[TAGNAME_KEY]));
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
