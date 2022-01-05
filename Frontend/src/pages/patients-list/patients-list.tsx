import { useEffect, useState } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { StaticContext } from "react-router";

import { Button, Paper, TableCell, CircularProgress } from "@material-ui/core";

import { Patient, PatientColumn } from "../../types";

import CustomModal from "../../components/modal/modal.component";
import DropdownMenuActions from "../../components/dropdownMenuActions/dropdownMenuActions";
import Search from "../../components/search/search.component";
import CustomTable from "../../components/table/table";

import useStyles from "./patients-list.style";
import { getPetBackendAPI } from "../../api";
import { getValue } from "../../utils/getValue";
import { useDispatch, useSelector } from "react-redux";
import { GlobalState } from "../../reducers";

import { getAllPatients } from "../../actions/patients/patients"

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
  const [searchedPatients, setSearchedPatients] = useState<Patient[]>([]);

  const classes = useStyles();

  const columns: PatientColumn[] = [
    { id: "petId", label: "ПЕТ број" },
    { id: "name", label: "Име" },
    { id: "surname", label: "Презиме" },
    { id: "telephoneNumber", label: "Телефонски број" },
    { id: "dateOfBirth", label: "Датум на раѓање"}
  ];

  const dispatch = useDispatch();

  const { patients, isLoading } = useSelector((state: GlobalState) => state.patients);

  useEffect(() => {
    setSearchedPatients(patients);
  }, [patients]);

  const fetch = async () => {
    dispatch(getAllPatients())
  };

  const handleDelete = async (id: string) => {
    try {
      await getPetBackendAPI().deletePatient(id);

      setTimeout(() => {
        fetch();
      }, 500);
      setSuccessMessage("Успешно избришан пациент");
    } catch (e: any) {
      setErrorMessage("Настана грешка при бришење на пациентот. Обидете се повторно");
    }
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
      setSearchedPatients(patients);
    } else {
      setSearchedPatients(
        patients.filter(
          (patient) =>
            patient.petId.toString().toLocaleLowerCase().includes(search) ||
            patient.EMBG!.toLowerCase().includes(search) ||
            (getValue("date", patient.dateOfBirth!) as string).includes(search)
        )
      );
    }
  };

  const mapElements = (patient: Patient) => {
    const elements = columns.map((column) => {
      let value = patient[column.id] || "/";

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
        key="dropdown"
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
              onClick={(event) => {
                props.history.push({
                  pathname: "/patients/edit",
                  state: {
                    patient: {
                      ...patient,
                      dateOfBirth: patient.dateOfBirth ? new Date(patient.dateOfBirth).toISOString() : undefined
                    }
                  },
                });
                event.stopPropagation();
              }}
            >
              Промени
            </Button>,
            <CustomModal
              buttonName="Избриши"
              onClick={() => {
                handleDelete(patient.petId);
              }}
              title="Избриши пациент"
              content={`Дали сте сигурни дека сакаде да ги избришете пациентот ${patient["name"]} ${patient["surname"]}?`}
              id={patient["petId"]!}
            />,
          ]}
        />
      </TableCell>
    );

    return [...elements, dropDownMenuActions];
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
      <h1>Сите Пациенти</h1>
      <div className={classes.btnContainer}>
        <Button
          variant="outlined"
          color="primary"
          className={classes.btn}
          onClick={() => props.history.push("/patients/add")}
        >
          Додади Пациент
        </Button>
        <Search
          handleSearch={handleSearchPatients}
          placeholder="пребарувај по датум, ПЕТ број и матичен број"
        />
      </div>
      {!isLoading ? (
        <Paper className={classes.root} elevation={3}>
          {searchedPatients && searchedPatients.length === 0 ? (
            <h2 className={classes.noPatients}>Нема пациенти!</h2>
          ) : (
            <CustomTable
              columns={columns}
              rows={searchedPatients.map((patient) => {
                return {
                  elements: mapElements(patient),
                  onClick: function () {
                    props.history.push({
                      pathname: `/patients/${patient.petId}`,
                      state: { patient },
                    });
                  },
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
