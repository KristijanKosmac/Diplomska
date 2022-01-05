const Sequelize = require('sequelize');
// import config from "../config";
// import * as AWS from "aws-sdk";
// tslint:disable:no-console
// var signer = new AWS.RDS.Signer({
//     region: process.env.AWS_REGION, // example: us-east-2
//     hostname: config.database.host,
//     port: config.database.port,
//     username: config.database.username
// });

// let token = signer.getAuthToken({
//     username: config.database.username
// });
// const sequelize = new Sequelize(
//     config.database.name,
//     config.database.username,
//     token,
//     {
//         dialect: 'mysql',
//         dialectOptions: {
//             ssl: 'Amazon RDS',
//             authPlugins: { // authSwitchHandler is deprecated
//                 mysql_clear_password: () => () => {
//                     return token
//                 }
//             }
//         },
//         host: config.database.host,
//         port: 3306,
//         pool: {
//             min: 0, //default
//             max: 5, // default
//             idle: 3600000
//         },
//     });

const sequelize = new Sequelize("petdb", "root", "Kristijan", {
    logging: false,
    dialect: "mysql",
    dialectOptions: {
        decimalNumbers: true,
        supportBigNumbers: true
    },
    host: "localhost",
    port: 3306
});

async function connectDatabase() {
    try {
        await sequelize.authenticate();
        console.log("[DATABASE] Connection has been established successfully.");
    } catch (error) {
        console.error("[DATABASE] Unable to connect to the database:", error);
    }
}

export { sequelize, connectDatabase };
