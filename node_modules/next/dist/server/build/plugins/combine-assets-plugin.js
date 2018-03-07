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

// This plugin combines a set of assets into a single asset
// This should be only used with text assets,
// otherwise the result is unpredictable.
var CombineAssetsPlugin = function () {
  function CombineAssetsPlugin(_ref) {
    var input = _ref.input,
        output = _ref.output;
    (0, _classCallCheck3.default)(this, CombineAssetsPlugin);

    this.input = input;
    this.output = output;
  }

  (0, _createClass3.default)(CombineAssetsPlugin, [{
    key: 'apply',
    value: function apply(compiler) {
      var _this = this;

      compiler.plugin('compilation', function (compilation) {
        // This is triggered after uglify and other optimizers have ran.
        compilation.plugin('after-optimize-chunk-assets', function (chunks) {
          var concat = new _webpackSources.ConcatSource();

          _this.input.forEach(function (name) {
            var asset = compilation.assets[name];
            if (!asset) return;

            // We add each matched asset from this.input to a new bundle
            concat.add(asset);
            // The original assets are kept because they show up when analyzing the bundle using webpack-bundle-analyzer
            // See https://github.com/zeit/next.js/tree/canary/examples/with-webpack-bundle-analyzer
          });

          // Creates a new asset holding the concatted source
          compilation.assets[_this.output] = concat;
        });
      });
    }
  }]);
  return CombineAssetsPlugin;
}();

exports.default = CombineAssetsPlugin;