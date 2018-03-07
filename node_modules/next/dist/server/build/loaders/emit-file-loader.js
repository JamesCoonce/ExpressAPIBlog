'use strict';

var _loaderUtils = require('loader-utils');

var _loaderUtils2 = _interopRequireDefault(_loaderUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (content, sourceMap) {
  var _this = this;

  this.cacheable();
  var callback = this.async();
  var resourcePath = this.resourcePath;

  var query = _loaderUtils2.default.getOptions(this);

  // Allows you to do checks on the file name. For example it's used to check if there's both a .js and .jsx file.
  if (query.validateFileName) {
    try {
      query.validateFileName(resourcePath);
    } catch (err) {
      callback(err);
      return;
    }
  }

  var name = query.name || '[hash].[ext]';
  var context = query.context || this.options.context;
  var regExp = query.regExp;
  var opts = { context: context, content: content, regExp: regExp };
  var interpolateName = query.interpolateName || function (name) {
    return name;
  };
  var interpolatedName = interpolateName(_loaderUtils2.default.interpolateName(this, name, opts), { name: name, opts: opts });
  var emit = function emit(code, map) {
    _this.emitFile(interpolatedName, code, map);
    callback(null, code, map);
  };

  if (query.transform) {
    var transformed = query.transform({ content: content, sourceMap: sourceMap, interpolatedName: interpolatedName });
    return emit(transformed.content, transformed.sourceMap);
  }

  return emit(content, sourceMap);
};