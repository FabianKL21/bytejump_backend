const multer = require("multer");
const path = require("path");

const storageSingle = multer.memoryStorage();
const upload = multer({
  storage: storageSingle,
  fileFilter: (req, file, callback) => {
    const allowedFileType = /jpeg|jpg|png/;
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const cekExtName = allowedFileType.test(fileExtension);
    const cekMimeType = allowedFileType.test(file.mimetype);

    if (cekExtName && cekMimeType) {
      callback(null, true);
    } else {
      callback("Waduh error mime type", false);
    }
  },
});

module.exports = upload;
