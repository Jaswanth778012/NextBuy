import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useOutletContext,
} from "react-router-dom";

import {
  FaImages,
  FaPlus,
} from "react-icons/fa";

import {
  getAllFestivalBanners,
  deleteFestivalBanner,
} from "../services/adminFestivalBannerService";

import FestivalBannerSearchBar from "../components/adminFestival/FestivalBannerSearchBar";
import FestivalBannerTable from "../components/adminFestival/FestivalBannerTable";
import FestivalBannerPagination from "../components/adminFestival/FestivalBannerPagination";
import AddFestivalBannerModal from "../components/adminFestival/AddFestivalBannerModal";
import EditFestivalBannerModal from "../components/adminFestival/EditFestivalBannerModal";

import "../styles/FestivalBannerManagement.css";

function FestivalBannerManagement() {

  const {
    sidebarOpen,
    theme,
  } = useOutletContext();

  const [banners,
    setBanners] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const [showAddModal,
    setShowAddModal] =
    useState(false);

  const [showEditModal,
    setShowEditModal] =
    useState(false);

  const [selectedBanner,
    setSelectedBanner] =
    useState(null);

  const [searchKeyword,
    setSearchKeyword] =
    useState("");

  const [currentPage,
    setCurrentPage] =
    useState(1);

  const [bannersPerPage,
    setBannersPerPage] =
    useState(10);

  /* ===========================
     FETCH BANNERS
  =========================== */

  const fetchBanners =
    async () => {

      try {

        setLoading(true);

        const response =
          await getAllFestivalBanners();

        setBanners(
          response?.data || []
        );

      } catch (error) {

        console.error(
          "Fetch Banner Error",
          error
        );

        setBanners([]);

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {

    fetchBanners();

  }, []);

  useEffect(() => {

    setCurrentPage(1);

  }, [searchKeyword]);

  /* ===========================
     DELETE
  =========================== */

  const handleDelete =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete this banner?"
        );

      if (!confirmDelete) {
        return;
      }

      try {

        await deleteFestivalBanner(
          id
        );

        await fetchBanners();

      } catch (error) {

        console.error(
          "Delete Banner Error",
          error
        );
      }
    };

  /* ===========================
     EDIT MODAL
  =========================== */

  const openEditModal =
    (banner) => {

      setSelectedBanner(
        banner
      );

      setShowEditModal(
        true
      );
    };

  /* ===========================
     FILTER
  =========================== */

  const filteredBanners =
    useMemo(() => {

      return banners.filter(
        (banner) =>

          banner.festivalName
            ?.toLowerCase()
            .includes(
              searchKeyword.toLowerCase()
            ) ||

          banner.title
            ?.toLowerCase()
            .includes(
              searchKeyword.toLowerCase()
            )

      );

    }, [
      banners,
      searchKeyword,
    ]);

  /* ===========================
     PAGINATION
  =========================== */

  const indexOfLastBanner =
    currentPage *
    bannersPerPage;

  const indexOfFirstBanner =
    indexOfLastBanner -
    bannersPerPage;

  const currentBanners =
    filteredBanners.slice(
      indexOfFirstBanner,
      indexOfLastBanner
    );

  const totalPages =
    Math.ceil(
      filteredBanners.length /
      bannersPerPage
    );

  /* ===========================
     LOADER
  =========================== */

  if (loading) {

    return (

      <div className="festival-page">

        <div className="festival-loader-card">

          <div className="festival-loader" />

          <h2>
            Loading Festival Banners
          </h2>

          <p>
            Fetching banner data...
          </p>

        </div>

      </div>
    );
  }

  return (

    <div
      className={`festival-page ${
        sidebarOpen
          ? "sidebar-open"
          : "sidebar-closed"
      } ${
        theme === "dark"
          ? "dark-mode"
          : ""
      }`}
    >

      {/* HEADER */}

      <div className="festival-header">

        <div>

          <h1>
            Festival Banner Management
          </h1>

          <p>
            Manage all
            promotional
            festival banners
          </p>

        </div>

        <div className="festival-header-actions">

          <div className="festival-total-card">

            <FaImages />

            <span>
              {banners.length}
              {" "}
              Banners
            </span>

          </div>

          <button
            className="festival-add-btn"
            onClick={() =>
              setShowAddModal(
                true
              )
            }
          >

            <FaPlus />

            Add Banner

          </button>

        </div>

      </div>

      {/* SEARCH */}

      <FestivalBannerSearchBar
        searchKeyword={
          searchKeyword
        }
        setSearchKeyword={
          setSearchKeyword
        }
      />

      {/* TABLE */}

      <FestivalBannerTable
        banners={
          currentBanners
        }
        openEditModal={
          openEditModal
        }
        handleDelete={
          handleDelete
        }
      />

      {/* PAGINATION */}

      {filteredBanners.length >
        0 && (

        <FestivalBannerPagination
          currentPage={
            currentPage
          }
          totalPages={
            totalPages
          }
          bannersPerPage={
            bannersPerPage
          }
          setBannersPerPage={
            setBannersPerPage
          }
          setCurrentPage={
            setCurrentPage
          }
        />

      )}

      {/* ADD */}

      <AddFestivalBannerModal
        showModal={
          showAddModal
        }
        setShowModal={
          setShowAddModal
        }
        fetchBanners={
          fetchBanners
        }
      />

      {/* EDIT */}

      <EditFestivalBannerModal
        showModal={
          showEditModal
        }
        setShowModal={
          setShowEditModal
        }
        banner={
          selectedBanner
        }
        fetchBanners={
          fetchBanners
        }
      />

    </div>
  );
}

export default FestivalBannerManagement;