"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _CalendarCampaign = _interopRequireDefault(require("@/models/CalendarCampaign"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CalendarController =
/*#__PURE__*/
function () {
  function CalendarController() {
    _classCallCheck(this, CalendarController);
  }

  _createClass(CalendarController, null, [{
    key: "getCampaignsByMonth",
    value: function getCampaignsByMonth(month, year) {
      var campaigns;
      return regeneratorRuntime.async(function getCampaignsByMonth$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return regeneratorRuntime.awrap(_CalendarCampaign["default"].getCampaignsByMonth(month, year));

            case 3:
              campaigns = _context.sent;
              return _context.abrupt("return", {
                ok: true,
                campaigns: campaigns
              });

            case 7:
              _context.prev = 7;
              _context.t0 = _context["catch"](0);
              console.error("Error fetching campaigns:", _context.t0);
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
  }]);

  return CalendarController;
}();

var _default = CalendarController;
exports["default"] = _default;