import { makeStyles } from "@material-ui/core/styles";
import { useEffect, useState, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import clsx from "clsx";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Fade from "@material-ui/core/Fade";
import Button from "@material-ui/core/Button";
import Backdrop from "@material-ui/core/Backdrop";
import { useRouter } from "next/router";

import TranslationGrid from "../components/TranslationGrid";
import ChartGrid from "../components/ChartGrid";
import OtherTranslations from "../components/OtherTranslations";
import Footer from "../components/Footer";

import { speak } from "../src/actions/translations";

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
    flexDirection: "column"
  },
  contentTyping: {
    display: "flex",
    flexDirection: "column",
    background: theme.palette.background.default
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    background: "rgb(53, 53, 53, .9)",
    color: "#fff",
    display: "flex",
    flexDirection: "column"
  },
  hiddenDate: {
    visibility: "hidden",
    marginLeft: "auto",
    marginRight: "auto"
  },
  hiddenGrid: {
    visibility: "hidden",
    marginBottom: theme.spacing(4),
    [theme.breakpoints.up("md")]: {
      marginBottom: theme.spacing(12)
    }
  },
  hiddenChart: {
    visibility: "hidden"
  }
}));

const LoadingOverlay = ({
  translations: {
    userInput,
    preTrans,
    postTrans,
    from,
    to,
    toCode,
    chartData,
    audio,
    otherTrans,
    loading
  },
  speak
}) => {
  const classes = useStyles();

  const router = useRouter();

  const [routing, setRouting] = useState({
    url: "",
    starting: true,
    complete: false
  });

  const [audioContext, setAudioContext] = useState(null);

  const [open, setOpen] = useState(false);

  const [hide, setHide] = useState(true);

  const [fade, setFade] = useState(false);

  const [loader, setLoader] = useState(true);

  const handleSpeak = e => {
    if (router.pathname === "/") {
      audioContext.resume();
      speak({ audioContext, data: audio[0] });
    } else {
      audioContext.resume();
      speak({ audioContext, data: audio[0] });
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRouteChangeStart = url => {
    setRouting(prev => ({ ...prev, starting: true, complete: false, url }));
  };

  const handleRouteChangeComplete = url => {
    setRouting(prev => ({ ...prev, starting: false, complete: true }));
  };

  useEffect(() => {
    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, []);

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
    if (!router.isFallback) {
      setFade(prev => true);
    }
  }, [router.isFallback]);

  useEffect(() => {
    if (chartData.length > 0) {
      setLoader(prev => false);
    }
    if (chartData.length === 0) {
      setLoader(prev => true);
    }
  }, [chartData]);

  useEffect(() => {
    if (router.isFallback) {
      setOpen(true);
    }
  }, [routing.starting, routing.complete]);

  useEffect(() => {
    setAudioContext(new (window.AudioContext || window.webkitAudioContext)());
  }, []);

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
      {loader && !router.isFallback && router.pathname !== "/" && (
        <div className={classes.root}>
          <Container className={classes.contentTyping} maxWidth="md">
            <Typography
              className={classes.hiddenDate}
              variant="caption"
              color="textSecondary"
            >
              first translated
            </Typography>
            <Fragment>
              <Grid
                container
                direction="row"
                // justify="flex-end"
                // alignItems="center"
                // alignContent="center"
                spacing={2}
              >
                <TranslationGrid
                  beforeTrans={""}
                  afterTrans={""}
                  from={from}
                  to={to}
                  speak={"none"}
                />
                <ChartGrid hide={{ hide: hide }} />
                <OtherTranslations
                  loading={true}
                  preTrans={preTrans}
                  otherTrans={otherTrans}
                  audioContext={audioContext}
                  speak={speak}
                />
              </Grid>
            </Fragment>
            <Footer />
          </Container>
        </div>
      )}
      {!loader && preTrans && router.pathname !== "/" && (
        <div className={classes.root}>
          <Container
            className={clsx(classes.content, {
              [classes.contentTyping]: !hide
            })}
            maxWidth="md"
          >
            <Typography
              className={classes.hiddenDate}
              variant="caption"
              color="textSecondary"
            >
              first translated
            </Typography>
            <Grid
              container
              direction="row"
              // justify="flex-end"
              // alignItems="center"
              // alignContent="center"
              spacing={2}
            >
              {hide && (
                <Fragment>
                  {!router.isFallback && router.pathname !== "/" && (
                    <Fragment>
                      {audio[0] && (
                        <TranslationGrid
                          beforeTrans={preTrans}
                          afterTrans={postTrans}
                          from={from}
                          to={to}
                          speak={handleSpeak}
                        />
                      )}
                      {!audio[0] && (
                        <TranslationGrid
                          beforeTrans={preTrans}
                          afterTrans={postTrans}
                          from={from}
                          to={to}
                          speak={"none"}
                        />
                      )}
                      {!loading && <ChartGrid hide={{ hide: !hide }} />}
                      {loading && <ChartGrid hide={{ hide: hide }} />}
                      <OtherTranslations
                        loading={loading}
                        preTrans={preTrans}
                        otherTrans={otherTrans}
                        audioContext={audioContext}
                        speak={speak}
                      />
                    </Fragment>
                  )}
                </Fragment>
              )}
              {!hide && (
                <Fragment>
                  {userInput && (
                    <TranslationGrid
                      beforeTrans={userInput}
                      afterTrans={""}
                      from={from}
                      to={to}
                    />
                  )}
                  <ChartGrid hide={{ hide: !hide }} />
                  <OtherTranslations
                    loading={true}
                    preTrans={preTrans}
                    otherTrans={otherTrans}
                    audioContext={audioContext}
                    speak={speak}
                  />
                </Fragment>
              )}
            </Grid>
            <Footer />
          </Container>
        </div>
      )}
    </Fragment>
  );
};

// LoadingOverlay.propTypes = {
//   rollbar: PropTypes.object.isRequired
// };

LoadingOverlay.propTypes = {
  translations: PropTypes.object.isRequired,
  speak: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  translations: state.translations
});

export default connect(mapStateToProps, { speak })(LoadingOverlay);
