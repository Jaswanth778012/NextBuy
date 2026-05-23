import React from "react";

function DashboardCard({ title, value }) {
  return (
    <div className="dashboard-card">
      <h2>{title}</h2>
      <p>{value}</p>
    </div>
  );
}

export default DashboardCard; 