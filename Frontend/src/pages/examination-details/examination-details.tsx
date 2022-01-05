import React, { useEffect, useState } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { StaticContext } from "react-router";
import axios from "axios";

import { AppBar, Tab, Tabs, CircularProgress } from "@material-ui/core";

import { getPetBackendAPI, WindowConfig } from "../../api";

import {
  Document,
  Examination,
  File,
  Patient
} from "../../types";

import AddEditExamination from "../add-edit-examination/add-edit-examination"
import Documents from "../../components/documents/documents.component";


import useStyles from "./examination-details.styles";
import { saveByteArray } from "../../utils/saveByteArray";
import { base64ToArrayBuffer } from "../../utils/base64ToArrayBuffer";
import { GetPatientResponse } from "pet-backend-sdk";

const ExaminationDetails = (props: RouteComponentProps<
  {},
  StaticContext,
  {
    examination: Examination;
    successMessage?: string;
    patientId?: string;
    tab?: number;
  }
>) => {
  const [examination, setExamination] = useState<Examination>({
    id: "",
    examinationType: "",
    patientId: ""
  });
  const [patient, setPatient] = useState<GetPatientResponse>();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [informMessage, setInformMessage] = useState("");

  const [isBusy, setIsBusy] = useState(true);
  const [tab, setTab] = useState(0);

  const [examinationId] = useState(window.location.pathname.split("/").reverse()[0])

  const classes = useStyles();

  useEffect(() => {
    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 3000);
  }, [errorMessage, successMessage]);

  useEffect(() => {
    fetchDocuments();
  }, [tab === 1]);

  const fetchExamination = async (examinationId: string) => {
    try {
      const { data: examinationData } = await getPetBackendAPI().getExamination(examinationId);
      const { data: patientData } = await getPetBackendAPI().getPatient(examinationData.patientId);
      setExamination(examinationData as Examination)
      setPatient(patientData);
    } catch (e) {
      console.log(e)
    }
    setIsBusy(false)
  }

  useEffect(() => {
    if (props.location.state && props.location.state.examination) {
      setExamination(props.location.state.examination);
      (async () => {
        const { data: patientData } = await getPetBackendAPI().getPatient(props.location.state.examination.patientId);
        setPatient(patientData);
        setIsBusy(false)
      })();
    } else {
      fetchExamination(examinationId)
    }
  }, [props.location.state])


  const handleSubmit = async (files: FormData) => {
    try {
      setIsBusy(true);
      await axios
        .post(
          `${process.env.REACT_APP_BACKEND_ENDPOINT || (window as unknown as WindowConfig).env.BACKEND_ENDPOINT}/examination/${examinationId}/documents`,
          files,
          {
            headers: {
              "authorization": `Bearer ${localStorage.getItem("accessToken")}`
            }
          }
        )
        .then(() => setSuccessMessage("Документот е успешно прикачен"))
        .catch((err: any) => {
          throw err
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

  const fetchDocuments = async () => {
    if (examinationId) {
      try {
        const response = await getPetBackendAPI().getExaminationDocuments(examinationId);
        const data = response.data as unknown as File[];

        const docs = data.sort((a, b) =>
          new Date(a.LastModified).getTime() < new Date(b.LastModified).getTime() ? 1 : -1
        );

        setDocuments(
          docs.map((doc) => {
            return {
              id: doc.Key,
              date: doc.LastModified,
              name: doc.Key.split("/").slice(1).join("/"),
              url: doc.url,
              isSend: doc.isSend,
              type: doc.type
            };
          }) as Document[]
        );
        setIsBusy(false);
      } catch (error: any) {
        setErrorMessage(error.response.data.message);
        console.log(error)
      }
    }
  };

  const handleMultipleDownload = async (fileKeys: string[]) => {

    try {
      const data = await getPetBackendAPI().downloadExaminationFiles({
        documents: fileKeys.map(key => {
          return {
            key,
            name: key.split("/")[1]
          }
        })
      })
      const bufferArray = base64ToArrayBuffer(data.data.blob);
      saveByteArray(`${examinationId}.zip`, bufferArray);
    } catch (err: any) {
      console.log(err)
    }
  }

  const handleDeleteDocument = async (
    documentId: string
  ) => {
    try {
      await getPetBackendAPI().deleteExaminationDocument(examinationId, documentId);
      setSuccessMessage("Документот е успешно избришан");

      setTimeout(() => {
        fetchDocuments();
      }, 500);
    } catch (error: any) {
      setErrorMessage(error.response.data.message);
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
        documents.map(document => {
          if (document.id === selectedDocumentId) {
            return {
              ...document,
              isSend: true
            }
          } else {
            return document
          }
        })
      )
      setSuccessMessage("Пораката е успешно пратена");
    } catch (e) {
      setErrorMessage("Настана грешка при праќање на пораката. Обидете се повторно.");
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

          <CircularProgress className={classes.circularProgress} size={23} thickness={5} />
          {informMessage}
        </div>
      )}
      <AppBar position="static" className={classes.appBar}>
        <Tabs
          value={tab}
          onChange={(_event, value) => setTab(value)}
          aria-label="simple tabs example"
          variant="fullWidth"
          centered
        >
          <Tab label={<h3>Информации за прегледот</h3>} style={{ width: "100%" }} />
          <Tab label={<h3>Документи за прегледот</h3>} style={{ width: "100%" }} />
        </Tabs>
      </AppBar>
      {
        tab === 0 ? (
          !isBusy ? 
            <AddEditExamination
              location={{ ...props.location, state: { examination, readOnly: true } }}
              history={props.history}
              match={props.match}
            />
            :
            <CircularProgress size={60} style={{ marginTop: "32px" }} />
        ) : (
          <Documents
            documents={documents}
            handleSubmit={handleSubmit}
            handleDelete={handleDeleteDocument}
            examination={examination}
            sendToEmail={patient && patient.email}
            isBusy={isBusy}
            handleMultipleDownload={handleMultipleDownload}
            handleSendEmail={handleSendEmail}
          />
        )
      }

    </div>
  );
};

export default withRouter(ExaminationDetails);