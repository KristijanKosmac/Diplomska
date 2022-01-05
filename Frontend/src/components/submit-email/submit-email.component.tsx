import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Box,
  Typography,
  Container,
} from "@material-ui/core";
import { LockOutlined as LockOutlinedIcon } from "@material-ui/icons";
import { SubmitEmailProps } from "../../types/index";
import Copyright from "../copyright-footer/copyright-footer.component";
import useStyles from "./submit-email.styles";

import emailValidation from "../../utils/validations/email-validation";
import { FormEvent, useEffect, useState } from "react";

export default function SumbitEmail({
  buttonName,
  onChange,
  onSubmit
}: SubmitEmailProps) {
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    onChange &&
      onChange({
        email
      });
  }, [email, onChange]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { error, valid } = emailValidation(email);

    setError(error);

    if(valid){
        onSubmit();
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Enter email
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email address"
            type="email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={!!error}
            helperText={error}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            className={classes.submit}
            color="primary"
          >
            {buttonName}
          </Button>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
