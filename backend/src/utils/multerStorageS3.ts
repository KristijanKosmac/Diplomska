import multer from "multer";
import multerS3 from "multer-s3"
import { s3 } from "../s3"
import config from "../config";


export const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: config.s3BucketName,
        acl: 'public-read',
        key: function (req: any, file, cb) {
            cb(null, `${req.body.patientId}/${req.body.examinationId}/${Date.now()}-${file.originalname}`);
        }
    })
});