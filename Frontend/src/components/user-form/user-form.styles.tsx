import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: "80%", // Fix IE 11 issue.
    marginTop: theme.spacing(5),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  submit: {
    margin: theme.spacing(4, 0, 2),
    width: "35%",
    color: "white",
  },
  btnContainer: {
    display: "flex",
    width: "100%",
    justifyContent: "space-evenly",
    "& a": {
      width: "35%",
      textDecoration: "none",
      color: "white",

      "& button": {
        width: "100%"
      }
    }
  }
}));
export default useStyles;
