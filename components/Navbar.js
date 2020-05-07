import { makeStyles } from "@material-ui/core/styles";
import { Fragment } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
  hidden: {
    visibility: "hidden"
  }
}));

const Navbar = () => {
  const classes = useStyles();

  return (
    <Fragment>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h3">Translator</Typography>
        </Toolbar>
      </AppBar>
      <Toolbar className={classes.hidden}>
        <Typography variant="h3">Translator</Typography>
      </Toolbar>
    </Fragment>
  );
};

// Navbar.propTypes = {
//   rollbar: PropTypes.object.isRequired
// };

export default Navbar;
