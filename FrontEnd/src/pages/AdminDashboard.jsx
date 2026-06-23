import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
  useLocation,
  useOutletContext,
} from "react-router-dom";

import { toast }
from "react-toastify";

import {

  getTotalStats,

  getTopSellingProducts,

  getAllCategories,

  getSubCategoriesByCategory,

} from "../services/AdminStatsService";

import DashboardCards
from "../components/adminDashboard/DashboardCards";

import MonthlyOrdersChart
from "../components/adminDashboard/MonthlyOrdersChart";

import TopSellingProductsTable
from "../components/adminDashboard/TopSellingProductsTable";

import CategorySalesPieChart
from "../components/adminDashboard/CategorySalesPieChart";

import "../styles/AdminDashboard.css";
import "../styles/AdminProfile.css";

function AdminDashboard() {

  const location =
    useLocation();

  const toastShown =
    useRef(false);

  // =========================
  // GET LAYOUT STATE
  // =========================

  const {
    sidebarOpen,
  } = useOutletContext();

  // =========================
  // LOADING + ERROR
  // =========================

  const [loading,
    setLoading] =
    useState(true);

  const [error,
    setError] =
    useState("");

  // =========================
  // DASHBOARD STATS
  // =========================

  const [stats,
    setStats] =
    useState({

      totalUsers: 0,

      totalProducts: 0,

      TotalRevanue: 0,

      monthlyRevanue: 0,

      yearlyRevanue: 0,

      deliveredOrders: 0,

      cancelledOrders: 0,

      pendingOrders: 0,

      TotallowStockProducts: 0,

      TotalHighStockProducts: 0,
    });

  // =========================
  // TOP PRODUCTS
  // =========================

  const [topProducts,
    setTopProducts] =
    useState([]);

  // =========================
  // CATEGORY
  // =========================

  const [categories,
    setCategories] =
    useState([]);

  const [subCategories,
    setSubCategories] =
    useState([]);

  const [selectedCategory,
    setSelectedCategory] =
    useState(null);

  const [selectedSubCategory,
    setSelectedSubCategory] =
    useState("");

  // =========================
  // LOGIN SUCCESS TOAST
  // =========================

  useEffect(() => {

    if (

      location.state?.loginSuccess &&

      !toastShown.current

    ) {

      toastShown.current =
        true;

      toast.success(
        "Welcome Admin 🚀"
      );

      // Clear state without triggering navigation
      window.history.replaceState({}, document.title, location.pathname);
    }

  }, [location]);

  // =========================
  // FETCH STATS
  // =========================

  const fetchStats =
    async () => {

      try {

        setLoading(true);

        const response =
          await getTotalStats();

        setStats(
          response.data
        );

        setError("");

      } catch (error) {

        console.error(error);

        setError(
          "Failed to load dashboard statistics"
        );

      } finally {

        setLoading(false);
      }
  };

  // =========================
  // FETCH CATEGORIES
  // =========================

  const fetchCategories =
    async () => {

      try {

        const response =
          await getAllCategories();

        setCategories(
          response.data
        );

      } catch (error) {

        console.error(error);
      }
  };

  // =========================
  // FETCH SUBCATEGORIES
  // =========================

  const fetchSubCategoriesByCategory =
    async (categoryId) => {

      try {

        const response =

          await getSubCategoriesByCategory(
            categoryId
          );

        setSubCategories(
          response.data
        );

      } catch (error) {

        console.error(error);
      }
  };

  // =========================
  // FETCH TOP PRODUCTS
  // =========================

  const fetchTopProducts =
    async (

      category = "",

      subCategory = ""

    ) => {

      try {

        const response =

          await getTopSellingProducts(

            category,

            subCategory
          );

        setTopProducts(

          [...response.data]

            .sort(
              (a, b) =>

                b.totalSold -
                a.totalSold
            )

            .slice(0, 5)
        );

      } catch (error) {

        console.error(error);
      }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {

    fetchStats();

    fetchCategories();

  }, []);

  // =========================
  // CATEGORY CHANGE
  // =========================

  useEffect(() => {

    if (
      selectedCategory?.id
    ) {

      fetchSubCategoriesByCategory(
        selectedCategory.id
      );

    } else {

      setSubCategories([]);
    }

    setSelectedSubCategory(
      ""
    );

  }, [selectedCategory]);

  // =========================
  // FETCH TOP PRODUCTS
  // =========================

  useEffect(() => {

    fetchTopProducts(

      selectedCategory?.name || "",

      selectedSubCategory
    );

  }, [

    selectedCategory,

    selectedSubCategory,

  ]);

  // =========================
  // LOADING UI
  // =========================

  if (loading) {

    return (

      <div className="dashboard-status-card">

        <div className="dashboard-loader"></div>

        <h2>
          Loading Dashboard
        </h2>

        <p>
          Fetching latest statistics...
        </p>

      </div>
    );
  }

  // =========================
  // ERROR UI
  // =========================

  if (error) {

    return (

      <div className="dashboard-status-card error-card">

        <div className="error-icon">
          ⚠️
        </div>

        <h2>
          Failed to Load Statistics
        </h2>

        <p>{error}</p>

        <button
          className="retry-btn"
          onClick={fetchStats}
        >
          Retry
        </button>

      </div>
    );
  }

  // =========================
  // MAIN UI
  // =========================

  return (

    <>

      {/* DASHBOARD CARDS */}

      <DashboardCards
        stats={stats}
        sidebarOpen={sidebarOpen}
      />

      {/* CHARTS */}

      <div className="charts-wrapper">

        <MonthlyOrdersChart />

        <CategorySalesPieChart />

      </div>

      {/* TOP PRODUCTS */}

      <TopSellingProductsTable

        products={topProducts}

        categories={categories}

        subCategories={subCategories}

        selectedCategory={
          selectedCategory
        }

        setSelectedCategory={
          setSelectedCategory
        }

        selectedSubCategory={
          selectedSubCategory
        }

        setSelectedSubCategory={
          setSelectedSubCategory
        }
      />

    </>
  );
}

export default AdminDashboard;