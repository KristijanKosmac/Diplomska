import * as bodyParser from "body-parser";
import { ExaminationEntity } from "../database/entities";
import express from "express";
import * as errorHandler from "../lib/async-response-handler";
import { ExaminationManager } from "../models/examination-manager";
import { upload } from "../utils/multerStorageS3"

const app = express();


app.get(
  "/",
  errorHandler.wrap(async () => {
    return new ExaminationManager().getAllExaminations();
  })
);
app.post(
  "/",
  bodyParser.json(),
  errorHandler.wrap(async (req) => {
    return new ExaminationManager().addExamination(req.body);
  })
);
app.get(
  "/:id",
  errorHandler.wrap(async (req) => {
    const { id } = req.params as any;
    return new ExaminationManager().getExamination(id);
  })
);

app.get(
  "/list/:patientId",
  errorHandler.wrap(async (req) => {
    const { patientId } = req.params as any;
    return new ExaminationManager().getAllPatientExaminations(patientId)
  })
);

app.delete(
  "/:id",
  bodyParser.json(),
  errorHandler.wrap(async (req) => {
    const { id } = req.params as any;
    return new ExaminationManager().deleteExamination(id);
  })
);
app.put(
  "/:id",
  bodyParser.json(),
  errorHandler.wrap(async (req) => {
    const { id } = req.params as any;
    return new ExaminationManager().updateExaminationDetails(id, req.body as ExaminationEntity);
  })
);

app.post(
  "/:id/documents",
  upload.array("file"),
  errorHandler.wrap(async (req) => {
    return new ExaminationManager().uploadFiles({ files: req.files });
  })
);

app.get(
  "/:id/documents",
  bodyParser.json(),
  errorHandler.wrap(async (req) => {
    const { patientId } = req.query as any;
    const { id }= req.params as any

    return new ExaminationManager().getAllDocuments(patientId, id);
  })
)

app.delete(
  "/:id/documents",
  bodyParser.json(),
  errorHandler.wrap(async (req) => {
    const { key } = req.query as any;
    return new ExaminationManager().deleteDocument(key);
  })
)

app.get(
  "/:id/documents/download",
  bodyParser.json(),
  errorHandler.wrap(async (req) => {
    const { key } = req.query as any;
    return new ExaminationManager().downloadDocument(key);
  })
)


app.post(
  "/send-email",
  bodyParser.json(),
  errorHandler.wrap(async (req) => {
    const { emails, documentId } = req.body as any;

    return new ExaminationManager().sendEmail(emails, documentId);
  })
)

// Export your express server so you can import it in the lambda function.
export const route = app;
