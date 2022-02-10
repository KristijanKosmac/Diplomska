import { FormEvent, useEffect, useState } from "react";
import { LockOutlined as LockOutlinedIcon } from "@material-ui/icons";
import { RouteComponentProps, withRouter } from "react-router-dom";
import passwordValidation from "../../utils/validations/password-validation";
import useStyles from "./change-password.styles";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
} from "@material-ui/core";
import Copyright from "../../components/copyright-footer/copyright-footer.component";
import { useDispatch, useSelector } from "react-redux";
import { GlobalState } from "../../reducers";
import { changePassword } from "../../actions";

const ChangePasswordPage = (props: RouteComponentProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { profile, successMessage, errorMessage } = useSelector(
    (state: GlobalState) => state.user
  );
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({
    newPasswordError: "",
    confirmPasswordError: ""
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { error, valid } = passwordValidation(newPassword, confirmPassword);

    setError(error);

    if (valid) {
      dispatch(
        changePassword(profile.id, newPassword, props.history)
      );
    }
  };

  return (
    <>
      {successMessage && <div className="successMessage">{successMessage}</div>}
      {errorMessage && <div className="errorMessage">{errorMessage}</div>}
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Change Password
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="newPassword"
              label="New Password"
              type="password"
              id="newPassword"
              autoComplete="newPassword"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              error={!!error.newPasswordError}
              helperText={error.newPasswordError}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Congirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="confirmPassword"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              error={!!error.confirmPasswordError}
              helperText={error.confirmPasswordError}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className={classes.submit}
              color="primary"
            >
              Change Password
            </Button>
          </form>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    </>
  );
};

export default withRouter(ChangePasswordPage);
