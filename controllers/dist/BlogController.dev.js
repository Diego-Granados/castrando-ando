"use strict";
"use client";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Blog = _interopRequireDefault(require("@/models/Blog"));

var _Comment = _interopRequireDefault(require("@/models/Comment"));

var _AuthController = _interopRequireDefault(require("@/controllers/AuthController"));

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
      var _ref, user, role, enrichedBlogData, result;

      return regeneratorRuntime.async(function createBlog$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return regeneratorRuntime.awrap(_AuthController["default"].getCurrentUser());

            case 3:
              _ref = _context.sent;
              user = _ref.user;
              role = _ref.role;

              if (!(!user || role !== "Admin")) {
                _context.next = 8;
                break;
              }

              return _context.abrupt("return", {
                ok: false,
                error: "No tienes permisos para crear blogs"
              });

            case 8:
              enrichedBlogData = _objectSpread({}, blogData, {
                author: "Admin",
                authorId: user.uid,
                createdAt: new Date().toISOString()
              });
              _context.next = 11;
              return regeneratorRuntime.awrap(_Blog["default"].create(enrichedBlogData));

            case 11:
              result = _context.sent;
              return _context.abrupt("return", {
                ok: true,
                id: result.id
              });

            case 15:
              _context.prev = 15;
              _context.t0 = _context["catch"](0);
              console.error("Error creating blog:", _context.t0);
              return _context.abrupt("return", {
                ok: false,
                error: "Error al crear el blog"
              });

            case 19:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[0, 15]]);
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
              return regeneratorRuntime.awrap(_Blog["default"].getAll(setBlogs));

            case 3:
              _context2.next = 9;
              break;

            case 5:
              _context2.prev = 5;
              _context2.t0 = _context2["catch"](0);
              console.error("Error getting blogs:", _context2.t0);
              throw _context2.t0;

            case 9:
            case "end":
              return _context2.stop();
          }
        }
      }, null, null, [[0, 5]]);
    }
  }, {
    key: "deleteBlog",
    value: function deleteBlog(blogId) {
      var _ref2, user, role;

      return regeneratorRuntime.async(function deleteBlog$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _context3.next = 3;
              return regeneratorRuntime.awrap(_AuthController["default"].getCurrentUser());

            case 3:
              _ref2 = _context3.sent;
              user = _ref2.user;
              role = _ref2.role;

              if (!(!user || role !== "Admin")) {
                _context3.next = 8;
                break;
              }

              return _context3.abrupt("return", {
                ok: false,
                error: "No tienes permisos para eliminar blogs"
              });

            case 8:
              _context3.next = 10;
              return regeneratorRuntime.awrap(_Comment["default"].deleteAllFromEntity('blog', blogId));

            case 10:
              _context3.next = 12;
              return regeneratorRuntime.awrap(_Blog["default"]["delete"](blogId));

            case 12:
              return _context3.abrupt("return", {
                ok: true
              });

            case 15:
              _context3.prev = 15;
              _context3.t0 = _context3["catch"](0);
              console.error("Error deleting blog:", _context3.t0);
              return _context3.abrupt("return", {
                ok: false,
                error: "Error al eliminar el blog"
              });

            case 19:
            case "end":
              return _context3.stop();
          }
        }
      }, null, null, [[0, 15]]);
    }
  }, {
    key: "isUserAuthenticated",
    value: function isUserAuthenticated() {
      return regeneratorRuntime.async(function isUserAuthenticated$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              return _context4.abrupt("return", _AuthController["default"].isUserAuthenticated());

            case 1:
            case "end":
              return _context4.stop();
          }
        }
      });
    }
  }, {
    key: "isUserAdmin",
    value: function isUserAdmin() {
      var _ref3, role;

      return regeneratorRuntime.async(function isUserAdmin$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              _context5.next = 3;
              return regeneratorRuntime.awrap(_AuthController["default"].getCurrentUser());

            case 3:
              _ref3 = _context5.sent;
              role = _ref3.role;
              return _context5.abrupt("return", role === "Admin");

            case 8:
              _context5.prev = 8;
              _context5.t0 = _context5["catch"](0);
              console.error("Error checking admin status:", _context5.t0);
              return _context5.abrupt("return", false);

            case 12:
            case "end":
              return _context5.stop();
          }
        }
      }, null, null, [[0, 8]]);
    }
  }]);

  return BlogController;
}();

var _default = BlogController;
exports["default"] = _default;