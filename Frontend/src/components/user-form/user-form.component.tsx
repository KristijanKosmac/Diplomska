import { FormEvent, useEffect, useState } from "react";

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

import CustomSelect from "../../components/select/select";
import DatePicker from "../date-picker/date-picker.component";
import useStyles from "./user-form.styles";
import { DoctorFormProps, Doctor } from "../../types";
import doctorValidation from "../../utils/validations/doctor.validation";
import { institutions } from "../../constants/institutions";
import { Link } from "react-router-dom";
export default function UserForm(props: DoctorFormProps) {
  const classes = useStyles();

  const [doctor, setDoctor] = useState<Doctor>({
    id: "",
    EMBG: 0,
    dateOfBirth: "",
    email: "",
    firstName: "",
    lastName: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    EMBG: "",
    dateOfBirth: "",
  });

  useEffect(() => {
    if (props.doctor) {
      setDoctor(props.doctor);
    }
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { errors, valid } = doctorValidation(doctor);
    setErrors(errors);
    if (valid) {
      props.onSubmit(doctor);
    }
  }
  // keyof Doctor
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDoctor({ ...doctor, [event.target.name]: event.target.value });
  };

  return (
    <Container component="main" maxWidth="md">
      {props.successMessage && (
        <div className="successMessage" style={{ margin: "20px auto 0" }}>
          {props.successMessage}
        </div>
      )}
      {props.errorMessage && (
        <div className="errorMessage" style={{ margin: "20px auto 0" }}>
          {props.errorMessage}
        </div>
      )}
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <AccountBoxOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {props.title}
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={5}>
            <Grid item xs={6} spacing={5}>
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
                value={doctor.firstName}
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
                autoFocus
                value={doctor.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                type="text"
                name="email"
                disabled
                autoComplete="email"
                autoFocus
                value={doctor.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="EMBG"
                label="EMBG"
                type="text"
                name="EMBG"
                autoComplete="EMBG"
                autoFocus
                value={doctor.EMBG}
                onChange={handleChange}
                error={!!errors.EMBG}
                helperText={errors.EMBG}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="telephoneNumber"
                label="Telephone Number"
                type="text"
                name="telephoneNumber"
                autoComplete="telephoneNumber"
                autoFocus
                value={doctor.telephoneNumber}
                onChange={handleChange}
              />
              <DatePicker
                name="Date of Birth"
                onChange={(dateOfBirth) =>
                  setDoctor({ ...doctor, dateOfBirth })
                }
                value={doctor.dateOfBirth}
              />
            </Grid>
            <Grid item xs={6} spacing={5}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="nationality"
                label="Nationality"
                type="text"
                name="nationality"
                autoComplete="nationality"
                autoFocus
                value={doctor.nationality}
                onChange={handleChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="address"
                label="address"
                type="text"
                name="Address"
                autoComplete="address"
                autoFocus
                value={doctor.address}
                onChange={handleChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="country"
                label="Country"
                type="text"
                name="country"
                autoComplete="country"
                autoFocus
                value={doctor.country}
                onChange={handleChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="city"
                label="City"
                type="text"
                name="city"
                autoComplete="city"
                autoFocus
                value={doctor.city}
                onChange={handleChange}
              />
              <CustomSelect
                items={institutions}
                name="Institutions"
                onChange={(value) => {
                  setDoctor({ ...doctor, institution: value });
                }}
                value={doctor.institution}
              />
            </Grid>
          </Grid>
          <div className={classes.btnContainer}>
            <Button
              type="submit"
              variant="contained"
              className={classes.submit}
              color="primary"
            >
              {props.isUpdate ? "Edit" : "Create"}
            </Button>
            <Link to="/profile/change-password" >
              <Button variant="contained" color="primary" className={classes.submit}>
                Change Password
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </Container>
  );
}
