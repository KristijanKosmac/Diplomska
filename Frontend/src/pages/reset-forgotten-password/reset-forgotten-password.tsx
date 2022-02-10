import { FormEvent, useEffect, useState } from "react";
import { LockOutlined as LockOutlinedIcon } from "@material-ui/icons";
import { RouteComponentProps } from "react-router-dom";
import passwordValidation from "../../utils/validations/password-validation";
import useStyles from "./reset-forgotten-password.styles";
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
import forgotPasswordValidation from "../../utils/validations/forgot-password-validation";

const ResetForgottenPasswordPage = (props: RouteComponentProps) => {
  const classes = useStyles();

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState({
    newPasswordError: "",
    confirmPasswordError: "",
    emailError: "",
    codeError: "",
  });

  const handleSendCodeToEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (email) {

        // await getUserManagementAPI().resetPassword({
        //   username,
        //   emailLanguage: ResetPasswordRequestEmailLanguageEnum.En,
        // } as ResetPasswordRequest);

        setShow(true);
        setSuccessMessage("Верификацискиот код е успешно испратен на вашата емаил адреса");
      } else {
        setError({
          emailError: "Емаил е задолжително поле",
          codeError: "",
          confirmPasswordError: "",
          newPasswordError: "",
        });
      }
    } catch (error: any) {
      setErrorMessage(error.response.data.message);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { error, valid } = forgotPasswordValidation(
      newPassword,
      confirmPassword,
      code,
      email
    );

    setError(error);

    if (valid) {
      try {

        setTimeout(() => props.history.push("/sign-in"), 2000);
      } catch (error: any) {
        setErrorMessage(error.response.data.message);
      }
      setShow(true);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 4000);
  }, [errorMessage, successMessage]);

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
            Ресетирај ја лозинката
          </Typography>
          <form className={classes.form} onSubmit={show ? handleSubmit : handleSendCodeToEmail}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="email"
              label="емаил"
              type="email"
              id="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              error={!!error.emailError}
              helperText={error.emailError}
            />
            {show && (
              <>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="code"
                  label="Code"
                  type="text"
                  id="code"
                  autoComplete="code"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  error={!!error.codeError}
                  helperText={error.codeError}
                />
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
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="confirmPassword"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  error={!!error.confirmPasswordError}
                  helperText={error.confirmPasswordError}
                />
              </>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              className={classes.submit}
              color="primary"
            >
              {show? "Submit" : "Send verification code"}
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

export default ResetForgottenPasswordPage;
