"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.POST = POST;

var _cloudinary = require("cloudinary");

_cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

function POST(request) {
  var _ref, publicIds, deletePromises;

  return regeneratorRuntime.async(function POST$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(request.json());

        case 3:
          _ref = _context.sent;
          publicIds = _ref.publicIds;

          if (Array.isArray(publicIds)) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", new Response(JSON.stringify({
            error: 'publicIds debe ser un array'
          }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json'
            }
          }));

        case 7:
          deletePromises = publicIds.map(function (publicId) {
            return _cloudinary.v2.uploader.destroy(publicId);
          });
          _context.next = 10;
          return regeneratorRuntime.awrap(Promise.all(deletePromises));

        case 10:
          return _context.abrupt("return", new Response(JSON.stringify({
            ok: true
          }), {
            status: 200,
            headers: {
              'Content-Type': 'application/json'
            }
          }));

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](0);
          console.error('Error deleting from Cloudinary:', _context.t0);
          return _context.abrupt("return", new Response(JSON.stringify({
            error: 'Error al eliminar las imágenes'
          }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json'
            }
          }));

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 13]]);
}