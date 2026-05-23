import React from "react";

import DashboardCard from "./DashboardCard";

function DashboardCards({ stats }) {
  const cards = [
    { title: "Total Users", value: stats.totalUsers },
    { title: "Total Products", value: stats.totalProducts },
    { title: "Total Revenue", value: `₹${stats.TotalRevanue}` },
    { title: "Delivered Orders", value: stats.deliveredOrders },
    { title: "Low Stock Products", value: stats.TotallowStockProducts },
    { title: "High Stock Products", value: stats.TotalHighStockProducts },
  ];

  return (
    <div className="dashboard-cards">
      {cards.map((card, index) => (
        <DashboardCard
          key={index}
          title={card.title}
          value={card.value}
        />
      ))}
    </div>
  );
}

export default DashboardCards;