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
import CustomSelect from "../select/select";

import useStyles from "./documents.styles";
import { Document, DocumentColumn, DocumentComponentProps } from "../../types";
import { GlobalState } from "../../reducers";
import { getValue } from "../../utils/getValue";
import {
  documentTypes,
  mapTypesFromCyrillic,
  mapTypesToCyrillic,
} from "../../constants/document-types";
import { getPetBackendAPI } from "../../api";

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
    { id: "name", label: "Име на документ" },
    { id: "date", label: "Датум на прикачување" },
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

  const handleTypeChange = async (documentType: string, key: string) => {
    try {
      await getPetBackendAPI().setDocumentType(key, documentType);
    } catch (err: any) {
      console.log(err);
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
        align="left"
        className={classes.bodyCell}
        style={{
          wordBreak: "break-word",
        }}
      >
        <CustomSelect
          items={documentTypes}
          name="Тип на документ"
          onChange={(value) =>
            value &&
            value !== document.type &&
            handleTypeChange(mapTypesFromCyrillic.get(value)!, document.id)
          }
          value={mapTypesToCyrillic.get(document.type)}
        />
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
          <a href={document.url} target="_blank" rel="noreferrer">
            <Button variant="outlined" color="primary" className={classes.btn}>
              Види документ
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
        // onClick={async (event) => {}}
      >
        <a
          href={document.url}
          target="_blank"
          title={document.name}
          download={document.name}
          style={{
            color: "inherit",
            textDecoration: "none",
          }}
          rel="noreferrer"
        >
          Превземи
        </a>
      </Button>,
      <CustomModal
        buttonName="Избриши"
        onClick={() => {
          props.handleDelete(document.id);
        }}
        title="Избриши документ"
        content={`Дали сте сигурни дека сакате да го избришете документот ${document.id
          .split("/")
          .slice(1)
          .join("/")}?`}
        id={document["id"]!}
      />,
    ];

    props.handleSendEmail &&
      props.sendToEmail &&
      dropDownItems.push(
        <SendEmail
          documents={props.documents}
          email={props.sendToEmail}
          onClick={props.handleSendEmail}
          suggestedEmails={suggestedEmails}
          defaultDocument={document}
          className={document.isSend ? classes.isSend : ""}
        />
      );
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
          <div style={{ marginBottom: "60px" }}>
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
              {props.isBusy ? "Се прикачува..." : "Започни прикачување"}
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
            useChipsForPreview={true}
            showPreviews={true}
            showPreviewsInDropzone={false}
            previewGridProps={{ container: { spacing: 1, direction: "row" } }}
            // previewChipProps={{classes: { root: classes.previewChip } }}
            previewText="Избрани фајлови"
            onChange={(data) => {
              const formdata = new FormData();
              props.patient &&
                formdata.append("directory", props.patient.id!);
              props.examination &&
                formdata.append("directory", props.examination.id);
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
              placeholder="пребарувај по име на документ и датум"
            />
          </div>
        </div>
      </div>
      {!props.isBusy ? (
        <Paper className={classes.root} elevation={3}>
          {searchedDocuments.length === 0 ? (
            <h2 className={classes.noDocuments}>Нема документи!</h2>
          ) : (
            <EnhancedTable
              columns={[
                ...documentColumns,
                {
                  id: "type",
                  label: "Тип на документ",
                  align: "left",
                  width: "25%",
                },
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
