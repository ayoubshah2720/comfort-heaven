const multer = require('multer');

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter(req, file, cb) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      const err = new Error('Invalid file type. Only jpg, jpeg, png, and webp are allowed');
      err.status_code = 400;
      err.code = 'LIMIT_FILE_TYPE';
      return cb(err);
    }

    return cb(null, true);
  }
});

module.exports = upload;
