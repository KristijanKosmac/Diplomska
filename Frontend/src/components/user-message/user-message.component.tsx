import { MessagesState } from "../../types";
import { Button } from "@material-ui/core";
import checked from "../../assets/check-mark-icon.png";
import failed from "../../assets/failed-mark-icon.png";
import { History } from "history";

export default function UserMessage({
  successMessage,
  errorMessage,
  showSignInBtn,
  history,
}: MessagesState & { showSignInBtn: boolean; history: History }) {

  if (successMessage) {
    return (
      <>
        <img
          style={{ marginTop: "10%", width: "130px", height: "130px" }}
          src={checked}
          alt="success"
        />
        <h2 style={{ textAlign: "center" }}>{successMessage}</h2>
        {showSignInBtn && (
          <Button
            type="submit"
            variant="contained"
            style={{ color: "white", margin: "40px 0", width: "15%" }}
            color="primary"
            onClick={() => history.push("/sign-in")}
          >
            Sign in
          </Button>
        )}
      </>
    );
  } else if (errorMessage) {
    return (
      <>
        <img
          style={{ marginTop: "10%", width: "130px", height: "130px" }}
          src={failed}
          alt="fail"
        />
        <h2 style={{ textAlign: "center" }}>{errorMessage}</h2>
        <Button
            type="submit"
            variant="contained"
            style={{ color: "white", margin: "40px 0", width: "15%" }}
            color="primary"
            onClick={() => history.push("/resend-email")}
          >
            Send email again
          </Button>
      </>
    );
  } else {
    return <h2 style={{ marginTop: "calc(10% + 65px)" }}>Please wait!</h2>;
  }
}
