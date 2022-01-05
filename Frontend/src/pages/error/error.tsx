import notFound from "../../assets/not-found-icon.png";
import { ErrorProps } from "../../types";

const ErrorPage = ({content}: ErrorProps) => {
  const temp = content ? "4%": 0;
  return (
    <div style={{ textAlign: "center", marginTop: "5%", marginLeft: temp, width: "100%"}}>
      <img src={notFound} alt="not_found" width="40%" height="65%" />
      <h1>{(content && content) || "Page does not exist!"}</h1>
    </div>
  );
};

export default ErrorPage;