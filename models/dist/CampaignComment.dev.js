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

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CampaignComment =
/*#__PURE__*/
function () {
  function CampaignComment() {
    _classCallCheck(this, CampaignComment);
  }

  _createClass(CampaignComment, null, [{
    key: "createComment",
    value: function createComment(campaignId, content, author, authorId) {
      var commentId, commentRef, commentData;
      return regeneratorRuntime.async(function createComment$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              commentId = Date.now().toString();
              commentRef = (0, _database.ref)(_config.db, "campaignComments/".concat(campaignId, "/").concat(commentId));
              commentData = {
                content: content,
                author: author,
                authorId: authorId,
                timestamp: new Date().toISOString(),
                createdAt: new Date().toLocaleString()
              };
              _context.next = 6;
              return regeneratorRuntime.awrap((0, _database.set)(commentRef, commentData));

            case 6:
              return _context.abrupt("return", {
                ok: true,
                commentId: commentId
              });

            case 9:
              _context.prev = 9;
              _context.t0 = _context["catch"](0);
              console.error("Error en CampaignComment model:", _context.t0);
              throw _context.t0;

            case 13:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[0, 9]]);
    }
  }, {
    key: "getComments",
    value: function getComments(campaignId, setComments) {
      var commentsRef, snapshot, commentsData, commentsArray;
      return regeneratorRuntime.async(function getComments$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              commentsRef = (0, _database.ref)(_config.db, "campaignComments/".concat(campaignId));
              _context2.next = 4;
              return regeneratorRuntime.awrap((0, _database.get)(commentsRef));

            case 4:
              snapshot = _context2.sent;

              if (snapshot.exists()) {
                commentsData = snapshot.val();
                commentsArray = Object.entries(commentsData).map(function (_ref) {
                  var _ref2 = _slicedToArray(_ref, 2),
                      id = _ref2[0],
                      comment = _ref2[1];

                  return _objectSpread({
                    id: id
                  }, comment);
                }).sort(function (a, b) {
                  return new Date(a.timestamp) - new Date(b.timestamp);
                });
                setComments(commentsArray);
              } else {
                setComments([]);
              }

              _context2.next = 12;
              break;

            case 8:
              _context2.prev = 8;
              _context2.t0 = _context2["catch"](0);
              console.error("Error obteniendo comentarios:", _context2.t0);
              throw _context2.t0;

            case 12:
            case "end":
              return _context2.stop();
          }
        }
      }, null, null, [[0, 8]]);
    }
  }, {
    key: "deleteComment",
    value: function deleteComment(campaignId, commentId, userId) {
      var commentRef, snapshot, commentData;
      return regeneratorRuntime.async(function deleteComment$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              commentRef = (0, _database.ref)(_config.db, "campaignComments/".concat(campaignId, "/").concat(commentId));
              _context3.next = 4;
              return regeneratorRuntime.awrap((0, _database.get)(commentRef));

            case 4:
              snapshot = _context3.sent;

              if (!snapshot.exists()) {
                _context3.next = 14;
                break;
              }

              commentData = snapshot.val();

              if (!(commentData.authorId === userId)) {
                _context3.next = 13;
                break;
              }

              _context3.next = 10;
              return regeneratorRuntime.awrap((0, _database.remove)(commentRef));

            case 10:
              return _context3.abrupt("return", {
                ok: true
              });

            case 13:
              throw new Error("No tienes permiso para eliminar este comentario");

            case 14:
              throw new Error("Comentario no encontrado");

            case 17:
              _context3.prev = 17;
              _context3.t0 = _context3["catch"](0);
              console.error("Error eliminando comentario:", _context3.t0);
              throw _context3.t0;

            case 21:
            case "end":
              return _context3.stop();
          }
        }
      }, null, null, [[0, 17]]);
    }
  }]);

  return CampaignComment;
}();

var _default = CampaignComment;
exports["default"] = _default;