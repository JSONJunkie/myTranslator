import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider, makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { withRedux } from "../lib/redux";
import Rollbar from "rollbar";

import Navbar from "../components/Navbar";
import LanguageSelect from "../components/LanguageSelect";
import Trending from "../components/Trending";
import LoadingOverlay from "../components/LoadingOverlay";
import Footer from "../components/Footer";
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

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column"
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
    flexGrow: 1
  }
}));

function MyApp({ Component, pageProps, store }) {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  const classes = useStyles();

  const [rollbar] = React.useState(getRollbar());

  return (
    <React.Fragment>
      <div className={classes.root}>
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
          <Navbar />
          <Trending />
          <LanguageSelect />
          <div className={classes.wrapper}>
            <LoadingOverlay />
            <Component rollbar={rollbar} {...pageProps} />
          </div>
          <Footer />
        </ThemeProvider>
      </div>
    </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired
};

export default withRedux(MyApp);
