'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _symbol = require('babel-runtime/core-js/symbol');

var _symbol2 = _interopRequireDefault(_symbol);

exports.default = onDemandEntryHandler;

var _DynamicEntryPlugin = require('webpack/lib/DynamicEntryPlugin');

var _DynamicEntryPlugin2 = _interopRequireDefault(_DynamicEntryPlugin);

var _events = require('events');

var _path = require('path');

var _url = require('url');

var _touch = require('touch');

var _touch2 = _interopRequireDefault(_touch);

var _resolve = require('./resolve');

var _resolve2 = _interopRequireDefault(_resolve);

var _utils = require('./build/webpack/utils');

var _utils2 = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ADDED = (0, _symbol2.default)('added');
var BUILDING = (0, _symbol2.default)('building');
var BUILT = (0, _symbol2.default)('built');

function onDemandEntryHandler(devMiddleware, compilers, _ref) {
  var dir = _ref.dir,
      dev = _ref.dev,
      reload = _ref.reload,
      _ref$maxInactiveAge = _ref.maxInactiveAge,
      maxInactiveAge = _ref$maxInactiveAge === undefined ? 1000 * 60 : _ref$maxInactiveAge,
      _ref$pagesBufferLengt = _ref.pagesBufferLength,
      pagesBufferLength = _ref$pagesBufferLengt === undefined ? 2 : _ref$pagesBufferLengt;

  var entries = {};
  var lastAccessPages = [''];
  var doneCallbacks = new _events.EventEmitter();
  var invalidator = new Invalidator(devMiddleware);
  var touchedAPage = false;
  var reloading = false;
  var stopped = false;
  var reloadCallbacks = new _events.EventEmitter();
  // Keep the names of compilers which are building pages at a given moment.
  var currentBuilders = new _set2.default();

  compilers.forEach(function (compiler) {
    compiler.plugin('make', function (compilation, done) {
      var _this = this;

      invalidator.startBuilding();
      currentBuilders.add(compiler.name);

      var allEntries = (0, _keys2.default)(entries).map(function (page) {
        var _entries$page = entries[page],
            name = _entries$page.name,
            entry = _entries$page.entry;

        entries[page].status = BUILDING;
        return addEntry(compilation, _this.context, name, entry);
      });

      _promise2.default.all(allEntries).then(function () {
        return done();
      }).catch(done);
    });

    compiler.plugin('done', function (stats) {
      // Wait until all the compilers mark the build as done.
      currentBuilders.delete(compiler.name);
      if (currentBuilders.size !== 0) return;

      var compilation = stats.compilation;

      var hardFailedPages = compilation.errors.filter(function (e) {
        // Make sure to only pick errors which marked with missing modules
        var hasNoModuleFoundError = /ENOENT/.test(e.message) || /Module not found/.test(e.message);
        if (!hasNoModuleFoundError) return false;

        // The page itself is missing. So this is a failed page.
        if (_utils2.IS_BUNDLED_PAGE.test(e.module.name)) return true;

        // No dependencies means this is a top level page.
        // So this is a failed page.
        return e.module.dependencies.length === 0;
      }).map(function (e) {
        return e.module.chunks;
      }).reduce(function (a, b) {
        return [].concat((0, _toConsumableArray3.default)(a), (0, _toConsumableArray3.default)(b));
      }, []).map(function (c) {
        var pageName = _utils2.MATCH_ROUTE_NAME.exec(c.name)[1];
        return normalizePage('/' + pageName);
      });

      // Call all the doneCallbacks
      (0, _keys2.default)(entries).forEach(function (page) {
        var entryInfo = entries[page];
        if (entryInfo.status !== BUILDING) return;

        // With this, we are triggering a filesystem based watch trigger
        // It'll memorize some timestamp related info related to common files used
        // in the page
        // That'll reduce the page building time significantly.
        if (!touchedAPage) {
          setTimeout(function () {
            _touch2.default.sync(entryInfo.pathname);
          }, 1000);
          touchedAPage = true;
        }

        entryInfo.status = BUILT;
        entries[page].lastActiveTime = Date.now();
        doneCallbacks.emit(page);
      });

      invalidator.doneBuilding(compiler.name);

      if (hardFailedPages.length > 0 && !reloading) {
        console.log('> Reloading webpack due to inconsistant state of pages(s): ' + hardFailedPages.join(', '));
        reloading = true;
        reload().then(function () {
          console.log('> Webpack reloaded.');
          reloadCallbacks.emit('done');
          stop();
        }).catch(function (err) {
          console.error('> Webpack reloading failed: ' + err.message);
          console.error(err.stack);
          process.exit(1);
        });
      }
    });
  });

  var disposeHandler = setInterval(function () {
    if (stopped) return;
    disposeInactiveEntries(devMiddleware, entries, lastAccessPages, maxInactiveAge);
  }, 5000);

  disposeHandler.unref();

  function stop() {
    clearInterval(disposeHandler);
    stopped = true;
    doneCallbacks = null;
    reloadCallbacks = null;
  }

  return {
    waitUntilReloaded: function waitUntilReloaded() {
      if (!reloading) return _promise2.default.resolve(true);
      return new _promise2.default(function (resolve) {
        reloadCallbacks.once('done', function () {
          resolve();
        });
      });
    },
    ensurePage: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(page) {
        var pagePath, pathname, _createEntry, name, files;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.waitUntilReloaded();

              case 2:
                page = normalizePage(page);

                pagePath = (0, _path.join)(dir, 'pages', page);
                _context.next = 6;
                return (0, _resolve2.default)(pagePath);

              case 6:
                pathname = _context.sent;
                _createEntry = (0, _utils.createEntry)((0, _path.relative)(dir, pathname)), name = _createEntry.name, files = _createEntry.files;
                _context.next = 10;
                return new _promise2.default(function (resolve, reject) {
                  var entryInfo = entries[page];

                  if (entryInfo) {
                    if (entryInfo.status === BUILT) {
                      resolve();
                      return;
                    }

                    if (entryInfo.status === BUILDING) {
                      doneCallbacks.once(page, handleCallback);
                      return;
                    }
                  }

                  console.log('> Building page: ' + page);

                  entries[page] = { name: name, entry: files, pathname: pathname, status: ADDED };
                  doneCallbacks.once(page, handleCallback);

                  invalidator.invalidate();

                  function handleCallback(err) {
                    if (err) return reject(err);
                    resolve();
                  }
                });

              case 10:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function ensurePage(_x) {
        return _ref2.apply(this, arguments);
      }

      return ensurePage;
    }(),
    middleware: function middleware() {
      var _this2 = this;

      return function (req, res, next) {
        if (stopped) {
          // If this handler is stopped, we need to reload the user's browser.
          // So the user could connect to the actually running handler.
          res.statusCode = 302;
          res.setHeader('Location', req.url);
          res.end('302');
        } else if (reloading) {
          // Webpack config is reloading. So, we need to wait until it's done and
          // reload user's browser.
          // So the user could connect to the new handler and webpack setup.
          _this2.waitUntilReloaded().then(function () {
            res.statusCode = 302;
            res.setHeader('Location', req.url);
            res.end('302');
          });
        } else {
          if (!/^\/_next\/on-demand-entries-ping/.test(req.url)) return next();

          var _parse = (0, _url.parse)(req.url, true),
              query = _parse.query;

          var page = normalizePage(query.page);
          var entryInfo = entries[page];

          // If there's no entry.
          // Then it seems like an weird issue.
          if (!entryInfo) {
            var message = 'Client pings, but there\'s no entry for page: ' + page;
            console.error(message);
            sendJson(res, { invalid: true });
            return;
          }

          sendJson(res, { success: true });

          // We don't need to maintain active state of anything other than BUILT entries
          if (entryInfo.status !== BUILT) return;

          // If there's an entryInfo
          if (!lastAccessPages.includes(page)) {
            lastAccessPages.unshift(page);

            // Maintain the buffer max length
            if (lastAccessPages.length > pagesBufferLength) lastAccessPages.pop();
          }
          entryInfo.lastActiveTime = Date.now();
        }
      };
    }
  };
}

