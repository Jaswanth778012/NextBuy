import React, { useEffect, useState } from "react";

import {
  getOrderStats,
  getAllOrders,
  getOrderById,
  getUserOrders,
  getOrdersByDate,
  getOrdersByStatus,
  getOrdersByMonth,
  getOrdersByYear,
  getOrdersByMonthAndYear,
  getTotalOrdersCount,
  updateOrderStatus
} from "../services/AdminOrderService";

import { FaBoxOpen } from "react-icons/fa";

import OrdersStatsCards from "../components/orderManagement/OrdersStatsCards";
import OrderSearchBar from "../components/orderManagement/OrderSearchBar";
import OrdersTable from "../components/orderManagement/OrdersTable";

import "../styles/ordersManagement.css";

function OrdersManagement() {
  const [totalOrders, setTotalOrders] = useState(0);
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [size, setSize] = useState(10);

  // =========================
  // STATS
  // =========================
  const fetchStats = async () => {
    try {
      const data = await getOrderStats();
      setStats(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ORDERS
  // =========================
  const fetchOrders = async (pageNumber = 0, pageSize = size) => {
    try {
      setLoadingOrders(true);

      const data = await getAllOrders(pageNumber, pageSize);

      setOrders(data?.content || []);
      setPage(data?.number || 0);
      setTotalPages(data?.totalPages || 0);
    } catch (error) {
      console.log(error);
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchTotalOrders = async () => {
    try {
      const data = await getTotalOrdersCount();
      setTotalOrders(data);
    } catch (error) {
      console.log(error);
      setTotalOrders(0);
    }
  };

  const resetOrders = async () => {
    await fetchOrders(0, size);
  };

  // =========================
  // SEARCH
  // =========================
  const handleSearch = async ({
    searchType,
    searchValue,
    year,
  }) => {
    try {
      let data;

      switch (searchType) {
        case "orderId":
          data = await getOrderById(searchValue);
          setOrders(data ? [data] : []);
          setTotalPages(1);
          break;

        case "userId":
          data = await getUserOrders(searchValue);
          setOrders(data || []);
          setTotalPages(1);
          break;

        case "date":
          data = await getOrdersByDate(searchValue);
          setOrders(data || []);
          setTotalPages(1);
          break;

        case "status":
          data = await getOrdersByStatus(searchValue);
          setOrders(data || []);
          setTotalPages(1);
          break;

        case "month":
          data = await getOrdersByMonth(searchValue);
          setOrders(data || []);
          setTotalPages(1);
          break;

        case "year":
          data = await getOrdersByYear(searchValue);
          setOrders(data || []);
          setTotalPages(1);
          break;

        case "monthYear":
          data = await getOrdersByMonthAndYear(searchValue, year);
          setOrders(data || []);
          setTotalPages(1);
          break;

        default:
          setOrders([]);
      }
    } catch (error) {
      console.log(error);
      setOrders([]);
    }
  };

  // =========================
  // STATUS UPDATE (NO REFRESH NEEDED)
  // =========================
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);

      // 🔥 instant UI update (NO PAGE REFRESH)
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );

      // optional: refresh stats only
      fetchStats();

    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // PAGINATION
  // =========================
  const handleNext = () => {
    if (page < totalPages - 1) {
      fetchOrders(page + 1, size);
    }
  };

  const handlePrev = () => {
    if (page > 0) {
      fetchOrders(page - 1, size);
    }
  };

  const handleSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setSize(newSize);
    fetchOrders(0, newSize);
  };

  useEffect(() => {
    fetchStats();
    fetchOrders(0, size);
    fetchTotalOrders();
  }, []);

  if (loading) return <h3>Loading Stats...</h3>;

  return (
    <div className="orders-container">

      {/* HEADER */}
      <div className="orders-header">

        <div>
          <h1 className="orders-title">
            Orders Management
          </h1>

          <p className="ordersmanagesment-message">
            Manage orders & spending analytics
          </p>
        </div>

        <div className="total-orders-badge">
          <FaBoxOpen className="orders-icon" />
          <span>{totalOrders} Orders</span>
        </div>

      </div>

      {/* STATS */}
      <OrdersStatsCards stats={stats} />

      {/* SEARCH */}
      <OrderSearchBar
        onSearch={handleSearch}
        onReset={resetOrders}
      />

      {/* TABLE */}
      {loadingOrders ? (
        <h3>Loading Orders...</h3>
      ) : orders.length === 0 ? (
        <h3 className="empty-orders">No Orders Found</h3>
      ) : (
        <OrdersTable
          orders={orders}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* PAGINATION */}
      <div className="pagination-container">

        <div className="pagination-left">
          <span>Show</span>

          <select value={size} onChange={handleSizeChange}>
            <option value={10}>10</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
          </select>

          <span>orders per page</span>
        </div>

        <div className="pagination-right">

          <button
            className="pagination-btn"
            onClick={handlePrev}
            disabled={page === 0}
          >
            Previous
          </button>

          <div className="page-indicator">
            Page {page + 1} of {totalPages || 1}
          </div>

          <button
            className="pagination-btn"
            onClick={handleNext}
            disabled={page >= totalPages - 1}
          >
            Next
          </button>

        </div>

      </div>

    </div>
  );
}

export default OrdersManagement;