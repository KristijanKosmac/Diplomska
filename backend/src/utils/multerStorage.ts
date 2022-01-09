import multer from "multer";
import fs from "fs";

var storage = multer.diskStorage({
    destination: function (req, files, cb) {
        const path = `src/documents/${req.params.id}`

        if(!fs.existsSync(path)) { 
            fs.mkdirSync(path)
        }

        cb(null, path);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

export const upload = multer({ storage });