import { useState } from "react";
import SumbitEmail from "../../components/submit-email/submit-email.component";
import {
  ResetPasswordRequest,
  ResetPasswordRequestEmailLanguageEnum,
} from "pet-user-management-sdk";
import { getUserManagementAPI } from "../../api";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event: { email: string }) => {
    setEmail(event.email);
  };

  const handleSubmit = async () => {
    try {
      const { data: { username } } = await getUserManagementAPI().getUserByEmail(email);
      await getUserManagementAPI().resetPassword({
        username,
        emailLanguage: ResetPasswordRequestEmailLanguageEnum.En,
      } as ResetPasswordRequest);

      setSuccessMessage("Успешно пратена порака за промена на лозинката!")
    } catch (error: any) {
      setErrorMessage(error.response.data.message);
    }

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
