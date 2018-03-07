'use strict';

exports.__esModule = true;
exports.setConfig = exports.areComponentsEqual = undefined;

var _proxies = require('./reconciler/proxies');

var _reactHotLoader = require('./reactHotLoader');

var _reactHotLoader2 = _interopRequireDefault(_reactHotLoader);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _reactStandIn = require('react-stand-in');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _reactStandIn.setConfig)({ logger: _logger2.default });

var areComponentsEqual = exports.areComponentsEqual = function areComponentsEqual(a, b) {
  return (0, _proxies.getProxyByType)(a) === (0, _proxies.getProxyByType)(b);
};

var setConfig = exports.setConfig = function setConfig(config) {
  return Object.assign(_reactHotLoader2.default.config, config);
};