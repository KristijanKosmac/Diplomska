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

import useStyles from "./user-form.styles";

import { UserRole, UserFormProps } from "../../types";

import UserValidation from "../../utils/validations/user-role.validation";

export default function UserForm(props: UserFormProps) {
  const classes = useStyles();

  const [id, setId] = useState("");
  const [institution, setInstitution] = useState("");
  const [role, setRole] = useState(
    props.user ? props.user.role : UserRole.Nurse
  );
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    institution: "",
    role: "",
  });
  const [institutions, setInstitutions] = useState([
    "УИ ПЕТ"
  ]);
  const roles = Object.values(UserRole)

  useEffect(() => {
    if (props.user) {
      const { email, firstName, id, institution, lastName, role } = props.user;

      setEmail(email);
      setInstitution(institution);
      setFirstName(firstName);
      setLastName(lastName);
      setRole(role);
      setId(id);
    }
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { errors, valid } = UserValidation({
      firstName,
      lastName,
      email,
      institution,
      role,
      id: "asda",
    });
    setErrors(errors);

    if (valid) {
      props.onSubmit({ id, email, firstName, institution, lastName, role });
    }
  }

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
              autoFocus
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
              id="email"
              label="Емаил"
              type="text"
              name="email"
              disabled
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              error={!!errors.email}
              helperText={errors.email}
            />
            <CustomSelect
              required
              items={institutions}
              errorMessage={errors.institution}
              name="Институција"
              onChange={(value) => setInstitution(value)}
              value={institution}
            />
            <CustomSelect
              disabled={!!props.user!.role}
              required
              items={roles}
              errorMessage={errors.role}
              name="Улога"
              onChange={(value) => setRole(UserRole[value as UserRole])}
              value={role}
            />
          </Grid>
          <Button
            type="submit"
            variant="contained"
            className={classes.submit}
            color="primary"
          >
            {props.isUpdate ? "Промени" : "Креирај"}
          </Button>
        </form>
      </div>
    </Container>
  );
}
