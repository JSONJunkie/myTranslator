import PropTypes from "prop-types";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Fragment, useEffect, useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { useRouter } from "next/router";
import Grow from "@material-ui/core/Grow";

import { numOfTranslations } from "../src/actions/translations";

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(1)
  },
  stuff: {
    marginLeft: "auto"
  }
}));

const Navbar = ({ numOfTranslations, translations: { numTrans } }) => {
  const classes = useStyles();

  const router = useRouter();

  const [routeChange, setRouteChange] = useState(true);

  const handleRouteChangeComplete = url => {
    setRouteChange(prev => true);
  };

  useEffect(() => {
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, []);

  useEffect(() => {
    if (routeChange) {
      numOfTranslations();
      setRouteChange(prev => false);
    }
  }, [routeChange]);

  return (
    <Fragment>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h3">Translator</Typography>
          <Grow in={numTrans}>
            <span className={classes.stuff}>
              <Typography>
                Total number of translations available: {numTrans}
              </Typography>
            </span>
          </Grow>
        </Toolbar>
      </AppBar>
      <Toolbar className={classes.root}>
        <Typography variant="h3">Translator</Typography>
      </Toolbar>
    </Fragment>
  );
};

// Navbar.propTypes = {
//   rollbar: PropTypes.object.isRequired
// };

Navbar.propTypes = {
  numOfTranslations: PropTypes.func.isRequired,
  translations: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  translations: state.translations
});

export default connect(mapStateToProps, { numOfTranslations })(Navbar);
