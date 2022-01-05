import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    root: {
      paddingBottom: theme.spacing(1),
      display: "grid",
      gridAutoFlow: "column",
      wordBreak: "break-all",
      gridColumnGap: "10px"
    },
    gridTemplate: {
        gridTemplateColumns: "33% 65%",
    },
    radioGroup: {
        marginTop: theme.spacing(2),
        maxHeight: "60px"
    }
  }));

  export default useStyles;