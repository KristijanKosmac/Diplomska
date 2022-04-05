import { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  Button,
  Paper,
  TableCell,
  CircularProgress,
  TextField,
} from "@material-ui/core";
import { DropzoneArea } from "material-ui-dropzone";

import CustomModal from "../../components/modal/modal.component";
import Search from "../../components/search/search.component";
import SendEmail from "../send-email/send-email";
import DropdownMenuActions from "../../components/dropdownMenuActions/dropdownMenuActions";
import EnhancedTable from "../select-table/select-table.component";

import useStyles from "./documents.styles";
import {
  Document,
  DocumentColumn,
  DocumentComment,
  DocumentComponentProps,
} from "../../types";
import { GlobalState } from "../../reducers";
import { getValue } from "../../utils/getValue";
import { saveByteArray } from "../../utils/saveByteArray";
import { b64toBlob } from "../../utils/base64ToBlob";

const Documents = (props: DocumentComponentProps) => {
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
  const [documentsComments, setDocumentsComments] = useState<DocumentComment[]>(
    []
  );
  const [currentDocumentName, setCurrentDocumentName] = useState("");
  const [currentDocumentComment, setCurrentDocumentComment] = useState("");

  const classes = useStyles();

  const documentColumns: DocumentColumn[] = [
    { id: "name", label: "Document Name" },
    { id: "date", label: "Upload Date" },
    { id: "comment", label: "Comment", width: "30%" },
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
            text={document.comment}
            // className={document.isSend ? classes.isSend : ""}
          />
        )}
      </TableCell>
    );

    const dropDownItems = [
      <CustomModal
        buttonName="Edit"
        disabled={props.disableButtons}
        onClick={() => {
          props.handleEditDocument(
            `${document.id.split("/").slice(0, -1).join("/")}/${
              currentDocumentName || document.name
            }`,
            document.id,
            document.comment,
            currentDocumentComment || document.comment
          );

          setCurrentDocumentComment("");
          setCurrentDocumentName("");
        }}
        title="Edit Document"
        content={
          <div>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id={document.id}
              label="Name"
              type="text"
              name={"name"}
              autoFocus
              value={currentDocumentName || document.name}
              onChange={(value) => {
                setCurrentDocumentName(value.target.value);
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id={document.id}
              label="Comment"
              type="text"
              name={"comment"}
              minRows={1}
              maxRows={5}
              multiline
              autoFocus
              value={currentDocumentComment || document.comment}
              onChange={(value) => {
                setCurrentDocumentComment(value.target.value);
              }}
            />
          </div>
        }
        id={document["id"]!}
      />,
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
        disabled={props.disableButtons}
        buttonName="Delete"
        onClick={() => {
          props.handleDelete(document.id);
        }}
        title="Delete Document"
        content={`Are you sure you want to delete document: ${document.name}?`}
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
          <div style={{ marginBottom: "10px", float: "right" }}>
            <CustomModal
              id="FileUpload"
              buttonName={props.isBusy ? "uploading..." : "Upload"}
              title="Files ready to upload"
              onClick={() => props.handleSubmit(files!, documentsComments)}
              disabled={
                props.isBusy ||
                (files && !files.getAll("file").length) ||
                props.disableButtons
              }
              content={documentsComments.map((doc, index) => {
                return (
                  <div className={classes.commentDisplay}>
                    <label>{doc.fileName}</label>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id={doc.fileName}
                      label="Comment"
                      type="text"
                      name={doc.fileName}
                      minRows={1}
                      maxRows={5}
                      multiline
                      autoFocus
                      value={doc.comment}
                      onChange={(value) => {
                        let updatedDocumentComments = [...documentsComments];
                        updatedDocumentComments[index] = {
                          fileName: doc.fileName,
                          comment: value.target.value,
                        };

                        setDocumentsComments(updatedDocumentComments);
                      }}
                    />
                  </div>
                );
              })}
            />
            {/* <Button
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
            </Button> */}
          </div>
          <br />
          <DropzoneArea
            key="0"
            previewGridClasses={{
              container: classes.dropZoneGridCointainer,
              image: "",
              item: "MuiGrid-grid-md-3",
            }}
            filesLimit={10}
            previewGridProps={{ container: { spacing: 1, direction: "row" } }}
            previewChipProps={{ classes: { root: classes.previewChip } }}
            onChange={(data) => {
              const formdata = new FormData();
              props.patient && formdata.append("directory", props.patient.id!);
              setDocumentsComments(
                data.map((d) => {
                  formdata.append("name", d.name);
                  formdata.append("file", d);
                  return { fileName: d.name, comment: "" };
                })
              );
              setFiles(formdata);
            }}
            maxFileSize={props.disableButtons ? 0 : 100000000}
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
