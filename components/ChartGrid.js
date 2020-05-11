import { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import Chart from "../components/Chart";

const useStyles = makeStyles(theme => ({
  chart: {
    height: 120,
    width: 170,
    margin: "auto",
    [theme.breakpoints.up("md")]: {
      height: 240,
      width: 340
    }
  },
  showChart: {
    height: "100%",
    width: "100%"
  },
  hideChart: {
    visibility: "hidden"
  }
}));

const ChartGrid = () => {
  const classes = useStyles();

  return (
    <Fragment>
      <Grid item xs={12} sm={12}>
        <Paper className={classes.chart}>
          <div className={classes.showChart}>
            <Chart />
          </div>
        </Paper>
      </Grid>
    </Fragment>
  );
};

ChartGrid.propTypes = {
  rollbar: PropTypes.object.isRequired
};

export default ChartGrid;
