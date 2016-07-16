function fromObject (obj) {
    var result =
        'React.createElement(' +
        JSON.stringify(obj.tagname) + ',' +
        JSON.stringify(obj.props);

    if (obj.children && obj.children.length) {
        result += ',[' + obj.children.map(fromObject).join(',') + ']';
    }

    result += ')';

    return result;
};

module.exports = function (obj) {
    var elements = fromObject(obj);
    return 'var React = require(\'react\');\n' +
        'module.exports = function () { return ' + elements + '; };';
};

