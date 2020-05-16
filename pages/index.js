import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Grow from "@material-ui/core/Grow";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

import TranslationGrid from "../components/TranslationGrid";
import ChartGrid from "../components/ChartGrid";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    height: "100%",
    flexGrow: 1
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  date: {
    visibility: "hidden"
  },
  progress: {
    display: "flex",
    justifyContent: "center"
  }
}));

const Index = ({ translations: { userInput, preTrans, from, to } }) => {
  const classes = useStyles();

  const [hide, setHide] = useState(false);

  useEffect(() => {
    if (userInput) {
      setHide(prev => true);
    }

    if (!userInput) {
      setHide(prev => false);
    }
  }, [userInput]);

  return preTrans ? (
    <div className={classes.root}>
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
          <TranslationGrid
            beforeTrans={"Welcome"}
            afterTrans={"Bienvenida"}
            from={"English"}
            to={"Spanish"}
          />
          <ChartGrid hide={{ hide: "" }} />
        </Grid>
      </Container>
    </div>
  ) : (
    <div className={classes.root}>
      <Container className={classes.content} maxWidth="md">
        <Typography variant="h5" align="center">
          one moment while I get that for you...
        </Typography>
        <div className={classes.progress}>
          <CircularProgress disableShrink />
        </div>
      </Container>
    </div>
  );
};

// Index.propTypes = {
//   rollbar: PropTypes.object.isRequired
// };

Index.propTypes = {
  translations: PropTypes.object.isRequired,
  rollbar: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  translations: state.translations
});

export default connect(mapStateToProps)(Index);
