import { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Skeleton from "@material-ui/lab/Skeleton";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";

const useStyles = makeStyles(theme => ({
  cardGrid: {
    maxWidth: 619,
    [theme.breakpoints.down("sm")]: {
      maxWidth: 360,
      margin: "auto"
    }
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
  posTyping: {
    marginBottom: 12,
    fontSize: 9,
    [theme.breakpoints.up("md")]: {
      fontSize: 14
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
    position: "absolute",
    marginLeft: theme.spacing(35),
    marginTop: theme.spacing(-8)
  },
  wrapper: {
    position: "relative"
  },
  hiddenTitle: {
    visibility: "hidden",
    fontSize: 25,
    [theme.breakpoints.up("md")]: {
      fontSize: 50
    }
  },
  hiddenPos: {
    visibility: "hidden",
    marginBottom: 12,
    fontSize: 10,
    [theme.breakpoints.up("md")]: {
      fontSize: 15
    }
  },
  hiddenTranslation: {
    visibility: "hidden",
    fontSize: 15,
    [theme.breakpoints.up("md")]: {
      fontSize: 30
    }
  },
  hiddenPlay: {
    visibility: "hidden",
    marginLeft: theme.spacing(12),
    [theme.breakpoints.up("md")]: {
      marginLeft: theme.spacing(1)
    }
  },
  hidden: {
    visibility: "hidden"
  },
  transparentCard: {
    background: "none"
  }
}));

const TranslationGrid = ({ beforeTrans, afterTrans, from, to, speak }) => {
  const classes = useStyles();

  return (
    <Fragment>
      {afterTrans && speak && speak !== "none" && (
        <Grid className={classes.cardGrid} item xs={12} sm={12} md={8}>
          <Card className={classes.transparentCard}>
            <CardContent className={classes.transparentCard}>
              <Typography
                className={classes.hiddenTitle}
                color="textSecondary"
                gutterBottom
              >
                {beforeTrans}
              </Typography>
              <Divider className={classes.hidden} />
              <div className={classes.wrapper}>
                <Typography className={classes.hiddenPos} color="textSecondary">
                  translating from {from} to {to}
                  <Tooltip title="Play">
                    <IconButton
                      className={classes.hiddenPlay}
                      onClick={speak}
                      aria-label="play"
                    >
                      <VolumeUpIcon />
                    </IconButton>
                  </Tooltip>
                </Typography>
                <Tooltip title="Play">
                  <IconButton
                    className={classes.play}
                    onClick={speak}
                    aria-label="play"
                  >
                    <VolumeUpIcon />
                  </IconButton>
                </Tooltip>
              </div>
              {afterTrans && (
                <Typography
                  className={classes.hiddenTranslation}
                  variant="body2"
                >
                  {afterTrans}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      )}
      {afterTrans && speak && speak === "none" && (
        <Grid className={classes.cardGrid} item xs={12} sm={12} md={8}>
          <Card className={classes.transparentCard}>
            <CardContent className={classes.transparentCard}>
              <Typography
                className={classes.hiddenTitle}
                color="textSecondary"
                gutterBottom
              >
                {beforeTrans}
              </Typography>
              <Divider className={classes.hidden} />
              <div className={classes.wrapper}>
                <Typography className={classes.hiddenPos} color="textSecondary">
                  translating from {from} to {to}
                  <Tooltip title="Play">
                    <IconButton
                      className={classes.hiddenPlay}
                      aria-label="play"
                    >
                      <VolumeUpIcon />
                    </IconButton>
                  </Tooltip>
                </Typography>
              </div>
              {afterTrans && (
                <Typography
                  className={classes.hiddenTranslation}
                  variant="body2"
                >
                  {afterTrans}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      )}
      {afterTrans && !speak && (
        <Grid className={classes.cardGrid} item xs={12} sm={12} md={8}>
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
                translated from {from} to {to}
                <IconButton className={classes.hiddenPlay} aria-label="play">
                  <VolumeUpIcon />
                </IconButton>
              </Typography>
              {afterTrans && (
                <Typography className={classes.translation} variant="body2">
                  {afterTrans}
                </Typography>
              )}
              {!afterTrans && (
                <Skeleton animation="wave" variant="rect" width="100%" />
              )}
            </CardContent>
          </Card>
        </Grid>
      )}
      {afterTrans === "" && (
        <Grid className={classes.cardGrid} item xs={12} sm={12} md={8}>
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
              <Typography className={classes.posTyping} color="textSecondary">
                translating from {from} to {to}
                <IconButton className={classes.hiddenPlay} aria-label="play">
                  <VolumeUpIcon />
                </IconButton>
              </Typography>
              <Skeleton animation="wave" variant="rect" width="100%" />
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
  to: PropTypes.string.isRequired
  // rollbar: PropTypes.object.isRequired
};

export default TranslationGrid;
