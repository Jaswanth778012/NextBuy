import React, {
  useEffect,
  useState,
} from "react";

import { useParams } from "react-router-dom";

import {
  getWishlistProducts,
  removeProductFromWishlist,
} from "../services/wishlistService";

import {
  getAlerts,
  deleteAlert,
} from "../services/wishlistAlertService";

import WishlistProductCard from "../components/wishlist/WishlistProductCard";
import WishlistAlertModal from "../components/wishlist/WishlistAlertModal";

import { toast } from "react-toastify";

import "../styles/Wishlist.css";

function WishlistDetailsPage() {
  const { wishlistId } = useParams();

  const [wishlistItems, setWishlistItems] =
    useState([]);

  const [alerts, setAlerts] =
    useState([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [showAlertModal, setShowAlertModal] =
    useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  useEffect(() => {
    fetchProducts();
    fetchAlerts();
  }, [wishlistId]);

  const fetchProducts = async () => {
    try {
      const data =
        await getWishlistProducts(
          wishlistId
        );

      setWishlistItems(data);
    } catch (error) {
      toast.error(
        "Failed to load wishlist products"
      );
    }
  };

  const fetchAlerts = async () => {
    try {
      const data =
        await getAlerts();

      setAlerts(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemove = async (
    wishlistId,
    productId
  ) => {
    try {
      await removeProductFromWishlist(
        wishlistId,
        productId
      );

      toast.success(
        "Removed from wishlist"
      );

      fetchProducts();
    } catch (error) {
      toast.error(
        "Failed to remove product"
      );
    }
  };

  const handleAddToCart = (
    productId
  ) => {
    console.log(
      "Add To Cart:",
      productId
    );
  };

  const getProductAlert = (
    productId
  ) => {
    return alerts.find(
      (alert) =>
        alert.productId ===
          productId &&
        alert.status !==
          "DISABLED" &&
        alert.status !==
          "EXPIRED"
    );
  };

  const handleOpenAlertModal =
    async (
      product,
      existingAlert
    ) => {

      if (existingAlert) {

        const confirmDelete =
          window.confirm(
            "Alert already exists for this product.\n\nDelete it?"
          );

        if (!confirmDelete)
          return;

        try {

          await deleteAlert(
            existingAlert.id
          );

          toast.success(
            "Alert deleted"
          );

          fetchAlerts();

        } catch (error) {

          toast.error(
            "Failed to delete alert"
          );

        }

        return;
      }

      setSelectedProduct(
        product
      );

      setShowAlertModal(
        true
      );
    };

  const handleCloseModal =
    () => {
      setSelectedProduct(
        null
      );

      setShowAlertModal(
        false
      );
    };

  const handleAlertCreated =
    () => {
      fetchAlerts();

      handleCloseModal();
    };

  const filteredItems =
    wishlistItems.filter(
      (item) =>
        item.product.name
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          )
    );

  return (
    <div className="wishlist-details-page">

      <div className="wishlist-page-header">

        <div className="wishlist-header">
          <h1>
            ❤️ Wishlist Products
          </h1>

          <p>
            Manage your saved
            products and never
            miss a price drop.
          </p>
        </div>

        <div className="wishlist-toolbar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
          />
        </div>

      </div>

      <div className="products-grid">

        {filteredItems.length >
        0 ? (

          filteredItems.map(
            (
              wishlistItem
            ) => {

              const existingAlert =
                getProductAlert(
                  wishlistItem
                    .product
                    .id
                );

              return (
                <WishlistProductCard
                  key={
                    wishlistItem.id
                  }
                  wishlistItem={
                    wishlistItem
                  }
                  wishlistId={
                    wishlistId
                  }
                  alert={
                    existingAlert
                  }
                  onRemove={
                    handleRemove
                  }
                  onAddToCart={
                    handleAddToCart
                  }
                  onOpenAlertModal={
                    (
                      product
                    ) =>
                      handleOpenAlertModal(
                        product,
                        existingAlert
                      )
                  }
                />
              );
            }
          )

        ) : (

          <div className="empty-wishlist">
            No products found.
          </div>

        )}

      </div>

      {showAlertModal &&
        selectedProduct && (
          <WishlistAlertModal
            product={
              selectedProduct
            }
            onClose={
              handleCloseModal
            }
            onAlertCreated={
              handleAlertCreated
            }
          />
        )}

    </div>
  );
}

export default WishlistDetailsPage;