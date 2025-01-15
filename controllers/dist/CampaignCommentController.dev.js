"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _CampaignComment = _interopRequireDefault(require("@/models/CampaignComment"));

var _config = require("@/lib/firebase/config");

var _database = require("firebase/database");

var _Auth = _interopRequireDefault(require("@/models/Auth"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
    key: "createComment",
    value: function createComment(campaignId, content) {
      var user, isAdmin, authorName, userData, result;
      return regeneratorRuntime.async(function createComment$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;

              if (content.trim()) {
                _context.next = 3;
                break;
              }

              throw new Error("El comentario no puede estar vacío");

            case 3:
              _context.next = 5;
              return regeneratorRuntime.awrap(_Auth["default"].getCurrentUser());

            case 5:
              user = _context.sent;
              _context.next = 8;
              return regeneratorRuntime.awrap(this.isUserAdmin());

            case 8:
              isAdmin = _context.sent;

              if (!isAdmin) {
                _context.next = 13;
                break;
              }

              // Si es admin, usar el rol como nombre
              authorName = "Administrador";
              _context.next = 19;
              break;

            case 13:
              _context.next = 15;
              return regeneratorRuntime.awrap(_Auth["default"].getUserData(user.uid));

            case 15:
              userData = _context.sent;

              if (userData) {
                _context.next = 18;
                break;
              }

              throw new Error("Debes iniciar sesión para comentar");

            case 18:
              authorName = userData.name;

            case 19:
              _context.next = 21;
              return regeneratorRuntime.awrap(_CampaignComment["default"].createComment(campaignId, content, authorName, user.uid));

            case 21:
              result = _context.sent;
              return _context.abrupt("return", {
                ok: true,
                commentId: result.commentId
              });

            case 25:
              _context.prev = 25;
              _context.t0 = _context["catch"](0);
              return _context.abrupt("return", {
                ok: false,
                error: _context.t0.message
              });

            case 28:
            case "end":
              return _context.stop();
          }
        }
      }, null, this, [[0, 25]]);
    }
  }, {
    key: "getComments",
    value: function getComments(campaignId, setComments) {
      return regeneratorRuntime.async(function getComments$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return regeneratorRuntime.awrap(_CampaignComment["default"].getComments(campaignId, setComments));

            case 3:
              return _context2.abrupt("return", {
                ok: true
              });

            case 6:
              _context2.prev = 6;
              _context2.t0 = _context2["catch"](0);
              return _context2.abrupt("return", {
                ok: false,
                error: _context2.t0.message
              });

            case 9:
            case "end":
              return _context2.stop();
          }
        }
      }, null, null, [[0, 6]]);
    }
  }, {
    key: "deleteComment",
    value: function deleteComment(campaignId, commentId) {
      var user, isAdmin;
      return regeneratorRuntime.async(function deleteComment$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _context3.next = 3;
              return regeneratorRuntime.awrap(_Auth["default"].getCurrentUser());

            case 3:
              user = _context3.sent;

              if (user) {
                _context3.next = 6;
                break;
              }

              throw new Error("Usuario no autenticado");

            case 6:
              _context3.next = 8;
              return regeneratorRuntime.awrap(this.isUserAdmin());

            case 8:
              isAdmin = _context3.sent;
              _context3.next = 11;
              return regeneratorRuntime.awrap(_CampaignComment["default"].deleteComment(campaignId, commentId, user.uid, isAdmin));

            case 11:
              return _context3.abrupt("return", {
                ok: true
              });

            case 14:
              _context3.prev = 14;
              _context3.t0 = _context3["catch"](0);
              return _context3.abrupt("return", {
                ok: false,
                error: _context3.t0.message
              });

            case 17:
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

  return CampaignCommentController;
}();

var _default = CampaignCommentController;
exports["default"] = _default;