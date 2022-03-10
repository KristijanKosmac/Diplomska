import React, { useEffect, useState } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { StaticContext } from "react-router";

import {
  Paper,
  Grid,
  AppBar,
  Tab,
  Tabs,
  CircularProgress,
  Button,
} from "@material-ui/core";

import { Patient, Document } from "../../types";

import Documents from "../../components/documents/documents.component";
import FoldersListPage from "../folders-list/folders-list";

import { patientAPI } from "../../api";
import { getValue } from "../../utils/getValue";
import { mapPatientKeys } from "../../utils/mapPatientKeys";

import useStyles from "./patient-details.styles";
import { base64ToArrayBuffer } from "../../utils/base64ToArrayBuffer";
import { saveByteArray } from "../../utils/saveByteArray";

const PatientDetails = (props: RouteComponentProps<{}, StaticContext, {}>) => {
  const [folder, setFolder] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [informMessage, setInformMessage] = useState("");

  const [patient, setPatient] = React.useState<Patient>({
    firstName: "",
    lastName: "",
    EMBG: 0,
    dateOfBirth: "",
    familyDoctor: "",
    email: "",
  });

  const [isBusy, setIsBusy] = useState(true);
  const [tab, setTab] = useState(0);

  const patientId = window.location.pathname.split("/").reverse()[0];

  const classes = useStyles();

  const fetchPatient = async () => {
    try {
      const { data } = await patientAPI.getPatient(patientId);
      setPatient(data as unknown as Patient);
    } catch (error: any) {
      setErrorMessage("Problem occurred while getting patient data");
    }
  };

  const fetchDocuments = async () => {
    try {
      if (folder) {
        setIsBusy(true)
        const { data } = await patientAPI.getAllFilesFromFolder(
          patientId,
          folder
        );
        setDocuments(
          data.map((doc: any) => {
            return {
              id: doc.filename,
              date: parseInt(doc.filename.split("-")[0]),
              name: doc.filename.split("-").slice(1).join("-"),
              content: doc.content,
            };
          }) as Document[]
        );
      }
      // const { data } = await patientAPI.getAllFiles(patientId);
      setIsBusy(false);
    } catch (error: any) {
      setErrorMessage(error.response.data.message);
    }
  };

  useEffect(() => {
    if (props.location.state) {
      const { patient, tab } = props.location.state as {
        patient: Patient;
        tab?: number;
      };

      patient ? setPatient(patient) : fetchPatient();
      setTab(tab ? tab : 0);
    } else {
      fetchPatient();
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [folder]);

  useEffect(() => {
    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 3000);
  }, [errorMessage, successMessage]);

  const handleDeleteDocument = async (documentId: string) => {
    try {
      await patientAPI.deleteFile(patientId, `${folder}/${documentId}`);
      setSuccessMessage("Document is successfully deleted");

      setTimeout(() => {
        fetchDocuments();
      }, 500);
    } catch (error: any) {
      setErrorMessage(error.response.data.message);
    }
  };

  const handleSubmit = async (files: FormData) => {
    try {
      setIsBusy(true);
      await patientAPI.uploadFiles(patientId, folder, files);

      setTimeout(() => {
        fetchDocuments();
      }, 500);
      setIsBusy(false);
    } catch (error: any) {
      setIsBusy(false);
      setErrorMessage(error.response.data.message);
    }
  };

  const handleMultipleDownload = async (fileKeys: string[]) => {
    try {
      setInformMessage("Zip file preparing ...");
      window.scrollTo({ top: 0, behavior: "smooth" });
      const { data } = await patientAPI.getMultipleFiles(patientId, folder, fileKeys);
      const bufferArray = base64ToArrayBuffer(data);
      saveByteArray(
        `${patient.firstName}-${patient.lastName}.zip`,
        bufferArray
      );
      setSuccessMessage("Zip file downloaded successfully");
      setInformMessage("");
    } catch (err: any) {
      setErrorMessage("Error while getting zip file");
    }
  };

  const handleSendEmail = async (
    emails: string[],
    selectedDocumentId: string,
    text: string
  ) => {
    try {
      await patientAPI.sendEmail(`${patientId}/${folder}`, emails, text, [selectedDocumentId]);

      setSuccessMessage("Mail successfully send");
    } catch (e) {
      console.log(e);
      setErrorMessage("Error occurred while sending mail");
    }
  };

  return (
    <div className={classes.mainContainer}>
      {successMessage && (
        <div className="successMessage" style={{ margin: "0 auto 20px" }}>
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="errorMessage" style={{ margin: "0 auto 20px" }}>
          {errorMessage}
        </div>
      )}
      {informMessage && (
        <div className="informMessage" style={{ margin: "0 auto 20px" }}>
          <CircularProgress
            className={classes.circularProgress}
            size={23}
            thickness={5}
          />
          {informMessage}
        </div>
      )}
      <h1>
        Patient: {patient.firstName} {patient.lastName}
      </h1>
      <AppBar position="static" className={classes.appBar}>
        <Tabs
          value={tab}
          onChange={(_event, value) => setTab(value)}
          aria-label="simple tabs example"
          variant="fullWidth"
          centered
        >
          <Tab label={<h3>Documents</h3>} style={{ width: "100%" }} />
          <Tab label={<h3>Patient Info</h3>} style={{ width: "100%" }} />
        </Tabs>
      </AppBar>
      {tab === 0 ? (
        folder ? (
          <div className={classes.documentWrapper}>
            <div>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  setFolder("");
                }}
              >
                Go Back
              </Button>
              <h2> Folder: {folder} </h2>
            </div>
            <Documents
              documents={documents}
              handleSubmit={handleSubmit}
              handleDelete={handleDeleteDocument}
              sendToEmail={patient.email}
              patient={patient}
              isBusy={isBusy}
              handleMultipleDownload={handleMultipleDownload}
              handleSendEmail={handleSendEmail}
            />
          </div>
        ) : (
          <FoldersListPage
            patientId={patientId}
            onClick={(folderName) => {
              setFolder(folderName);
            }}
          />
        )
      ) : (
        <div className={classes.root}>
          <div>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                props.history.push({
                  pathname: "/patients/edit",
                  state: {
                    patient: {
                      ...patient,
                      dateOfBirth: patient.dateOfBirth
                        ? new Date(patient.dateOfBirth).toISOString()
                        : undefined,
                    },
                  },
                });
              }}
            >
              Edit
            </Button>
          </div>
          <Paper elevation={3}>
            <div className={classes.gridContainer}>
              <Grid container spacing={2}>
                {Object.entries(patient).map(
                  (entry, index) =>
                    entry[0] !== "createdAt" &&
                    entry[0] !== "updatedAt" &&
                    entry[0] !== "id" &&
                    entry[0] !== "_id" &&
                    entry[0] !== "__v" && (
                      <Grid item xs={4} key={index}>
                        <h3>{mapPatientKeys(entry[0])}</h3>
                        <div>{getValue(entry[0], entry[1])}</div>
                      </Grid>
                    )
                )}
              </Grid>
            </div>
          </Paper>
        </div>
      )}
    </div>
  );
};

export default withRouter(PatientDetails);
