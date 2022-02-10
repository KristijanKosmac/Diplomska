import { AppBar, Toolbar, CssBaseline } from "@material-ui/core";
import logo from "../../assets/logo.png";
import useStyles from "./header.styles";

function Header() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <a href="/">
            <img src={logo} alt="logo" height="64px" className={classes.logo} />
          </a>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Header;
