import React from "react";
import { FaDownload } from "react-icons/fa";
import { downloadInvoice } from "../../services/AdminOrderService";

function OrdersTable({ orders, onStatusChange }) {

  const statusFlow = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["PROCESSING", "CANCELLED"],
    PROCESSING: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["OUT_FOR_DELIVERY", "RETURNED"],
    OUT_FOR_DELIVERY: ["DELIVERED", "RETURNED"],
    DELIVERED: [],
    CANCELLED: [],
    RETURNED: []
  };

  const getAllowedStatuses = (currentStatus) =>
    statusFlow[currentStatus] || [];

  return (
    <div className="users-table-card">
      <div className="table-wrapper">

        <table className="users-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Order No</th>
              <th>Customer</th>
              <th>Products</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Order Date</th>
              <th>Invoice</th>
            </tr>
          </thead>

          <tbody>
            {orders?.length > 0 ? (
              orders.map((order) => {

                const allowedStatuses = getAllowedStatuses(order.status);

                return (
                  <tr key={order.id}>

                    <td>#{order.id}</td>
                    <td>{order.orderNumber}</td>

                    <td>
                      <div className="user-info-cell">
                        <div className="user-avatar">
                          {order.shippingAddress?.fullName?.charAt(0)?.toUpperCase()}
                        </div>

                        <div>
                          <h4>{order.shippingAddress?.fullName || "N/A"}</h4>
                          <p>{order.shippingAddress?.mobileNumber || "N/A"}</p>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="orders-chip">
                        {order.orderItems?.length || 0}
                      </span>
                    </td>

                    <td>
                      <div className="spent-cell">
                        ₹{Number(order.finalPrice).toLocaleString("en-IN")}
                      </div>
                    </td>

                    <td className="email-cell">
                      {order.payment?.paymentMethod || "N/A"}
                    </td>

                    {/* STATUS */}
                    <td>
                      <select
                        value={order.status}
                        className={`status-dropdown status-${order.status}`}
                        onChange={(e) =>
                          onStatusChange(order.id, e.target.value)
                        }
                      >
                        <option value={order.status}>
                          {order.status}
                        </option>

                        {allowedStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <div className="date-info">
                        {new Date(order.orderedAt).toLocaleDateString()}
                      </div>
                    </td>

                    {/* INVOICE BUTTON */}
                    <td>
                      <button
                        type="button"
                        className="invoice-btn"
                        onClick={() => downloadInvoice(order.id)}
                      >
                        <FaDownload style={{ marginRight: "6px" }} />
                        Download
                      </button>
                    </td>

                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="empty-users">
                  No Orders Found 🚫
                </td>
              </tr>
            )}
          </tbody>

        </table>

      </div>
    </div>
  );
}

export default OrdersTable;