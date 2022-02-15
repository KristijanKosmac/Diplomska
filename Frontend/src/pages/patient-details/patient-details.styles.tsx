import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "80%",
    marginBottom: "3%",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1100px)"]: {
      width: "80%",
    },
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      width: "90%",
    },

    "& > div": {
      marginBottom: "50px",

      "& button": {
        float: "right"
      }
    }
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
    marginRight: "10px",

   
  },
  documentWrapper: {
    width: "80%",
    "& > div:nth-of-type(1)": {
      display: "grid",
      gridTemplateColumns: "40% auto",
      
      "& > button": {
        width: "100px",
        height: "40px"
      }
    }
  }
}));

export default useStyles;
