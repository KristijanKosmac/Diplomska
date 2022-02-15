import * as bodyParser from "body-parser";
import express from "express";
import * as errorHandler from "../lib/async-response-handler";
import { doctorManager } from "../models/doctor-manager";
import { auth } from "../middleware/auth"

const app = express.Router();

app.get(
  "/doctor/:id",
  auth,
  errorHandler.wrap(async (req) => {
    const { id } = req.params as any;
    return doctorManager.getDoctor(id);
  })
);
app.post(
  "/doctor",
  bodyParser.json(),
  errorHandler.wrap(async (req) => {
    return doctorManager.addDoctor(req.body);
  })
);

app.get(
  "/doctor",
  auth,
  errorHandler.wrap(async () => {
    return doctorManager.getAllDoctors();
  })
);

app.delete(
  "/doctor/:id",
  auth,
  errorHandler.wrap(async (req) => {
    const { id } = req.params as any;
    return doctorManager.deleteDoctor(id);
  })
);
app.put(
  "/doctor/:id",
  auth,
  bodyParser.json(),
  errorHandler.wrap(async (req) => {
    const { id } = req.params as any;
    return doctorManager.updateDoctor(id, req.body);
  })
);

// Export your express server so you can import it in the lambda function.
export const doctorRouter = app;
