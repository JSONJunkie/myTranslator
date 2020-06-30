import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";

const Copyright = () => {
  return (
    <Typography variant="caption" color="textSecondary">
      {"Copyright © "}
      <Link color="inherit" href="https://webdeveloperbeau.com">
        JSONJuggler
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

export default Copyright;
