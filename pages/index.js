import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  content: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(1)
  }
}));

const Index = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Container className={classes.content}>
        <Paper className={classes.paper}></Paper>
      </Container>
    </div>
  );
};

// Index.propTypes = {
//   rollbar: PropTypes.object.isRequired
// };

export default Index;
