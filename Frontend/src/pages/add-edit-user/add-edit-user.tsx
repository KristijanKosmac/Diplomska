import { FormEvent, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { StaticContext } from "react-router";
import { useDispatch, useSelector } from "react-redux";
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

import { User } from "../../types";

import { GlobalState } from "../../reducers";
import { createUser } from "../../actions";

import CustomSelect from "../../components/select/select";
import useStyles from "./add-edit-user.styles";
import CreateUserValidation from "../../utils/validations/create-user-validation";

export default function AddEditUser(
  props: RouteComponentProps<{}, StaticContext, { data: User }>
) {
  const dispatch = useDispatch();
  const { successMessage, errorMessage, isLoading } = useSelector(
    (state: GlobalState) => state.user
  );
  const classes = useStyles();

  // const [role, setRole] = useState("");
  const [email, setEmail] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    // role: "",
  });
  // const roles = "";

  useEffect(() => {
    if (props.location.state && props.location.state.data) {
      const { email } = props.location.state.data;

      setEmail(email);
      // setRole(role);
    }
  }, []);

  const [isUpdate] = useState(
    window.location.href.split("/").reverse()[0] === "edit" ? true : false
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isUpdate) {
      const { email, institution, id } = props.location.state.data;

      // const req = {
      //   role,
      //   institution,
      //   email,
      // }

      props.history.push("/users")
    } else {
      const { errors, valid } = CreateUserValidation({ email });
      setErrors(errors);
      
      valid && dispatch(createUser(email, props.history));
    }
  };

  return (
    <Container component="main" maxWidth="md">
      {successMessage && (
        <div className="successMessage" style={{ margin: "20px auto 0" }}>
          {successMessage}
        </div>
      )}
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
          {isUpdate ? "Edit User" : "Create User"}
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={5}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="email"
              type="text"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              disabled={isUpdate}
              onChange={(event) => setEmail(event.target.value)}
              error={!!errors.email}
              helperText={errors.email}
            />
            {/* <CustomSelect
              required
              items={roles}
              errorMessage={errors.role}
              name="Улога"
              onChange={(value) => setRole(UserRole[value as UserRole])}
              value={role}
            /> */}
          </Grid>
          <div className={classes.btnContainer}> 
            <Button
              variant="contained"
              className={classes.submit}
              color="primary"
              onClick={() => {
                props.history.push("/users")
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              className={classes.submit}
              color="primary"
              disabled={isLoading}
            >
              {isUpdate ? "Edit" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </Container>
  );
}
