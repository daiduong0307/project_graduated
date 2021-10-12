var multer = require("multer");
const util = require("util");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
  "application/pdf": "pdf"
};

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/avatar");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.split(" ").join();
    const extension = MIME_TYPES[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + extension);
  },
});

var storageFile = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/file");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.split(" ").join();
    const extension = MIME_TYPES[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + extension);
  },
});

var upload = multer({ storage: storage }).single("avatar");
var uploadFile = multer({ storage: storageFile }).single("fileUpload");

var multerInstance = util.promisify(upload);
var multerInstanceFile = util.promisify(uploadFile);

module.exports = { multerInstance, multerInstanceFile };
