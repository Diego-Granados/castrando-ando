"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.POST = POST;

var _server = require("next/server");

var _config = require("@/lib/firebase/config");

var _storage = require("firebase/storage");

var _firestore = require("firebase/firestore");

function POST(request) {
  var formData, title, content, author, userId, image, imageUrl, bytes, blob, fileName, storageRef, uploadResult, blogData, docRef;
  return regeneratorRuntime.async(function POST$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(request.formData());

        case 3:
          formData = _context.sent;
          // Obtener los datos del formulario
          title = formData.get('title');
          content = formData.get('content');
          author = formData.get('author');
          userId = formData.get('userId');
          image = formData.get('image');
          imageUrl = null; // Si hay una imagen, subirla a Firebase Storage

          if (!image) {
            _context.next = 32;
            break;
          }

          _context.prev = 11;
          _context.next = 14;
          return regeneratorRuntime.awrap(image.arrayBuffer());

        case 14:
          bytes = _context.sent;
          blob = new Blob([bytes], {
            type: image.type
          }); // Generar un nombre único para el archivo

          fileName = "".concat(Date.now(), "-").concat(image.name.replace(/[^a-zA-Z0-9.]/g, '_'));
          storageRef = (0, _storage.ref)(_config.storage, "blog-images/".concat(fileName)); // Subir el archivo

          _context.next = 20;
          return regeneratorRuntime.awrap((0, _storage.uploadBytes)(storageRef, blob));

        case 20:
          uploadResult = _context.sent;
          console.log('Archivo subido exitosamente:', uploadResult); // Obtener la URL

          _context.next = 24;
          return regeneratorRuntime.awrap((0, _storage.getDownloadURL)(uploadResult.ref));

        case 24:
          imageUrl = _context.sent;
          console.log('URL de imagen obtenida:', imageUrl);
          _context.next = 32;
          break;

        case 28:
          _context.prev = 28;
          _context.t0 = _context["catch"](11);
          console.error('Error específico de Storage:', _context.t0);
          throw new Error("Error al subir la imagen: ".concat(_context.t0.message));

        case 32:
          // Crear el documento en Firestore
          blogData = {
            title: title,
            content: content,
            author: author,
            userId: userId,
            imageUrl: imageUrl,
            createdAt: (0, _firestore.serverTimestamp)(),
            date: new Date().toLocaleDateString()
          };
          _context.next = 35;
          return regeneratorRuntime.awrap((0, _firestore.addDoc)((0, _firestore.collection)(_config.db, 'blogs'), blogData));

        case 35:
          docRef = _context.sent;
          return _context.abrupt("return", _server.NextResponse.json({
            ok: true,
            id: docRef.id,
            message: 'Blog creado exitosamente'
          }));

        case 39:
          _context.prev = 39;
          _context.t1 = _context["catch"](0);
          console.error('Error detallado en la API de blogs:', _context.t1);
          return _context.abrupt("return", _server.NextResponse.json({
            ok: false,
            error: _context.t1.message || 'Error al crear el blog',
            details: process.env.NODE_ENV === 'development' ? _context.t1.toString() : undefined
          }, {
            status: 500
          }));

        case 43:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 39], [11, 28]]);
}