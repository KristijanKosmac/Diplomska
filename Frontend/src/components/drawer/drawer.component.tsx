import React from "react";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
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
  DeleteForever,
} from "@material-ui/icons";
import LockIcon from "@material-ui/icons/Lock";
import logo from "../../assets/logo.png";
import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";

import { deleteUser, signOutUser } from "../../actions/index";
import DropdownMenuActions from "../dropdownMenuActions/dropdownMenuActions";
import { GlobalState } from "../../reducers";
import CustomModal from "../modal/modal.component";

function MiniDrawer({ history }: RouteComponentProps) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { profile } = useSelector((state: GlobalState) => state.user);

  const [open, setOpen] = React.useState(false);
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
    },
  ];

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    dispatch(deleteUser(profile.id));
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
        <Toolbar>
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
            <DropdownMenuActions
              items={[
                <Link
                  onClick={() => history.push("/profile")}
                  color="inherit"
                  underline="none"
                  className={classes.verticalyAlign}
                >
                  <PersonOutline />
                  <label>Profile</label>
                </Link>,
                <Link
                  onClick={() => history.push("/profile/change-password")}
                  color="inherit"
                  underline="none"
                  className={classes.verticalyAlign}
                >
                  <LockIcon />
                  <label>Change Password</label>
                </Link>,
                <Link
                  onClick={() => dispatch(signOutUser(history))}
                  color="inherit"
                  underline="none"
                  className={classes.verticalyAlign}
                >
                  <ExitToApp />
                  <label>Sign out</label>
                </Link>,
                <Link
                  color="inherit"
                  underline="none"
                  className={classes.deleteAccount}
                >
                  <DeleteForever />
                  <CustomModal
                    buttonName="Delete Account"
                    onClick={(
                      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
                    ) => {
                      handleDelete();
                    }}
                    title="Delete Account"
                    content={`Are you sure you want to delete your account ?`}
                    id={profile.id}
                  /> 
                </Link>,
              ]}
            />
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
