"use strict";
"use client";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _SupportRequest = _interopRequireDefault(require("@/models/SupportRequest"));

var _AuthController = _interopRequireDefault(require("@/controllers/AuthController"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SupportRequestController =
/*#__PURE__*/
function () {
  function SupportRequestController() {
    _classCallCheck(this, SupportRequestController);
  }

  _createClass(SupportRequestController, null, [{
    key: "createRequest",
    value: function createRequest(requestData) {
      var _ref, user, role, imageUrl, formData, response, data, _result, userData, result;

      return regeneratorRuntime.async(function createRequest$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return regeneratorRuntime.awrap(_AuthController["default"].getCurrentUser());

            case 3:
              _ref = _context.sent;
              user = _ref.user;
              role = _ref.role;

              if (user) {
                _context.next = 8;
                break;
              }

              return _context.abrupt("return", {
                ok: false,
                error: "Usuario no autenticado"
              });

            case 8:
              // Subir imagen a Cloudinary si existe
              imageUrl = "";

              if (!requestData.selectedImage) {
                _context.next = 22;
                break;
              }

              formData = new FormData();
              formData.append("file", requestData.selectedImage);
              formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
              _context.next = 15;
              return regeneratorRuntime.awrap(fetch("https://api.cloudinary.com/v1_1/".concat(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, "/image/upload"), {
                method: "POST",
                body: formData
              }));

            case 15:
              response = _context.sent;
              _context.next = 18;
              return regeneratorRuntime.awrap(response.json());

            case 18:
              data = _context.sent;

              if (data.secure_url) {
                _context.next = 21;
                break;
              }

              throw new Error("Error al subir la imagen");

            case 21:
              imageUrl = data.secure_url;

            case 22:
              if (!(role === "Admin")) {
                _context.next = 27;
                break;
              }

              _context.next = 25;
              return regeneratorRuntime.awrap(_SupportRequest["default"].createRequest({
                title: requestData.title,
                description: requestData.description,
                imageUrl: imageUrl,
                userId: "admin",
                userName: "Administrador",
                status: "Pendiente",
                date: new Date().toLocaleDateString()
              }));

            case 25:
              _result = _context.sent;
              return _context.abrupt("return", {
                ok: true,
                id: _result.id
              });

            case 27:
              _context.next = 29;
              return regeneratorRuntime.awrap(_AuthController["default"].getUserData(user.uid));

            case 29:
              userData = _context.sent;

              if (userData) {
                _context.next = 32;
                break;
              }

              return _context.abrupt("return", {
                ok: false,
                error: "No se encontraron datos del usuario"
              });

            case 32:
              _context.next = 34;
              return regeneratorRuntime.awrap(_SupportRequest["default"].createRequest({
                title: requestData.title,
                description: requestData.description,
                imageUrl: imageUrl,
                userId: user.uid,
                userName: userData.name || "Usuario",
                status: "Pendiente",
                date: new Date().toLocaleDateString()
              }));

            case 34:
              result = _context.sent;
              return _context.abrupt("return", {
                ok: true,
                id: result.id
              });

            case 38:
              _context.prev = 38;
              _context.t0 = _context["catch"](0);
              console.error("Error creating request:", _context.t0);
              return _context.abrupt("return", {
                ok: false,
                error: _context.t0.message
              });

            case 42:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[0, 38]]);
    }
  }, {
    key: "getRequests",
    value: function getRequests() {
      var requests;
      return regeneratorRuntime.async(function getRequests$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return regeneratorRuntime.awrap(_SupportRequest["default"].getAll());

            case 3:
              requests = _context2.sent;
              return _context2.abrupt("return", {
                ok: true,
                requests: requests
              });

            case 7:
              _context2.prev = 7;
              _context2.t0 = _context2["catch"](0);
              console.error("Error getting requests:", _context2.t0);
              return _context2.abrupt("return", {
                ok: false,
                error: _context2.t0.message
              });

            case 11:
            case "end":
              return _context2.stop();
          }
        }
      }, null, null, [[0, 7]]);
    }
  }, {
    key: "updateRequestStatus",
    value: function updateRequestStatus(requestId, newStatus) {
      return regeneratorRuntime.async(function updateRequestStatus$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _context3.next = 3;
              return regeneratorRuntime.awrap(_SupportRequest["default"].updateStatus(requestId, newStatus));

            case 3:
              return _context3.abrupt("return", {
                ok: true
              });

            case 6:
              _context3.prev = 6;
              _context3.t0 = _context3["catch"](0);
              console.error("Error updating request status:", _context3.t0);
              return _context3.abrupt("return", {
                ok: false,
                error: _context3.t0.message
              });

            case 10:
            case "end":
              return _context3.stop();
          }
        }
      }, null, null, [[0, 6]]);
    }
  }, {
    key: "deleteRequest",
    value: function deleteRequest(requestId) {
      var result;
      return regeneratorRuntime.async(function deleteRequest$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;

              if (requestId) {
                _context4.next = 3;
                break;
              }

              throw new Error("ID de solicitud no proporcionado");

            case 3:
              _context4.next = 5;
              return regeneratorRuntime.awrap(_SupportRequest["default"]["delete"](requestId));

            case 5:
              result = _context4.sent;

              if (!result) {
                _context4.next = 10;
                break;
              }

              return _context4.abrupt("return", {
                ok: true
              });

            case 10:
              return _context4.abrupt("return", {
                ok: false,
                error: "No se pudo eliminar la solicitud"
              });

            case 11:
              _context4.next = 17;
              break;

            case 13:
              _context4.prev = 13;
              _context4.t0 = _context4["catch"](0);
              console.error("Error deleting request:", _context4.t0);
              return _context4.abrupt("return", {
                ok: false,
                error: _context4.t0.message
              });

            case 17:
            case "end":
              return _context4.stop();
          }
        }
      }, null, null, [[0, 13]]);
    }
  }]);

  return SupportRequestController;
}();

var _default = SupportRequestController;
exports["default"] = _default;