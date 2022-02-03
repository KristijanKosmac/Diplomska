import React, { useEffect, useState } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { StaticContext } from "react-router";
import axios from "axios";

import {
  Paper,
  Grid,
  AppBar,
  Tab,
  Tabs,
  CircularProgress,
  Button,
} from "@material-ui/core";

import {
  Patient,
  Document,
  File,
} from "../../types";

import Documents from "../../components/documents/documents.component";

import { getPetBackendAPI } from "../../api";
import { getValue } from "../../utils/getValue";
import { mapPatientKeys } from "../../utils/mapPatientKeys";

import useStyles from "./patient-details.styles";
import { base64ToArrayBuffer } from "../../utils/base64ToArrayBuffer";
import { saveByteArray } from "../../utils/saveByteArray";

const PatientDetails = (props: RouteComponentProps<{}, StaticContext, {}>) => {
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

  const [isBusy, setIsBusy] = useState(false); // set to true
  const [tab, setTab] = useState(0);

  const patientId = window.location.pathname.split("/").reverse()[0];

  const classes = useStyles();

  const fetchPatient = async () => {
    try {
      const { data } = await getPetBackendAPI().getPatient(patientId);
      setPatient(data as unknown as Patient);
    } catch (error: any) {
      setErrorMessage(
        "Настана грешка при превземање на информациите за пациентот. Обидете се повторно."
      );
    }
  };

  const fetchDocuments = async () => {
    if (patient.id) {
      try {
        const response = await getPetBackendAPI().getDocuments(patient.id);
        const data = response.data as unknown as File[];

        const docs = data.sort((a, b) =>
          new Date(a.LastModified).getTime() <
          new Date(b.LastModified).getTime()
            ? 1
            : -1
        );

        setDocuments(
          docs.map((doc) => {
            return {
              id: doc.Key,
              date: doc.LastModified,
              name: doc.Key.split("/").slice(1).join("/"),
              url: doc.url,
              isSend: doc.isSend,
              type: doc.type,
            };
          }) as Document[]
        );

        setIsBusy(false);
      } catch (error: any) {
        setErrorMessage(error.response.data.message);
      }
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
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 3000);
  }, [errorMessage, successMessage]);

  const handleDeleteDocument = async (documentId: string) => {
    try {
      await getPetBackendAPI().deleteDocument(patient.id, documentId);
      setSuccessMessage("Документот е успешно избришан");

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
      await axios
        .post(
          ``,
          files,
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        )
        .then(() => setSuccessMessage("Документот е успешно прикачен"))
        .catch((err: any) => {
          throw err;
        });

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
      const data = await getPetBackendAPI().downloadMultipleFiles({
        documents: fileKeys.map((key) => {
          return { key, name: key.split("/")[1] };
        }),
      });
      const bufferArray = base64ToArrayBuffer(data.data.blob);
      saveByteArray(`${patient.id}.zip`, bufferArray);
    } catch (err: any) {
      console.log(err);
    }
  };

  const handleSendEmail = async (
    emails: string[],
    selectedDocumentId: string
  ) => {
    try {
      await getPetBackendAPI().sendEmail({
        emails,
        documentId: selectedDocumentId,
      });

      setDocuments(
        documents.map((document) => {
          if (document.id === selectedDocumentId) {
            return {
              ...document,
              isSend: true,
            };
          } else {
            return document;
          }
        })
      );
      setSuccessMessage("Пораката е успешно пратена");
    } catch (e) {
      setErrorMessage(
        "Настана грешка при праќање на пораката. Обидете се повторно."
      );
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
        Пациент: {patient.firstName} {patient.lastName}
      </h1>
      <AppBar position="static" className={classes.appBar}>
        <Tabs
          value={tab}
          onChange={(_event, value) => setTab(value)}
          aria-label="simple tabs example"
          variant="fullWidth"
          centered
        >
          <Tab label={<h3>Документи</h3>} style={{ width: "100%" }} />
          <Tab
            label={<h3>Информации за пациентот</h3>}
            style={{ width: "100%" }}
          />
        </Tabs>
      </AppBar>
      {tab === 0 ? (
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
              Промени
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
