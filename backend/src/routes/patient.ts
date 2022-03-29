import * as bodyParser from "body-parser";
import express from "express";
import * as errorHandler from "../lib/async-response-handler";
import { patientManager } from "../models/patient-manager";
import { upload } from "../utils/multerStorage";
import { auth } from "../middleware/auth"

const app = express.Router();
app.get(
  "/patient/:id",
  auth,
  errorHandler.wrap(async (req) => {
    const { id } = req.params as any;
    return patientManager.getPatient(id);
  })
);
app.post(
  "/patient",
  auth,
  bodyParser.json(),
  errorHandler.wrap(async (req) => {
    return patientManager.addPatient(req.body);
  })
);

app.get(
  "/patient",
  auth,
  errorHandler.wrap(async (req) => {
    const { doctorId } = req.query
    return patientManager.getAllPatientsForDoctor(doctorId as string);
  })
);

app.delete(
  "/patient/:id",
  auth,
  errorHandler.wrap(async (req) => {
    const { id } = req.params as any;
    return patientManager.deletePatient(id);
  })
);

app.put(
  "/patient/:id",
  auth,
  bodyParser.json(),
  errorHandler.wrap(async (req) => {
    const { id } = req.params as any;
    return patientManager.updatePatient(id, req.body);
  })
);

app.delete(
  "/patient/:id/documents",
  auth,
  errorHandler.wrap(async (req) => {
    const { id } = req.body as any;

    return patientManager.deleteFile(id);
  })
);

// app.get(
//   "/patient/:id/documents",
//   auth,
//   errorHandler.wrap(async (req) => {
//     const { id } = req.params as any;

//     return patientManager.getAllFiles(id);
//   })
// );

app.get(
  "/patient/:id/folder/:folderName",
  auth,
  errorHandler.wrap(async (req) => {
    const { id, folderName } = req.params as any;

    return patientManager.getAllFilesFromFolder(id, folderName);
  })
);

app.get(
  "/patient/:id/folder",
  auth,
  errorHandler.wrap(async (req) => {
    const { id } = req.params as any;

    return patientManager.getAllFolders(id);
  })
);

app.post(
  "/patient/:id/folder/:folderName",
  auth,
  bodyParser.json(),
  errorHandler.wrap(async (req) => {
    const { id, folderName } = req.params as any;

    return patientManager.createFolder( id, folderName);
  })
);

// app.post(
//   "/patient/:id/documents",
//   auth,
//   upload.array("file"),
//   errorHandler.wrap(async (req) => {
//     return patientManager.uploadFiles(req.files);
//   })
// );

app.post(
  "/patient/:id/folder/:folderName/upload",
  auth,
  upload.array("file"),
  errorHandler.wrap(async (req) => {
    return patientManager.uploadFiles(req.files);
  })
);

app.post(
  "/patient/:id/folder/:folderName/files-comments",
  auth,
  errorHandler.wrap(async (req) => {
    const { id, folderName } = req.params as any

    return patientManager.uploadFilesComments(id, folderName, req.body.documents);
  })
);

app.put(
  "/patient/:id/folder/:folderName/file-edit",
  auth,
  errorHandler.wrap(async (req) => {
    // const { id, folderName } = req.params as any
    const { documentId, oldDocumentId, comment } = req.body as any

    return patientManager.updateDocument(documentId, oldDocumentId, comment);
  })
);

app.delete(
  "/patient/:id/folder/:folderName",
  auth,
  bodyParser.json(),
  errorHandler.wrap(async (req) => {
    const { id, folderName } = req.params as any;

    return patientManager.deleteFolder( id, folderName);
  })
);

app.put(
  "/patient/:id/folder/:folderName",
  auth,
  bodyParser.json(),
  errorHandler.wrap(async (req) => {
    const { id, folderName } = req.params as any;
    const { newFolderName } = req.body as any;

    return patientManager.renameFolder( id, folderName, newFolderName);
  })
);

app.post(
  "/patient/:id/documents/send-email",
  auth,
  bodyParser.json(),
  errorHandler.wrap(async (req) => {
    // const { id } = req.params as any;
    const { id ,emails, text, filesIds} = req.body as any

    return patientManager.sendEmail( id, emails, text, filesIds );
  })
);


app.post(
  "/patient/:id/documents/download",
  auth,
  bodyParser.json(),
  errorHandler.wrap(async (req) => {
    // const { id } = req.params as any;
    const { documentIds} = req.body as any

    return patientManager.getMultipleFiles( documentIds, "" );
  })
);



// Export your express server so you can import it in the lambda function.
export const patientRouter = app;
