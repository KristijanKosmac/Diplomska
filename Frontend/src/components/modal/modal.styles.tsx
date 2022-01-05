import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: "35%",
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      display: "flex",
      flexDirection: "column",
      outline: "none",
    },
    btn: {
      float: "right",
      color: "white",
      border: "1px solid white",
      minWidth: "fit-content",
      width: "fit-content",
      padding: "0 10px",
      "&:hover": {
        background: "white",
        color: theme.palette.primary.main,
      },
    },
    cancelBtn: {
      width: "35%",
    },
    confirmBtn: {
      background: "#dc3545",
      color: "white",
      width: "35%",
      "&:hover": {
        border: "1px solid #dc3545",
        color: "#dc3545",
        background: "white",
      }
    },
    description: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: theme.spacing(1, 4, 3),
      textAlign: "center",
    },
    title: {
      marginTop: 0,
      backgroundColor: theme.palette.primary.main,
      color: "white",
      padding: theme.spacing(2, 4),
    },
    btnWrap: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
      margin: theme.spacing(3, 0),
    },
  })
);

export default useStyles;
