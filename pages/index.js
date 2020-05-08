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

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    height: "100%",
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
  translation: {
    fontSize: 30
  },
  pos: {
    marginBottom: 12
  },
  hidden: {
    fontSize: 30,
    visibility: "hidden"
  }
}));

const Index = ({ translations: { userInput } }) => {
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
                Welcome
              </Typography>
              <Divider />
              <Typography className={classes.pos} color="textSecondary">
                translating from english to spanish...
              </Typography>
              <Typography
                className={classes.translation}
                variant="body2"
                component="p"
              >
                Bienvenida
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Container>
    </div>
  );
};

// Index.propTypes = {
//   rollbar: PropTypes.object.isRequired
// };

Index.propTypes = {
  translations: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  translations: state.translations
});

export default connect(mapStateToProps)(Index);
