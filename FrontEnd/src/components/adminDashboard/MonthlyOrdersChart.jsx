import React, {
  useEffect,
  useState
} from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import {
  getMonthlyOrderCount
} from "../../services/AdminStatsService";

function MonthlyOrdersChart() {

  const [chartData, setChartData] =
    useState([]);

  useEffect(() => {

    fetchChartData();

  }, []);

  const fetchChartData =
    async () => {

      try {

        const response =
          await getMonthlyOrderCount();

        setChartData(response.data);

      } catch (error) {

        console.log(error);

      }
    };

  return (

    <div className="chart-container">

      <div className="chart-header">

        <h2 className="chart-title">
          Monthly Orders
        </h2>

        <p className="chart-subtitle">
          Orders analytics overview
        </p>

      </div>

      <ResponsiveContainer
        width="100%"
        height={280}
      >

        <BarChart
          data={chartData}
          margin={{
            top: 10,
            right: 10,
            left: -15,
            bottom: 5
          }}
        >

          <CartesianGrid
            strokeDasharray="2 2"
            vertical={false}
            stroke="#edf1ff"
          />

          <XAxis
            dataKey="month"
            interval={0}
            tick={{
              fontSize: 11,
              fill: "#7b8199"
            }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{
              fontSize: 11,
              fill: "#7b8199"
            }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            cursor={{
              fill:
              "rgba(139,92,246,0.08)"
            }}
            contentStyle={{
              borderRadius: "14px",
              border: "none",
              background: "#ffffff",
              boxShadow:
              "0 8px 25px rgba(0,0,0,0.08)"
            }}
          />

          <Bar
            dataKey="count"
            radius={[8,8,0,0]}
            fill="#8B5CF6"
            barSize={28}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}

export default MonthlyOrdersChart;