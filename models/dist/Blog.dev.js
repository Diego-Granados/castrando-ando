"use strict";
"use client";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _config = require("@/lib/firebase/config");

var _database = require("firebase/database");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Blog =
/*#__PURE__*/
function () {
  function Blog() {
    _classCallCheck(this, Blog);
  }

  _createClass(Blog, null, [{
    key: "create",
    value: function create(blogData) {
      var blogsRef, newBlogRef, user, newBlog;
      return regeneratorRuntime.async(function create$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              blogsRef = (0, _database.ref)(_config.db, "blogs");
              newBlogRef = (0, _database.push)(blogsRef);
              user = _config.auth.currentUser;

              if (user) {
                _context.next = 6;
                break;
              }

              throw new Error("Usuario no autenticado");

            case 6:
              newBlog = {
                title: blogData.title,
                content: blogData.content,
                imageUrl: blogData.imageUrl || "",
                author: user.displayName || "Administrador",
                authorId: user.uid,
                date: blogData.date || new Date().toLocaleDateString(),
                createdAt: new Date().toISOString()
              };
              _context.next = 9;
              return regeneratorRuntime.awrap((0, _database.set)(newBlogRef, newBlog));

            case 9:
              return _context.abrupt("return", {
                id: newBlogRef.key
              });

            case 12:
              _context.prev = 12;
              _context.t0 = _context["catch"](0);
              throw _context.t0;

            case 15:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[0, 12]]);
    }
  }, {
    key: "getAll",
    value: function getAll(setBlogs) {
      var blogsRef, snapshot, blogsArray;
      return regeneratorRuntime.async(function getAll$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              blogsRef = (0, _database.ref)(_config.db, "blogs");
              _context2.next = 4;
              return regeneratorRuntime.awrap((0, _database.get)(blogsRef));

            case 4:
              snapshot = _context2.sent;

              if (snapshot.exists()) {
                blogsArray = [];
                snapshot.forEach(function (childSnapshot) {
                  var blogData = childSnapshot.val();
                  blogsArray.push(_objectSpread({
                    id: childSnapshot.key
                  }, blogData));
                }); // Ordenar por fecha de creación, más reciente primero

                blogsArray.sort(function (a, b) {
                  return new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date);
                });
                setBlogs(blogsArray);
              } else {
                setBlogs([]);
              }

              _context2.next = 12;
              break;

            case 8:
              _context2.prev = 8;
              _context2.t0 = _context2["catch"](0);
              console.error("Error getting blogs:", _context2.t0);
              throw _context2.t0;

            case 12:
            case "end":
              return _context2.stop();
          }
        }
      }, null, null, [[0, 8]]);
    }
  }, {
    key: "delete",
    value: function _delete(blogId) {
      var blogRef;
      return regeneratorRuntime.async(function _delete$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              blogRef = (0, _database.ref)(_config.db, "blogs/".concat(blogId));
              _context3.next = 4;
              return regeneratorRuntime.awrap((0, _database.remove)(blogRef));

            case 4:
              return _context3.abrupt("return", {
                ok: true
              });

            case 7:
              _context3.prev = 7;
              _context3.t0 = _context3["catch"](0);
              console.error("Error deleting blog:", _context3.t0);
              throw _context3.t0;

            case 11:
            case "end":
              return _context3.stop();
          }
        }
      }, null, null, [[0, 7]]);
    }
  }]);

  return Blog;
}();

var _default = Blog;
exports["default"] = _default;