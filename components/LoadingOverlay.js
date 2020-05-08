import { makeStyles } from "@material-ui/core/styles";
import { useEffect, useState } from "react";
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

const useStyles = makeStyles(theme => ({
  root: {
    position: "absolute",
    display: "flex",
    height: "100%",
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
    display: "flex"
  },
  cardRoot: {
    width: 360
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
    marginTop: -12,
    marginLeft: -12
  },
  caption: {
    position: "absolute",
    top: "90%",
    left: "10%"
  }
}));

const LoadingOverlay = ({ translations: { userInput } }) => {
  const classes = useStyles();

  const [hide, setHide] = useState(true);

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

  return (
    <div
      className={clsx(classes.root, {
        [classes.hideRoot]: hide
      })}
    >
      <Container className={classes.content} maxWidth="md">
        <Grid
          container
          justify="center"
          alignItems="center"
          alignContent="center"
        >
          <Card className={classes.cardRoot}>
            <CardContent>
              <Typography
                className={classes.title}
                color="textSecondary"
                gutterBottom
              >
                {userInput}
              </Typography>
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
                  the translation is gona go here
                </Typography>
                <CircularProgress disableShrink className={classes.progress} />
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
      </Container>
    </div>
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
