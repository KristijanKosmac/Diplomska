import { FormEvent, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { StaticContext } from "react-router";

import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Typography,
  Container,
  Grid,
} from "@material-ui/core";
import { AccountBoxOutlined as AccountBoxOutlinedIcon } from "@material-ui/icons";
import useStyles from "./add-edit-patient.styles";
import patientValidation from "../../utils/validations/patient-validation";
import { getPetBackendAPI } from "../../api";
import { Patient } from "../../types";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import DateFnsUtils from "@date-io/date-fns";
import CustomSelect from "../../components/select/select";
import { citizenships } from "../../constants/citizenship"

export default function AddEditPatient(
  props: RouteComponentProps<
    {},
    StaticContext,
    {
      patient: Patient;
      successMessage?: string;
    }
  >
) {
  const classes = useStyles();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [petId, setPetId] = useState<number>();
  const [telephoneNumber, setTelephoneNumber] = useState("");
  const [secondTelephoneNumber, setSecondTelephoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<string>();
  const [EMBG, setEMBG] = useState("");
  const [address, setAddress] = useState("");
  const [citizenship, setCitizenship] = useState("");
  const [sex, setSex] = useState<"male" | "female">();

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    PET: "",
    telephoneNumber: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const [isUpdate] = useState(
    window.location.href.split("/").reverse()[0] === "edit" ? true : false
  );

  useEffect(() => {
    if (props.location.state) {
      const patient = props.location.state.patient;
      setFirstName(patient.name);
      setLastName(patient.surname);
      setPetId(patient.petId as unknown as number);
      setEmail(patient.email!);
      setTelephoneNumber(patient.telephoneNumber)
      setSecondTelephoneNumber(patient.secondTelephoneNumber || "")
      setDateOfBirth(patient.dateOfBirth)
      setEMBG(patient.EMBG || "")
      setAddress(patient.address || "")
      setCitizenship(patient.citizenship || "")
      setSex(patient.sex)
    }
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { errors, valid } = patientValidation({
      firstName,
      lastName,
      PET: petId!,
      telephoneNumber,
    });

    if (valid) {
      try {
        if (isUpdate) {
          await getPetBackendAPI().updatePatientDetails(
            props.location.state.patient.petId,
            {
              createdAt: props.location.state.patient.createdAt,
              name: firstName,
              surname: lastName,
              petId: petId!.toString(),
              telephoneNumber,
              EMBG, 
              address,
              citizenship,
              dateOfBirth: dateOfBirth ? Date.parse(dateOfBirth): undefined ,
              secondTelephoneNumber,
              sex: sex as any,
              email,
            }
          );
        } else {
          await getPetBackendAPI().addPatient({
            name: firstName,
            surname: lastName,
            petId: petId!.toString(),
            telephoneNumber,
            EMBG, 
            address,
            citizenship,
            dateOfBirth: dateOfBirth ? Date.parse(dateOfBirth): undefined ,
            secondTelephoneNumber,
            sex: sex as any,
            email,
          });
        }

        props.history.push({
          pathname: "/patients",
          state: {
            successMessage: `Successfully ${
              isUpdate ? "edited" : "added"
            } patient!`,
            patient: {
              surname: lastName,
              name: firstName,
              petId: petId!.toString(),
              telephoneNumber,
              secondTelephoneNumber,
              email,
              createdAt: new Date().getTime(),
              EMBG,
              address,
              citizenship,
              dateOfBirth,
              sex,
            },
          },
        });
      } catch (error: any) {
        console.log(error)
        setErrorMessage(error.response.data.message);
      }
    } else {
      setErrors(errors);
    }
  }

  return (
    <Container component="main" maxWidth="lg">
      {errorMessage && (
        <div className="errorMessage" style={{ margin: "20px auto 0" }}>
          {errorMessage}
        </div>
      )}
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <AccountBoxOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {isUpdate ? "Промени податоци за пациент" : "Креирај Пациент"}
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={5}>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="petId"
                label="ПЕТ број"
                disabled={isUpdate}
                type="number"
                name="petId"
                autoComplete="petId"
                value={petId}
                onChange={(event) => setPetId(+event.target.value)}
                error={!!errors.PET}
                helperText={errors.PET}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="firstName"
                label="Име"
                type="text"
                name="firstName"
                autoComplete="firstName"
                autoFocus
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="lastName"
                label="Презиме"
                type="text"
                name="lastName"
                autoComplete="lastName"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="telephoneNumber"
                label="Телефонски број"
                type="telephoneNumber"
                name="telephoneNumber"
                autoComplete="telephoneNumber"
                value={telephoneNumber}
                onChange={(event) => setTelephoneNumber(event.target.value)}
                error={!!errors.telephoneNumber}
                helperText={errors.telephoneNumber}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="secondTelephoneNumber"
                label="Втор телефонски број"
                type="text"
                name="secondTelephoneNumber"
                autoComplete="secondTelephoneNumber"
                autoFocus
                value={secondTelephoneNumber}
                onChange={(event) =>
                  setSecondTelephoneNumber(event.target.value)
                }
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="email"
                label="Емаил"
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="EMBG"
                label="ЕМБГ"
                type="text"
                name="EMBG"
                autoComplete="EMBG"
                value={EMBG}
                onChange={(event) => setEMBG(event.target.value)}
              />
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container justifyContent="space-around">
                  <DatePicker
                    defaultValue={null}
                    inputVariant="outlined"
                    disableFuture
                    margin="normal"
                    fullWidth
                    id="datePicker"
                    name="dateOfBirth"
                    cancelLabel="Cancel"
                    label="Датум на раѓање"
                    format="dd-MM-yyyy"
                    value={!dateOfBirth ? null : new Date(dateOfBirth)}
                    onChange={(date: MaterialUiPickersDate) =>
                      setDateOfBirth(new Date(date!).toISOString())
                    }
                  />
                </Grid>
              </MuiPickersUtilsProvider>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="address"
                label="Адреса"
                type="text"
                name="address"
                autoComplete="address"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
              />
              <CustomSelect
                value={citizenship}
                items={citizenships}
                errorMessage=""
                name="Државјанство"
                onChange={(value) => {
                  setCitizenship(value);
                }}
              />
              <CustomSelect
                value={sex || ""}
                items={["male", "female"]}
                errorMessage=""
                name="Пол"
                onChange={(value) => {
                  setSex(value);
                }}
              />
            </Grid>
          </Grid>
          <div className={classes.btnContainer}> 
            <Button
              variant="contained"
              className={classes.submit}
              color="primary"
              onClick={() => {
                props.history.push("/patients")
              }}
            >
              Откажи
            </Button>
            <Button
              type="submit"
              variant="contained"
              className={classes.submit}
              color="primary"
            >
              {isUpdate ? "Промени" : "Креирај"}
            </Button>
          </div>
        </form>
      </div>
    </Container>
  );
}
