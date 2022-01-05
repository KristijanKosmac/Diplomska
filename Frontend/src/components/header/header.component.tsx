import { AppBar, Toolbar, CssBaseline } from "@material-ui/core";
import logo from "../../assets/PET_Logo.png";
import useStyles from "./header.styles";
import { useHistory } from "react-router";

function Header() {
  const classes = useStyles();
  const history = useHistory();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <a href="https://uipet.mk">
            <img
              src={logo}
              alt=""
              height="64px"
              className={classes.logo}
            />
          </a>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Header;
