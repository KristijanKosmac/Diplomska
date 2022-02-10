import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import Authentication from "../../components/authentication/authentication.component";
import { AuthenticationEvent } from "../../types";
import { signInUser } from "../../actions/index";
import { GlobalState } from "../../reducers";

const SignInPage = (props: RouteComponentProps) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {errorMessage, successMessage} = useSelector((state: GlobalState) => state.user)

  const handleChange = (event: AuthenticationEvent) => {
    setEmail(event.email);
    setPassword(event.password);
  };

  const handleSubmit = () => {
      dispatch(signInUser(email, password, props.history))
  };

  return (
    <>
      {successMessage && <div className="successMessage">{successMessage}</div>}
      {errorMessage && <div className="errorMessage">{errorMessage}</div>}

      <Authentication
        title={"Sign in"}
        links={[
          { href: "/forgot-password", content: "forgot password?" },
          { href: "/sign-up", content: "Sign up" },
        ]}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default withRouter(SignInPage);
