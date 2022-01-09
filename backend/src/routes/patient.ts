import * as bodyParser from "body-parser";
import express from "express";
import * as errorHandler from "../lib/async-response-handler";
import { PatientManager } from "../models/patient-manager";

const app = express();

app.get(
  "/:id",
  errorHandler.wrap(async (req) => {
    const { id } = req.params as any;
    return new PatientManager().getPatient(id);
  })
);
app.post(
  "/",
  bodyParser.json(),
  errorHandler.wrap(async (req) => {
    return new PatientManager().addPatient(req.body);
  })
);

app.get(
  "/",
  errorHandler.wrap(async (req) => {
    const { doctorId } = req.query
    return new PatientManager().getAllPatientsForDoctor(doctorId as string);
  })
);

app.delete(
  "/:id",
  errorHandler.wrap(async (req) => {
    const { id } = req.params as any;
    return new PatientManager().deletePatient(id);
  })
);
app.put(
  "/:id",
  bodyParser.json(),
  errorHandler.wrap(async (req) => {
    const { id } = req.params as any;
    return new PatientManager().updatePatient(id, req.body);
  })
);

// Export your express server so you can import it in the lambda function.
export const route = app;