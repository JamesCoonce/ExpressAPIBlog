'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _resolve = require('resolve');

var _resolve2 = _interopRequireDefault(_resolve);

var _uglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');

var _uglifyjsWebpackPlugin2 = _interopRequireDefault(_uglifyjsWebpackPlugin);

var _caseSensitivePathsWebpackPlugin = require('case-sensitive-paths-webpack-plugin');

var _caseSensitivePathsWebpackPlugin2 = _interopRequireDefault(_caseSensitivePathsWebpackPlugin);

var _writeFileWebpackPlugin = require('write-file-webpack-plugin');

var _writeFileWebpackPlugin2 = _interopRequireDefault(_writeFileWebpackPlugin);

var _friendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

var _friendlyErrorsWebpackPlugin2 = _interopRequireDefault(_friendlyErrorsWebpackPlugin);

var _utils = require('./webpack/utils');

var _combineAssetsPlugin = require('./plugins/combine-assets-plugin');

var _combineAssetsPlugin2 = _interopRequireDefault(_combineAssetsPlugin);

var _pagesPlugin = require('./plugins/pages-plugin');

var _pagesPlugin2 = _interopRequireDefault(_pagesPlugin);

var _nextjsSsrImport = require('./plugins/nextjs-ssr-import');

var _nextjsSsrImport2 = _interopRequireDefault(_nextjsSsrImport);

var _dynamicChunksPlugin = require('./plugins/dynamic-chunks-plugin');

var _dynamicChunksPlugin2 = _interopRequireDefault(_dynamicChunksPlugin);

var _unlinkFilePlugin = require('./plugins/unlink-file-plugin');

var _unlinkFilePlugin2 = _interopRequireDefault(_unlinkFilePlugin);

var _findConfig = require('./babel/find-config');

