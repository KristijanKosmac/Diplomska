import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  deleteIcon: {
    alignSelf: "center",
    padding: "0 10px",
    color: "#01A8C2",
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  root: {
    display: "flex",
    flexDirection: "row",
    width: "45%",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1300px)"]: {
      width: "52%",
    },
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1100px)"]: {
      width: "62%",
    },
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      width: "72%",
    },
    alignItems: "center"
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    color: "#01A8C2",
    border: "1px solid #01A8C2",
    marginLeft: 0,
    width: "100%",
    height: "37px",
    display: "flex",
    flexDirection: "row",
  },
  searchIcon: {
    margin: theme.spacing(0, 0, 0, 1),
    height: "37px",
    width: "37px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#01A8C2",
    color: "white",
    borderRadius: "4px",
  },
  inputRoot: {
    flexGrow: 1,
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: "16px",
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

export default useStyles;
