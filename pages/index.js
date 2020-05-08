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
import Paper from "@material-ui/core/Paper";
import Grow from "@material-ui/core/Grow";

import Chart from "../components/Chart";

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
    width: "100%",
    height: "100%"
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
  cardGrid: {
    maxWidth: 360
  },
  chart: {
    height: 240,
    width: 340,
    margin: "auto"
  },
  showChart: {
    height: "100%",
    width: "100%"
  },
  hideChart: {
    visibility: "hidden"
  }
}));

const Index = ({ translations: { userInput } }) => {
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

  return (
    <div className={classes.root}>
      <Container className={classes.content} maxWidth="md">
        <Grow in={true} timeout={500}>
          <Grid
            container
            justify="center"
            alignItems="center"
            alignContent="center"
            spacing={2}
          >
            <Grid className={classes.cardGrid} item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
              <Paper className={classes.chart}>
                <div
                  className={clsx(classes.showChart, {
                    [classes.hideChart]: hide
                  })}
                >
                  <Chart />
                </div>
              </Paper>
            </Grid>
          </Grid>
        </Grow>
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
