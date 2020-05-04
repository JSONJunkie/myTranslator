import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { withRedux } from "../lib/redux";
import Rollbar from "rollbar";

import theme from "../themes/theme";

function getRollbar() {
  if (process.env.NODE_ENV === "development") {
    const rollbar = new Rollbar({
      // accessToken: process.env.ROLLBAR_CLIENT_TOKEN,
      captureUncaught: true,
      captureUnhandledRejections: true,
      environment: "development"
    });
    return rollbar;
  }

  if (process.env.NODE_ENV === "production") {
    const rollbar = new Rollbar({
      // accessToken: process.env.ROLLBAR_CLIENT_TOKEN,
      captureUncaught: true,
      captureUnhandledRejections: true,
      environment: "production"
    });
    return rollbar;
  }
}
function MyApp({ Component, store }) {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  const [rollbar] = React.useState(getRollbar());

  return (
    <React.Fragment>
      <Head>
        <title>localhostin</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component rollbar={rollbar} />
      </ThemeProvider>
    </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired
};

export default withRedux(MyApp);
