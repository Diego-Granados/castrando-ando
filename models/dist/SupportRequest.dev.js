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
      var requestsRef, newRequestRef, newRequest;
      return regeneratorRuntime.async(function createRequest$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              requestsRef = (0, _database.ref)(_config.db, "supportRequests");
              newRequestRef = (0, _database.push)(requestsRef);
              newRequest = {
                title: requestData.title || "",
                description: requestData.description || "",
                imageUrl: requestData.imageUrl || "",
                status: requestData.status || "Pendiente",
                date: requestData.date || new Date().toLocaleDateString(),
                createdAt: new Date().toISOString(),
                userId: requestData.userId || "admin",
                userName: requestData.userName || "Administrador"
              };
              _context.next = 6;
              return regeneratorRuntime.awrap((0, _database.set)(newRequestRef, newRequest));

            case 6:
              return _context.abrupt("return", {
                id: newRequestRef.key
              });

            case 9:
              _context.prev = 9;
              _context.t0 = _context["catch"](0);
              console.error("Error creating request:", _context.t0);
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
    value: function getAll() {
      var requestsRef, snapshot, requestsArray;
      return regeneratorRuntime.async(function getAll$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              requestsRef = (0, _database.ref)(_config.db, "supportRequests");
              _context2.next = 4;
              return regeneratorRuntime.awrap((0, _database.get)(requestsRef));

            case 4:
              snapshot = _context2.sent;

              if (!snapshot.exists()) {
                _context2.next = 10;
                break;
              }

              requestsArray = [];
              snapshot.forEach(function (childSnapshot) {
                var requestData = childSnapshot.val();
                requestsArray.push(_objectSpread({
                  id: childSnapshot.key
                }, requestData, {
                  imageUrl: requestData.imageUrl || "",
                  status: requestData.status || "Pendiente",
                  date: requestData.date || new Date(requestData.createdAt || Date.now()).toLocaleDateString()
                }));
              }); // Ordenar por fecha de creación, más reciente primero

              requestsArray.sort(function (a, b) {
                return new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date);
              });
              return _context2.abrupt("return", requestsArray);

            case 10:
              return _context2.abrupt("return", []);

            case 13:
              _context2.prev = 13;
              _context2.t0 = _context2["catch"](0);
              console.error("Error getting requests:", _context2.t0);
              throw _context2.t0;

            case 17:
            case "end":
              return _context2.stop();
          }
        }
      }, null, null, [[0, 13]]);
    }
  }, {
    key: "getById",
    value: function getById(requestId) {
      var requestRef, snapshot, data;
      return regeneratorRuntime.async(function getById$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              requestRef = (0, _database.ref)(_config.db, "supportRequests/".concat(requestId));
              _context3.next = 4;
              return regeneratorRuntime.awrap((0, _database.get)(requestRef));

            case 4:
              snapshot = _context3.sent;

              if (!snapshot.exists()) {
                _context3.next = 8;
                break;
              }

              data = snapshot.val();
              return _context3.abrupt("return", _objectSpread({
                id: requestId
              }, data, {
                imageUrl: data.imageUrl || "",
                status: data.status || "Pendiente",
                date: data.date || new Date(data.createdAt || Date.now()).toLocaleDateString()
              }));

            case 8:
              return _context3.abrupt("return", null);

            case 11:
              _context3.prev = 11;
              _context3.t0 = _context3["catch"](0);
              console.error("Error getting request:", _context3.t0);
              throw _context3.t0;

            case 15:
            case "end":
              return _context3.stop();
          }
        }
      }, null, null, [[0, 11]]);
    }
  }, {
    key: "delete",
    value: function _delete(requestId) {
      var requestRef, snapshot, requestData;
      return regeneratorRuntime.async(function _delete$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              if (requestId) {
                _context4.next = 2;
                break;
              }

              throw new Error("ID de solicitud requerido");

            case 2:
              _context4.prev = 2;
              // Obtener referencia a la solicitud
              requestRef = (0, _database.ref)(_config.db, "supportRequests/".concat(requestId)); // Verificar si existe la solicitud

              _context4.next = 6;
              return regeneratorRuntime.awrap((0, _database.get)(requestRef));

            case 6:
              snapshot = _context4.sent;

              if (snapshot.exists()) {
                _context4.next = 9;
                break;
              }

              throw new Error("La solicitud no existe");

            case 9:
              // Obtener datos de la solicitud para la imagen
              requestData = snapshot.val(); // Si hay una imagen, eliminarla de Cloudinary

              if (!requestData.imageUrl) {
                _context4.next = 19;
                break;
              }

              _context4.prev = 11;
              _context4.next = 14;
              return regeneratorRuntime.awrap(fetch('/api/storage/delete', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  urls: [requestData.imageUrl]
                })
              }));

            case 14:
              _context4.next = 19;
              break;

            case 16:
              _context4.prev = 16;
              _context4.t0 = _context4["catch"](11);
              console.error("Error al eliminar imagen:", _context4.t0); // Continuamos con la eliminación aunque falle la imagen

            case 19:
              _context4.next = 21;
              return regeneratorRuntime.awrap((0, _database.remove)(requestRef));

            case 21:
              return _context4.abrupt("return", true);

            case 24:
              _context4.prev = 24;
              _context4.t1 = _context4["catch"](2);
              console.error("Error en delete:", _context4.t1);
              throw _context4.t1;

            case 28:
            case "end":
              return _context4.stop();
          }
        }
      }, null, null, [[2, 24], [11, 16]]);
    }
  }, {
    key: "updateStatus",
    value: function updateStatus(requestId, newStatus) {
      var requestRef, snapshot, currentData;
      return regeneratorRuntime.async(function updateStatus$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              requestRef = (0, _database.ref)(_config.db, "supportRequests/".concat(requestId));
              _context5.next = 4;
              return regeneratorRuntime.awrap((0, _database.get)(requestRef));

            case 4:
              snapshot = _context5.sent;

              if (!snapshot.exists()) {
                _context5.next = 11;
                break;
              }

              currentData = snapshot.val();
              _context5.next = 9;
              return regeneratorRuntime.awrap((0, _database.set)(requestRef, _objectSpread({}, currentData, {
                status: newStatus,
                updatedAt: new Date().toISOString()
              })));

            case 9:
              _context5.next = 12;
              break;

            case 11:
              throw new Error("Solicitud no encontrada");

            case 12:
              _context5.next = 18;
              break;

            case 14:
              _context5.prev = 14;
              _context5.t0 = _context5["catch"](0);
              console.error("Error updating request status:", _context5.t0);
              throw _context5.t0;

            case 18:
            case "end":
              return _context5.stop();
          }
        }
      }, null, null, [[0, 14]]);
    }
  }, {
    key: "getRequests",
    value: function getRequests(callback) {
      var requestsRef, unsubscribe;
      return regeneratorRuntime.async(function getRequests$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.prev = 0;
              requestsRef = (0, _database.ref)(_config.db, "supportRequests");
              unsubscribe = onValue(requestsRef, function (snapshot) {
                if (snapshot.exists()) {
                  var requestsData = snapshot.val();
                  callback(requestsData);
                } else {
                  callback(null);
                }
              });
              return _context6.abrupt("return", unsubscribe);

            case 6:
              _context6.prev = 6;
              _context6.t0 = _context6["catch"](0);
              console.error("Error getting requests:", _context6.t0);
              throw _context6.t0;

            case 10:
            case "end":
              return _context6.stop();
          }
        }
      }, null, null, [[0, 6]]);
    }
  }, {
    key: "getUserData",
    value: function getUserData(uid) {
      var uidMapRef, uidMapSnapshot, cedula, userRef, userSnapshot;
      return regeneratorRuntime.async(function getUserData$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.prev = 0;
              // Obtener el ID de usuario (cédula) usando el UID
              uidMapRef = (0, _database.ref)(_config.db, "uidToCedula/".concat(uid));
              _context7.next = 4;
              return regeneratorRuntime.awrap((0, _database.get)(uidMapRef));

            case 4:
              uidMapSnapshot = _context7.sent;

              if (uidMapSnapshot.exists()) {
                _context7.next = 7;
                break;
              }

              throw new Error("No se encontraron datos del usuario");

            case 7:
              cedula = uidMapSnapshot.val();
              userRef = (0, _database.ref)(_config.db, "users/".concat(cedula));
              _context7.next = 11;
              return regeneratorRuntime.awrap((0, _database.get)(userRef));

            case 11:
              userSnapshot = _context7.sent;

              if (userSnapshot.exists()) {
                _context7.next = 14;
                break;
              }

              throw new Error("No se encontraron datos del usuario");

            case 14:
              return _context7.abrupt("return", userSnapshot.val());

            case 17:
              _context7.prev = 17;
              _context7.t0 = _context7["catch"](0);
              console.error("Error getting user data:", _context7.t0);
              throw _context7.t0;

            case 21:
            case "end":
              return _context7.stop();
          }
        }
      }, null, null, [[0, 17]]);
    }
  }]);

  return SupportRequest;
}();

var _default = SupportRequest;
exports["default"] = _default;