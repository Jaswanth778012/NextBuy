import React, {
  useEffect,
  useState
} from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import {
  getCategoryStats
} from "../../services/AdminStatsService";

const COLORS = [
  "#8B5CF6",
  "#3B82F6",
  "#EC4899",
  "#14B8A6",
  "#F97316",
  "#6366F1"
];

function CategorySalesPieChart() {

  const [chartData, setChartData] =
    useState([]);

  useEffect(() => {

    fetchCategoryStats();

  }, []);

  const fetchCategoryStats =
    async () => {

      try {

        const response =
          await getCategoryStats();

        const data =
          response.data;

        // SORT HIGH TO LOW

        const sortedData =
          [...data].sort(
            (a, b) =>
              b.totalSold - a.totalSold
          );

        // TOP 5

        const topFive =
          sortedData.slice(0, 5);

        // REMAINING

        const remaining =
          sortedData.slice(5);

        // OTHERS TOTAL

        const othersTotal =
          remaining.reduce(
            (sum, item) =>
              sum + item.totalSold,
            0
          );

        // FINAL DATA

        const finalData =
          othersTotal > 0
          ? [
              ...topFive,
              {
                categoryName: "Others",
                totalSold: othersTotal
              }
            ]
          : topFive;

        setChartData(finalData);

      } catch (error) {

        console.log(error);

      }
    };

  return (

    <div className="pie-chart-container">

      {/* HEADER */}

      <div className="chart-header">

        <h2 className="chart-title">
          Category Sales
        </h2>

        <p className="chart-subtitle">
          Top selling categories
        </p>

      </div>

      {/* CONTENT */}

      <div className="pie-layout">

        {/* PIE GRAPH */}

        <div className="pie-graph">

          <ResponsiveContainer
            width="100%"
            height={220}
          >

            <PieChart>

              <Pie
                data={chartData}
                dataKey="totalSold"
                nameKey="categoryName"
                cx="50%"
                cy="50%"
                outerRadius={78}
                innerRadius={42}
                paddingAngle={3}
              >

                {chartData.map(
                  (entry, index) => (

                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index % COLORS.length
                        ]
                      }
                    />

                  )
                )}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

        {/* CATEGORY LIST */}

        <div className="category-list">

          {chartData.map(
            (item, index) => (

              <div
                className="category-row"
                key={index}
              >

                <div className="category-left">

                  <span
                    className="category-dot"
                    style={{
                      background:
                      COLORS[
                        index % COLORS.length
                      ]
                    }}
                  />

                  <span className="category-text">

                    {item.categoryName}

                  </span>

                </div>

                <span className="category-count">

                  {item.totalSold}

                </span>

              </div>

            )
          )}

        </div>

      </div>

    </div>
  );
}

export default CategorySalesPieChart;