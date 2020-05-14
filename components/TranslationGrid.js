import { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { CircularProgress } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";

const useStyles = makeStyles(theme => ({
  cardGrid: {
    maxWidth: 360
  },
  cardRoot: {
    width: "100%",
    height: "100%"
  },
  pos: {
    marginBottom: 12,
    fontSize: 10,
    [theme.breakpoints.up("md")]: {
      fontSize: 15
    }
  },
  title: {
    fontSize: 25,
    [theme.breakpoints.up("md")]: {
      fontSize: 50
    }
  },
  translation: {
    fontSize: 15,
    [theme.breakpoints.up("md")]: {
      fontSize: 30
    }
  },
  progress: {
    display: "flex",
    justifyContent: "center"
  },
  play: {
    marginLeft: theme.spacing(12),
    [theme.breakpoints.up("md")]: {
      marginLeft: theme.spacing(1)
    }
  }
}));

const TranslationGrid = ({ beforeTrans, afterTrans, from, to, speak }) => {
  const classes = useStyles();

  return (
    <Fragment>
      {afterTrans && speak && (
        <Grid className={classes.cardGrid} item xs={12} sm={12}>
          <Card className={classes.cardRoot}>
            <CardContent>
              <Typography
                className={classes.title}
                color="textSecondary"
                gutterBottom
              >
                {beforeTrans}
              </Typography>
              <Divider />
              <Typography className={classes.pos} color="textSecondary">
                translating from {from} to {to}...
                <Tooltip title="Play">
                  <IconButton
                    className={classes.play}
                    onClick={speak}
                    aria-label="play"
                  >
                    <VolumeUpIcon />
                  </IconButton>
                </Tooltip>
              </Typography>
              {afterTrans && (
                <Typography className={classes.translation} variant="body2">
                  {afterTrans}
                </Typography>
              )}
              {!afterTrans && (
                <div className={classes.progress}>
                  <CircularProgress disableShrink />
                </div>
              )}
            </CardContent>
          </Card>
        </Grid>
      )}
      {afterTrans && (
        <Grid className={classes.cardGrid} item xs={12} sm={12}>
          <Card className={classes.cardRoot}>
            <CardContent>
              <Typography
                className={classes.title}
                color="textSecondary"
                gutterBottom
              >
                {beforeTrans}
              </Typography>
              <Divider />
              <Typography className={classes.pos} color="textSecondary">
                translating from {from} to {to}...
              </Typography>
              {afterTrans && (
                <Typography className={classes.translation} variant="body2">
                  {afterTrans}
                </Typography>
              )}
              {!afterTrans && (
                <div className={classes.progress}>
                  <CircularProgress disableShrink />
                </div>
              )}
            </CardContent>
          </Card>
        </Grid>
      )}
      {afterTrans === "" && (
        <Grid className={classes.cardGrid} item xs={12} sm={12}>
          <Card className={classes.cardRoot}>
            <CardContent>
              <Typography
                className={classes.title}
                color="textSecondary"
                gutterBottom
              >
                {beforeTrans}
              </Typography>
              <Divider />
              <Typography className={classes.pos} color="textSecondary">
                translating from {from} to {to}...
              </Typography>
              <div className={classes.progress}>
                <CircularProgress disableShrink />
              </div>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Fragment>
  );
};

TranslationGrid.propTypes = {};

TranslationGrid.propTypes = {
  beforeTrans: PropTypes.string.isRequired,
  afterTrans: PropTypes.string.isRequired,
  from: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  speak: PropTypes.func
  // rollbar: PropTypes.object.isRequired
};

export default TranslationGrid;
