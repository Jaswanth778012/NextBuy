import React from "react";

function DashboardCard({
  title,
  value,
  onClick
}) {

  return (

    <div
      className="dashboard-card"
      onClick={onClick}
      style={{
        cursor: onClick
          ? "pointer"
          : "default"
      }}
    >

      <h2>{title}</h2>

      <p>{value}</p>

    </div>
  );
}

export default DashboardCard;