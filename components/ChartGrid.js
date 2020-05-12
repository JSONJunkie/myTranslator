import { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { CircularProgress } from "@material-ui/core";

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
  },
  wrapper: {
    display: "flex",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  spacer: {
    height: 120,
    width: 170,
    margin: "auto",
    [theme.breakpoints.up("md")]: {
      height: 240,
      width: 340
    },
    visibility: "hidden"
  }
}));

const data = [
  { time: 0, hits: 2 },
  { time: 4, hits: 7 },
  { time: 8, hits: 9 },
  { time: 12, hits: 3 },
  { time: 16, hits: 5 },
  { time: 100, hits: 0 }
];

const ChartGrid = ({ hide: { hide } }) => {
  const classes = useStyles();
  return (
    <Fragment>
      <Grid item xs={12} sm={12}>
        {!hide && hide !== "" && (
          <Paper className={classes.chart}>
            <div className={classes.showChart}>
              <Chart data={data} />
            </div>
          </Paper>
        )}
        {hide && (
          <Paper className={classes.chart}>
            <div className={classes.showChart}>
              <div className={classes.wrapper}>
                <CircularProgress disableShrink />
              </div>
            </div>
          </Paper>
        )}
        {hide === "" && (
          <Paper className={classes.spacer}>
            <div>a</div>
          </Paper>
        )}
      </Grid>
    </Fragment>
  );
};

ChartGrid.propTypes = {
  hide: PropTypes.object.isRequired,
  rollbar: PropTypes.object.isRequired
};

export default ChartGrid;
