import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../../actions";
import { GlobalState } from "../../reducers";
import SumbitEmail from "../../components/submit-email/submit-email.component";
import { RouteComponentProps } from "react-router-dom";


const ForgotPasswordPage = (props: RouteComponentProps) => {
  const [email, setEmail] = useState("");
  const { errorMessage, successMessage } = useSelector(
    (state: GlobalState) => state.user
  );
  const dispatch = useDispatch()

  const handleChange = (event: { email: string }) => {
    setEmail(event.email);
  };

  const handleSubmit = async () => {
    dispatch(resetPassword(email, props.history));
  };

  return (
    <>
      {successMessage && <div className="successMessage">{successMessage}</div>}
      {errorMessage && <div className="errorMessage">{errorMessage}</div>}
      <SumbitEmail
        buttonName="Change Password"
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default ForgotPasswordPage;
