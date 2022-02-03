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
  btn: {
    float: "right",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1100px)"]: {
      width: "fit-content",
      float: "left",
      margin: theme.spacing(1, 0),
    },
  },
  noDocuments: {
    margin: "0",
    padding: "10px 2px",
    textAlign: "center",
    border: "1px solid brown",
    color: "brown",
  },
  bodyCell: {
    padding: theme.spacing(2, 1),
  },
  dropZone: {
    width: "100%",
    
    "&>:nth-child(2)": {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "10px",
    },
  },
  previewChip: {
    minWidth: 160,
    maxWidth: 210
  },
  dropZoneGridCointainer: {
    width: "100% !important",
  },
  searchBar: {
    alignItems: "flex-end",
    float: "left"
  },
  isSend: {
    "& button": {
      color: "#0c47b3",
      border: "1px solid #0c47b3"
    }
  },
}));

export default useStyles;
