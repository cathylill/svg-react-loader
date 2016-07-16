/*globals describe, it*/
require('should');

describe('svg-react-loader/lib/component/from-object', () => {
    const toModule = require('../../../lib/component/object-to-module');
    const xml = require('../../../lib/xml')();
    const read = require('../../../lib/util/read-file');

    const expectedProps = {
        version: "1.1",
        x: "0px",
        y: "0px",
        viewbox: "0 0 16 16",
        enableBackground: "new 0 0 16 16",
        xmlSpace: "preserve",
        className: "simple"
    };

    it('should return the correct string for a component function', (done) => {
        read('test/samples/simple.svg').
            flatMap(xml.parse).
            map(toModule).
            subscribe(
                (result) => {
                    result.
                        should.
                        equal(
                            'var React = require(\'react\');\n' +
                            'module.exports = function () { ' +
                            'return React.createElement("svg",' + JSON.stringify(expectedProps) + ',' +
                            '[React.createElement("rect",{"x":"0","y":"0",' +
                            '"width":"16","height":"16","fill":"#fff"})]' +
                            '); };'
                        );
                },
                (error) => { throw error; },
                done
            );
    });
});
