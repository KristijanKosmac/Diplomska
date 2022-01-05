import { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";

import { Button, Paper, TableCell, CircularProgress } from "@material-ui/core";
import { Study, StudyColumn, StudiesListProps } from "../../types";

import Search from "../../components/search/search.component";
import DropdownMenuActions from "../../components/dropdownMenuActions/dropdownMenuActions";
import CustomTable from "../../components/table/table";

import useStyles from "./studies-list.styles";
import { getValue } from "../../utils/getValue";

const StudiesList = (props: StudiesListProps) => {
  const [searchedStudies, setSearchedStudies] = useState<Study[]>(
    props.studies
  );

  const classes = useStyles();

  const columns: StudyColumn[] = [
    { id: "studyDate", label: "Датум на студија" },
    { id: "studyID", label: "Број на студија" },
    { id: "institutionName", label: "Институција" },
    { id: "lastUpdate", label: "Последна промена" },
    { id: "studyDescription", label: "Опис" },
    { id: "patientName", label: "Име на пациент" },
  ];

  const handleSearchPatients = (search: string) => {
    search = search.toLowerCase().trim();
    if (search === "") {
      setSearchedStudies(props.studies);
    } else {
      setSearchedStudies(
        props.studies.filter(
          (study) =>
            study.studyID.toLowerCase().includes(search) ||
            (
              getValue("date", study.studyDate.toLowerCase()) as string
            ).includes(search)
        )
      );
    }
  };

  useEffect(() => {
    setSearchedStudies(props.studies);
  }, [props.studies]);

  const mapElements = (study: Study) => {
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

    const dropDownMenuActions = (
      <TableCell
        align="right"
        style={{
          minWidth: "5%",
          width: "5%",
        }}
      >
        <DropdownMenuActions
          items={[
            <Button
              variant="outlined"
              color="primary"
              className={classes.btn}
              size="small"
              onClick={() => props.downloadStudy(study.id, study.studyID)}
            >
              download
            </Button>
          ]}
        />
      </TableCell>
    );

    return [...elements, dropDownMenuActions];
  };

  return (
    <>
      <div className={classes.btnContainer}>
        <Search
          handleSearch={handleSearchPatients}
          placeholder="пребарувај по датум и број на студија"
        />
      </div>
      {!props.isBusy ? (
        <Paper className={classes.root} elevation={3}>
          {searchedStudies.length === 0 ? (
            <h2 className={classes.noExaminations}>There are no studies!</h2>
          ) : (
            <CustomTable
              columns={[...columns]}
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
    </>
  );
};

export default withRouter(StudiesList);
