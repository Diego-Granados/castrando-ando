"use strict";
"use client";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Auth = _interopRequireDefault(require("@/models/Auth"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AuthController =
/*#__PURE__*/
function () {
  function AuthController() {
    _classCallCheck(this, AuthController);
  }

  _createClass(AuthController, null, [{
    key: "adminLogin",
    value: function adminLogin(email, password, onSuccess, onError) {
      var user, role;
      return regeneratorRuntime.async(function adminLogin$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return regeneratorRuntime.awrap(_Auth["default"].login(email, password));

            case 3:
              user = _context.sent;
              _context.next = 6;
              return regeneratorRuntime.awrap(_Auth["default"].getUserRole(user.uid));

            case 6:
              role = _context.sent;

              if (!(role !== "Admin")) {
                _context.next = 9;
                break;
              }

              throw new Error("User is not an admin");

            case 9:
              localStorage.setItem("userRole", role);
              onSuccess(user);
              _context.next = 16;
              break;

            case 13:
              _context.prev = 13;
              _context.t0 = _context["catch"](0);
              onError(_context.t0);

            case 16:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[0, 13]]);
    }
  }, {
    key: "userLogin",
    value: function userLogin(email, password, onSuccess, onError) {
      var user, role;
      return regeneratorRuntime.async(function userLogin$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return regeneratorRuntime.awrap(_Auth["default"].login(email, password));

            case 3:
              user = _context2.sent;
              _context2.next = 6;
              return regeneratorRuntime.awrap(_Auth["default"].getUserRole(user.uid));

            case 6:
              role = _context2.sent;

              if (!(role !== "User")) {
                _context2.next = 9;
                break;
              }

              throw new Error("User is not an user.");

            case 9:
              localStorage.setItem("userRole", role);
              onSuccess(user);
              _context2.next = 16;
              break;

            case 13:
              _context2.prev = 13;
              _context2.t0 = _context2["catch"](0);
              onError(_context2.t0);

            case 16:
            case "end":
              return _context2.stop();
          }
        }
      }, null, null, [[0, 13]]);
    }
  }, {
    key: "getCurrentUser",
    value: function getCurrentUser() {
      var user, role;
      return regeneratorRuntime.async(function getCurrentUser$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return regeneratorRuntime.awrap(_Auth["default"].getCurrentUser());

            case 2:
              user = _context3.sent;
              role = localStorage.getItem("userRole");

              if (role) {
                _context3.next = 8;
                break;
              }

              _context3.next = 7;
              return regeneratorRuntime.awrap(_Auth["default"].getUserRole(user.uid));

            case 7:
              role = _context3.sent;

            case 8:
              return _context3.abrupt("return", {
                user: user,
                role: role
              });

            case 9:
            case "end":
              return _context3.stop();
          }
        }
      });
    }
  }, {
    key: "getUserId",
    value: function getUserId() {
      var user;
      return regeneratorRuntime.async(function getUserId$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return regeneratorRuntime.awrap(_Auth["default"].getCurrentUser());

            case 2:
              user = _context4.sent;
              return _context4.abrupt("return", user.uid);

            case 4:
            case "end":
              return _context4.stop();
          }
        }
      });
    }
  }, {
    key: "getCurrentRole",
    value: function getCurrentRole(user) {
      var role;
      return regeneratorRuntime.async(function getCurrentRole$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              role = localStorage.getItem("userRole");

              if (role) {
                _context5.next = 5;
                break;
              }

              _context5.next = 4;
              return regeneratorRuntime.awrap(_Auth["default"].getUserRole(user.uid));

            case 4:
              role = _context5.sent;

            case 5:
              return _context5.abrupt("return", role);

            case 6:
            case "end":
              return _context5.stop();
          }
        }
      });
    }
  }, {
    key: "subscribeToAuthState",
    value: function subscribeToAuthState(callback) {
      var unsubscribe;
      return regeneratorRuntime.async(function subscribeToAuthState$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return regeneratorRuntime.awrap(_Auth["default"].subscribeToAuthState(callback));

            case 2:
              unsubscribe = _context6.sent;
              return _context6.abrupt("return", unsubscribe);

            case 4:
            case "end":
              return _context6.stop();
          }
        }
      });
    }
  }, {
    key: "signout",
    value: function signout() {
      return regeneratorRuntime.async(function signout$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return regeneratorRuntime.awrap(_Auth["default"].signout());

            case 2:
              localStorage.removeItem("userRole");

            case 3:
            case "end":
              return _context7.stop();
          }
        }
      });
    }
  }, {
    key: "getUser",
    value: function getUser(cedula, setUser) {
      return regeneratorRuntime.async(function getUser$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return regeneratorRuntime.awrap(_Auth["default"].getUser(cedula, setUser));

            case 2:
            case "end":
              return _context8.stop();
          }
        }
      });
    }
  }, {
    key: "resetPassword",
    value: function resetPassword(email) {
      return regeneratorRuntime.async(function resetPassword$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return regeneratorRuntime.awrap(_Auth["default"].resetPassword(email));

            case 2:
            case "end":
              return _context9.stop();
          }
        }
      });
    }
  }, {
    key: "register",
    value: function register(email, password, name, phone, cedula) {
      var profileUrl,
          errorMessage,
          _args10 = arguments;
      return regeneratorRuntime.async(function register$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              profileUrl = _args10.length > 5 && _args10[5] !== undefined ? _args10[5] : null;
              _context10.prev = 1;

              if (!(!email || !password || !name || !phone || !cedula)) {
                _context10.next = 4;
                break;
              }

              throw new Error("Todos los campos son obligatorios");

            case 4:
              if (!(password.length < 6)) {
                _context10.next = 6;
                break;
              }

              throw new Error("La contraseña debe tener al menos 6 caracteres");

            case 6:
              if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
                _context10.next = 8;
                break;
              }

              throw new Error("El correo electrónico no es válido");

            case 8:
              if (/^\d{8,}$/.test(phone)) {
                _context10.next = 10;
                break;
              }

              throw new Error("El número de teléfono debe tener al menos 8 dígitos");

            case 10:
              _context10.next = 12;
              return regeneratorRuntime.awrap(_Auth["default"].register(email, password, name, phone, cedula, profileUrl));

            case 12:
              return _context10.abrupt("return", {
                ok: true
              });

            case 15:
              _context10.prev = 15;
              _context10.t0 = _context10["catch"](1);
              // Personalizar mensajes de error de Firebase
              errorMessage = "Error al registrar el usuario";
              _context10.t1 = _context10.t0.code;
              _context10.next = _context10.t1 === "auth/email-already-in-use" ? 21 : _context10.t1 === "auth/invalid-email" ? 23 : _context10.t1 === "auth/operation-not-allowed" ? 25 : _context10.t1 === "auth/weak-password" ? 27 : _context10.t1 === "auth/network-request-failed" ? 29 : _context10.t1 === "auth/too-many-requests" ? 31 : 33;
              break;

            case 21:
              errorMessage = "Ya existe una cuenta con este correo electrónico";
              return _context10.abrupt("break", 34);

            case 23:
              errorMessage = "El formato del correo electrónico no es válido";
              return _context10.abrupt("break", 34);

            case 25:
              errorMessage = "El registro de usuarios está deshabilitado temporalmente";
              return _context10.abrupt("break", 34);

            case 27:
              errorMessage = "La contraseña es demasiado débil. Debe tener al menos 6 caracteres";
              return _context10.abrupt("break", 34);

            case 29:
              errorMessage = "Error de conexión. Por favor, verifica tu conexión a internet";
              return _context10.abrupt("break", 34);

            case 31:
              errorMessage = "Demasiados intentos fallidos. Por favor, intenta más tarde";
              return _context10.abrupt("break", 34);

            case 33:
              errorMessage = _context10.t0.message;

            case 34:
              return _context10.abrupt("return", {
                ok: false,
                error: errorMessage
              });

            case 35:
            case "end":
              return _context10.stop();
          }
        }
      }, null, null, [[1, 15]]);
    }
  }, {
    key: "getUserData",
    value: function getUserData(uid) {
      var userData;
      return regeneratorRuntime.async(function getUserData$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _context11.prev = 0;
              _context11.next = 3;
              return regeneratorRuntime.awrap(_Auth["default"].getUserData(uid));

            case 3:
              userData = _context11.sent;
              return _context11.abrupt("return", userData);

            case 7:
              _context11.prev = 7;
              _context11.t0 = _context11["catch"](0);
              throw _context11.t0;

            case 10:
            case "end":
              return _context11.stop();
          }
        }
      }, null, null, [[0, 7]]);
    }
  }, {
    key: "updateUserProfile",
    value: function updateUserProfile(updateData) {
      var user;
      return regeneratorRuntime.async(function updateUserProfile$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _context12.prev = 0;
              _context12.next = 3;
              return regeneratorRuntime.awrap(_Auth["default"].getCurrentUser());

            case 3:
              user = _context12.sent;

              if (!(!updateData.name || !updateData.phone)) {
                _context12.next = 6;
                break;
              }

              throw new Error("El nombre y teléfono son obligatorios");

            case 6:
              if (/^\d{8,}$/.test(updateData.phone)) {
                _context12.next = 8;
                break;
              }

              throw new Error("El número de teléfono debe tener al menos 8 dígitos");

            case 8:
              _context12.next = 10;
              return regeneratorRuntime.awrap(_Auth["default"].updateUserProfile(user.uid, updateData));

            case 10:
              return _context12.abrupt("return", {
                ok: true
              });

            case 13:
              _context12.prev = 13;
              _context12.t0 = _context12["catch"](0);
              return _context12.abrupt("return", {
                ok: false,
                error: _context12.t0.message || "Error al actualizar el perfil"
              });

            case 16:
            case "end":
              return _context12.stop();
          }
        }
      }, null, null, [[0, 13]]);
    }
  }, {
    key: "deleteAccount",
    value: function deleteAccount() {
      var user, errorMessage;
      return regeneratorRuntime.async(function deleteAccount$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              _context13.prev = 0;
              _context13.next = 3;
              return regeneratorRuntime.awrap(_Auth["default"].getCurrentUser());

            case 3:
              user = _context13.sent;
              _context13.next = 6;
              return regeneratorRuntime.awrap(_Auth["default"].deleteAccount(user.uid));

            case 6:
              localStorage.removeItem("userRole");
              _context13.next = 9;
              return regeneratorRuntime.awrap(AuthController.signout());

            case 9:
              return _context13.abrupt("return", {
                ok: true
              });

            case 12:
              _context13.prev = 12;
              _context13.t0 = _context13["catch"](0);
              errorMessage = "Error al eliminar la cuenta";
              _context13.t1 = _context13.t0.code;
              _context13.next = _context13.t1 === "auth/requires-recent-login" ? 18 : 20;
              break;

            case 18:
              errorMessage = "Por seguridad, debe volver a iniciar sesión antes de eliminar su cuenta";
              return _context13.abrupt("break", 21);

            case 20:
              errorMessage = _context13.t0.message;

            case 21:
              return _context13.abrupt("return", {
                ok: false,
                error: errorMessage
              });

            case 22:
            case "end":
              return _context13.stop();
          }
        }
      }, null, null, [[0, 12]]);
    }
  }]);

  return AuthController;
}();

var _default = AuthController;
exports["default"] = _default;