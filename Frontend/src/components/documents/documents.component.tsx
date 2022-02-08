import { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { useSelector } from "react-redux";

import { Button, Paper, TableCell, CircularProgress } from "@material-ui/core";
import { DropzoneArea } from "material-ui-dropzone";

import CustomModal from "../../components/modal/modal.component";
import Search from "../../components/search/search.component";
import SendEmail from "../send-email/send-email";
import DropdownMenuActions from "../../components/dropdownMenuActions/dropdownMenuActions";
import EnhancedTable from "../select-table/select-table.component";

import useStyles from "./documents.styles";
import { Document, DocumentColumn, DocumentComponentProps } from "../../types";
import { GlobalState } from "../../reducers";
import { getValue } from "../../utils/getValue";
import { saveByteArray } from "../../utils/saveByteArray";
import { b64toBlob } from "../../utils/base64ToBlob";

const Documents = (props: DocumentComponentProps) => {
  const [key, setKey] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [searchedDocuments, setSearchedDocuments] = useState<Document[]>(
    props.documents
  );
  const [files, setFiles] = useState<FormData>();
  const { patients } = useSelector((state: GlobalState) => state.patients);
  const suggestedEmails = patients.map((patient) =>
    patient.email ? patient.email : ""
  );

  const classes = useStyles();

  const documentColumns: DocumentColumn[] = [
    { id: "name", label: "Document name" },
    { id: "date", label: "Upload date" },
  ];

  useEffect(() => {
    setSearchedDocuments(props.documents);
  }, [props.documents]);

  useEffect(() => {
    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 4000);
  }, [errorMessage, successMessage]);

  const handleSearchDocument = (search: string) => {
    search = search.toLowerCase().trim();
    if (search === "") {
      setSearchedDocuments(props.documents);
    } else {
      setSearchedDocuments(
        props.documents.filter(
          (document) =>
            document.name.toLowerCase().includes(search) ||
            (getValue("date", document.date.toLowerCase()) as string).includes(
              search
            )
        )
      );
    }
  };

  const mapDocumentElements = (document: Document) => {
    const elements = documentColumns.map((column) => {
      let value = document[column.id] || "/";

      return (
        <TableCell
          key={column.id}
          align={column.align}
          className={classes.bodyCell}
          style={{
            wordBreak: "break-word",
            minWidth: column.minWidth,
            width: column.width,
          }}
        >
          {getValue(column.id, value)}
        </TableCell>
      );
    });

    elements.push(
      <TableCell
        key="document"
        align="right"
        className={classes.bodyCell}
        style={{
          wordBreak: "break-word",
        }}
      >
        {props.handleSendEmail && props.sendToEmail && (
          <SendEmail
            documents={props.documents}
            email={props.sendToEmail!}
            onClick={props.handleSendEmail!}
            suggestedEmails={suggestedEmails}
            defaultDocument={document}
            // className={document.isSend ? classes.isSend : ""}
          />
        )}
      </TableCell>
    );

    elements.push(
      <TableCell
        key="preview"
        align="right"
        className={classes.bodyCell}
        style={{
          wordBreak: "break-word",
        }}
      >
        {["pdf", "jpeg", "jpg", "png"].includes(
          document.name.split(".").pop() || ""
        ) ? (
          <a href={document.content} target="_blank" rel="noreferrer">
            <Button variant="outlined" color="primary" className={classes.btn}>
              Open document
            </Button>
          </a>
        ) : null}
      </TableCell>
    );

    const dropDownItems = [
      <Button
        variant="outlined"
        color="primary"
        className={classes.btn}
        size="small"
        onClick={async (event) => {
          event.stopPropagation();
          const blob = b64toBlob(document.content, "");
          saveByteArray(`${document.id}`, blob);
        }}
      >
        Download
      </Button>,
      <CustomModal
        buttonName="Delete"
        onClick={() => {
          props.handleDelete(document.id);
        }}
        title="Delete Document"
        content={`Are you sure you want to delete document: ${document.id
          .split("-")
          .slice(1)
          .join("-")}?`}
        id={document["id"]!}
      />,
    ];

    const dropDownMenuActions = (
      <TableCell
        align="right"
        style={{
          minWidth: "5%",
          width: "5%",
        }}
      >
        <DropdownMenuActions items={dropDownItems} />
      </TableCell>
    );

    return [...elements, dropDownMenuActions];
  };

  return (
    <>
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
      <div className={classes.btnContainer}>
        <div className={classes.dropZone}>
          <div style={{ marginBottom: "25px" }}>
            <Button
              variant="outlined"
              color="primary"
              className={classes.btn}
              onClick={async () => {
                await props.handleSubmit(files!);
                setKey(Math.random());
              }}
              disabled={props.isBusy || (files && !files.getAll("file").length)}
            >
              {props.isBusy ? "uploading..." : "Upload"}
            </Button>
          </div>
          <br />
          <DropzoneArea
            key={key}
            previewGridClasses={{
              container: classes.dropZoneGridCointainer,
              image: "",
              item: "MuiGrid-grid-md-3",
            }}
            filesLimit={10}
            // useChipsForPreview={true}
            // showPreviews={true}
            // showPreviewsInDropzone={false}
            previewGridProps={{ container: { spacing: 1, direction: "row" } }}
            previewChipProps={{ classes: { root: classes.previewChip } }}
            // previewText="Избрани фајлови"
            onChange={(data) => {
              const formdata = new FormData();
              props.patient && formdata.append("directory", props.patient.id!);
              data.forEach((d) => {
                formdata.append("name", d.name);
                formdata.append("file", d);
              });
              setFiles(formdata);
            }}
            maxFileSize={100000000}
          />
          <br />
          <div>
            <Search
              className={classes.searchBar}
              handleSearch={handleSearchDocument}
              placeholder="Search by document or date"
            />
          </div>
        </div>
      </div>
      {!props.isBusy ? (
        <Paper className={classes.root} elevation={3}>
          {searchedDocuments.length === 0 ? (
            <h2 className={classes.noDocuments}>There are no documents!</h2>
          ) : (
            <EnhancedTable
              columns={[
                ...documentColumns,
                { id: "send email", label: "", align: "right" },
                { id: "preview", label: "", align: "right" },
                { id: "actionButtons", label: "", align: "right" },
              ]}
              rows={searchedDocuments.map((document) => {
                return {
                  elements: mapDocumentElements(document),
                  id: document.id,
                };
              })}
              onDownload={props.handleMultipleDownload}
            />
          )}
        </Paper>
      ) : (
        <CircularProgress size={60} style={{ marginTop: "32px" }} />
      )}
    </>
  );
};

export default withRouter(Documents);
