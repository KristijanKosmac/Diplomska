import * as bodyParser from "body-parser";
import express from "express";
import * as errorHandler from "../lib/async-response-handler";
import { UserManager } from "../models/user-manager";
import { auth } from "../middleware/auth"

const app = express.Router();

app.post(
  "/user/sign-up",
  bodyParser.json(),
  errorHandler.wrap(async (req) => {
    const { email, password } = req.body as any;

    return new UserManager().signUp(email, password)
  })
);

app.post(
  "/user/sign-in",
  bodyParser.json(),
  errorHandler.wrap(async (req) => {
    const { email, password } = req.body as any;
    console.log("VLAGA")

    return new UserManager().signIn(email, password)
  })
);

app.post(
  "/user/resent-password",
  bodyParser.json(),
  errorHandler.wrap(async (req) => {
    const { email } = req.body as any;

    return new UserManager().resetPasswordFirebase(email)
  })
);

app.put(
  "/user/:id",
  auth,
  bodyParser.json(),
  errorHandler.wrap(async (req) => {
    const { id } = req.params as any;
    const { password } = req.body as any;

    return new UserManager().changeUserPassword(id, password)
  })
);

app.post(
  "/user/create",
  bodyParser.json(),
  errorHandler.wrap(async (req) => {
    const { email } = req.body as any;

    return new UserManager().createUser( email )
  })
);

app.delete(
  "/user/:id",
  bodyParser.json(),
  errorHandler.wrap(async (req) => {
    const { id } = req.params as any;

    return new UserManager().deleteUser( id )
  })
);

// Export your express server so you can import it in the lambda function.
export const userRouter = app;
