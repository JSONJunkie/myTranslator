import React from "react";
import PropTypes from "prop-types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const Chart = ({ data }) => {
  return (
    <ResponsiveContainer>
      <LineChart
        data={data}
        margin={{
          top: 10,
          right: 10,
          left: 10,
          bottom: 10
        }}
      >
        <Line
          type="linear"
          dataKey="hits"
          stroke="#8884d8"
          dot={false}
          activeDot={true}
          animationBegin={700}
          isAnimationActive={false}
        />
        <Line
          type="linear"
          dataKey="mostHits"
          stroke="#8884d8"
          isAnimationActive={false}
          strokeWidth={0}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

Chart.propTypes = {
  data: PropTypes.array.isRequired
};

export default Chart;
