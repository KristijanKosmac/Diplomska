import { useEffect, useState } from "react";
import { MessagesState } from "../../types";
import { RouteComponentProps } from "react-router-dom";
import UserMessage from "../../components/user-message/user-message.component";

const ActivateUserPage = (props: MessagesState & RouteComponentProps) => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const { code, userId } = props.match.params as {
      code: string;
      userId: string;
    };
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <UserMessage
        successMessage={successMessage}
        errorMessage={errorMessage}
        showSignInBtn={true}
        history={props.history}
      />
    </div>
  );
};

export default ActivateUserPage;
