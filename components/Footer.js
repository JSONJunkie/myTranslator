import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: "auto"
  }
}));

const Footer = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h3">Footer</Typography>
    </div>
  );
};

// Footer.propTypes = {
//   rollbar: PropTypes.object.isRequired
// };

export default Footer;
