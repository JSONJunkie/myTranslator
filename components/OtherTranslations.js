import { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import Skeleton from "@material-ui/lab/Skeleton";

const useStyles = makeStyles(theme => ({
  otherTrans: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    padding: theme.spacing(2)
    // height: theme.spacing(30)
  },
  otherTitle: {
    fontSize: 15,
    marginBottom: theme.spacing(1),
    [theme.breakpoints.up("md")]: {
      fontSize: 20
    }
  },
  subTitle: {
    fontSize: 12,
    marginBottom: theme.spacing(1),
    textDecoration: "underline",
    [theme.breakpoints.up("md")]: {
      fontSize: 17
    }
  },
  noTrans: {
    fontSize: 13,
    [theme.breakpoints.up("md")]: {
      fontSize: 18
    }
  },
  text: {
    fontSize: 12,
    [theme.breakpoints.up("md")]: {
      fontSize: 17
    }
  },
  iconsWrapper: {
    display: "flex"
  },
  iconsButton: {
    marginLeft: "auto"
  },
  iconsPlayButton: {
    marginRight: "auto"
  },
  skeleton: {
    marginBottom: theme.spacing(2)
  }
}));

const OtherTrans = ({ loading, otherTrans, audioContext, speak, preTrans }) => {
  const classes = useStyles();

  const handleSpeak = data => {
    audioContext.resume();
    speak({ audioContext, data });
  };

  return (
    <Fragment>
      <Grid item xs={12}>
        <Paper className={classes.otherTrans}>
          {loading && (
            <div className={classes.skeleton}>
              <Skeleton animation="wave" variant="rect" width="100%" />
            </div>
          )}
          {loading && (
            <div>
              <Skeleton animation="wave" variant="rect" width="100%" />
            </div>
          )}
          {otherTrans.length === 0 && !loading && (
            <Typography align="center" className={classes.noTrans}>
              No other translations found
            </Typography>
          )}
          {otherTrans.length > 0 && !loading && (
            <Grid container spacing={2}>
              {otherTrans.length > 0 &&
                otherTrans.map(translation => (
                  <Grid key={translation.text} item xs={12} md={6}>
                    <Divider />
                    <div className={classes.iconsWrapper}>
                      <IconButton
                        className={classes.iconsButton}
                        size="small"
                        color="secondary"
                      >
                        <Typography
                          className={classes.subTitle}
                          color="textSecondary"
                        >
                          {translation.to.toUpperCase()}
                        </Typography>
                      </IconButton>
                      <IconButton
                        className={classes.iconsPlayButton}
                        onClick={e => {
                          handleSpeak(translation.audio[0]);
                        }}
                        aria-label="play"
                      >
                        <VolumeUpIcon />
                      </IconButton>
                    </div>
                    <Typography align="center" className={classes.text}>
                      {translation.text}
                    </Typography>
                    <Divider />
                  </Grid>
                ))}
            </Grid>
          )}
        </Paper>
      </Grid>
    </Fragment>
  );
};

OtherTrans.propTypes = {
  // rollbar: PropTypes.object.isRequired
};

export default OtherTrans;
