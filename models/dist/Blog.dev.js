"use strict";
"use client";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _config = require("@/lib/firebase/config");

var _database = require("firebase/database");

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
    key: "createBlog",
    value: function createBlog(blogData) {
      var blogsRef, newBlogRef, newBlog;
      return regeneratorRuntime.async(function createBlog$(_context) {
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
                author: blogData.author,
                authorId: blogData.authorId,
                date: new Date().toLocaleDateString(),
                createdAt: new Date().toISOString()
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
              throw _context.t0;

            case 12:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[0, 9]]);
    }
  }, {
    key: "getBlogs",
    value: function getBlogs(setBlogs) {
      var blogsRef, snapshot, blogsArray;
      return regeneratorRuntime.async(function getBlogs$(_context2) {
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
                  blogsArray.push({
                    id: childSnapshot.key,
                    title: blogData.title,
                    content: blogData.content,
                    imageUrl: blogData.imageUrl,
                    author: blogData.author,
                    date: blogData.date
                  });
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
  }]);

  return Blog;
}();

var _default = Blog;
exports["default"] = _default;