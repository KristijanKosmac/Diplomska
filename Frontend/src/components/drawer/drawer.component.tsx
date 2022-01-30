import React from "react";
import clsx from "clsx";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { useTheme } from "@material-ui/core/styles";
import {
  Drawer,
  AppBar,
  Toolbar,
  List,
  CssBaseline,
  Typography,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link,
} from "@material-ui/core";
import useStyles from "./drawer.styles";

//icons
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  PeopleAltOutlined as PeopleAltOutlinedIcon,
  PersonOutline,
  ExitToApp,
} from "@material-ui/icons";
import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";
import DocumentScannerIcon from '@material-ui/icons/Scanner';
import UploadDicomIcon from '@material-ui/icons/CloudUpload';
import logo from "../../assets/logo.png";
import { signOutUser } from "../../actions/index";
import { useDispatch } from "react-redux";

function MiniDrawer({ history }: RouteComponentProps) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const dispatch = useDispatch();
  const itemsList = [
    {
      text: "Patients",
      icon: <PeopleAltOutlinedIcon />,
      onClick: () => history.push("/patients"),
    },
    {
      text: "Users",
      icon: <SupervisedUserCircleIcon />,
      onClick: () => history.push("/users"),
    }
  ];

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography noWrap className={classes.logoWrapper}>
            <a href="/">
              <img src={logo} alt="logo" className={classes.logo} />
            </a>
          </Typography>
          <Typography variant="button" className={classes.links}>
            <Link
              onClick={() => history.push("/profile")}
              color="inherit"
              underline="none"
            >
              <PersonOutline />
              Profile
            </Link>
            <Link
              onClick={() => dispatch(signOutUser(history))}
              color="inherit"
              underline="none"
            >
              <ExitToApp />
              Sign out
            </Link>
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>
        <List>
          {itemsList.map((item) => {
            const { text, icon, onClick } = item;
            return (
              <ListItem
                button
                key={text}
                onClick={onClick}
                divider
                style={{ paddingLeft: "23px" }}
              >
                <ListItemIcon title={text}>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            );
          })}
        </List>
      </Drawer>
    </div>
  );
}

export default withRouter(MiniDrawer);
