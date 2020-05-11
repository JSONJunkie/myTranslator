import { makeStyles } from "@material-ui/core/styles";
import { useEffect, useState, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import clsx from "clsx";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Grow from "@material-ui/core/Grow";
import Button from "@material-ui/core/Button";
import Backdrop from "@material-ui/core/Backdrop";
import { useRouter } from "next/router";

import TranslationGrid from "../components/TranslationGrid";
import ChartGrid from "../components/ChartGrid";

const useStyles = makeStyles(theme => ({
  root: {
    position: "absolute",
    display: "flex",
    minHeight: "100%",
    width: "100%",
    flexGrow: 1
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    background: "rgb(53, 53, 53, .9)",
    color: "#fff",
    display: "flex",
    flexDirection: "column"
  },
  hiddenDate: {
    visibility: "hidden"
  },
  hiddenGrid: {
    visibility: "hidden"
  }
}));

const LoadingOverlay = ({ translations: { userInput } }) => {
  const classes = useStyles();

  const router = useRouter();

  const [routing, setRouting] = useState({
    url: "",
    starting: false,
    complete: true
  });

  const [open, setOpen] = useState(false);

  const [hide, setHide] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  const handleRouteChangeStart = url => {
    setRouting(prev => ({ ...prev, starting: true, url }));
  };

  const handleRouteChangeComplete = url => {
    setRouting(prev => ({ ...prev, complete: true }));
  };

  useEffect(() => {
    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    return () => {
      router.events.on("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, []);

  useEffect(() => {
    if (routing.complete) {
      setRouting(prev => ({ ...prev, complete: false }));
    }
    if (routing.starting) {
      setRouting(prev => ({ ...prev, starting: false, url: "" }));
    }
  }, [routing.starting, routing.complete]);

  useEffect(() => {
    if (userInput) {
      setHide(prev => false);
    }

    if (!userInput) {
      setHide(prev => true);
    }
    return () => {
      setHide(prev => true);
    };
  }, [userInput]);

  useEffect(() => {
    if (router.isFallback) {
      setOpen(true);
    }
  }, [routing.starting, routing.complete]);

  return (
    <Fragment>
      <Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
        <Typography variant="h5" align="center">
          Hey, you're the first person to make this translation! Thanks for
          using my webapp!
        </Typography>
        <Button variant="contained" color="primary" size="large">
          Continue
        </Button>
      </Backdrop>
      <div className={classes.root}>
        <Container className={classes.content} maxWidth="md">
          <Typography
            className={classes.hiddenDate}
            variant="caption"
            color="textSecondary"
          >
            first translated
          </Typography>
          <Grow in={true} timeout={500}>
            <Grid
              container
              justify="center"
              alignItems="center"
              alignContent="center"
              spacing={2}
            >
              {hide && (
                <Fragment>
                  <div className={classes.hiddenGrid}>
                    <TranslationGrid
                      beforeTrans={"Welcome"}
                      afterTrans={""}
                      from={"english"}
                      to={"spanish"}
                    />
                  </div>
                  {!router.isFallback && <ChartGrid hide={{ hide: !hide }} />}
                </Fragment>
              )}
              {!hide && (
                <Fragment>
                  <TranslationGrid
                    className={classes.hiddenGrid}
                    beforeTrans={userInput}
                    afterTrans={""}
                    from={"english"}
                    to={"spanish"}
                  />
                  <ChartGrid hide={{ hide: !hide }} />
                </Fragment>
              )}
            </Grid>
          </Grow>
        </Container>
      </div>
    </Fragment>
  );
};

// LoadingOverlay.propTypes = {
//   rollbar: PropTypes.object.isRequired
// };

LoadingOverlay.propTypes = {
  translations: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  translations: state.translations
});

export default connect(mapStateToProps)(LoadingOverlay);
