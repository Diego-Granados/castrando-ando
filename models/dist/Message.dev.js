"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _config = require("@/lib/firebase/config");

var _database = require("firebase/database");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Message =
/*#__PURE__*/
function () {
  function Message() {
    _classCallCheck(this, Message);
  }

  _createClass(Message, null, [{
    key: "createMessage",
    value: function createMessage(content, author, authorId) {
      var messageId, messageRef, messageData;
      return regeneratorRuntime.async(function createMessage$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              // Generar un ID único para el mensaje
              messageId = Date.now().toString(); // Crear entrada en la base de datos

              messageRef = (0, _database.ref)(_config.db, "messages/".concat(messageId));
              messageData = {
                content: content,
                author: author,
                authorId: authorId,
                timestamp: new Date().toISOString(),
                createdAt: new Date().toLocaleString()
              };
              _context.next = 6;
              return regeneratorRuntime.awrap((0, _database.set)(messageRef, messageData));

            case 6:
              return _context.abrupt("return", {
                ok: true,
                messageId: messageId
              });

            case 9:
              _context.prev = 9;
              _context.t0 = _context["catch"](0);
              console.error("Error en Message model:", _context.t0);
              throw _context.t0;

            case 13:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[0, 9]]);
    }
  }, {
    key: "getMessages",
    value: function getMessages(callback) {
      var messagesRef, unsubscribe;
      return regeneratorRuntime.async(function getMessages$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              messagesRef = (0, _database.ref)(_config.db, 'messages'); // Usar onValue para escuchar cambios en tiempo real

              unsubscribe = (0, _database.onValue)(messagesRef, function (snapshot) {
                if (snapshot.exists()) {
                  var messagesData = snapshot.val();
                  var messagesArray = Object.entries(messagesData).map(function (_ref) {
                    var _ref2 = _slicedToArray(_ref, 2),
                        id = _ref2[0],
                        message = _ref2[1];

                    return _objectSpread({
                      id: id
                    }, message);
                  }).sort(function (a, b) {
                    return new Date(a.timestamp) - new Date(b.timestamp);
                  });
                  callback(messagesArray);
                } else {
                  callback([]);
                }
              }); // Devolver la función de limpieza

              return _context2.abrupt("return", unsubscribe);

            case 6:
              _context2.prev = 6;
              _context2.t0 = _context2["catch"](0);
              console.error("Error obteniendo mensajes:", _context2.t0);
              throw _context2.t0;

            case 10:
            case "end":
              return _context2.stop();
          }
        }
      }, null, null, [[0, 6]]);
    }
  }, {
    key: "deleteMessage",
    value: function deleteMessage(messageId, userId, role) {
      var messageRef, snapshot, messageData;
      return regeneratorRuntime.async(function deleteMessage$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              messageRef = (0, _database.ref)(_config.db, "messages/".concat(messageId));
              _context3.next = 4;
              return regeneratorRuntime.awrap((0, _database.get)(messageRef));

            case 4:
              snapshot = _context3.sent;

              if (!snapshot.exists()) {
                _context3.next = 20;
                break;
              }

              messageData = snapshot.val();

              if (!(messageData.authorId === userId.uid)) {
                _context3.next = 13;
                break;
              }

              _context3.next = 10;
              return regeneratorRuntime.awrap((0, _database.remove)(messageRef));

            case 10:
              return _context3.abrupt("return", {
                ok: true
              });

            case 13:
              if (!(role === 'Admin')) {
                _context3.next = 19;
                break;
              }

              _context3.next = 16;
              return regeneratorRuntime.awrap((0, _database.remove)(messageRef));

            case 16:
              return _context3.abrupt("return", {
                ok: true
              });

            case 19:
              throw new Error("No tienes permiso para eliminar este mensaje");

            case 20:
              throw new Error("Mensaje no encontrado");

            case 23:
              _context3.prev = 23;
              _context3.t0 = _context3["catch"](0);
              console.error("Error eliminando mensaje:", _context3.t0);
              throw _context3.t0;

            case 27:
            case "end":
              return _context3.stop();
          }
        }
      }, null, null, [[0, 23]]);
    }
  }]);

  return Message;
}();

var _default = Message;
exports["default"] = _default;