var _findConfig2 = _interopRequireDefault(_findConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nextDir = _path2.default.join(__dirname, '..', '..', '..');
var nextNodeModulesDir = _path2.default.join(nextDir, 'node_modules');
var nextPagesDir = _path2.default.join(nextDir, 'pages');
var defaultPages = ['_error.js', '_document.js'];
var interpolateNames = new _map2.default(defaultPages.map(function (p) {
  return [_path2.default.join(nextPagesDir, p), 'dist/bundles/pages/' + p];
}));

function babelConfig(dir, _ref) {
  var isServer = _ref.isServer,
      dev = _ref.dev;

  var mainBabelOptions = {
    cacheDirectory: true,
    presets: [],
    plugins: [dev && !isServer && require.resolve('react-hot-loader/babel')].filter(Boolean)
  };

  var externalBabelConfig = (0, _findConfig2.default)(dir);
  if (externalBabelConfig) {
    // Log it out once
    if (!isServer) {
      console.log('> Using external babel configuration');
      console.log('> Location: "' + externalBabelConfig.loc + '"');
    }
    // It's possible to turn off babelrc support via babelrc itself.
    // In that case, we should add our default preset.
    // That's why we need to do this.
    var options = externalBabelConfig.options;

    mainBabelOptions.babelrc = options.babelrc !== false;
  } else {
    mainBabelOptions.babelrc = false;
  }

  // Add our default preset if the no "babelrc" found.
  if (!mainBabelOptions.babelrc) {
    mainBabelOptions.presets.push(require.resolve('./babel/preset'));
  }

  return mainBabelOptions;
}

function externalsConfig(dir, isServer) {
  var externals = [];

  if (!isServer) {
    return externals;
  }

  externals.push(function (context, request, callback) {
    (0, _resolve2.default)(request, { basedir: dir, preserveSymlinks: true }, function (err, res) {
      if (err) {
        return callback();
      }

      // Webpack itself has to be compiled because it doesn't always use module relative paths
      if (res.match(/node_modules[/\\].*\.js/) && !res.match(/node_modules[/\\]webpack/)) {
        return callback(null, 'commonjs ' + request);
      }

      callback();
    });
  });

  return externals;
}

exports.default = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(dir, _ref2) {
    var _this = this;

    var _ref2$dev = _ref2.dev,
        dev = _ref2$dev === undefined ? false : _ref2$dev,
        _ref2$isServer = _ref2.isServer,
        isServer = _ref2$isServer === undefined ? false : _ref2$isServer,
        buildId = _ref2.buildId,
        config = _ref2.config;
    var babelLoaderOptions, defaultLoaders, nodePathList, totalPages, webpackConfig;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            babelLoaderOptions = babelConfig(dir, { dev: dev, isServer: isServer });
            defaultLoaders = {
              babel: {
                loader: 'babel-loader',
                options: babelLoaderOptions
              }

              // Support for NODE_PATH
            };
            nodePathList = (process.env.NODE_PATH || '').split(process.platform === 'win32' ? ';' : ':').filter(function (p) {
              return !!p;
            });
            totalPages = void 0;
            webpackConfig = {
              devtool: dev ? 'source-map' : false,
              name: isServer ? 'server' : 'client',
              cache: true,
              target: isServer ? 'node' : 'web',
              externals: externalsConfig(dir, isServer),
              context: dir,
              entry: function () {
                var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                  var pages, mainJS, clientConfig;
                  return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.next = 2;
                          return (0, _utils.getPages)(dir, { dev: dev, isServer: isServer });

                        case 2:
                          pages = _context.sent;

                          totalPages = (0, _keys2.default)(pages).length;
                          mainJS = require.resolve('../../client/next' + (dev ? '-dev' : ''));
                          clientConfig = !isServer ? {
                            'main.js': [dev && !isServer && _path2.default.join(__dirname, '..', '..', 'client', 'webpack-hot-middleware-client'), dev && !isServer && _path2.default.join(__dirname, '..', '..', 'client', 'on-demand-entries-client'), mainJS].filter(Boolean)
                          } : {};
                          return _context.abrupt('return', (0, _extends3.default)({}, clientConfig, pages));

                        case 7:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, _this);
                }));

                function entry() {
                  return _ref4.apply(this, arguments);
                }

                return entry;
              }(),
              output: {
                path: _path2.default.join(dir, config.distDir, isServer ? 'dist' : ''), // server compilation goes to `.next/dist`
                filename: '[name]',
                libraryTarget: 'commonjs2',
                // This saves chunks with the name given via require.ensure()
                chunkFilename: '[name]-[chunkhash].js',
                strictModuleExceptionHandling: true,
                devtoolModuleFilenameTemplate: '[absolute-resource-path]'
              },
              performance: { hints: false },
              resolve: {
                extensions: ['.js', '.jsx', '.json'],
                modules: [nextNodeModulesDir, 'node_modules'].concat((0, _toConsumableArray3.default)(nodePathList)),
                alias: {
                  next: nextDir,
                  // This bypasses React's check for production mode. Since we know it is in production this way.
                  // This allows us to exclude React from being uglified. Saving multiple seconds per build.
                  react: dev ? 'react/cjs/react.development.js' : 'react/cjs/react.production.min.js',
                  'react-dom': dev ? 'react-dom/cjs/react-dom.development.js' : 'react-dom/cjs/react-dom.production.min.js'
                }
              },
              resolveLoader: {
                modules: [nextNodeModulesDir, 'node_modules', _path2.default.join(__dirname, 'loaders')].concat((0, _toConsumableArray3.default)(nodePathList))
              },
              module: {
                rules: [dev && !isServer && {
                  test: /\.(js|jsx)(\?[^?]*)?$/,
                  loader: 'hot-self-accept-loader',
                  include: [_path2.default.join(dir, 'pages'), nextPagesDir]
                }, {
                  test: /\.+(js|jsx)$/,
                  include: [dir],
                  exclude: /node_modules/,
                  use: defaultLoaders.babel
                }].filter(Boolean)
              },
              plugins: [new _webpack2.default.IgnorePlugin(/(precomputed)/, /node_modules.+(elliptic)/), dev && new _webpack2.default.NoEmitOnErrorsPlugin(), dev && !isServer && new _friendlyErrorsWebpackPlugin2.default(), dev && new _webpack2.default.NamedModulesPlugin(), dev && !isServer && new _webpack2.default.HotModuleReplacementPlugin(), // Hot module replacement
              dev && new _unlinkFilePlugin2.default(), dev && new _caseSensitivePathsWebpackPlugin2.default(), // Since on macOS the filesystem is case-insensitive this will make sure your path are case-sensitive
              dev && new _webpack2.default.LoaderOptionsPlugin({
                options: {
                  context: dir,
                  customInterpolateName: function customInterpolateName(url, name, opts) {
                    return interpolateNames.get(this.resourcePath) || url;
                  }
                }
              }), dev && new _writeFileWebpackPlugin2.default({
                exitOnErrors: false,
                log: false,
                // required not to cache removed files
                useHashIndex: false
              }), !dev && new _webpack2.default.IgnorePlugin(/react-hot-loader/), !isServer && !dev && new _uglifyjsWebpackPlugin2.default({
                exclude: /react\.js/,
                parallel: true,
                sourceMap: false,
                uglifyOptions: {
                  compress: {
                    arrows: false,
                    booleans: false,
                    collapse_vars: false,
                    comparisons: false,
                    computed_props: false,
                    hoist_funs: false,
                    hoist_props: false,
                    hoist_vars: false,
                    if_return: false,
                    inline: false,
                    join_vars: false,
                    keep_infinity: true,
                    loops: false,
                    negate_iife: false,
                    properties: false,
                    reduce_funcs: false,
                    reduce_vars: false,
                    sequences: false,
                    side_effects: false,
                    switches: false,
                    top_retain: false,
                    toplevel: false,
                    typeofs: false,
                    unused: false,
                    conditionals: false,
                    dead_code: true,
                    evaluate: false
                  }
                }
              }), new _webpack2.default.DefinePlugin({
                'process.env.NODE_ENV': (0, _stringify2.default)(dev ? 'development' : 'production')
              }), !isServer && new _combineAssetsPlugin2.default({
                input: ['manifest.js', 'react.js', 'commons.js', 'main.js'],
                output: 'app.js'
              }), !dev && new _webpack2.default.optimize.ModuleConcatenationPlugin(), !isServer && new _pagesPlugin2.default(), !isServer && new _dynamicChunksPlugin2.default(), isServer && new _nextjsSsrImport2.default({ dir: dir, dist: config.distDir }), !isServer && new _webpack2.default.optimize.CommonsChunkPlugin({
                name: 'commons',
                filename: 'commons.js',
                minChunks: function minChunks(module, count) {
                  // We need to move react-dom explicitly into common chunks.
                  // Otherwise, if some other page or module uses it, it might
                  // included in that bundle too.
                  if (dev && module.context && module.context.indexOf(_path.sep + 'react' + _path.sep) >= 0) {
                    return true;
                  }

                  if (dev && module.context && module.context.indexOf(_path.sep + 'react-dom' + _path.sep) >= 0) {
                    return true;
                  }

                  // In the dev we use on-demand-entries.
                  // So, it makes no sense to use commonChunks based on the minChunks count.
                  // Instead, we move all the code in node_modules into each of the pages.
                  if (dev) {
                    return false;
                  }

                  // If there are one or two pages, only move modules to common if they are
                  // used in all of the pages. Otherwise, move modules used in at-least
                  // 1/2 of the total pages into commons.
                  if (totalPages <= 2) {
                    return count >= totalPages;
                  }
                  return count >= totalPages * 0.5;
                }
              }), !isServer && new _webpack2.default.optimize.CommonsChunkPlugin({
                name: 'react',
                filename: 'react.js',
                minChunks: function minChunks(module, count) {
                  if (dev) {
                    return false;
                  }

                  if (module.resource && module.resource.includes(_path.sep + 'react-dom' + _path.sep) && count >= 0) {
                    return true;
                  }

                  if (module.resource && module.resource.includes(_path.sep + 'react' + _path.sep) && count >= 0) {
                    return true;
                  }

                  return false;
                }
              }), !isServer && new _webpack2.default.optimize.CommonsChunkPlugin({
                name: 'manifest',
                filename: 'manifest.js'
              })].filter(Boolean)
            };


            if (typeof config.webpack === 'function') {
              webpackConfig = config.webpack(webpackConfig, { dir: dir, dev: dev, isServer: isServer, buildId: buildId, config: config, defaultLoaders: defaultLoaders });
            }

            return _context2.abrupt('return', webpackConfig);

          case 7:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  function getBaseWebpackConfig(_x, _x2) {
    return _ref3.apply(this, arguments);
  }

  return getBaseWebpackConfig;
}();