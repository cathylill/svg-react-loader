var Rx     = require('rx');
var R      = require('ramda');
var xml2js = require('xml2js');

var TAGNAME_KEY = require('./xml2js-name-key');

module.exports = function xml (opts) {
    var options   = require('./options')(opts);
    var sanitizer = require('./sanitize')(R.pick(['tagkey', 'propFilters'], options));
    var parser    = new xml2js.Parser(options);

    return {
        parse: function (src) {
            return Rx.Observable.create(function (observer) {
                var disposed = false;
                var data;

                parser.parseString(src, function (error, result) {
                    if (disposed) {
                        return;
                    }

                    if (error) {
                        observer.onError(error);
                    }
                    else {
                        data = {};

                        data[TAGNAME_KEY]      = result[TAGNAME_KEY];
                        data[options.attrkey]  = result[options.attrkey];
                        data[options.childkey] = result[options.childkey];

                        data = sanitizer(data);

                        observer.onNext(data);
                        observer.onCompleted();
                    }
                });

                return Rx.Disposable.create(function () {
                    if (!disposed) {
                        disposed = true;
                    }
                });
            });
        }
    };
};
