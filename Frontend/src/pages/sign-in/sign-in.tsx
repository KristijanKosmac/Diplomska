import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import Authentication from "../../components/authentication/authentication.component";
import { AuthenticationEvent } from "../../types";
import { resetMessages, signInUser } from "../../actions/index";
import { GlobalState } from "../../reducers";

const SignInPage = (props: RouteComponentProps) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {user, patients} = useSelector((state: GlobalState) => state)

  const handleChange = (event: AuthenticationEvent) => {
    setEmail(event.email);
    setPassword(event.password);
  };

  const handleSubmit = () => {
      dispatch(signInUser(email, password, props.history))
  };

  useEffect(() => {
    setTimeout(() => {
      dispatch(resetMessages())
    }, 3000);
  }, [user.successMessage, user.errorMessage, patients.errorMessage, patients.successMessage]);

  return (
    <>
      {user.successMessage && <div className="successMessage">{user.successMessage}</div>}
      {user.errorMessage && <div className="errorMessage">{user.errorMessage}</div>}
      {patients.successMessage && <div className="successMessage">{patients.successMessage}</div>}
      {patients.errorMessage && <div className="errorMessage">{patients.errorMessage}</div>}

      <Authentication
        title={"Sign in"}
        links={[
          { href: "/forgot-password", content: "Forgot password?" },
          { href: "/sign-up", content: "Sign up" },
        ]}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default withRouter(SignInPage);
