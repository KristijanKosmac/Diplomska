import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";

export default function Copyright() {
  return (
    <Typography variant="body2" color="textPrimary" align="center">
      <Link color="inherit" href="/">
        Diplomska
      </Link>{" "}
      {new Date().getFullYear()}©{" "}
      Сите права се задржани
    </Typography>
  );
}
