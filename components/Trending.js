import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Grid from "@material-ui/core/Grid";
import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Skeleton from "@material-ui/lab/Skeleton";
import Fade from "@material-ui/core/Fade";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { useRouter } from "next/router";

import TrendingChart from "../components/TrendingChart";

import {
  getTrending,
  selectTrendingLang,
  selectLang
} from "../src/actions/translations";

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
    height: theme.spacing(4),
    left: theme.spacing(4),
    top: theme.spacing(-0.5),
    [theme.breakpoints.up("md")]: {
      height: theme.spacing(5)
    },
    background: theme.palette.background.paper
  },
  formControl: {
    width: theme.spacing(9),
    [theme.breakpoints.up("md")]: {
      width: theme.spacing(12)
    }
  },
  scrollToggle: {
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
  spacer: {
    position: "absolute",
    width: theme.spacing(1),
    left: theme.spacing(12),
    top: theme.spacing(-0.5),
    [theme.breakpoints.up("md")]: {
      left: theme.spacing(14.8),
      width: theme.spacing(0.2)
    },
    background: theme.palette.background.default
  },
  endCap: {
    position: "absolute",
    width: theme.spacing(4),
    right: theme.spacing(0),
    top: theme.spacing(-0.5),
    background: theme.palette.background.default
  },
  trendingTextDesktop: {
    display: "none",
    zIndex: 1,
    [theme.breakpoints.up("md")]: {
      position: "absolute",
      display: "flex",
      left: theme.spacing(0),
      right: theme.spacing(3),
      paddingTop: theme.spacing(1),
      paddingLeft: theme.spacing(0.5),
      height: theme.spacing(5)
    }
  },
  trendingTextMobile: {
    position: "absolute",
    height: theme.spacing(4),
    paddingTop: theme.spacing(0.5),
    paddingLeft: theme.spacing(1.5),
    right: theme.spacing(3),
    left: theme.spacing(0),
    display: "flex",
    zIndex: 1,
    [theme.breakpoints.up("md")]: {
      display: "none"
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
    paddingRight: theme.spacing(8),
    marginLeft: theme.spacing(1),
    background: theme.palette.background.paper,
    [theme.breakpoints.up("md")]: {
      fontSize: 22,
      paddingRight: theme.spacing(10)
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
      transform: "translateX(-65%)"
    }
  },
  pause: {
    width: "100%",
    display: "flex",
    animationPlayState: "paused",
    position: "absolute"
  },
  chart: {
    position: "absolute",
    zIndex: 0,
    height: theme.spacing(3),
    width: theme.spacing(5),
    marginLeft: theme.spacing(3.5),
    [theme.breakpoints.up("md")]: {
      height: theme.spacing(4),
      width: theme.spacing(6),
      marginLeft: theme.spacing(4.5)
    }
  },
  showChart: {
    height: "100%",
    width: "100%"
  }
}));

