"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _CampaignComment = _interopRequireDefault(require("@/models/CampaignComment"));

var _config = require("@/lib/firebase/config");

var _database = require("firebase/database");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CampaignCommentController =
/*#__PURE__*/
function () {
  function CampaignCommentController() {
    _classCallCheck(this, CampaignCommentController);
  }

  _createClass(CampaignCommentController, null, [{
    key: "getCurrentUser",
    value: function getCurrentUser() {
      var firebaseUser, cedulaRef, cedulaSnapshot, cedula, userRef, userSnapshot, userData;
      return regeneratorRuntime.async(function getCurrentUser$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              firebaseUser = _config.auth.currentUser;

              if (firebaseUser) {
                _context.next = 4;
                break;
              }

              throw new Error("No hay usuario autenticado");

            case 4:
              cedulaRef = (0, _database.ref)(_config.db, "uidToCedula/".concat(firebaseUser.uid));
              _context.next = 7;
              return regeneratorRuntime.awrap((0, _database.get)(cedulaRef));

            case 7:
              cedulaSnapshot = _context.sent;
              cedula = cedulaSnapshot.val();
              userRef = (0, _database.ref)(_config.db, "users/".concat(cedula));
              _context.next = 12;
              return regeneratorRuntime.awrap((0, _database.get)(userRef));

            case 12:
              userSnapshot = _context.sent;
              userData = userSnapshot.val();

              if (userData) {
                _context.next = 16;
                break;
              }

              throw new Error("No se encontraron datos del usuario");

            case 16:
              return _context.abrupt("return", _objectSpread({}, userData, {
                uid: firebaseUser.uid
              }));

            case 19:
              _context.prev = 19;
              _context.t0 = _context["catch"](0);
              console.error("Error obteniendo usuario actual:", _context.t0);
              throw _context.t0;

            case 23:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[0, 19]]);
    }
  }, {
    key: "createComment",
    value: function createComment(campaignId, content) {
      var currentUser, result;
      return regeneratorRuntime.async(function createComment$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;

              if (content.trim()) {
                _context2.next = 3;
                break;
              }

              throw new Error("El comentario no puede estar vacío");

            case 3:
              _context2.next = 5;
              return regeneratorRuntime.awrap(this.getCurrentUser());

            case 5:
              currentUser = _context2.sent;

              if (currentUser) {
                _context2.next = 8;
                break;
              }

              throw new Error("Debes iniciar sesión para comentar");

            case 8:
              _context2.next = 10;
              return regeneratorRuntime.awrap(_CampaignComment["default"].createComment(campaignId, content, currentUser.name, currentUser.uid));

            case 10:
              result = _context2.sent;
              return _context2.abrupt("return", {
                ok: true,
                commentId: result.commentId
              });

            case 14:
              _context2.prev = 14;
              _context2.t0 = _context2["catch"](0);
              return _context2.abrupt("return", {
                ok: false,
                error: _context2.t0.message
              });

            case 17:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this, [[0, 14]]);
    }
  }, {
    key: "getComments",
    value: function getComments(campaignId, setComments) {
      return regeneratorRuntime.async(function getComments$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _context3.next = 3;
              return regeneratorRuntime.awrap(_CampaignComment["default"].getComments(campaignId, setComments));

            case 3:
              return _context3.abrupt("return", {
                ok: true
              });

            case 6:
              _context3.prev = 6;
              _context3.t0 = _context3["catch"](0);
              return _context3.abrupt("return", {
                ok: false,
                error: _context3.t0.message
              });

            case 9:
            case "end":
              return _context3.stop();
          }
        }
      }, null, null, [[0, 6]]);
    }
  }, {
    key: "deleteComment",
    value: function deleteComment(campaignId, commentId) {
      var currentUser;
      return regeneratorRuntime.async(function deleteComment$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              _context4.next = 3;
              return regeneratorRuntime.awrap(this.getCurrentUser());

            case 3:
              currentUser = _context4.sent;

              if (currentUser) {
                _context4.next = 6;
                break;
              }

              throw new Error("Usuario no autenticado");

            case 6:
              _context4.next = 8;
              return regeneratorRuntime.awrap(_CampaignComment["default"].deleteComment(campaignId, commentId, currentUser.uid));

            case 8:
              return _context4.abrupt("return", {
                ok: true
              });

            case 11:
              _context4.prev = 11;
              _context4.t0 = _context4["catch"](0);
              return _context4.abrupt("return", {
                ok: false,
                error: _context4.t0.message
              });

            case 14:
            case "end":
              return _context4.stop();
          }
        }
      }, null, this, [[0, 11]]);
    }
  }, {
    key: "isUserAuthenticated",
    value: function isUserAuthenticated() {
      return _config.auth.currentUser !== null;
    }
  }]);

  return CampaignCommentController;
}();

var _default = CampaignCommentController;
exports["default"] = _default;