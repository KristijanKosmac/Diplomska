import * as bodyParser from "body-parser";
import express from "express";
import * as errorHandler from "../lib/async-response-handler";
import { DoctorManager } from "../models/doctor-manager";
import { auth } from "../middleware/auth"

const app = express.Router();

app.get(
  "/doctor/:id",
  auth,
  errorHandler.wrap(async (req) => {
    const { id } = req.params as any;
    return new DoctorManager().getDoctor(id);
  })
);
app.post(
  "/doctor",
  bodyParser.json(),
  errorHandler.wrap(async (req) => {
    return new DoctorManager().addDoctor(req.body);
  })
);

app.get(
  "/doctor",
  auth,
  errorHandler.wrap(async () => {
    return new DoctorManager().getAllDoctors();
  })
);

app.delete(
  "/doctor/:id",
  auth,
  errorHandler.wrap(async (req) => {
    const { id } = req.params as any;
    return new DoctorManager().deleteDoctor(id);
  })
);
app.put(
  "/doctor/:id",
  auth,
  bodyParser.json(),
  errorHandler.wrap(async (req) => {
    const { id } = req.params as any;
    return new DoctorManager().updateDoctor(id, req.body);
  })
);

// Export your express server so you can import it in the lambda function.
export const doctorRouter = app;
