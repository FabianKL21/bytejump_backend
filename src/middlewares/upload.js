const multer = require("multer");
const path = require("path");

const storageSingle = multer.diskStorage({
  destination: (req, file, callback) => {
    const folderName = "uploads";
    callback(null, folderName);
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});
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
