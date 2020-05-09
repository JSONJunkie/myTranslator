import { makeStyles } from "@material-ui/core/styles";
import { useEffect, useState, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import clsx from "clsx";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import Grow from "@material-ui/core/Grow";
import Button from "@material-ui/core/Button";
import Backdrop from "@material-ui/core/Backdrop";
import { useRouter } from "next/router";

import Chart from "../components/Chart";

const useStyles = makeStyles(theme => ({
  root: {
    position: "absolute",
    display: "flex",
    minHeight: "100%",
    width: "100%",
    flexGrow: 1
  },
  hideRoot: {
    visibility: "hidden",
    position: "absolute",
    display: "flex",
    height: "100%",
    width: "100%",
    flexGrow: 1
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    background: theme.palette.background.default
  },
  cardGrid: {
    maxWidth: 360
  },
  cardRoot: {
    width: "100%",
    height: "100%"
  },
  title: {
    fontSize: 50
  },
  hidden: {
    fontSize: 30,
    visibility: "hidden"
  },
  pos: {
    marginBottom: 12
  },
  wrapper: {
    position: "relative"
  },
  progress: {
    position: "absolute",
    top: "50%",
    left: "47%",
    marginTop: -30,
    marginLeft: -12
  },
  chartProgress: {
    position: "absolute",
    top: "10%",
    left: "47%",
    marginTop: 100,
    marginLeft: -12
  },
  caption: {
    position: "absolute",
    top: "90%",
    left: "10%"
  },
  chart: {
    height: 240,
    width: 340,
    margin: "auto"
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    background: "rgb(53, 53, 53, .9)",
    color: "#fff",
    display: "flex",
    flexDirection: "column"
  },
  date: {
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
      <div
        className={clsx(classes.root, {
          [classes.hideRoot]: hide
        })}
      >
        <Container className={classes.content} maxWidth="md">
          <Typography
            className={classes.date}
            variant="caption"
            color="textSecondary"
          >
            first translated
          </Typography>
          <Grid
            container
            justify="center"
            alignItems="center"
            alignContent="center"
            spacing={2}
          >
            <Grid className={classes.cardGrid} item xs={12} sm={6}>
              <Card className={classes.cardRoot}>
                <CardContent>
                  {userInput.split("\n").map((i, key) => {
                    return (
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                        key={key}
                        paragraph
                      >
                        {i}
                      </Typography>
                    );
                  })}
                  {!userInput && (
                    <Typography
                      className={classes.title}
                      color="textSecondary"
                      gutterBottom
                    >
                      Welcome
                    </Typography>
                  )}
                  <Divider />
                  <Typography className={classes.pos} color="textSecondary">
                    translating from english to spanish...
                  </Typography>
                  <div className={classes.wrapper}>
                    <Typography
                      className={classes.hidden}
                      variant="body2"
                      component="p"
                    >
                      Bienvenida
                    </Typography>
                    <CircularProgress
                      disableShrink
                      className={classes.progress}
                    />
                    <Typography
                      className={classes.caption}
                      variant="caption"
                      color="textSecondary"
                    >
                      hit "enter" or the translate button to translate
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper className={classes.chart}>
                <div className={classes.wrapper}>
                  <CircularProgress
                    disableShrink
                    className={classes.chartProgress}
                  />
                </div>
              </Paper>
            </Grid>
          </Grid>
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
