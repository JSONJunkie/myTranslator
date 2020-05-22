import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { LineChart, Line, ResponsiveContainer } from "recharts";

const useStyles = makeStyles(theme => ({
  chart: {
    zIndex: -1
  }
}));

const TrendingChart = ({ data }) => {
  const classes = useStyles();

  return (
    <ResponsiveContainer>
      <LineChart
        className={classes.chart}
        data={data}
        margin={{
          top: 1,
          right: 2,
          left: 1,
          bottom: 3
        }}
      >
        <Line
          type="linear"
          dataKey="hits"
          stroke="#8884d8"
          dot={false}
          activeDot={true}
          animationBegin={700}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

TrendingChart.propTypes = {
  data: PropTypes.array.isRequired
};

export default TrendingChart;
