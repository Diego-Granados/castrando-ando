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

var CampaignComment =
/*#__PURE__*/
function () {
  function CampaignComment() {
    _classCallCheck(this, CampaignComment);
  }

  _createClass(CampaignComment, null, [{
    key: "createComment",
    value: function createComment(campaignId, content, author, authorId) {
      var commentsRef, newComment, commentRef;
      return regeneratorRuntime.async(function createComment$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              commentsRef = (0, _database.ref)(_config.db, "campaign-comments/".concat(campaignId));
              newComment = {
                content: content,
                author: author,
                authorId: authorId,
                createdAt: (0, _database.serverTimestamp)()
              };
              _context.next = 5;
              return regeneratorRuntime.awrap((0, _database.push)(commentsRef, newComment));

            case 5:
              commentRef = _context.sent;
              return _context.abrupt("return", {
                commentId: commentRef.key
              });

            case 9:
              _context.prev = 9;
              _context.t0 = _context["catch"](0);
              console.error("Error creating comment:", _context.t0);
              throw _context.t0;

            case 13:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[0, 9]]);
    }
  }, {
    key: "getComments",
    value: function getComments(campaignId, callback) {
      var commentsRef, unsubscribe;
      return regeneratorRuntime.async(function getComments$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              commentsRef = (0, _database.ref)(_config.db, "campaign-comments/".concat(campaignId)); // Configurar el listener en tiempo real

              unsubscribe = (0, _database.onValue)(commentsRef, function (snapshot) {
                var comments = [];
                snapshot.forEach(function (childSnapshot) {
                  var comment = _objectSpread({
                    id: childSnapshot.key
                  }, childSnapshot.val(), {
                    createdAt: new Date(childSnapshot.val().createdAt).toLocaleString()
                  });

                  comments.push(comment);
                }); // Ordenar comentarios por fecha (más antiguos primero)

                comments.sort(function (a, b) {
                  return new Date(a.createdAt) - new Date(b.createdAt);
                });
                callback(comments);
              }); // Devolver la función de limpieza

              return _context2.abrupt("return", function () {
                return unsubscribe();
              });

            case 6:
              _context2.prev = 6;
              _context2.t0 = _context2["catch"](0);
              console.error("Error getting comments:", _context2.t0);
              throw _context2.t0;

            case 10:
            case "end":
              return _context2.stop();
          }
        }
      }, null, null, [[0, 6]]);
    }
  }, {
    key: "deleteComment",
    value: function deleteComment(campaignId, commentId, userId, isAdmin) {
      var commentRef, snapshot, comment;
      return regeneratorRuntime.async(function deleteComment$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              // Verificar si el usuario puede eliminar el comentario
              commentRef = (0, _database.ref)(_config.db, "campaign-comments/".concat(campaignId, "/").concat(commentId));
              _context3.next = 4;
              return regeneratorRuntime.awrap((0, _database.get)(commentRef));

            case 4:
              snapshot = _context3.sent;

              if (snapshot.exists()) {
                _context3.next = 7;
                break;
              }

              throw new Error("Comentario no encontrado");

            case 7:
              comment = snapshot.val();

              if (!(!isAdmin && comment.authorId !== userId)) {
                _context3.next = 10;
                break;
              }

              throw new Error("No tienes permiso para eliminar este comentario");

            case 10:
              _context3.next = 12;
              return regeneratorRuntime.awrap((0, _database.remove)(commentRef));

            case 12:
              _context3.next = 18;
              break;

            case 14:
              _context3.prev = 14;
              _context3.t0 = _context3["catch"](0);
              console.error("Error deleting comment:", _context3.t0);
              throw _context3.t0;

            case 18:
            case "end":
              return _context3.stop();
          }
        }
      }, null, null, [[0, 14]]);
    }
  }]);

  return CampaignComment;
}();

var _default = CampaignComment;
exports["default"] = _default;