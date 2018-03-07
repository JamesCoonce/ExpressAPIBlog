'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _webpackSources = require('webpack-sources');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isImportChunk = /^chunks[/\\]/;
var matchChunkName = /^chunks[/\\](.*)$/;

var DynamicChunkTemplatePlugin = function () {
  function DynamicChunkTemplatePlugin() {
    (0, _classCallCheck3.default)(this, DynamicChunkTemplatePlugin);
  }

  (0, _createClass3.default)(DynamicChunkTemplatePlugin, [{
    key: 'apply',
    value: function apply(chunkTemplate) {
      chunkTemplate.plugin('render', function (modules, chunk) {
        if (!isImportChunk.test(chunk.name)) {
          return modules;
        }

        var chunkName = matchChunkName.exec(chunk.name)[1];
        var source = new _webpackSources.ConcatSource();

        source.add('\n        __NEXT_REGISTER_CHUNK(\'' + chunkName + '\', function() {\n      ');
        source.add(modules);
        source.add('\n        })\n      ');

        return source;
      });
    }
  }]);
  return DynamicChunkTemplatePlugin;
}();

var DynamicChunksPlugin = function () {
  function DynamicChunksPlugin() {
    (0, _classCallCheck3.default)(this, DynamicChunksPlugin);
  }

  (0, _createClass3.default)(DynamicChunksPlugin, [{
    key: 'apply',
    value: function apply(compiler) {
      compiler.plugin('compilation', function (compilation) {
        compilation.chunkTemplate.apply(new DynamicChunkTemplatePlugin());

        compilation.plugin('additional-chunk-assets', function (chunks) {
          chunks = chunks.filter(function (chunk) {
            return isImportChunk.test(chunk.name) && compilation.assets[chunk.name];
          });

          chunks.forEach(function (chunk) {
            // This is to support, webpack dynamic import support with HMR
            var copyFilename = 'chunks/' + chunk.name;
            compilation.additionalChunkAssets.push(copyFilename);
            compilation.assets[copyFilename] = compilation.assets[chunk.name];
          });
        });
      });
    }
  }]);
  return DynamicChunksPlugin;
}();

exports.default = DynamicChunksPlugin;