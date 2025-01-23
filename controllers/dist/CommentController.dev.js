"use strict";
"use client";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Comment = _interopRequireDefault(require("@/models/Comment"));

var _AuthController = _interopRequireDefault(require("@/controllers/AuthController"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CommentController =
/*#__PURE__*/
function () {
  function CommentController() {
    _classCallCheck(this, CommentController);
  }

  _createClass(CommentController, null, [{
    key: "createComment",
    value: function createComment(commentData) {
      var entityType, entityId, content, author, authorId, userData, _ref, user, userDataFromDB, result;

      return regeneratorRuntime.async(function createComment$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              entityType = commentData.entityType, entityId = commentData.entityId, content = commentData.content, author = commentData.author, authorId = commentData.authorId;

              if (!(!entityType || !entityId || !content)) {
                _context.next = 4;
                break;
              }

              return _context.abrupt("return", {
                ok: false,
                error: "Faltan datos requeridos"
              });

            case 4:
              if (!(author === "Admin" && authorId === "admin")) {
                _context.next = 8;
                break;
              }

              userData = {
                author: "Admin",
                authorId: "admin",
                authorUid: "admin",
                authorAvatar: ""
              };
              _context.next = 18;
              break;

            case 8:
              _context.next = 10;
              return regeneratorRuntime.awrap(_AuthController["default"].getCurrentUser());

            case 10:
              _ref = _context.sent;
              user = _ref.user;

              if (user) {
                _context.next = 14;
                break;
              }

              return _context.abrupt("return", {
                ok: false,
                error: "Debes iniciar sesión para comentar"
              });

            case 14:
              _context.next = 16;
              return regeneratorRuntime.awrap(_AuthController["default"].getUserData(user.uid));

            case 16:
              userDataFromDB = _context.sent;
              userData = {
                author: userDataFromDB.name,
                authorId: userDataFromDB.id,
                authorUid: user.uid,
                authorAvatar: userDataFromDB.profileUrl || ""
              };

            case 18:
              _context.next = 20;
              return regeneratorRuntime.awrap(_Comment["default"].create(_objectSpread({}, commentData, {}, userData)));

            case 20:
              result = _context.sent;
              return _context.abrupt("return", {
                ok: true,
                comment: result
              });

            case 24:
              _context.prev = 24;
              _context.t0 = _context["catch"](0);
              console.error("Error creating comment:", _context.t0);
              return _context.abrupt("return", {
                ok: false,
                error: _context.t0.message
              });

            case 28:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[0, 24]]);
    }
  }, {
    key: "getComments",
    value: function getComments(entityType, entityId, setComments) {
      var comments, unsubscribe;
      return regeneratorRuntime.async(function getComments$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return regeneratorRuntime.awrap(_Comment["default"].getAll(entityType, entityId));

            case 3:
              comments = _context2.sent;
              setComments(comments); // Luego suscribirse a cambios

              unsubscribe = _Comment["default"].subscribe(entityType, entityId, setComments);
              return _context2.abrupt("return", unsubscribe);

            case 9:
              _context2.prev = 9;
              _context2.t0 = _context2["catch"](0);
              console.error("Error obteniendo comentarios:", _context2.t0);
              throw _context2.t0;

            case 13:
            case "end":
              return _context2.stop();
          }
        }
      }, null, null, [[0, 9]]);
    }
  }, {
    key: "updateComment",
    value: function updateComment(entityType, entityId, commentId, content) {
      var _ref2, user, role, isAdmin, comment;

      return regeneratorRuntime.async(function updateComment$(_context3) {
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

              if (user) {
                _context3.next = 8;
                break;
              }

              return _context3.abrupt("return", {
                ok: false,
                error: "Usuario no autenticado"
              });

            case 8:
              isAdmin = role === "Admin";

              if (isAdmin) {
                _context3.next = 15;
                break;
              }

              _context3.next = 12;
              return regeneratorRuntime.awrap(_Comment["default"].get(entityType, entityId, commentId));

            case 12:
              comment = _context3.sent;

              if (!(comment.authorId !== user.uid)) {
                _context3.next = 15;
                break;
              }

              return _context3.abrupt("return", {
                ok: false,
                error: "No tienes permiso para editar este comentario"
              });

            case 15:
              _context3.next = 17;
              return regeneratorRuntime.awrap(_Comment["default"].update(entityType, entityId, commentId, content));

            case 17:
              return _context3.abrupt("return", {
                ok: true
              });

            case 20:
              _context3.prev = 20;
              _context3.t0 = _context3["catch"](0);
              console.error("Error updating comment:", _context3.t0);
              return _context3.abrupt("return", {
                ok: false,
                error: _context3.t0.message
              });

            case 24:
            case "end":
              return _context3.stop();
          }
        }
      }, null, null, [[0, 20]]);
    }
  }, {
    key: "deleteComment",
    value: function deleteComment(entityType, entityId, commentId) {
      var isAdmin,
          _ref3,
          user,
          comment,
          _args4 = arguments;

      return regeneratorRuntime.async(function deleteComment$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              isAdmin = _args4.length > 3 && _args4[3] !== undefined ? _args4[3] : false;
              _context4.prev = 1;

              if (isAdmin) {
                _context4.next = 14;
                break;
              }

              _context4.next = 5;
              return regeneratorRuntime.awrap(_AuthController["default"].getCurrentUser());

            case 5:
              _ref3 = _context4.sent;
              user = _ref3.user;

              if (user) {
                _context4.next = 9;
                break;
              }

              return _context4.abrupt("return", {
                ok: false,
                error: "Usuario no autenticado"
              });

            case 9:
              _context4.next = 11;
              return regeneratorRuntime.awrap(_Comment["default"].get(entityType, entityId, commentId));

            case 11:
              comment = _context4.sent;

              if (!(!comment || comment.authorUid !== user.uid)) {
                _context4.next = 14;
                break;
              }

              return _context4.abrupt("return", {
                ok: false,
                error: "No tienes permiso para eliminar este comentario"
              });

            case 14:
              _context4.next = 16;
              return regeneratorRuntime.awrap(_Comment["default"]["delete"](entityType, entityId, commentId));

            case 16:
              return _context4.abrupt("return", {
                ok: true
              });

            case 19:
              _context4.prev = 19;
              _context4.t0 = _context4["catch"](1);
              console.error("Error deleting comment:", _context4.t0);
              return _context4.abrupt("return", {
                ok: false,
                error: _context4.t0.message
              });

            case 23:
            case "end":
              return _context4.stop();
          }
        }
      }, null, null, [[1, 19]]);
    }
  }, {
    key: "toggleLike",
    value: function toggleLike(entityType, entityId, commentId) {
      var _ref4, user;

      return regeneratorRuntime.async(function toggleLike$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              _context5.next = 3;
              return regeneratorRuntime.awrap(_AuthController["default"].getCurrentUser());

            case 3:
              _ref4 = _context5.sent;
              user = _ref4.user;

              if (user) {
                _context5.next = 7;
                break;
              }

              return _context5.abrupt("return", {
                ok: false,
                error: "Usuario no autenticado"
              });

            case 7:
              _context5.next = 9;
              return regeneratorRuntime.awrap(_Comment["default"].toggleLike(entityType, entityId, commentId));

            case 9:
              return _context5.abrupt("return", {
                ok: true
              });

            case 12:
              _context5.prev = 12;
              _context5.t0 = _context5["catch"](0);
              console.error("Error toggling like:", _context5.t0);
              return _context5.abrupt("return", {
                ok: false,
                error: _context5.t0.message
              });

            case 16:
            case "end":
              return _context5.stop();
          }
        }
      }, null, null, [[0, 12]]);
    } // Métodos de verificación

  }, {
    key: "isUserAuthenticated",
    value: function isUserAuthenticated() {
      var _ref5, user;

      return regeneratorRuntime.async(function isUserAuthenticated$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return regeneratorRuntime.awrap(_AuthController["default"].getCurrentUser());

            case 2:
              _ref5 = _context6.sent;
              user = _ref5.user;
              return _context6.abrupt("return", user !== null);

            case 5:
            case "end":
              return _context6.stop();
          }
        }
      });
    }
  }, {
    key: "getCurrentUser",
    value: function getCurrentUser() {
      return regeneratorRuntime.async(function getCurrentUser$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              return _context7.abrupt("return", _AuthController["default"].getCurrentUser());

            case 1:
            case "end":
              return _context7.stop();
          }
        }
      });
    }
  }, {
    key: "isUserAdmin",
    value: function isUserAdmin() {
      var _ref6, role;

      return regeneratorRuntime.async(function isUserAdmin$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.prev = 0;
              _context8.next = 3;
              return regeneratorRuntime.awrap(_AuthController["default"].getCurrentUser());

            case 3:
              _ref6 = _context8.sent;
              role = _ref6.role;
              return _context8.abrupt("return", role === "Admin");

            case 8:
              _context8.prev = 8;
              _context8.t0 = _context8["catch"](0);
              console.error("Error checking admin status:", _context8.t0);
              return _context8.abrupt("return", false);

            case 12:
            case "end":
              return _context8.stop();
          }
        }
      }, null, null, [[0, 8]]);
    }
  }]);

  return CommentController;
}();

var _default = CommentController;
exports["default"] = _default;