const multer = require('multer');
const uuid = require('uuid').v4;

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
}

const fileUpload = multer({
  limits: 50000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/images')

    },
    fileName: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype]
      cd(null, uuid() + '.' + ext);
    }
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype]
    let error = isValid ? null : new Error('Invalid mime type!')
    cb(error, isValid)
  }
});

multer.exports = fileUpload;