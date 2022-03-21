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
import CustomSelect from "../../components/select/select";
import DatePicker from "../../components/date-picker/date-picker.component";
import patientValidation from "../../utils/validations/patient-validation";
import { patientAPI, doctorAPI } from "../../api";
import { Doctor, Patient } from "../../types";
import { citizenships } from "../../constants/citizenship";
import { useDispatch, useSelector } from "react-redux";
import { GlobalState } from "../../reducers";
import { getUser } from "../../actions/user/user";
import { bloodTypes } from "../../constants/blood-types";

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
  const dispatch = useDispatch();
  
  const { profile } = useSelector(
    (state: GlobalState) => state.user
  );

  const [patient, setPatient] = useState<Patient>({
    EMBG: 0,
    dateOfBirth: "",
    email: "",
    familyDoctor: profile.id,
    firstName: "",
    lastName: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    EMBG: "",
    dateOfBirth: "",
    email: "",
    familyDoctor: ""
  });
  const [errorMessage, setErrorMessage] = useState("");

  const [isUpdate] = useState(
    window.location.href.split("/").reverse()[0] === "edit" ? true : false
  );

  const [doctors, setDoctors] = useState<Doctor[]>([])

  useEffect(() => {
    if (props.location.state) {
      const patient = props.location.state.patient;
      setPatient(patient);
    }
    dispatch(getUser());
    fetchDoctors()
  }, []);

  const fetchDoctors = async () => {
    try {
      const { data } = await doctorAPI.getAllDoctors();

      setDoctors(data as Doctor[])
    } catch (err: any) {
      setErrorMessage(err)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { errors, valid } = patientValidation(patient);
  
    if (valid) {
      try {
        if (isUpdate) {
          await patientAPI.updatePatient(props.location.state.patient.id!, patient ).catch(err => {throw err})
        } else {
          await patientAPI.createPatient(patient).catch(err => {throw err})
        }

        props.history.push({
          pathname: "/patients",
          state: {
            successMessage: `Successfully ${
              isUpdate ? "edited" : "added"
            } patient!`,
            patient
          },
        });
      } catch (error: any) {
        console.log(error);
        setErrorMessage(error.response.data.message);
      }
    } else {
      setErrors(errors);
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPatient({ ...patient, [event.target.name]: event.target.value });
  };

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
          {isUpdate ? "Update Patient Info" : "Create Patient"}
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={5}>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="firstName"
                label="First Name"
                type="text"
                name="firstName"
                autoComplete="firstName"
                autoFocus
                value={patient.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                type="text"
                name="lastName"
                autoComplete="lastName"
                value={patient.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                required
                id="email"
                label="Email"
                type="email"
                name="email"
                autoComplete="email"
                value={patient.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                required
                id="EMBG"
                label="EMBG"
                type="text"
                name="EMBG"
                autoComplete="EMBG"
                value={patient.EMBG}
                onChange={handleChange}
                error={!!errors.EMBG}
                helperText={errors.EMBG}
              />
              <DatePicker
                name="dateOfBirth"
                onChange={(dateOfBirth) => {
                  setPatient({ ...patient, dateOfBirth });
                }}
                value={patient.dateOfBirth!}
              />
              <CustomSelect
                value={patient.familyDoctor || ""}
                items={doctors}
                errorMessage=""
                required
                objectParametars={["firstName", "lastName"]}
                name="Family Doctor"
                onChange={(familyDoctor) => {
                  setPatient({ ...patient, familyDoctor });
                }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="telephoneNumber"
                label="Telephone Number"
                type="telephoneNumber"
                name="telephoneNumber"
                autoComplete="telephoneNumber"
                value={patient.telephoneNumber}
                onChange={handleChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="address"
                label="Address"
                type="text"
                name="address"
                autoComplete="address"
                value={patient.address}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="country"
                label="country"
                type="text"
                name="country"
                autoComplete="country"
                value={patient.country}
                onChange={handleChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="city"
                label="city"
                type="text"
                name="city"
                autoComplete="city"
                value={patient.city}
                onChange={handleChange}
              />
               <CustomSelect
                value={patient.nationality || ""}
                items={citizenships}
                errorMessage=""
                name="Nationality"
                onChange={(nationality) => {
                  setPatient({ ...patient, nationality });
                }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="height"
                label="Height"
                type="number"
                name="height"
                autoComplete="height"
                value={patient.height}
                onChange={handleChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="weight"
                label="weight"
                type="number"
                name="weight"
                autoComplete="weight"
                value={patient.weight}
                onChange={handleChange}
              />
              <CustomSelect
                value={patient.sex || ""}
                items={["Male", "Female"]}
                errorMessage=""
                name="Sex"
                onChange={(sex) => {
                  setPatient({ ...patient, sex });
                }}
              />
              <CustomSelect
                value={patient.bloodType || ""}
                items={bloodTypes}
                errorMessage=""
                name="Blood Type"
                onChange={(bloodType) => {
                  setPatient({ ...patient, bloodType });
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
                props.history.push("/patients");
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              className={classes.submit}
              color="primary"
            >
              {isUpdate ? "Edit" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </Container>
  );
}
