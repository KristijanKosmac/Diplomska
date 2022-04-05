import "./App.css";
import { Route } from "react-router";
import { Redirect, Switch } from "react-router-dom";
import { useSelector } from "react-redux";
import { ThemeProvider, createTheme } from "@material-ui/core/styles";
import { GlobalState } from "./reducers";

import Header from "./components/header/header.component";
import MiniDrawer from "./components/drawer/drawer.component";
import SignInPage from "./pages/sign-in/sign-in";
import SignUpPage from "./pages/sign-up/sign-up";
import ForgotPasswordPage from "./pages/forgot-password/forgot-password";
import ChangePasswordPage from "./pages/change-password/change-password";
import PatientsListPage from "./pages/patients-list/patients-list";
import AddEditPatient from "./pages/add-edit-patient/add-edit-patient";
import PatientDetails from "./pages/patient-details/patient-details";
import UsersListPage from "./pages/users-list/users-list";
import AddEditUser from "./pages/add-edit-user/add-edit-user";
import Profile from "./pages/profile/profile";
import ErrorPage from "./pages/error/error";
import ResetForgottenPasswordPage from "./pages/reset-forgotten-password/reset-forgotten-password";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#01A8C2",
    },
    secondary: {
      main: "#037dfd",
    },
  },
});

const App = () => {
  const { isLoggedIn, profile } = useSelector(
    (state: GlobalState) => state.user
  );

  const notLoggedInRoutes = (
    <div>
      <Header />
      <Switch>
        <Route path="/" component={SignInPage} exact />
        <Route path="/sign-in" component={SignInPage} />
        <Route path="/sign-up" component={SignUpPage} />
        <Route path="/forgot-password" component={ForgotPasswordPage} />
        <Route
          path="/reset-forgotten-password"
          component={ResetForgottenPasswordPage}
        />
        {/* <Redirect to="/sign-in" /> */}
        <Route path="*" component={SignInPage} />
      </Switch>
    </div>
  );

  const notFilledProfileInfo = (
    <>
      <MiniDrawer />
      <Switch>
        <Route exact path="/profile" component={Profile} />
        <Redirect to="/profile" />
      </Switch>
    </>
  );

  const loggedInRoutes = (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <MiniDrawer />
      <div style={{ marginTop: "2%", width: "100%" }}>
        <Switch>
          <Route exact path="/profile" component={Profile} />
          <Route
            path="/profile/change-password"
            component={ChangePasswordPage}
          />

          <Route exact path="/" component={PatientsListPage} />
          <Route exact path="/patients" component={PatientsListPage} />
          <Route path="/patients/add" component={AddEditPatient} />
          <Route path="/patients/edit" component={AddEditPatient} />
          <Route path="/patients/:id" component={PatientDetails} />

          <Route exact path="/users" component={UsersListPage} />
          <Route path="/users/add" component={AddEditUser} />
          <Route path="/users/edit" component={AddEditUser} />

          <Route path="*" component={ErrorPage} />
        </Switch>
      </div>
    </div>
  );

  const patientRoutes = (
    <div style={{ display: "flex", flexDirection: "row" }}>
    <MiniDrawer />
    <div style={{ marginTop: "2%", width: "100%" }}>
      <Switch>
        <Route exact path="/profile" component={Profile} />
        <Route path="/profile/change-password" component={ChangePasswordPage} />

        {/* <Route path="/patients/:id" component={PatientDetails} /> */}

        <Route path={`/patients/${profile.id}`} component={PatientDetails} />

        {/* <Route path="*" component={ErrorPage} /> */}
        <Redirect to={`/patients/${profile.id}`} />
      </Switch>
    </div>
    </div>  
  );

  const routeCondition = () => {
    return isLoggedIn
      ? Object.keys(profile).length < 5
        ? notFilledProfileInfo
        : profile.role === "Patient"
        ? patientRoutes
        : loggedInRoutes
      : notLoggedInRoutes;
  };

  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          display: "flex",
          marginTop: theme.spacing(8),
          flexDirection: "column",
        }}
      >
        {/* {isLoggedIn ? loggedInRoutes : notLoggedInRoutes} */}
        {routeCondition()}
      </div>
    </ThemeProvider>
  );
};

export default App;
