"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _SupportRequest = _interopRequireDefault(require("@/models/SupportRequest"));

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
      var result;
      return regeneratorRuntime.async(function createRequest$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return regeneratorRuntime.awrap(_SupportRequest["default"].createRequest(requestData));

            case 3:
              result = _context.sent;
              return _context.abrupt("return", {
                ok: true,
                id: result.id
              });

            case 7:
              _context.prev = 7;
              _context.t0 = _context["catch"](0);
              console.error("Error creating support request:", _context.t0);
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
    key: "subscribeToRequests",
    value: function subscribeToRequests(setRequests) {
      try {
        _SupportRequest["default"].getRequests(setRequests);
      } catch (error) {
        console.error("Error getting support requests:", error);
        setRequests([]);
      }
    }
  }]);

  return SupportRequestController;
}();

var _default = SupportRequestController;
exports["default"] = _default;