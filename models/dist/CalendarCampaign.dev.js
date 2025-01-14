"use strict";

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

var CalendarCampaign =
/*#__PURE__*/
function () {
  function CalendarCampaign() {
    _classCallCheck(this, CalendarCampaign);
  }

  _createClass(CalendarCampaign, null, [{
    key: "getCampaignsByMonth",
    value: function getCampaignsByMonth(month, year) {
      var campaignsRef, snapshot, campaigns;
      return regeneratorRuntime.async(function getCampaignsByMonth$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              campaignsRef = (0, _database.ref)(_config.db, "campaigns");
              _context.next = 4;
              return regeneratorRuntime.awrap((0, _database.get)(campaignsRef));

            case 4:
              snapshot = _context.sent;

              if (!snapshot.exists()) {
                _context.next = 9;
                break;
              }

              campaigns = [];
              snapshot.forEach(function (childSnapshot) {
                var campaign = childSnapshot.val();
                var campaignDate = new Date(campaign.date); // Filtra las campañas del mes y año especificados

                if (campaignDate.getMonth() === month && campaignDate.getFullYear() === year) {
                  campaigns.push(_objectSpread({
                    id: childSnapshot.key
                  }, campaign, {
                    date: campaignDate
                  }));
                }
              });
              return _context.abrupt("return", campaigns);

            case 9:
              return _context.abrupt("return", []);

            case 12:
              _context.prev = 12;
              _context.t0 = _context["catch"](0);
              console.error("Error getting campaigns:", _context.t0);
              throw _context.t0;

            case 16:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[0, 12]]);
    }
  }]);

  return CalendarCampaign;
}();

var _default = CalendarCampaign;
exports["default"] = _default;