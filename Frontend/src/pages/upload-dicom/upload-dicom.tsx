import React, { useState, useEffect } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { StaticContext } from "react-router";
import axios from "axios";

import { LinearProgress, Button, TextField, Grid } from "@material-ui/core";

import { WindowConfig } from "../../api";
import useStyles from "./upload-dicom.styles";
import { DropzoneArea } from "material-ui-dropzone";

const PatientDetails = (props: RouteComponentProps<{}, StaticContext, {}>) => {

  const [key, setKey] = useState(0);
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState<(Blob & { name: string; size: number })[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [patientId, setPatientId] = useState<string>("");

  const classes = useStyles();

  useEffect(() => {
    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 3000);
  }, [errorMessage, successMessage]);

  const uploadFiles = async (files: FormData) => {
    await axios
      .post(
        `${process.env.REACT_APP_BACKEND_ENDPOINT || (window as unknown as WindowConfig).env.BACKEND_ENDPOINT}/dicom/upload`,
        files,
        {
          headers: {
            "authorization": `Bearer ${localStorage.getItem("accessToken")}`
          }
        }
      );
  }

  const normaliseProgress = (value: number, min: number, max: number) => ((value - min) * 100) / (max - min);

  const handleSubmit = async (files: (Blob & { name: string; size: number })[]) => {
    try {
      var form = new FormData();
      form.append("patientId", patientId);

      var dataPool = 0;
      for (var i = 0; i < files.length; i++) {
        const file = files[i];

        if (dataPool + file.size >= 4000000) {
          await uploadFiles(form);

          form = new FormData();
          form.append("file", file.name);
          form.append("file", file);
          form.append("patientId", patientId);

          dataPool = file.size;
        } else {
          dataPool += file.size;
          form.append("file", file.name);
          form.append("file", file);
        }

        setProgress(i);
      }

      await uploadFiles(form);
      setProgress(0);
      setKey(Math.random());
      setSuccessMessage("Успешно прокачени DICOM фајлови");
      setPatientId("");
    } catch (error: any) {
      console.log(error)
      setErrorMessage(error.response.data.message);
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
      <h1>Прикачи DICOM</h1>
      <div className={classes.btnContainer}>
        <div className={classes.dropZone}>
          <div style={{ marginBottom: "60px" }}>
            <TextField
              size="small"
              variant="outlined"
              id="petId"
              label="Нов Број на Пациент"
              name="petId"
              autoComplete="petId"
              value={patientId}
              onChange={(event: any) => setPatientId(event.target.value)}
            />
            <Button
              variant="outlined"
              color="primary"
              className={classes.btn}
              onClick={() => handleSubmit(files!)}
              disabled={progress > 0 || !files.length}
            >
              {
                progress > 0 ? "Се прикачува..." : "Започни прикачување"
              }
            </Button>
          </div>
          <LinearProgress variant="determinate" value={normaliseProgress(progress, 0, files.length)} />
          <br />
          <DropzoneArea
            key={key}
            previewGridClasses={{
              container: classes.dropZoneGridCointainer,
              image: "",
              item: "MuiGrid-grid-md-3",
            }}
            filesLimit={10000}
            showPreviewsInDropzone={false}
            previewGridProps={{ container: { spacing: 1, direction: 'row' } }}
            onChange={(data) => {
              setFiles(data);
            }}

            maxFileSize={100000000}
          />
          <br />
          <b>
            {files.length} фајлови прикачени
          </b>
        </div>
      </div>
    </div>
  );
};

export default withRouter(PatientDetails);
