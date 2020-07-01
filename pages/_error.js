import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
    paddingTop: theme.spacing(10),
  },
}));

function Error({ statusCode }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Container className={classes.content}>
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : "An error occurred on client"}
      </Container>
    </div>
  );
}

Error.getInitialProps = ({ res, req, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  console.log(err);

  // Only require Rollbar and report error if we're on the server
  if (!process.browser && err) {
    console.log("Reporting error to Rollbar...");
    const Rollbar = require("rollbar");
    const rollbar = new Rollbar({
      // accessToken: process.env.ROLLBAR_SERVER_TOKEN,
      captureUncaught: true,
      captureUnhandledRejections: true,
    });
    rollbar.error(err, req, (rollbarError) => {
      if (rollbarError) {
        console.error("Rollbar error reporting failed:");
        console.error(rollbarError);
        return;
      }
      console.log("Reported error to Rollbar");
    });
  }

  return { statusCode };
};

export default Error;
