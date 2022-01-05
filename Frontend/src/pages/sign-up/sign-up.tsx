import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { signUpUser } from "../../actions/index";
import Authentication from "../../components/authentication/authentication.component";
import { GlobalState } from "../../reducers";
import { AuthenticationEvent } from "../../types";

const SignUpPage = (props: RouteComponentProps) => {
  const dispatch = useDispatch();
  const {successMessage, errorMessage} = useSelector((state: GlobalState) => state.user)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleChange = (event: AuthenticationEvent) => {
    setEmail(event.email);
    setPassword(event.password);
  };

  const handleSubmit = () => {
    dispatch(signUpUser(email, password, props.history))
  };

  return (
    <>
      {successMessage && <div className="successMessage">{successMessage}</div>}
      {errorMessage && <div className="errorMessage">{errorMessage}</div>}
      <Authentication
        title="Sign up"
        links={[
          { href: "/sign-in", content: "Already have an account? Sign in" },
        ]}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default withRouter(SignUpPage);
