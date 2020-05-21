import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { useRouter } from "next/router";

import { selectLang } from "../src/actions/translations";
import { Fragment } from "react";

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
  test: {
    background: theme.palette.background.paper,
    maxWidth: 150,
    margin: "auto",
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
  }
}));

const Trending = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <div className={classes.scrollContainer}>
          <div className={classes.scroll1}>
            <Typography className={classes.test} color="textSecondary">
              scroll
            </Typography>
            <Typography className={classes.test} color="textSecondary">
              scroll2
            </Typography>
            <Typography className={classes.test} color="textSecondary">
              scroll3
            </Typography>
          </div>
          <div className={classes.scroll2}>
            <Typography className={classes.test} color="textSecondary">
              scroll
            </Typography>
            <Typography className={classes.test} color="textSecondary">
              scroll2
            </Typography>
            <Typography className={classes.test} color="textSecondary">
              scroll3
            </Typography>
          </div>
        </div>
        <div className={classes.trending}>
          <Paper square={true}>
            <Typography className={classes.trendingText} color="textSecondary">
              Trending
            </Typography>
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
    </div>
  );
};

Trending.propTypes = {
  // rollbar: PropTypes.object.isRequired
};

export default Trending;
