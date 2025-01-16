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

var SupportRequest =
/*#__PURE__*/
function () {
  function SupportRequest() {
    _classCallCheck(this, SupportRequest);
  }

  _createClass(SupportRequest, null, [{
    key: "createRequest",
    value: function createRequest(requestData) {
      var requestsRef, newRequestRef, user, newRequest;
      return regeneratorRuntime.async(function createRequest$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              requestsRef = (0, _database.ref)(_config.db, "supportRequests");
              newRequestRef = (0, _database.push)(requestsRef);
              user = _config.auth.currentUser;

              if (user) {
                _context.next = 6;
                break;
              }

              throw new Error("Usuario no autenticado");

            case 6:
              newRequest = {
                title: requestData.title,
                description: requestData.description,
                userId: user.uid,
                userName: user.displayName || "Usuario Anónimo",
                date: new Date().toLocaleDateString(),
                createdAt: new Date().toISOString()
              };
              _context.next = 9;
              return regeneratorRuntime.awrap((0, _database.set)(newRequestRef, newRequest));

            case 9:
              return _context.abrupt("return", {
                id: newRequestRef.key
              });

            case 12:
              _context.prev = 12;
              _context.t0 = _context["catch"](0);
              throw _context.t0;

            case 15:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[0, 12]]);
    }
  }, {
    key: "getRequests",
    value: function getRequests(callback) {
      var requestsRef, unsubscribe;
      return regeneratorRuntime.async(function getRequests$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              requestsRef = (0, _database.ref)(_config.db, "supportRequests");
              unsubscribe = (0, _database.onValue)(requestsRef, function (snapshot) {
                callback(snapshot.val());
              });
              return _context2.abrupt("return", unsubscribe);

            case 6:
              _context2.prev = 6;
              _context2.t0 = _context2["catch"](0);
              console.error("Error getting requests:", _context2.t0);
              throw _context2.t0;

            case 10:
            case "end":
              return _context2.stop();
          }
        }
      }, null, null, [[0, 6]]);
    }
  }, {
    key: "deleteRequest",
    value: function deleteRequest(requestId) {
      var requestRef;
      return regeneratorRuntime.async(function deleteRequest$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              requestRef = (0, _database.ref)(_config.db, "supportRequests/".concat(requestId));
              _context3.next = 4;
              return regeneratorRuntime.awrap((0, _database.remove)(requestRef));

            case 4:
              return _context3.abrupt("return", {
                ok: true
              });

            case 7:
              _context3.prev = 7;
              _context3.t0 = _context3["catch"](0);
              console.error("Error deleting request:", _context3.t0);
              throw _context3.t0;

            case 11:
            case "end":
              return _context3.stop();
          }
        }
      }, null, null, [[0, 7]]);
    }
  }, {
    key: "updateStatus",
    value: function updateStatus(requestId, newStatus) {
      var requestRef, snapshot, currentData;
      return regeneratorRuntime.async(function updateStatus$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              requestRef = (0, _database.ref)(_config.db, "supportRequests/".concat(requestId));
              _context4.next = 4;
              return regeneratorRuntime.awrap((0, _database.get)(requestRef));

            case 4:
              snapshot = _context4.sent;

              if (!snapshot.exists()) {
                _context4.next = 12;
                break;
              }

              currentData = snapshot.val();
              _context4.next = 9;
              return regeneratorRuntime.awrap((0, _database.set)(requestRef, _objectSpread({}, currentData, {
                status: newStatus
              })));

            case 9:
              return _context4.abrupt("return", {
                ok: true
              });

            case 12:
              throw new Error("Solicitud no encontrada");

            case 13:
              _context4.next = 19;
              break;

            case 15:
              _context4.prev = 15;
              _context4.t0 = _context4["catch"](0);
              console.error("Error updating request status:", _context4.t0);
              throw _context4.t0;

            case 19:
            case "end":
              return _context4.stop();
          }
        }
      }, null, null, [[0, 15]]);
    }
  }]);

  return SupportRequest;
}();

var _default = SupportRequest;
exports["default"] = _default;