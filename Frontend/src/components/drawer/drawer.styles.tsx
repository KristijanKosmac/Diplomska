import { lighten, makeStyles } from "@material-ui/core/styles";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    paddingLeft: theme.spacing(3)
  },
  logo: {
    margin: "5px",
    height: "55px",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:450px)"]: {
      height: "35px",
    },
  },
  logoWrapper: {
    flexGrow: 1,
    height: "64px",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:450px)"]: {
      height: "35px",
    },
  },
  links: {
    width: "20%",
    justifyContent: "flex-end",
    display: "flex",
    "& a": {
      cursor: "pointer",
      fontWeight: "bold",
      display: "flex",

      "&:hover": {
        opacity: "70%"
      },

      "&:nth-of-type(1)": {
        marginRight: "15%"
      }
    }
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    color: "white",
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    // padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  customSvg: {
    width: "25px",
    height: "25px",
    fill: "rgba(0, 0, 0, 0.54)"
  }
}));

export default useStyles;