const Trending = ({
  translations: { trending, preTrans, trendingLang, toCode },
  getTrending,
  selectTrendingLang
}) => {
  const classes = useStyles();

  const router = useRouter();

  const [pause, setPause] = useState(false);

  const [fade, setFade] = useState(false);

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(prev => false);
  };

  const handleOpen = () => {
    setOpen(prev => true);
  };

  const handleChange = e => {
    selectTrendingLang(e.target.value);
  };

  const handleButtonPause = () => {
    setPause(prev => true);
  };

  const handleButtonUnpause = () => {
    setPause(prev => false);
  };

  const handleRouting = data => {
    if (data.from === "en") {
      router.push(
        "/translate/[translation]/" + data.from + "/es",
        "/translate/" +
          data.translation[data.from].text.toLowerCase() +
          "/" +
          data.from +
          "/es"
      );
      return;
    }

    if (data.from !== "en") {
      router.push(
        "/translate/[translation]/" + data.from + "/en",
        "/translate/" +
          data.translation[data.from].text.toLowerCase() +
          "/" +
          data.from +
          "/en"
      );
      return;
    }
  };

  useEffect(() => {
    if (preTrans) {
      getTrending(trendingLang);
    }
  }, [preTrans, trendingLang]);

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
            <div className={classes.scrollContainer}>
              <div
                className={clsx(classes.scroll1, {
                  [classes.pause]: pause
                })}
              >
                <Grid container direction="row" justify="space-around">
                  {trending.map(translation => (
                    <Grid item xs key={translation._id}>
                      <IconButton
                        aria-label="translation"
                        color="secondary"
                        onClick={e => {
                          handleRouting({
                            translation,
                            from: trendingLang
                          });
                        }}
                      >
                        <Typography
                          className={classes.translation}
                          color="textSecondary"
                        >
                          {translation[trendingLang].text}
                        </Typography>
                        <div className={classes.chart}>
                          <div className={classes.showChart}>
                            <TrendingChart data={translation.hitData} />
                          </div>
                        </div>
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
                        aria-label="translation"
                        color="secondary"
                        onClick={e => {
                          handleRouting({
                            translation,
                            from: trendingLang
                          });
                        }}
                      >
                        <Typography
                          className={classes.translation}
                          color="textSecondary"
                        >
                          {translation[trendingLang].text}
                        </Typography>
                        <div className={classes.chart}>
                          <div className={classes.showChart}>
                            <TrendingChart data={translation.hitData} />
                          </div>
                        </div>
                      </IconButton>
                    </Grid>
                  ))}
                </Grid>
              </div>
            </div>
          </Fade>
        )}
        <div className={classes.trending}>
          <Paper
            square={true}
            elevation={0}
            className={classes.trendingTextDesktop}
          >
            <Typography noWrap={true} color="textSecondary">
              Trending
            </Typography>
          </Paper>
          <Paper
            square={true}
            elevation={0}
            className={classes.trendingTextMobile}
          >
            <TrendingUpIcon />
          </Paper>
          <FormControl
            variant="outlined"
            size="small"
            className={classes.formControl}
          >
            <Select
              labelId="trending language"
              id="trending language"
              open={open}
              onClose={handleClose}
              onOpen={handleOpen}
              value={trendingLang}
              onChange={handleChange}
            >
              <MenuItem value="ar" disabled={trendingLang === "ar"}>
                Arabic
              </MenuItem>
              <MenuItem value="zh" disabled={trendingLang === "zh"}>
                Chinese (simplified)
              </MenuItem>
              <MenuItem value="zh-TW" disabled={trendingLang === "zh-TW"}>
                Chinese (traditional)
              </MenuItem>
              <MenuItem value="en" disabled={trendingLang === "en"}>
                English
              </MenuItem>
              <MenuItem value="fi" disabled={trendingLang === "fi"}>
                Finnish
              </MenuItem>
              <MenuItem value="fr" disabled={trendingLang === "fr"}>
                French
              </MenuItem>
              <MenuItem value="de" disabled={trendingLang === "de"}>
                German
              </MenuItem>
              <MenuItem value="it" disabled={trendingLang === "it"}>
                Italian
              </MenuItem>
              <MenuItem value="ja" disabled={trendingLang === "ja"}>
                Japanese
              </MenuItem>
              <MenuItem value="ko" disabled={trendingLang === "ko"}>
                Korean
              </MenuItem>
              <MenuItem value="pt" disabled={trendingLang === "pt"}>
                Portuguese
              </MenuItem>
              <MenuItem value="ro" disabled={trendingLang === "ro"}>
                Romanian
              </MenuItem>
              <MenuItem value="ru" disabled={trendingLang === "ru"}>
                Russian
              </MenuItem>
              <MenuItem value="sk" disabled={trendingLang === "sk"}>
                Slovak
              </MenuItem>
              <MenuItem value="es" disabled={trendingLang === "es"}>
                Spanish
              </MenuItem>
              <MenuItem value="sv" disabled={trendingLang === "sv"}>
                Swedish
              </MenuItem>
              <MenuItem value="th" disabled={trendingLang === "th"}>
                Thai
              </MenuItem>
              <MenuItem value="tr" disabled={trendingLang === "tr"}>
                Turkish
              </MenuItem>
              <MenuItem value="vi" disabled={trendingLang === "vi"}>
                Vietnamese
              </MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className={classes.scrollToggle}>
          <Paper square={true}>
            {!pause && (
              <IconButton
                aria-label="pause"
                color="secondary"
                onClick={handleButtonPause}
              >
                <PauseIcon />
              </IconButton>
            )}
            {pause && (
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
        <div className={classes.spacer}>
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

export default connect(mapStateToProps, { getTrending, selectTrendingLang })(
  Trending
);
