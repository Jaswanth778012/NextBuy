import React from "react";



function OrdersStatsCards({ stats }) {
  return (
    <div className="orders-stats-grid">

      {/* Cancelled Orders */}
      <div className="stat-card cancelled-card">
        <div className="card-top">
         
        </div>

        <h3>Cancelled Orders</h3>

        <p>{stats?.cancelledOrders || 0}</p>
      </div>

      {/* Pending Orders */}
      <div className="stat-card pending-card">
        <div className="card-top">
         
        </div>

        <h3>Pending Orders</h3>

        <p>{stats?.pendingOrders || 0}</p>
      </div>

      {/* Shipped Orders */}
      <div className="stat-card shipped-card">
        <div className="card-top">
          
        </div>

        <h3>Shipped Orders</h3>

        <p>{stats?.shippedOrdes || 0}</p>
      </div>

      {/* Returned Orders */}
      <div className="stat-card return-card">
        <div className="card-top">
        
        </div>

        <h3>Returned Orders</h3>

        <p>{stats?.returnOrders || 0}</p>
      </div>

    </div>
  );
}

export default OrdersStatsCards;