import app from "./app";
import { connectDatabase } from "./database/connection";
// import { createConnection } from "typeorm";
// import * as entities from "./database/entities/index";
// import * as AWS from "aws-sdk"
// import config from "./config";

const DEFAULT_PORT = 80;

(async () => {
    await connectDatabase();
})();
// (async () => {
//     await connectDatabase();
// })();
// (async () => {
//     console.log("Async connection to database")
//     await connectDatabase();

    // var signer = new AWS.RDS.Signer({
    //     region: process.env.AWS_REGION, // example: us-east-2
    //     hostname: config.database.host,
    //     port: config.database.port,
    //     username: config.database.username
    // });

    // let token = signer.getAuthToken({
    //     username: config.database.username
    // });

    // try {
    //     await createConnection({
    //         type: "mysql",
    //         database: config.database.name,
    //         username: config.database.username,
    //         password: token,
    //         host: config.database.host,
    //         port: 3306,
    //         synchronize: true,
    //         entities: Object.values(entities),
    //         extra: {
    //             authPlugins: {
    //                 mysql_clear_password: () => (data: any, cb: any) => {
    //                     if (data.pluginName === 'mysql_clear_password') {
    //                         // See https://dev.mysql.com/doc/internals/en/clear-text-authentication.html
    //                         console.log("pluginName: " + data.pluginName);
    //                         let password = token + '\0';
    //                         cb(null, password);
    //                     }
    //                 }
    //             }
    //         }
    //     });
    //     console.log("Database connection established")
    // } catch (e) {
    //     console.log("Error while connecting to database", e);
    // }

// })();


app.listen(process.env.PORT || DEFAULT_PORT, () => {
    // tslint:disable-next-line:no-console
    // connectDatabase();
    console.log("Listening on PORT: ", process.env.PORT || DEFAULT_PORT);
});
