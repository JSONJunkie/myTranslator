import { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Grid from "@material-ui/core/Grid";
import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import IconButton from "@material-ui/core/IconButton";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Skeleton from "@material-ui/lab/Skeleton";
import Fade from "@material-ui/core/Fade";
import { useRouter } from "next/router";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import { getTrending } from "../src/actions/translations";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    display: "flex",
    flexDirection: "column"
  },
  wrapper: {
    position: "relative",
    width: "100%",
    overflow: "hidden",
    height: theme.spacing(3),
    display: "flex",
    [theme.breakpoints.up("md")]: {
      height: theme.spacing(4)
    }
  },
  trending: {
    position: "absolute",
    left: theme.spacing(4),
    top: theme.spacing(-0.5)
  },
  button: {
    position: "absolute",
    left: theme.spacing(13),
    top: theme.spacing(-1.5),
    [theme.breakpoints.up("md")]: {
      left: theme.spacing(15),
      top: theme.spacing(-1)
    }
  },
  beginningCap: {
    position: "absolute",
    width: theme.spacing(4),
    left: theme.spacing(0),
    top: theme.spacing(-0.5),
    background: theme.palette.background.default
  },
  endCap: {
    position: "absolute",
    width: theme.spacing(4),
    right: theme.spacing(0),
    top: theme.spacing(-0.5),
    background: theme.palette.background.default
  },
  trendingText: {
    padding: theme.spacing(0.75),
    fontSize: 14,
    [theme.breakpoints.up("md")]: {
      fontSize: 18,
      padding: theme.spacing(1)
    }
  },
  hidden: {
    visibility: "hidden",
    padding: theme.spacing(1),
    fontSize: 10,
    [theme.breakpoints.up("md")]: {
      fontSize: 15
    }
  },
  translation: {
    fontSize: 18,
    padding: theme.spacing(2),
    marginLeft: theme.spacing(1),
    background: theme.palette.background.paper,
    [theme.breakpoints.up("md")]: {
      fontSize: 22
    }
  },
  none: {
    width: "100%",
    fontSize: 18,
    [theme.breakpoints.up("md")]: {
      fontSize: 22
    }
  },
  scrollContainer: {
    display: "flex",
    width: "100%",
    position: "relative",
    alignItems: "center"
  },
  scroll1: {
    width: "100%",
    display: "flex",
    animation: `$myEffect 20s linear infinite`,
    position: "absolute"
  },
  scroll2: {
    width: "100%",
    display: "flex",
    animation: `$myEffect 20s linear infinite`,
    animationDelay: "-10s",
    position: "absolute"
  },
  "@keyframes myEffect": {
    "0%": {
      transform: "translateX(100%)"
    },
    "100%": {
      transform: "translateX(-100%)"
    }
  },
  pause: {
    width: "100%",
    display: "flex",
    animationPlayState: "paused",
    position: "absolute"
  }
}));

const Trending = ({ translations: { trending, preTrans }, getTrending }) => {
  const classes = useStyles();

  const router = useRouter();

  const [pause, setPause] = useState(false);

  const [buttonPause, setButtonPause] = useState(false);

  const [fade, setFade] = useState(false);

  const handlePause = () => {
    if (!buttonPause) {
      setPause(prev => true);
    }
  };

  const handleUnpause = () => {
    if (!buttonPause) {
      setPause(prev => false);
    }
  };

  const handleButtonPause = () => {
    setButtonPause(prev => true);
    setPause(prev => true);
  };

  const handleButtonUnpause = () => {
    setButtonPause(prev => false);
    setPause(prev => false);
  };

  const handleRouting = data => {
    router.push(
      "/translate/[translation]/" + data.from + "/" + data.to,
      "/translate/" +
        data.translation.toLowerCase() +
        "/" +
        data.from +
        "/" +
        data.to
    );
  };

  useEffect(() => {
    if (preTrans) {
      getTrending();
    }
  }, [preTrans]);

  useEffect(() => {
    if (trending[0] || trending === "none") {
      setFade(prev => true);
    }
  }, [trending]);

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        {!trending[0] && (
          <Skeleton animation="wave" variant="rect" width="100%" />
        )}
        {trending === "none" && (
          <Fade in={fade} timeout={2000}>
            <Typography
              className={classes.none}
              align="center"
              color="textSecondary"
            >
              No translations trending!
            </Typography>
          </Fade>
        )}

        {trending[0] && trending !== "none" && (
          <Fade in={fade} timeout={2000}>
            <div
              onMouseEnter={handlePause}
              onMouseLeave={handleUnpause}
              className={classes.scrollContainer}
            >
              <div
                className={clsx(classes.scroll1, {
                  [classes.pause]: pause
                })}
              >
                <Grid container direction="row" justify="space-around">
                  {trending.map(translation => (
                    <Grid item xs key={translation._id}>
                      <IconButton
                        aria-label="en-es translation"
                        color="secondary"
                        onClick={e => {
                          handleRouting({
                            translation: translation.en.text,
                            from: "en",
                            to: "es"
                          });
                        }}
                      >
                        <Typography
                          className={classes.translation}
                          color="textSecondary"
                        >
                          {translation.en.text}
                        </Typography>
                      </IconButton>
                    </Grid>
                  ))}
                </Grid>
              </div>
              <div
                className={clsx(classes.scroll2, {
                  [classes.pause]: pause
                })}
              >
                <Grid container direction="row" justify="space-around">
                  {trending.map(translation => (
                    <Grid item xs key={translation._id}>
                      <IconButton
                        aria-label="en-es translation"
                        color="secondary"
                        onClick={e => {
                          handleRouting({
                            translation: translation.en.text,
                            from: "en",
                            to: "es"
                          });
                        }}
                      >
                        <Typography
                          className={classes.translation}
                          color="textSecondary"
                        >
                          {translation.en.text}
                        </Typography>
                      </IconButton>
                    </Grid>
                  ))}
                </Grid>
              </div>
              <div className={classes.trending}>
                <Paper square={true}>
                  <Typography
                    className={classes.trendingText}
                    color="textSecondary"
                  >
                    Trending
                  </Typography>
                </Paper>
              </div>
              <div className={classes.button}>
                <Paper square={true}>
                  {!buttonPause && (
                    <IconButton
                      aria-label="pause"
                      color="secondary"
                      onClick={handleButtonPause}
                    >
                      <PauseIcon />
                    </IconButton>
                  )}
                  {buttonPause && (
                    <IconButton
                      aria-label="unpause"
                      color="secondary"
                      onClick={handleButtonUnpause}
                    >
                      <PlayArrowIcon />
                    </IconButton>
                  )}
                </Paper>
              </div>
              <div className={classes.beginningCap}>
                <Typography className={classes.hidden} color="textSecondary">
                  Trending
                </Typography>
              </div>
              <div className={classes.endCap}>
                <Typography className={classes.hidden} color="textSecondary">
                  Trending
                </Typography>
              </div>
            </div>
          </Fade>
        )}
      </div>
    </div>
  );
};

Trending.propTypes = {
  translations: PropTypes.object.isRequired
  // rollbar: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  translations: state.translations
});

export default connect(mapStateToProps, { getTrending })(Trending);
