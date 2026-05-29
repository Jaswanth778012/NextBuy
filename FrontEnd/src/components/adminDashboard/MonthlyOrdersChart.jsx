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

        <div>

          <h2 className="chart-title">
            Monthly Orders
          </h2>

          <p className="chart-subtitle">
            Ecommerce analytics overview
          </p>

        </div>

      </div>

      <ResponsiveContainer
        width="100%"
        height={180}
      >

        <BarChart
          data={chartData}
          margin={{
            top: 10,
            right: 10,
            left: -20,
            bottom: 0
          }}
        >

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#ede9fe"
          />

          <XAxis
            dataKey="month"
            interval={0}
            tick={{
              fontSize: 9,
              fill: "#7c7c98"
            }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{
              fontSize: 9,
              fill: "#7c7c98"
            }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            cursor={{
              fill:
              "rgba(124,58,237,0.06)"
            }}
            contentStyle={{
              borderRadius: "12px",
              border: "none",
              background: "#ffffff",
              boxShadow:
              "0 8px 20px rgba(0,0,0,0.08)"
            }}
          />

          <Bar
            dataKey="count"
            radius={[8,8,0,0]}
            fill="url(#purpleGradient)"
            barSize={12}
          />

          <defs>

            <linearGradient
              id="purpleGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >

              <stop
                offset="0%"
                stopColor="#8B5CF6"
              />

              <stop
                offset="100%"
                stopColor="#6366F1"
              />

            </linearGradient>

          </defs>

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}

export default MonthlyOrdersChart;