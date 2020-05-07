import Rollbar from "rollbar";

export default rollbar = new Rollbar({
  // accessToken: process.env.ROLLBAR_SERVER_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true
});
