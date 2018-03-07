'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _webpackSources = require('webpack-sources');

var _utils = require('../../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PageChunkTemplatePlugin = function () {
  function PageChunkTemplatePlugin() {
    (0, _classCallCheck3.default)(this, PageChunkTemplatePlugin);
  }

  (0, _createClass3.default)(PageChunkTemplatePlugin, [{
    key: 'apply',
    value: function apply(chunkTemplate) {
      chunkTemplate.plugin('render', function (modules, chunk) {
        if (!_utils.IS_BUNDLED_PAGE.test(chunk.name)) {
          return modules;
        }

        var routeName = _utils.MATCH_ROUTE_NAME.exec(chunk.name)[1];

        // We need to convert \ into / when we are in windows
        // to get the proper route name
        // Here we need to do windows check because it's possible
        // to have "\" in the filename in unix.
        // Anyway if someone did that, he'll be having issues here.
        // But that's something we cannot avoid.
        if (/^win/.test(process.platform)) {
          routeName = routeName.replace(/\\/g, '/');
        }

        routeName = '/' + routeName.replace(/(^|\/)index$/, '');

        var source = new _webpackSources.ConcatSource();

        source.add('\n        __NEXT_REGISTER_PAGE(\'' + routeName + '\', function() {\n          var comp = \n      ');
        source.add(modules);
        source.add('\n          return { page: comp.default }\n        })\n      ');

        return source;
      });
    }
  }]);
  return PageChunkTemplatePlugin;
}();

var PagesPlugin = function () {
  function PagesPlugin() {
    (0, _classCallCheck3.default)(this, PagesPlugin);
  }

  (0, _createClass3.default)(PagesPlugin, [{
    key: 'apply',
    value: function apply(compiler) {
      compiler.plugin('compilation', function (compilation) {
        compilation.chunkTemplate.apply(new PageChunkTemplatePlugin());
      });
    }
  }]);
  return PagesPlugin;
}();

exports.default = PagesPlugin;