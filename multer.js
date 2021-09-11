const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: function (req, file, cb) {
    console.log("gfdhaskj");
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