// Based on https://github.com/webpack/webpack/blob/master/lib/DynamicEntryPlugin.js#L29-L37
function addEntry(compilation, context, name, entry) {
  return new _promise2.default(function (resolve, reject) {
    var dep = _DynamicEntryPlugin2.default.createDependency(entry, name);
    compilation.addEntry(context, dep, name, function (err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

function disposeInactiveEntries(devMiddleware, entries, lastAccessPages, maxInactiveAge) {
  var disposingPages = [];

  (0, _keys2.default)(entries).forEach(function (page) {
    var _entries$page2 = entries[page],
        lastActiveTime = _entries$page2.lastActiveTime,
        status = _entries$page2.status;

    // This means this entry is currently building or just added
    // We don't need to dispose those entries.

    if (status !== BUILT) return;

    // We should not build the last accessed page even we didn't get any pings
    // Sometimes, it's possible our XHR ping to wait before completing other requests.
    // In that case, we should not dispose the current viewing page
    if (lastAccessPages.includes(page)) return;

    if (Date.now() - lastActiveTime > maxInactiveAge) {
      disposingPages.push(page);
    }
  });

  if (disposingPages.length > 0) {
    disposingPages.forEach(function (page) {
      delete entries[page];
    });
    console.log('> Disposing inactive page(s): ' + disposingPages.join(', '));
    devMiddleware.invalidate();
  }
}

// /index and / is the same. So, we need to identify both pages as the same.
// This also applies to sub pages as well.
function normalizePage(page) {
  return page.replace(/\/index$/, '/');
}

function sendJson(res, payload) {
  res.setHeader('Content-Type', 'application/json');
  res.status = 200;
  res.end((0, _stringify2.default)(payload));
}

// Make sure only one invalidation happens at a time
// Otherwise, webpack hash gets changed and it'll force the client to reload.

var Invalidator = function () {
  function Invalidator(devMiddleware) {
    (0, _classCallCheck3.default)(this, Invalidator);

    this.devMiddleware = devMiddleware;
    // contains an array of types of compilers currently building
    this.building = false;
    this.rebuildAgain = false;
  }

  (0, _createClass3.default)(Invalidator, [{
    key: 'invalidate',
    value: function invalidate() {
      // If there's a current build is processing, we won't abort it by invalidating.
      // (If aborted, it'll cause a client side hard reload)
      // But let it to invalidate just after the completion.
      // So, it can re-build the queued pages at once.
      if (this.building) {
        this.rebuildAgain = true;
        return;
      }

      this.building = true;
      this.devMiddleware.invalidate();
    }
  }, {
    key: 'startBuilding',
    value: function startBuilding() {
      this.building = true;
    }
  }, {
    key: 'doneBuilding',
    value: function doneBuilding() {
      this.building = false;

      if (this.rebuildAgain) {
        this.rebuildAgain = false;
        this.invalidate();
      }
    }
  }]);
  return Invalidator;
}();