"use strict";
"use client";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Blog = _interopRequireDefault(require("@/models/Blog"));

var _Auth = _interopRequireDefault(require("@/models/Auth"));

var _config = require("@/lib/firebase/config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var BlogController =
/*#__PURE__*/
function () {
  function BlogController() {
    _classCallCheck(this, BlogController);
  }

  _createClass(BlogController, null, [{
    key: "createBlog",
    value: function createBlog(blogData) {
      var user, result;
      return regeneratorRuntime.async(function createBlog$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return regeneratorRuntime.awrap(_Auth["default"].getCurrentUser());

            case 3:
              user = _context.sent;

              if (user) {
                _context.next = 6;
                break;
              }

              return _context.abrupt("return", {
                ok: false,
                error: "Usuario no autenticado"
              });

            case 6:
              _context.next = 8;
              return regeneratorRuntime.awrap(_Blog["default"].createBlog(_objectSpread({}, blogData, {
                authorId: user.uid,
                author: user.displayName || user.email
              })));

            case 8:
              result = _context.sent;
              return _context.abrupt("return", {
                ok: true,
                id: result.id
              });

            case 12:
              _context.prev = 12;
              _context.t0 = _context["catch"](0);
              console.error("Error creating blog:", _context.t0);
              return _context.abrupt("return", {
                ok: false,
                error: _context.t0.message
              });

            case 16:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[0, 12]]);
    }
  }, {
    key: "getBlogs",
    value: function getBlogs(setBlogs) {
      return regeneratorRuntime.async(function getBlogs$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return regeneratorRuntime.awrap(_Blog["default"].getBlogs(setBlogs));

            case 3:
              return _context2.abrupt("return", {
                ok: true
              });

            case 6:
              _context2.prev = 6;
              _context2.t0 = _context2["catch"](0);
              console.error("Error getting blogs:", _context2.t0);
              return _context2.abrupt("return", {
                ok: false,
                error: _context2.t0.message
              });

            case 10:
            case "end":
              return _context2.stop();
          }
        }
      }, null, null, [[0, 6]]);
    }
  }, {
    key: "isUserAuthenticated",
    value: function isUserAuthenticated() {
      return _config.auth.currentUser !== null;
    }
  }]);

  return BlogController;
}();

var _default = BlogController;
exports["default"] = _default;