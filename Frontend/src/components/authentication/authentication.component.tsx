import { FormEvent, useEffect, useState } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
} from "@material-ui/core";

import useStyles from "./authentication.styles";
import userValidation from "../../utils/validations/user-validation";
import { LockOutlined as LockOutlinedIcon } from "@material-ui/icons";
import { AuthenticationProps } from "../../types/index";

import Copyright from "../copyright-footer/copyright-footer.component";

export default function Authentication({
  links,
  title,
  onChange,
  onSubmit,
}: AuthenticationProps) {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  useEffect(() => {
    onChange &&
      onChange({
        email,
        password,
      });
  }, [email, password, onChange]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { errors, valid } = userValidation(email, password);
    setErrors(errors);

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
          {title}
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="email"
                type="email"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                error={!!errors.password}
                helperText={errors.password}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {title}
          </Button>
          <Grid container>
            {links.map((link, index) => (
              <Grid item style={{ flexGrow: index % 2 ? 0 : 1 }} key={index}>
                <Link href={link.href} variant="body2">
                  {link.content}
                </Link>
              </Grid>
            ))}
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}
