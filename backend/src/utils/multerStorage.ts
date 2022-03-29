import multer from "multer";
import fs from "fs";

var storage = multer.diskStorage({
    destination: function (req, files, cb) {
        let path = `src/documents/${req.params.id}/`
        
        if(req.params.folderName) {
            path = `src/documents/${req.params.id}/${req.params.folderName}/`
        }
        
        if(!fs.existsSync(path)) { 
            fs.mkdirSync(path)
        }

        cb(null, path);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

export const upload = multer({ storage });