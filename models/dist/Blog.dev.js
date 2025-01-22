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
      var blogsRef, newBlogRef, newBlog;
      return regeneratorRuntime.async(function create$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              blogsRef = (0, _database.ref)(_config.db, "blogs");
              newBlogRef = (0, _database.push)(blogsRef);
              newBlog = {
                title: blogData.title,
                content: blogData.content,
                imageUrl: blogData.imageUrl || "",
                author: blogData.author || "Admin",
                authorId: blogData.authorId,
                date: blogData.date || new Date().toLocaleDateString(),
                createdAt: blogData.createdAt || new Date().toISOString()
              };
              _context.next = 6;
              return regeneratorRuntime.awrap((0, _database.set)(newBlogRef, newBlog));

            case 6:
              return _context.abrupt("return", {
                id: newBlogRef.key
              });

            case 9:
              _context.prev = 9;
              _context.t0 = _context["catch"](0);
              console.error("Error creating blog:", _context.t0);
              throw _context.t0;

            case 13:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[0, 9]]);
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
                });
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
      var blogRef, snapshot, blogData;
      return regeneratorRuntime.async(function _delete$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (blogId) {
                _context3.next = 2;
                break;
              }

              throw new Error("ID del blog requerido");

            case 2:
              _context3.prev = 2;
              // Obtener referencia al blog
              blogRef = (0, _database.ref)(_config.db, "blogs/".concat(blogId)); // Verificar si existe el blog y obtener sus datos

              _context3.next = 6;
              return regeneratorRuntime.awrap((0, _database.get)(blogRef));

            case 6:
              snapshot = _context3.sent;

              if (snapshot.exists()) {
                _context3.next = 9;
                break;
              }

              throw new Error("El blog no existe");

            case 9:
              // Obtener datos del blog para la imagen
              blogData = snapshot.val(); // Si hay una imagen, eliminarla de Cloudinary

              if (!blogData.imageUrl) {
                _context3.next = 19;
                break;
              }

              _context3.prev = 11;
              _context3.next = 14;
              return regeneratorRuntime.awrap(fetch('/api/storage/delete', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  urls: [blogData.imageUrl]
                })
              }));

            case 14:
              _context3.next = 19;
              break;

            case 16:
              _context3.prev = 16;
              _context3.t0 = _context3["catch"](11);
              console.error("Error al eliminar imagen:", _context3.t0); // Continuamos con la eliminación aunque falle la imagen

            case 19:
              _context3.next = 21;
              return regeneratorRuntime.awrap((0, _database.remove)(blogRef));

            case 21:
              return _context3.abrupt("return", true);

            case 24:
              _context3.prev = 24;
              _context3.t1 = _context3["catch"](2);
              console.error("Error en delete:", _context3.t1);
              throw _context3.t1;

            case 28:
            case "end":
              return _context3.stop();
          }
        }
      }, null, null, [[2, 24], [11, 16]]);
    }
  }]);

  return Blog;
}();

var _default = Blog;
exports["default"] = _default;