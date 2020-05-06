import PropTypes from "prop-types";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Fragment, useEffect, useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { useRouter } from "next/router";

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(1)
  }
}));

const Navbar = ({}) => {
  const classes = useStyles();

  const router = useRouter();

  const [routeChange, setRouteChange] = useState(true);

  const handleRouteChangeComplete = url => {
    console.log("App changed to: ", url);
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
      console.log("Total translations");
      setRouteChange(prev => false);
    }
  }, [routeChange]);

  return (
    <Fragment>
      <AppBar position="fixed">
        <Toolbar>
          <Typography>Translator</Typography>
        </Toolbar>
      </AppBar>
      <Toolbar className={classes.root} />
    </Fragment>
  );
};

// Navbar.propTypes = {
//   rollbar: PropTypes.object.isRequired
// };

Navbar.propTypes = {};

export default connect(null)(Navbar);
