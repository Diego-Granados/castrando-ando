"use strict";
"use client";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Message = _interopRequireDefault(require("@/models/Message"));

var _config = require("@/lib/firebase/config");

var _AuthController = _interopRequireDefault(require("@/controllers/AuthController"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MessageController =
/*#__PURE__*/
function () {
  function MessageController() {
    _classCallCheck(this, MessageController);
  }

  _createClass(MessageController, null, [{
    key: "createMessage",
    value: function createMessage(content) {
      var _ref, user, role, authorName, userData, result;

      return regeneratorRuntime.async(function createMessage$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;

              if (content.trim()) {
                _context.next = 3;
                break;
              }

              throw new Error("El mensaje no puede estar vacío");

            case 3:
              _context.next = 5;
              return regeneratorRuntime.awrap(_AuthController["default"].getCurrentUser());

            case 5:
              _ref = _context.sent;
              user = _ref.user;
              role = _ref.role;

              if (user) {
                _context.next = 10;
                break;
              }

              throw new Error("Debes iniciar sesión para enviar mensajes");

            case 10:
              if (!(role === 'Admin')) {
                _context.next = 14;
                break;
              }

              // Si es admin, usar "Administrador" como nombre
              authorName = "Administrador";
              _context.next = 20;
              break;

            case 14:
              _context.next = 16;
              return regeneratorRuntime.awrap(_AuthController["default"].getUserData(user.uid));

            case 16:
              userData = _context.sent;

              if (userData) {
                _context.next = 19;
                break;
              }

              throw new Error("No se encontraron datos del usuario");

            case 19:
              authorName = userData.name;

            case 20:
              _context.next = 22;
              return regeneratorRuntime.awrap(_Message["default"].createMessage(content, authorName, user.uid));

            case 22:
              result = _context.sent;
              return _context.abrupt("return", {
                ok: true,
                messageId: result.messageId
              });

            case 26:
              _context.prev = 26;
              _context.t0 = _context["catch"](0);
              console.error("Error en MessageController:", _context.t0);
              return _context.abrupt("return", {
                ok: false,
                error: _context.t0.message
              });

            case 30:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[0, 26]]);
    }
  }, {
    key: "getMessages",
    value: function getMessages(setMessages) {
      var unsubscribe;
      return regeneratorRuntime.async(function getMessages$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return regeneratorRuntime.awrap(_Message["default"].getMessages(setMessages));

            case 3:
              unsubscribe = _context2.sent;
              return _context2.abrupt("return", unsubscribe);

            case 7:
              _context2.prev = 7;
              _context2.t0 = _context2["catch"](0);
              console.error("Error obteniendo mensajes:", _context2.t0);
              throw _context2.t0;

            case 11:
            case "end":
              return _context2.stop();
          }
        }
      }, null, null, [[0, 7]]);
    }
  }, {
    key: "deleteMessage",
    value: function deleteMessage(messageId) {
      var _ref2, user, role;

      return regeneratorRuntime.async(function deleteMessage$(_context3) {
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

              throw new Error("Usuario no autenticado");

            case 8:
              _context3.next = 10;
              return regeneratorRuntime.awrap(_Message["default"].deleteMessage(messageId, user, role));

            case 10:
              return _context3.abrupt("return", {
                ok: true
              });

            case 13:
              _context3.prev = 13;
              _context3.t0 = _context3["catch"](0);
              return _context3.abrupt("return", {
                ok: false,
                error: _context3.t0.message
              });

            case 16:
            case "end":
              return _context3.stop();
          }
        }
      }, null, null, [[0, 13]]);
    }
  }, {
    key: "isUserAuthenticated",
    value: function isUserAuthenticated() {
      var _ref3, user;

      return regeneratorRuntime.async(function isUserAuthenticated$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              _context4.next = 3;
              return regeneratorRuntime.awrap(_AuthController["default"].getCurrentUser());

            case 3:
              _ref3 = _context4.sent;
              user = _ref3.user;
              return _context4.abrupt("return", user !== null);

            case 8:
              _context4.prev = 8;
              _context4.t0 = _context4["catch"](0);
              return _context4.abrupt("return", false);

            case 11:
            case "end":
              return _context4.stop();
          }
        }
      }, null, null, [[0, 8]]);
    }
  }, {
    key: "isUserAdmin",
    value: function isUserAdmin() {
      var _ref4, user, role;

      return regeneratorRuntime.async(function isUserAdmin$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              _context5.next = 3;
              return regeneratorRuntime.awrap(_AuthController["default"].getCurrentUser());

            case 3:
              _ref4 = _context5.sent;
              user = _ref4.user;
              role = _ref4.role;
              return _context5.abrupt("return", role === "Admin");

            case 9:
              _context5.prev = 9;
              _context5.t0 = _context5["catch"](0);
              console.error("Error checking admin status:", _context5.t0);
              return _context5.abrupt("return", false);

            case 13:
            case "end":
              return _context5.stop();
          }
        }
      }, null, null, [[0, 9]]);
    }
  }]);

  return MessageController;
}();

var _default = MessageController;
exports["default"] = _default;