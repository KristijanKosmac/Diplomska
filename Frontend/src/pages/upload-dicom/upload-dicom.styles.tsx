import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "80%",
    marginTop: "1%",
    marginBottom: "3%",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1100px)"]: {
      width: "80%",
    },
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      width: "90%",
    },
  },
  btn: {
    float: "right",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1100px)"]: {
      width: "fit-content",
      float: "left",
      margin: theme.spacing(1, 0),
    },
  },
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  bodyCell: {
    padding: theme.spacing(2, 1),
  },
  gridContainer: {
    padding: "20px",
    textAlign: "center",
    "& div": {
      fontSize: "16px"
    }
  },
  appBar: {
    width: "80%",
    color: "#01A8C2",
    backgroundColor: "#fafafa",
    boxShadow: "none",
    marginBottom: "15px"
  },
  circularProgress: {
    verticalAlign: "middle",
    color: "gray",
    marginRight: "10px"
  },
  btnContainer: {
    width: "80%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1100px)"]: {
      width: "80%",
      flexDirection: "column",
    },
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      width: "90%",
    },
  },
  noDocuments: {
    margin: "0",
    padding: "10px 2px",
    textAlign: "center",
    border: "1px solid brown",
    color: "brown",
  },
  dropZone: {
    width: "100%",
    paddingTop: "20px",

    "&>:nth-child(2)": {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "10px",
    },
  },
  dropZoneGridCointainer: {
    width: "100% !important",
  },
}));

export default useStyles;
