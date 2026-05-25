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
  "#6366F1",
  "#06B6D4",
  "#F43F5E"
];

function CategorySalesPieChart() {

  const [chartData, setChartData] =
    useState([]);

  const [showAll, setShowAll] =
    useState(false);

  useEffect(() => {

    fetchCategoryStats();

  }, []);

  const fetchCategoryStats =
    async () => {

      try {

        const response =
          await getCategoryStats();

        setChartData(response.data);

      } catch (error) {

        console.log(error);

      }
    };

  // SHOW ONLY 5 INITIALLY

  const visibleCategories =
    showAll
    ? chartData
    : chartData.slice(0, 5);

  return (

    <div className="pie-chart-container">

      {/* HEADER */}

      <div className="chart-header">

        <h2 className="chart-title">
          Category Sales
        </h2>

        <p className="chart-subtitle">
          Product sales overview
        </p>

      </div>

      {/* PIE + CATEGORYS */}

      <div className="pie-layout">

        {/* PIE CHART */}

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
                outerRadius={75}
                innerRadius={42}
                paddingAngle={3}
              >

                {chartData.map((entry, index) => (

                  <Cell
                    key={index}
                    fill={
                      COLORS[
                        index % COLORS.length
                      ]
                    }
                  />

                ))}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

        {/* CATEGORY LIST */}

        <div className="category-list">

          {visibleCategories.map((item, index) => (

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

          ))}

          {/* MORE BUTTON */}

          {chartData.length > 5 && (

            <button
              className="more-btn"
              onClick={() =>
                setShowAll(!showAll)
              }
            >

              {showAll
                ? "Show Less"
                : "More"}

            </button>

          )}

        </div>

      </div>

    </div>
  );
}

export default CategorySalesPieChart;