"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _SupportRequest = _interopRequireDefault(require("@/models/SupportRequest"));

var _config = require("@/lib/firebase/config");

var _Auth = _interopRequireDefault(require("@/models/Auth"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AdminSupportRequestController =
/*#__PURE__*/
function () {
  function AdminSupportRequestController() {
    _classCallCheck(this, AdminSupportRequestController);
  }

  _createClass(AdminSupportRequestController, null, [{
    key: "getAllRequests",
    value: function getAllRequests(setRequests) {
      var unsubscribe;
      return regeneratorRuntime.async(function getAllRequests$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return regeneratorRuntime.awrap(_SupportRequest["default"].getRequests(setRequests));

            case 3:
              unsubscribe = _context.sent;
              return _context.abrupt("return", unsubscribe);

            case 7:
              _context.prev = 7;
              _context.t0 = _context["catch"](0);
              console.error("Error fetching requests:", _context.t0);
              return _context.abrupt("return", {
                ok: false,
                error: _context.t0.message
              });

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[0, 7]]);
    }
  }, {
    key: "deleteRequest",
    value: function deleteRequest(requestId) {
      var user, userRole;
      return regeneratorRuntime.async(function deleteRequest$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              user = _config.auth.currentUser;

              if (user) {
                _context2.next = 4;
                break;
              }

              return _context2.abrupt("return", {
                ok: false,
                error: "Usuario no autenticado"
              });

            case 4:
              _context2.next = 6;
              return regeneratorRuntime.awrap(_Auth["default"].getUserRole(user.uid));

            case 6:
              userRole = _context2.sent;

              if (!(userRole !== "Admin")) {
                _context2.next = 9;
                break;
              }

              return _context2.abrupt("return", {
                ok: false,
                error: "No tienes permisos para eliminar solicitudes"
              });

            case 9:
              _context2.next = 11;
              return regeneratorRuntime.awrap(_SupportRequest["default"]["delete"](requestId));

            case 11:
              return _context2.abrupt("return", {
                ok: true
              });

            case 14:
              _context2.prev = 14;
              _context2.t0 = _context2["catch"](0);
              console.error("Error deleting request:", _context2.t0);
              return _context2.abrupt("return", {
                ok: false,
                error: _context2.t0.message
              });

            case 18:
            case "end":
              return _context2.stop();
          }
        }
      }, null, null, [[0, 14]]);
    }
  }, {
    key: "updateRequestStatus",
    value: function updateRequestStatus(requestId, newStatus) {
      var user, userRole;
      return regeneratorRuntime.async(function updateRequestStatus$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              user = _config.auth.currentUser;

              if (user) {
                _context3.next = 4;
                break;
              }

              return _context3.abrupt("return", {
                ok: false,
                error: "Usuario no autenticado"
              });

            case 4:
              _context3.next = 6;
              return regeneratorRuntime.awrap(_Auth["default"].getUserRole(user.uid));

            case 6:
              userRole = _context3.sent;

              if (!(userRole !== "Admin")) {
                _context3.next = 9;
                break;
              }

              return _context3.abrupt("return", {
                ok: false,
                error: "No tienes permisos para actualizar solicitudes"
              });

            case 9:
              _context3.next = 11;
              return regeneratorRuntime.awrap(_SupportRequest["default"].updateStatus(requestId, newStatus));

            case 11:
              return _context3.abrupt("return", {
                ok: true
              });

            case 14:
              _context3.prev = 14;
              _context3.t0 = _context3["catch"](0);
              console.error("Error updating request status:", _context3.t0);
              return _context3.abrupt("return", {
                ok: false,
                error: _context3.t0.message
              });

            case 18:
            case "end":
              return _context3.stop();
          }
        }
      }, null, null, [[0, 14]]);
    }
  }]);

  return AdminSupportRequestController;
}();

var _default = AdminSupportRequestController;
exports["default"] = _default;