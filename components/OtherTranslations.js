import { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";

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
  text: {
    fontSize: 12,
    [theme.breakpoints.up("md")]: {
      fontSize: 17
    }
  }
}));

const OtherTrans = ({ otherTrans, audioContext, speak }) => {
  const classes = useStyles();

  const handleSpeak = data => {
    audioContext.resume();
    speak({ audioContext, data });
  };

  return (
    <Fragment>
      <Grid item xs={12}>
        <Paper className={classes.otherTrans}>
          <Typography className={classes.otherTitle}>
            Other translations
          </Typography>
          <Grid container spacing={2}>
            {otherTrans.length > 0 &&
              otherTrans.map(translation => (
                <Grid key={translation.text} item xs={12} md={6}>
                  <Divider />
                  <IconButton size="small" color="secondary">
                    <Typography
                      className={classes.subTitle}
                      color="textSecondary"
                    >
                      {translation.to.toUpperCase()}
                    </Typography>
                  </IconButton>
                  <IconButton
                    onClick={e => {
                      handleSpeak(translation.audio[0]);
                    }}
                    aria-label="play"
                  >
                    <VolumeUpIcon />
                  </IconButton>
                  <Typography className={classes.text}>
                    {translation.text}
                  </Typography>
                  <Divider />
                </Grid>
              ))}
          </Grid>
        </Paper>
      </Grid>
    </Fragment>
  );
};

OtherTrans.propTypes = {
  // rollbar: PropTypes.object.isRequired
};

export default OtherTrans;
