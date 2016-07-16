/*globals describe, it*/
require('should');

describe('svg-react-loader/lib/xml', () => {
    const xml = require('../../../lib/xml')();
    const read = require('../../../lib/util/read-file');

    it('should parse xml correctly', (done) => {
        read('test/samples/simple.svg').
            flatMap(xml.parse).
            subscribe(
                (result) => {
                    result.
                        should.
                        eql({
                            "props": {
                                "version": "1.1",
                                "x": "0px",
                                "y": "0px",
                                "viewbox": "0 0 16 16",
                                "enableBackground": "new 0 0 16 16",
                                "xmlSpace": "preserve",
                                "className": "simple"
                            },
                            "tagname": "svg",
                            "children": [
                                {
                                    "props": {
                                        "x": "0",
                                        "y": "0",
                                        "width": "16",
                                        "height": "16",
                                        "fill": "#fff"
                                    },
                                    "tagname": "rect"
                                }
                            ]
                        });
                },
                (error) => { throw error; },
                done
            );
    });
});
