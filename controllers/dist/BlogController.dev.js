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
      var user, isAdmin, result;
      return regeneratorRuntime.async(function createBlog$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              user = _config.auth.currentUser;

              if (user) {
                _context.next = 4;
                break;
              }

              return _context.abrupt("return", {
                ok: false,
                error: "Usuario no autenticado"
              });

            case 4:
              _context.next = 6;
              return regeneratorRuntime.awrap(this.isUserAdmin());

            case 6:
              isAdmin = _context.sent;

              if (isAdmin) {
                _context.next = 9;
                break;
              }

              return _context.abrupt("return", {
                ok: false,
                error: "No tienes permisos para crear blogs"
              });

            case 9:
              _context.next = 11;
              return regeneratorRuntime.awrap(_Blog["default"].create(blogData));

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
                error: _context.t0.message
              });

            case 19:
            case "end":
              return _context.stop();
          }
        }
      }, null, this, [[0, 15]]);
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
      var user, isAdmin;
      return regeneratorRuntime.async(function deleteBlog$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              user = _config.auth.currentUser;

              if (user) {
                _context3.next = 4;
                break;
              }

              return _context3.abrupt("return", {
                ok: false,
                error: "Usuario no autenticado"
              });

            case 4:
              _context3.next = 6;
              return regeneratorRuntime.awrap(this.isUserAdmin());

            case 6:
              isAdmin = _context3.sent;

              if (isAdmin) {
                _context3.next = 9;
                break;
              }

              return _context3.abrupt("return", {
                ok: false,
                error: "No tienes permisos para eliminar blogs"
              });

            case 9:
              _context3.next = 11;
              return regeneratorRuntime.awrap(_Blog["default"]["delete"](blogId));

            case 11:
              return _context3.abrupt("return", {
                ok: true
              });

            case 14:
              _context3.prev = 14;
              _context3.t0 = _context3["catch"](0);
              console.error("Error deleting blog:", _context3.t0);
              return _context3.abrupt("return", {
                ok: false,
                error: _context3.t0.message
              });

            case 18:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this, [[0, 14]]);
    }
  }, {
    key: "isUserAuthenticated",
    value: function isUserAuthenticated() {
      return _config.auth.currentUser !== null;
    }
  }, {
    key: "isUserAdmin",
    value: function isUserAdmin() {
      var user, userRole;
      return regeneratorRuntime.async(function isUserAdmin$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              user = _config.auth.currentUser;

              if (user) {
                _context4.next = 4;
                break;
              }

              return _context4.abrupt("return", false);

            case 4:
              _context4.next = 6;
              return regeneratorRuntime.awrap(_Auth["default"].getUserRole(user.uid));

            case 6:
              userRole = _context4.sent;
              return _context4.abrupt("return", userRole === "Admin");

            case 10:
              _context4.prev = 10;
              _context4.t0 = _context4["catch"](0);
              console.error("Error checking admin status:", _context4.t0);
              return _context4.abrupt("return", false);

            case 14:
            case "end":
              return _context4.stop();
          }
        }
      }, null, null, [[0, 10]]);
    }
  }]);

  return BlogController;
}();

var _default = BlogController;
exports["default"] = _default;