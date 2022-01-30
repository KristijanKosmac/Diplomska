import * as bodyParser from "body-parser";
import express from "express";
import * as errorHandler from "../lib/async-response-handler";
import { PatientManager } from "../models/patient-manager";
import { upload } from "../utils/multerStorage";

const app = express.Router();
app.get(
  "/patient/:id",
  errorHandler.wrap(async (req) => {
    const { id } = req.params as any;
    return new PatientManager().getPatient(id);
  })
);
app.post(
  "/patient",
  bodyParser.json(),
  errorHandler.wrap(async (req) => {
    return new PatientManager().addPatient(req.body);
  })
);

app.get(
  "/patient",
  errorHandler.wrap(async (req) => {
    const { doctorId } = req.query
    return new PatientManager().getAllPatientsForDoctor(doctorId as string);
  })
);

app.delete(
  "/patient/:id",
  errorHandler.wrap(async (req) => {
    const { id } = req.params as any;
    return new PatientManager().deletePatient(id);
  })
);

app.put(
  "/patient/:id",
  bodyParser.json(),
  errorHandler.wrap(async (req) => {
    const { id } = req.params as any;
    return new PatientManager().updatePatient(id, req.body);
  })
);

app.post(
  "/patient/:id/documents",
  upload.array("file"),
  errorHandler.wrap(async (req) => {
    return new PatientManager().uploadFiles(req.files);
  })
);

app.delete(
  "/patient/:id/documents",
  errorHandler.wrap(async (req) => {
    const { id } = req.params as any;
    const { fileName } = req.query as any;

    return new PatientManager().deleteFile(id, fileName);
  })
);


app.get(
  "/patient/:id/documents",
  errorHandler.wrap(async (req) => {
    const { id } = req.params as any;

    return new PatientManager().getAllFiles(id);
  })
);

// Export your express server so you can import it in the lambda function.
export const patientRouter = app;
