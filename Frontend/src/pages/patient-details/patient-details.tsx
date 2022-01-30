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
  Study,
  StudiesResponse,
  Examination,
} from "../../types";

import Documents from "../../components/documents/documents.component";
import StudiesList from "../../components/studies-list/studies-list.component";
import ExaminationList from "../examination-list/examination-list";

import { getPetBackendAPI, WindowConfig } from "../../api";
import { getValue } from "../../utils/getValue";
import { mapPatientKeys } from "../../utils/mapPatientKeys";

import useStyles from "./patient-details.styles";
import { base64ToArrayBuffer } from "../../utils/base64ToArrayBuffer";
import { saveByteArray } from "../../utils/saveByteArray";
import moment from "moment";

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

  const [studies, setStudies] = useState<Study[]>([]);

  const [examinations, setExaminations] = useState<Examination[]>([]);

  const [isBusy, setIsBusy] = useState(true);
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

  const fetchExaminations = async () => {
    try {
      if (patient.id) {
        const { data } = await getPetBackendAPI().getAllExaminationForPatient(
          patient.id
        );
        setExaminations(data as unknown as Examination[]);
      }
    } catch (error: any) {
      console.log(error);
      // setErrorMessage("Something went wrong while getting studies");
    }
    setIsBusy(false);
  };

  const fetchStudies = async () => {
    try {
      if (patient.id) {
        const { data } = await getPetBackendAPI().getAllStudies(patient.id);

        const studiesData = data as unknown as StudiesResponse[];

        const studies = studiesData.sort((a, b) =>
          moment(a.mainDicomTags.studyDate) < moment(b.mainDicomTags.studyDate)
            ? 1
            : -1
        );

        setStudies(
          studies.map((study) => {
            return {
              ...study,
              ...study.mainDicomTags,
              ...(study as any).patientMainDicomTags,
            };
          })
        );
        setIsBusy(false);
      }
    } catch (error: any) {
      console.log(error);
      // setErrorMessage("Something went wrong while getting studies");
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
    fetchStudies();
    fetchExaminations();
  }, [patient]);

  useEffect(() => {
    fetchDocuments();
  }, [tab === 2]);

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

  const handleDeleteExamination = async (id: string) => {
    try {
      await getPetBackendAPI().deleteExamination(id);
      setTimeout(() => {
        fetchExaminations();
      }, 500);
      setSuccessMessage("Прегледот е успешно избришан");
    } catch (error: any) {
      console.log(error.response.data.message);
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

  const downloadStudy = async (studyUid: string, studyId: string) => {
    setInformMessage("File is prepairing for download, please wait");
    try {
      // Download directly from the PACS!!! Fix this
      const response = await axios(`/series/${studyUid}/media`, {
        responseType: "arraybuffer",
      });
      saveByteArray(`${patient.id}/${studyId}.zip`, response.data);

      // const { data } = await getPetBackendAPI().downloadStudy(studyUid);
      // const bufferArray = base64ToArrayBuffer(data.blob);
      // saveByteArray(`${patient.petId}/${studyId}.zip`, bufferArray);

      setSuccessMessage("Документот е успешно превземен");
    } catch (error: any) {
      setErrorMessage(
        "Настана грешка при превземање на документот. Обидете се повторно"
      );
    }
    setInformMessage("");
    // await axios
    //   .get(`http://localhost:80/dicom/${studyId}/download`)
    //   .then((res: { data: { blob: string } }) => {
    //     const bufferArray = base64ToArrayBuffer(res.data.blob);
    //     saveByteArray("dicom.zip", bufferArray);
    //   })
    //   .catch((err) => setErrorMessage(err.response.data.message));
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
          <Tab label={<h3>Студии</h3>} style={{ width: "100%" }} />
          <Tab label={<h3>Прегледи</h3>} style={{ width: "100%" }} />
          <Tab label={<h3>Документи</h3>} style={{ width: "100%" }} />
          <Tab
            label={<h3>Информации за пациентот</h3>}
            style={{ width: "100%" }}
          />
        </Tabs>
      </AppBar>
      {tab === 0 ? (
        <StudiesList
          studies={studies}
          isBusy={isBusy}
          downloadStudy={downloadStudy}
        />
      ) : tab === 1 ? (
        <ExaminationList
          examinations={examinations}
          handleDelete={handleDeleteExamination}
          patientId={patientId ? patientId : patient.id!}
          isBusy={isBusy}
        />
      ) : tab === 2 ? (
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
                    entry[0] !== "id" && (
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
