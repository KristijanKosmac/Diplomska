import { APIGatewayEvent, Context } from "aws-lambda";
import awsServerlessExpress from "aws-serverless-express";
import app from "./app";
// import { connectDatabase } from "./database/connection";

const server = awsServerlessExpress.createServer(app);

const ACCOUNT_ID_POSITION = 4;



export const handler = (event: APIGatewayEvent, context: Context) => {
    // little magic here so we don't configure aws-account-id
    process.env.awsAccountId = context.invokedFunctionArn.split(":")[ACCOUNT_ID_POSITION];
    console.log("handlerche");
    awsServerlessExpress.proxy(server, event, context);
    return;
};
