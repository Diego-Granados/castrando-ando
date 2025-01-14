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
    value: function getRequests(setRequests) {
      var requestsRef, snapshot, requestsArray;
      return regeneratorRuntime.async(function getRequests$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              requestsRef = (0, _database.ref)(_config.db, "supportRequests");
              _context2.next = 4;
              return regeneratorRuntime.awrap((0, _database.get)(requestsRef));

            case 4:
              snapshot = _context2.sent;

              if (snapshot.exists()) {
                requestsArray = [];
                snapshot.forEach(function (childSnapshot) {
                  var requestData = childSnapshot.val();
                  requestsArray.push({
                    id: childSnapshot.key,
                    title: requestData.title,
                    description: requestData.description,
                    userName: requestData.userName,
                    userId: requestData.userId,
                    date: requestData.date
                  });
                });
                requestsArray.sort(function (a, b) {
                  return new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date);
                });
                setRequests(requestsArray);
              } else {
                setRequests([]);
              }

              _context2.next = 12;
              break;

            case 8:
              _context2.prev = 8;
              _context2.t0 = _context2["catch"](0);
              console.error("Error getting support requests:", _context2.t0);
              throw _context2.t0;

            case 12:
            case "end":
              return _context2.stop();
          }
        }
      }, null, null, [[0, 8]]);
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
              return _context3.abrupt("return", true);

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
  }]);

  return SupportRequest;
}();

var _default = SupportRequest;
exports["default"] = _default;