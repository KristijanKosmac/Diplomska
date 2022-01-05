import { useEffect, useState } from "react";
import { withRouter} from "react-router-dom";

import { Button, Paper, TableCell, CircularProgress, Grid } from "@material-ui/core";

import { Examination, ExaminationColumn, ExaminationListProps } from "../../types";

import CustomModal from "../../components/modal/modal.component";
import DropdownMenuActions from "../../components/dropdownMenuActions/dropdownMenuActions";
import Search from "../../components/search/search.component";
import CustomTable from "../../components/table/table";

import useStyles from "./examination-list.style";
import { getValue } from "../../utils/getValue";

const ExaminationList = (
  props: ExaminationListProps
) => {
  const [searchedExaminations, setSearchedExaminations] = useState<Examination[]>(
    props.examinations
  );

  const classes = useStyles();

  const columns: ExaminationColumn[] = [
    { id: "date", label: "Датум на преглед" },
    { id: "examinationType", label: "Тип на преглед" },
    { id: "changedBy", label: "Променето од" },
    { id: "updatedAt", label: "Последна промена" },
  ];

  const handleSearchExaminations = (search: string) => {
    search = search.toLowerCase().trim();
    if (search === "") {
      setSearchedExaminations(props.examinations);
    } else {
      setSearchedExaminations(
        props.examinations.filter(
          (examination) =>
            examination.examinationType.toLowerCase().includes(search) ||
            (getValue("date" ,examination.date!) as string).includes(search)
        )
      );
    }
  };

  useEffect(() => {
    setSearchedExaminations(props.examinations);
  }, [props.examinations]);

  const mapElements = (examination: Examination) => {
    const elements = columns.map((column) => {
      let value = examination[column.id] || "/";

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
              onClick={() => props.history.push({
                pathname: "/examinations/edit",
                state: {
                  examination,
                  patientId: props.patientId
                }
              })}
            >
              Промени
            </Button>,
             <CustomModal
              buttonName="Избриши"
              onClick={() => {
                props.handleDelete(examination.id);
              }}
              title="Избриши пациент"
              content={`Дали сте сигурни дека сакаде да ги избришете прегледот?`}
              id={examination.id}
            />
          ]}
        />
      </TableCell>
    );

    return [...elements, dropDownMenuActions];
  };

  return (
    <>
       <div className={classes.btnContainer}>
        <Button
          variant="outlined"
          color="primary"
          className={classes.btn}
          onClick={() => props.history.push({
            pathname: "/examinations/add",
            state: {
              patientId: props.patientId
            }
          })}
        >
          Додади Преглед
        </Button>
        <Search
          handleSearch={handleSearchExaminations}
          placeholder="пребарувај по датум и тип на преглед"
        />
      </div>
      {!props.isBusy ? (
        <Paper className={classes.root} elevation={3}>
          {searchedExaminations.length === 0 ? (
            <h2 className={classes.noExaminations}>There are no examinations!</h2>
          ) : (
            <CustomTable
              columns={[...columns]}
              rows={searchedExaminations.map((examination) => {
                return {
                  elements: mapElements(examination),
                  onClick: () => props.history.push({
                    pathname: `/examinations/${examination.id}`,
                    state: {
                      examination,
                      patientId: props.patientId
                    }
                  })
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
export default withRouter(ExaminationList);
