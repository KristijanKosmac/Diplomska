import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    maxHeight: "65vh",
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
  cell: {
    background: theme.palette.primary.main,
    color: "#fff",
    padding: theme.spacing(2, 1),
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1300px)"]: {
      padding: theme.spacing(2, 0),
    },
  },
  bodyCell: {
    padding: theme.spacing(2, 1),
  },
  pointer: {
    cursor: "pointer"
  }
}));

export default useStyles;
