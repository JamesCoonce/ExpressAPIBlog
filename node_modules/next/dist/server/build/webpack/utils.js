'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPages = undefined;

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var getPages = exports.getPages = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(dir, _ref) {
    var dev = _ref.dev,
        isServer = _ref.isServer;
    var pageFiles;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return getPagePaths(dir, { dev: dev, isServer: isServer });

          case 2:
            pageFiles = _context.sent;
            return _context.abrupt('return', getPageEntries(pageFiles, { isServer: isServer }));

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function getPages(_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();

var getPagePaths = function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(dir, _ref3) {
    var dev = _ref3.dev,
        isServer = _ref3.isServer;
    var pages;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            pages = void 0;

            if (!dev) {
              _context2.next = 7;
              break;
            }

            _context2.next = 4;
            return (0, _globPromise2.default)(isServer ? 'pages/+(_document|_error).+(js|jsx|ts|tsx)' : 'pages/_error.+(js|jsx|ts|tsx)', { cwd: dir });

          case 4:
            pages = _context2.sent;
            _context2.next = 10;
            break;

          case 7:
            _context2.next = 9;
            return (0, _globPromise2.default)(isServer ? 'pages/**/*.+(js|jsx|ts|tsx)' : 'pages/**/!(_document)*.+(js|jsx|ts|tsx)', { cwd: dir });

          case 9:
            pages = _context2.sent;

          case 10:
            return _context2.abrupt('return', pages);

          case 11:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function getPagePaths(_x3, _x4) {
    return _ref4.apply(this, arguments);
  };
}();

// Convert page path into single entry


exports.createEntry = createEntry;
exports.getPageEntries = getPageEntries;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _globPromise = require('glob-promise');

var _globPromise2 = _interopRequireDefault(_globPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nextPagesDir = _path2.default.join(__dirname, '..', '..', '..', 'pages');

function createEntry(filePath, name) {
  var parsedPath = _path2.default.parse(filePath);
  var entryName = name || filePath;

  // This makes sure we compile `pages/blog/index.js` to `pages/blog.js`.
  // Excludes `pages/index.js` from this rule since we do want `/` to route to `pages/index.js`
  if (parsedPath.dir !== 'pages' && parsedPath.name === 'index') {
    entryName = parsedPath.dir + '.js';
  }

  // Makes sure supported extensions are stripped off. The outputted file should always be `.js`
  entryName = entryName.replace(/\.+(jsx|tsx|ts)/, '.js');

  return {
    name: _path2.default.join('bundles', entryName),
    files: [parsedPath.root ? filePath : './' + filePath] // The entry always has to be an array.
  };
}

// Convert page paths into entries
function getPageEntries(pagePaths, _ref5) {
  var isServer = _ref5.isServer;

  var entries = {};

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (0, _getIterator3.default)(pagePaths), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var filePath = _step.value;

      var entry = createEntry(filePath);
      entries[entry.name] = entry.files;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var errorPagePath = _path2.default.join(nextPagesDir, '_error.js');
  var errorPageEntry = createEntry(errorPagePath, 'pages/_error.js'); // default error.js
  if (!entries[errorPageEntry.name]) {
    entries[errorPageEntry.name] = errorPageEntry.files;
  }

  if (isServer) {
    var documentPagePath = _path2.default.join(nextPagesDir, '_document.js');
    var documentPageEntry = createEntry(documentPagePath, 'pages/_document.js');
    if (!entries[documentPageEntry.name]) {
      entries[documentPageEntry.name] = documentPageEntry.files;
    }
  }

  return entries;
}