import { useEffect, useState } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { StaticContext } from "react-router";

import { Paper, TableCell, CircularProgress, Button } from "@material-ui/core";

import { Patient, Study, StudyColumn, UnassignesStudies } from "../../types";

import Search from "../../components/search/search.component";
import CustomTable from "../../components/table/table";

import useStyles from "./unassigned-studies.style";
import { getValue } from "../../utils/getValue";
import { useDispatch, useSelector } from "react-redux";
import { GlobalState } from "../../reducers";

import { getAllUnassignedStudies } from "../../actions/studies/unassigned-studies";

const PatientsListPage = (
  props: RouteComponentProps<
    {},
    StaticContext,
    {
      patient: Patient;
      successMessage?: string;
    }
  >
) => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [searchedStudies, setSearchedStudies] = useState<UnassignesStudies[]>([]);

  const classes = useStyles();


  const columns: StudyColumn[] = [
    { id: "studyDate", label: "Датум на студија" },
    { id: "patientId", label: "ПЕТ број" },
    { id: "patientName", label: "Име на пациент" },
    { id: "studyID", label: "Број на студија" },
    { id: "institutionName", label: "Институција" },
    { id: "lastUpdate", label: "Последна промена" },
    { id: "studyDescription", label: "Опис" },
  ];

  const dispatch = useDispatch();

  const { studies, isLoading } = useSelector(
    (state: GlobalState) => state.unassignedStudies
  );

  console.log(studies)
  useEffect(() => {
    setSearchedStudies(studies);
  }, [studies]);

  const fetch = async () => {
    dispatch(getAllUnassignedStudies());
  };

  useEffect(() => {
    if (props.location.state && props.location.state.successMessage) {
      setSuccessMessage(props.location.state.successMessage);
    }

    fetch();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 5000);
  }, [errorMessage, successMessage]);

  const handleSearchPatients = (search: string) => {
    search = search.toLowerCase().trim();
    if (search === "") {
      setSearchedStudies(studies);
    } else {
      setSearchedStudies(
        studies.filter(
          (study) =>
            study.id.toString().toLocaleLowerCase().includes(search) ||
            study.patientId.toString().toLocaleLowerCase().includes(search) ||
            study.patientName.toString().toLocaleLowerCase().includes(search) ||
            (getValue("date", study.studyDate) as string).includes(search)
        )
      );
    }
  };

  const mapElements = (study: UnassignesStudies) => {
    const elements = columns.map((column) => {
      let value = study[column.id] || "/";

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
        key={"button"}
        align={"right"}
        className={classes.bodyCell}
        style={{
          wordBreak: "break-word",
          minWidth: "10%",
          width: "13%"
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          className={classes.btn}
          size="small"
          onClick={(event) => {
            props.history.push({
              pathname: "/patients/add",
              state: {
                patient: {
                  name: study.patientMainDicomTags.patientName.split("^")[1],
                  surname: study.patientMainDicomTags.patientName.split("^")[0],
                  sex: study.patientMainDicomTags.patientSex === "F" ? "female" : study.patientMainDicomTags.patientSex === "M" ? "male" : undefined,
                  petId: study.patientId,
                  createdAt: 0,
                  telephoneNumber: ""
                }
              },
            });
            event.stopPropagation();
          }}
        >
          Креирај Пациент
        </Button>
      </TableCell>
    );

    return [...elements];
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
      <h1>Недоделени Студии</h1>
      <div className={classes.btnContainer}>
        <Button
          variant="outlined"
          color="primary"
          className={classes.btn}
          onClick={() => props.history.push("/studies/upload")}
        >
          Прикачи DICOM
        </Button>
        <Search
          handleSearch={handleSearchPatients}
          placeholder="пребарувај по датум, ПЕТ број, име и презиме"
        />
      </div>
      {!isLoading ? (
        <Paper className={classes.root} elevation={3}>
          {searchedStudies && searchedStudies.length === 0 ? (
            <h2 className={classes.noPatients}>
              Нема недоделени студии!
            </h2>
          ) : (
            <CustomTable
              columns={columns}
              rows={searchedStudies.map((study) => {
                return {
                  elements: mapElements(study),
                };
              })}
            />
          )}
        </Paper>
      ) : (
        <CircularProgress size={60} style={{ marginTop: "32px" }} />
      )}
    </div>
  );
};

export default withRouter(PatientsListPage);
