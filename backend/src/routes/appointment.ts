import * as bodyParser from "body-parser";
import express from "express";
import * as errorHandler from "../lib/async-response-handler";

const app = express();

app.get(
  "/",
  bodyParser.json(),
  errorHandler.wrap(async (req) => {
    // const { id } = req.query as any;
    
  })
);
app.get(
  "/list",
  bodyParser.json(),
  errorHandler.wrap(async (req) => {
    // const { therapistId } = req.query as any;
    
  })
);
app.post(
  "/",
  bodyParser.json(),
  errorHandler.wrap(async (req) => {
  
  })
);
app.delete(
  "/",
  bodyParser.json(),
  errorHandler.wrap(async (req) => {
    // const { id } = req.query as any;

  })
);
app.put(
  "/",
  bodyParser.json(),
  errorHandler.wrap(async (req) => {
    
  })
);

// Export your express server so you can import it in the lambda function.
export const route = app;
