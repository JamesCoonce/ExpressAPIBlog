webpackHotUpdate(4,{

/***/ "./components/DashboardLayout.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = '/Users/jamescoonce/WebstormProjects/ExpressAPIBlog/components/DashboardLayout.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("./node_modules/react/cjs/react.development.js");

var _react2 = _interopRequireDefault(_react);

var _antd = __webpack_require__("./node_modules/antd/es/index.js");

__webpack_require__("./node_modules/antd/dist/antd.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = __webpack_require__("./node_modules/react-hot-loader/patch.js").enterModule;

  enterModule && enterModule(module);
})();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Header = _antd.Layout.Header,
    Sider = _antd.Layout.Sider,
    Content = _antd.Layout.Content;

var DashboardLayout = function (_React$Component) {
  _inherits(DashboardLayout, _React$Component);

  function DashboardLayout() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, DashboardLayout);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = DashboardLayout.__proto__ || Object.getPrototypeOf(DashboardLayout)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      collapsed: false
    }, _this.toggle = function () {
      _this.setState({
        collapsed: !_this.state.collapsed
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(DashboardLayout, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        _antd.Layout,
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 16
          }
        },
        _react2.default.createElement(
          Sider,
          {
            trigger: null,
            collapsible: true,
            collapsed: this.state.collapsed,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 17
            }
          },
          _react2.default.createElement('div', { className: 'logo', __source: {
              fileName: _jsxFileName,
              lineNumber: 22
            }
          }),
          _react2.default.createElement(
            _antd.Menu,
            { theme: 'dark', mode: 'inline', defaultSelectedKeys: ['1'], __source: {
                fileName: _jsxFileName,
                lineNumber: 23
              }
            },
            _react2.default.createElement(
              _antd.Menu.Item,
              { key: '1', __source: {
                  fileName: _jsxFileName,
                  lineNumber: 24
                }
              },
              _react2.default.createElement(_antd.Icon, { type: 'user', __source: {
                  fileName: _jsxFileName,
                  lineNumber: 25
                }
              }),
              _react2.default.createElement(
                'span',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 26
                  }
                },
                'nav 1'
              )
            ),
            _react2.default.createElement(
              _antd.Menu.Item,
              { key: '2', __source: {
                  fileName: _jsxFileName,
                  lineNumber: 28
                }
              },
              _react2.default.createElement(_antd.Icon, { type: 'video-camera', __source: {
                  fileName: _jsxFileName,
                  lineNumber: 29
                }
              }),
              _react2.default.createElement(
                'span',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 30
                  }
                },
                'nav 2'
              )
            ),
            _react2.default.createElement(
              _antd.Menu.Item,
              { key: '3', __source: {
                  fileName: _jsxFileName,
                  lineNumber: 32
                }
              },
              _react2.default.createElement(_antd.Icon, { type: 'upload', __source: {
                  fileName: _jsxFileName,
                  lineNumber: 33
                }
              }),
              _react2.default.createElement(
                'span',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 34
                  }
                },
                'nav 3'
              )
            )
          )
        ),
        _react2.default.createElement(
          _antd.Layout,
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 38
            }
          },
          _react2.default.createElement(
            Header,
            { style: { background: '#fff', padding: 0 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 39
              }
            },
            _react2.default.createElement(_antd.Icon, {
              className: 'trigger',
              type: this.state.collapsed ? 'menu-unfold' : 'menu-fold',
              onClick: this.toggle,
              __source: {
                fileName: _jsxFileName,
                lineNumber: 40
              }
            })
          ),
          _react2.default.createElement(
            Content,
            { style: { margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 46
              }
            },
            this.props.children
          )
        )
      );
    }
  }, {
    key: '__reactstandin__regenerateByEval',
    value: function __reactstandin__regenerateByEval(key, code) {
      this[key] = eval(code);
    }
  }]);

  return DashboardLayout;
}(_react2.default.Component);

var _default = DashboardLayout;
exports.default = _default;
;

(function () {
  var reactHotLoader = __webpack_require__("./node_modules/react-hot-loader/patch.js").default;

  var leaveModule = __webpack_require__("./node_modules/react-hot-loader/patch.js").leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(Header, 'Header', '/Users/jamescoonce/WebstormProjects/ExpressAPIBlog/components/DashboardLayout.js');
  reactHotLoader.register(Sider, 'Sider', '/Users/jamescoonce/WebstormProjects/ExpressAPIBlog/components/DashboardLayout.js');
  reactHotLoader.register(Content, 'Content', '/Users/jamescoonce/WebstormProjects/ExpressAPIBlog/components/DashboardLayout.js');
  reactHotLoader.register(DashboardLayout, 'DashboardLayout', '/Users/jamescoonce/WebstormProjects/ExpressAPIBlog/components/DashboardLayout.js');
  reactHotLoader.register(_default, 'default', '/Users/jamescoonce/WebstormProjects/ExpressAPIBlog/components/DashboardLayout.js');
  leaveModule(module);
})();

;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./node_modules/antd/dist/antd.css":
/***/ (function(module, exports) {

throw new Error("Module parse failed: Unexpected character '@' (14:0)\nYou may need an appropriate loader to handle this file type.\n| /* stylelint-disable declaration-bang-space-before,no-duplicate-selectors */\n| /* stylelint-disable at-rule-no-unknown */\n| @font-face {\n|   font-family: \"Monospaced Number\";\n|   src: local(\"Tahoma\");");

/***/ })

})
//# sourceMappingURL=4.8312f97a8adafe338cbb.hot-update.js.map