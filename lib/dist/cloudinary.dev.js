"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uploadToCloudinary = void 0;

var uploadToCloudinary = function uploadToCloudinary(file) {
  var formData, response, data;
  return regeneratorRuntime.async(function uploadToCloudinary$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
          _context.next = 6;
          return regeneratorRuntime.awrap(fetch("https://api.cloudinary.com/v1_1/".concat(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, "/image/upload"), {
            method: 'POST',
            body: formData
          }));

        case 6:
          response = _context.sent;
          _context.next = 9;
          return regeneratorRuntime.awrap(response.json());

        case 9:
          data = _context.sent;

          if (!data.secure_url) {
            _context.next = 12;
            break;
          }

          return _context.abrupt("return", data.secure_url);

        case 12:
          throw new Error('Error al subir la imagen');

        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](0);
          console.error('Error uploading to Cloudinary:', _context.t0);
          throw _context.t0;

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

exports.uploadToCloudinary = uploadToCloudinary;