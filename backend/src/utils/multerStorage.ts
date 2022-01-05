import multer from "multer";

var storage = multer.diskStorage({
    destination: function (req, files, cb) {
        cb(null, "src/documents");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

export const upload = multer({ storage });