
import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useOutletContext,
} from "react-router-dom";

import {
  FaTicketAlt,
  FaPlus,
} from "react-icons/fa";

import CouponSearchBar from "../components/adminCupon/CouponSearchBar";
import CouponTable from "../components/adminCupon/CouponTable";
import CouponPagination from "../components/adminCupon/CouponPagination";
import AddCouponModal from "../components/adminCupon/AddCouponModal";
import EditCouponModal from "../components/adminCupon/EditCouponModal";

import {
  getAllCoupons,
} from "../services/adminCuponService";

import "../styles/CouponManagement.css";

function AdminCupon() {

  const {
    sidebarOpen,
    theme,
  } = useOutletContext();

  const [coupons, setCoupons] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [showModal,
    setShowModal] =
    useState(false);

  const [showEditModal,
    setShowEditModal] =
    useState(false);

  const [selectedCoupon,
    setSelectedCoupon] =
    useState(null);

  const [searchKeyword,
    setSearchKeyword] =
    useState("");

  const [currentPage,
    setCurrentPage] =
    useState(1);

  const [couponsPerPage,
    setCouponsPerPage] =
    useState(10);

  const fetchCoupons =
    async () => {

      try {

        setLoading(true);

        const response =
          await getAllCoupons();

        setCoupons(
          response || []
        );

      } catch (error) {

        console.error(error);

        setCoupons([]);

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {

    fetchCoupons();

  }, []);

  const openEditModal =
    (coupon) => {

      setSelectedCoupon(
        coupon
      );

      setShowEditModal(
        true
      );
    };

  const filteredCoupons =
    useMemo(() => {

      return coupons.filter(
        (coupon) =>
          coupon.code
            ?.toLowerCase()
            .includes(
              searchKeyword.toLowerCase()
            )
      );

    }, [
      coupons,
      searchKeyword,
    ]);

  const indexOfLastCoupon =
    currentPage *
    couponsPerPage;

  const indexOfFirstCoupon =
    indexOfLastCoupon -
    couponsPerPage;

  const currentCoupons =
    filteredCoupons.slice(
      indexOfFirstCoupon,
      indexOfLastCoupon
    );

  const totalPages =
    Math.ceil(
      filteredCoupons.length /
      couponsPerPage
    );

  if (loading) {

    return (

      <div className="coupon-panel-page">

        <div className="coupon-loader-card">

          <div className="dashboard-loader" />

          <h2>
            Loading Coupons
          </h2>

        </div>

      </div>
    );
  }

  return (

    <div
      className={`coupon-panel-page ${
        sidebarOpen
          ? "sidebar-open"
          : "sidebar-closed"
      } ${
        theme === "dark"
          ? "dark-mode"
          : ""
      }`}
    >

      <div className="coupon-panel-header">

        <div>

          <h1>
            Coupon Management
          </h1>

          <p>
            Manage discounts,
            offers and coupon codes
          </p>

        </div>

        <div className="coupon-header-actions">

          <div className="coupon-total-card">

            <FaTicketAlt />

            <span>
              {coupons.length}
              {" "}
              Coupons
            </span>

          </div>

          <button
            className="add-coupon-btn"
            onClick={() =>
              setShowModal(true)
            }
          >

            <FaPlus />

            Add Coupon

          </button>

        </div>

      </div>

      <CouponSearchBar
        searchKeyword={
          searchKeyword
        }
        setSearchKeyword={
          setSearchKeyword
        }
      />

      <CouponTable
        coupons={currentCoupons}
        fetchCoupons={
          fetchCoupons
        }
        openEditModal={
          openEditModal
        }
      />

      {filteredCoupons.length >
        0 && (

        <CouponPagination
          currentPage={
            currentPage
          }
          totalPages={
            totalPages
          }
          couponsPerPage={
            couponsPerPage
          }
          setCouponsPerPage={
            setCouponsPerPage
          }
          setCurrentPage={
            setCurrentPage
          }
        />

      )}

      <AddCouponModal
        showModal={
          showModal
        }
        setShowModal={
          setShowModal
        }
        fetchCoupons={
          fetchCoupons
        }
      />

      <EditCouponModal
        showModal={
          showEditModal
        }
        setShowModal={
          setShowEditModal
        }
        coupon={
          selectedCoupon
        }
        fetchCoupons={
          fetchCoupons
        }
      />

    </div>
  );
}

export default AdminCupon;

