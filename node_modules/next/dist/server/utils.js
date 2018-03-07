'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MATCH_ROUTE_NAME = exports.IS_BUNDLED_PAGE = undefined;

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

exports.getAvailableChunks = getAvailableChunks;
exports.isInternalUrl = isInternalUrl;
exports.addCorsSupport = addCorsSupport;

var _path = require('path');

var _fs = require('fs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var IS_BUNDLED_PAGE = exports.IS_BUNDLED_PAGE = /^bundles[/\\]pages.*\.js$/;
var MATCH_ROUTE_NAME = exports.MATCH_ROUTE_NAME = /^bundles[/\\]pages[/\\](.*)\.js$/;

function getAvailableChunks(dir, dist) {
  var chunksDir = (0, _path.join)(dir, dist, 'chunks');
  if (!(0, _fs.existsSync)(chunksDir)) return {};

  var chunksMap = {};
  var chunkFiles = (0, _fs.readdirSync)(chunksDir);

  chunkFiles.forEach(function (filename) {
    if (/\.js$/.test(filename)) {
      var chunkName = filename.replace(/-.*/, '');
      chunksMap[chunkName] = filename;
    }
  });

  return chunksMap;
}

var internalPrefixes = [/^\/_next\//, /^\/static\//];

function isInternalUrl(url) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (0, _getIterator3.default)(internalPrefixes), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var prefix = _step.value;

      if (prefix.test(url)) {
        return true;
      }
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

  return false;
}

function addCorsSupport(req, res) {
  if (!req.headers.origin) {
    return { preflight: false };
  }

  res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Request-Method', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', req.headers.origin);

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return { preflight: true };
  }

  return { preflight: false };
}