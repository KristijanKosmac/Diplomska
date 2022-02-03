import * as bodyParser from "body-parser";
import express from "express";
import * as errorHandler from "../lib/async-response-handler";
import { DoctorManager } from "../models/doctor-manager";

const app = express.Router();

app.get(
  "/doctor/:id",
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
  errorHandler.wrap(async () => {
    return new DoctorManager().getAllDoctors();
  })
);

app.delete(
  "/doctor/:id",
  errorHandler.wrap(async (req) => {
    const { id } = req.params as any;
    return new DoctorManager().deleteDoctor(id);
  })
);
app.put(
  "/doctor/:id",
  bodyParser.json(),
  errorHandler.wrap(async (req) => {
    const { id } = req.params as any;
    return new DoctorManager().updateDoctor(id, req.body);
  })
);

// Export your express server so you can import it in the lambda function.
export const doctorRouter = app;
