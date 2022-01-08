require("./database/mongoose")
import bodyParser from "body-parser";
import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";


const app = express();
const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


const routesFolder = path.join(__dirname, "/routes");
const fileExtension = /\.js$/;
fs.readdirSync(routesFolder)
    .filter(fileName => {
        return fileName[0] !== "." && fileExtension.test(fileName);
    })
    .forEach(fileName => {
        const routePath = path.join(routesFolder, fileName);
        const routeModule = require(routePath);
        const usepath = path.normalize(`/${fileName.replace(fileExtension, "")}`);
        // tslint:disable-next-line: no-console
        console.info(`Loaded ${usepath}`);
        if (!routeModule.route) {
            // tslint:disable-next-line: no-console
            console.error(`Route module ${fileName} does not export itself properly`);
            throw new Error(`Unable to set up route ${fileName}. Check the route module for unexported route variables`);
        }
        app.use(usepath, routeModule.route);
    });

app.use(cors())
app.use("/", router);

// Export your express server so you can import it in the lambda function.
export default app;
