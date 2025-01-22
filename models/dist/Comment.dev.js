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

var Comment =
/*#__PURE__*/
function () {
  function Comment() {
    _classCallCheck(this, Comment);
  }

  _createClass(Comment, null, [{
    key: "create",
    value: function create(commentData) {
      var commentsRef, newCommentRef, newComment;
      return regeneratorRuntime.async(function create$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              commentsRef = (0, _database.ref)(_config.db, "comments/".concat(commentData.entityType, "/").concat(commentData.entityId));
              newCommentRef = (0, _database.push)(commentsRef);
              newComment = {
                content: commentData.content,
                author: commentData.author || "Usuario",
                authorId: commentData.authorId,
                authorAvatar: commentData.authorAvatar || "",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              };
              _context.next = 6;
              return regeneratorRuntime.awrap((0, _database.set)(newCommentRef, newComment));

            case 6:
              return _context.abrupt("return", _objectSpread({
                id: newCommentRef.key
              }, newComment));

            case 9:
              _context.prev = 9;
              _context.t0 = _context["catch"](0);
              console.error("Error en create comment:", _context.t0);
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
    value: function getAll(entityType, entityId) {
      var commentsRef, snapshot, comments;
      return regeneratorRuntime.async(function getAll$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              commentsRef = (0, _database.ref)(_config.db, "comments/".concat(entityType, "/").concat(entityId));
              _context2.next = 4;
              return regeneratorRuntime.awrap((0, _database.get)(commentsRef));

            case 4:
              snapshot = _context2.sent;

              if (!snapshot.exists()) {
                _context2.next = 9;
                break;
              }

              comments = [];
              snapshot.forEach(function (childSnapshot) {
                comments.push(_objectSpread({
                  id: childSnapshot.key
                }, childSnapshot.val()));
              });
              return _context2.abrupt("return", comments.sort(function (a, b) {
                return new Date(b.createdAt) - new Date(a.createdAt);
              }));

            case 9:
              return _context2.abrupt("return", []);

            case 12:
              _context2.prev = 12;
              _context2.t0 = _context2["catch"](0);
              console.error("Error en getAll comments:", _context2.t0);
              throw _context2.t0;

            case 16:
            case "end":
              return _context2.stop();
          }
        }
      }, null, null, [[0, 12]]);
    }
  }, {
    key: "get",
    value: function get(entityType, entityId, commentId) {
      var commentRef, snapshot;
      return regeneratorRuntime.async(function get$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              commentRef = (0, _database.ref)(_config.db, "comments/".concat(entityType, "/").concat(entityId, "/").concat(commentId));
              _context3.next = 4;
              return regeneratorRuntime.awrap((0, _database.get)(commentRef));

            case 4:
              snapshot = _context3.sent;

              if (snapshot.exists()) {
                _context3.next = 7;
                break;
              }

              return _context3.abrupt("return", null);

            case 7:
              return _context3.abrupt("return", _objectSpread({
                id: snapshot.key
              }, snapshot.val()));

            case 10:
              _context3.prev = 10;
              _context3.t0 = _context3["catch"](0);
              console.error("Error en get comment:", _context3.t0);
              throw _context3.t0;

            case 14:
            case "end":
              return _context3.stop();
          }
        }
      }, null, null, [[0, 10]]);
    }
  }, {
    key: "delete",
    value: function _delete(entityType, entityId, commentId) {
      var commentRef;
      return regeneratorRuntime.async(function _delete$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              commentRef = (0, _database.ref)(_config.db, "comments/".concat(entityType, "/").concat(entityId, "/").concat(commentId));
              _context4.next = 4;
              return regeneratorRuntime.awrap((0, _database.remove)(commentRef));

            case 4:
              return _context4.abrupt("return", true);

            case 7:
              _context4.prev = 7;
              _context4.t0 = _context4["catch"](0);
              console.error("Error en delete comment:", _context4.t0);
              throw _context4.t0;

            case 11:
            case "end":
              return _context4.stop();
          }
        }
      }, null, null, [[0, 7]]);
    }
  }, {
    key: "update",
    value: function update(entityType, entityId, commentId, content) {
      var commentRef, snapshot, commentData;
      return regeneratorRuntime.async(function update$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              commentRef = (0, _database.ref)(_config.db, "comments/".concat(entityType, "/").concat(entityId, "/").concat(commentId));
              _context5.next = 4;
              return regeneratorRuntime.awrap((0, _database.get)(commentRef));

            case 4:
              snapshot = _context5.sent;

              if (snapshot.exists()) {
                _context5.next = 7;
                break;
              }

              throw new Error("Comentario no encontrado");

            case 7:
              commentData = snapshot.val();
              _context5.next = 10;
              return regeneratorRuntime.awrap((0, _database.set)(commentRef, _objectSpread({}, commentData, {
                content: content,
                updatedAt: new Date().toISOString(),
                isEdited: true
              })));

            case 10:
              return _context5.abrupt("return", {
                ok: true
              });

            case 13:
              _context5.prev = 13;
              _context5.t0 = _context5["catch"](0);
              console.error("Error updating comment:", _context5.t0);
              throw _context5.t0;

            case 17:
            case "end":
              return _context5.stop();
          }
        }
      }, null, null, [[0, 13]]);
    }
  }, {
    key: "toggleLike",
    value: function toggleLike(entityType, entityId, commentId) {
      var likeRef, snapshot;
      return regeneratorRuntime.async(function toggleLike$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.prev = 0;
              likeRef = (0, _database.ref)(_config.db, "comments/".concat(entityType, "/").concat(entityId, "/").concat(commentId, "/likes/").concat(commentId));
              _context6.next = 4;
              return regeneratorRuntime.awrap((0, _database.get)(likeRef));

            case 4:
              snapshot = _context6.sent;

              if (!snapshot.exists()) {
                _context6.next = 10;
                break;
              }

              _context6.next = 8;
              return regeneratorRuntime.awrap((0, _database.remove)(likeRef));

            case 8:
              _context6.next = 12;
              break;

            case 10:
              _context6.next = 12;
              return regeneratorRuntime.awrap((0, _database.set)(likeRef, true));

            case 12:
              return _context6.abrupt("return", {
                ok: true
              });

            case 15:
              _context6.prev = 15;
              _context6.t0 = _context6["catch"](0);
              console.error("Error toggling like:", _context6.t0);
              throw _context6.t0;

            case 19:
            case "end":
              return _context6.stop();
          }
        }
      }, null, null, [[0, 15]]);
    }
  }, {
    key: "getCommentsByUser",
    value: function getCommentsByUser(userId) {
      return regeneratorRuntime.async(function getCommentsByUser$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.prev = 0;
              throw new Error("Método no implementado");

            case 4:
              _context7.prev = 4;
              _context7.t0 = _context7["catch"](0);
              console.error("Error getting user comments:", _context7.t0);
              throw _context7.t0;

            case 8:
            case "end":
              return _context7.stop();
          }
        }
      }, null, null, [[0, 4]]);
    }
  }, {
    key: "deleteAllFromEntity",
    value: function deleteAllFromEntity(entityType, entityId) {
      var commentsRef;
      return regeneratorRuntime.async(function deleteAllFromEntity$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.prev = 0;
              commentsRef = (0, _database.ref)(_config.db, "comments/".concat(entityType, "/").concat(entityId));
              _context8.next = 4;
              return regeneratorRuntime.awrap((0, _database.remove)(commentsRef));

            case 4:
              return _context8.abrupt("return", true);

            case 7:
              _context8.prev = 7;
              _context8.t0 = _context8["catch"](0);
              console.error("Error deleting all comments:", _context8.t0);
              throw _context8.t0;

            case 11:
            case "end":
              return _context8.stop();
          }
        }
      }, null, null, [[0, 7]]);
    }
  }]);

  return Comment;
}();

var _default = Comment;
exports["default"] = _default;