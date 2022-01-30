import { useState } from "react";
import SumbitEmail from "../../components/submit-email/submit-email.component";
import { getUserManagementAPI } from "../../api";

const ResendEmailPage = () => {
  const [email, setEmail] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event: { email: string }) => {
    setEmail(event.email);
  };

  const handleSubmit = async () => {
    try {
      // await getUserManagementAPI().resendAccountConfirmationEmail(
      //   { email: email, emailLanguage: ResendAccountConfirmationEmailRequestEmailLanguageEnum.En} as ResendAccountConfirmationEmailRequest
      // );

      setSuccessMessage("Успешно испратена порака за валидација на емаил")
    } catch (error: any) {
      setErrorMessage(error.response.data.message)
    }
  };

  return (
    <>
      {successMessage && <div className="successMessage">{successMessage}</div>}
      {errorMessage && <div className="errorMessage">{errorMessage}</div>}
      <SumbitEmail
        buttonName="Resend email"
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default ResendEmailPage;
