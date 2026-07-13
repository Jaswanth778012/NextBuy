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

// change by Gowtham:
// imported useCart because Wishlist Details page needs to add a single product into cart.
// Previously Add To Cart only had console.log, so product was not actually added.
import { useCart } from "../context/CartContext";

import WishlistProductCard from "../components/wishlist/WishlistProductCard";
import WishlistAlertModal from "../components/wishlist/WishlistAlertModal";

import { toast } from "react-toastify";

import "../styles/Wishlist.css";

function WishlistDetailsPage() {
  const { wishlistId } = useParams();

  // change by Gowtham:
  // added addToCart to add selected wishlist product into cart.
  // added loadCart to refresh cart count in header after product added.
  const { addToCart, loadCart } = useCart();

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

  // change by Gowtham:
  // this state is used to show loading only for clicked product cart button.
  // Example: button text can become "Adding..." for that product only.
  const [cartLoadingId, setCartLoadingId] =
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
      console.log(
        "Wishlist products load error:",
        error
      );

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

      await fetchProducts();
    } catch (error) {
      console.log(
        "Remove wishlist product error:",
        error
      );

      toast.error(
        "Failed to remove product"
      );
    }
  };

  const handleAddToCart = async (
    product
  ) => {
    try {
      // change by Gowtham:
      // product can come as full product object or only productId.
      // This line safely gets product id in both cases.
      const productId =
        product?.productId ||
        product?.id ||
        product;

      if (!productId) {
        toast.error(
          "Product id not found"
        );
        return;
      }

      // change by Gowtham:
      // set clicked product id as loading.
      // This prevents multiple clicks on the same cart button.
      setCartLoadingId(productId);

      // change by Gowtham:
      // this is the main fix.
      // Previously this function only printed console.log.
      // Now it actually calls CartContext addToCart function.
      await addToCart(productId);

      // change by Gowtham:
      // reload cart after adding product.
      // This updates cart count in header immediately.
      await loadCart();

      toast.success(
        "Product added to cart"
      );
    } catch (error) {
      console.log(
        "Wishlist product add to cart error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          error.response?.data ||
          error.message ||
          "Failed to add product to cart"
      );
    } finally {
      // change by Gowtham:
      // stop loading after success or error.
      setCartLoadingId(null);
    }
  };

  const getProductAlert = (
    productId
  ) => {
    return alerts.find(
      (alert) =>
        Number(alert.productId) ===
          Number(productId) &&
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

        if (!confirmDelete) {
          return;
        }

        try {
          await deleteAlert(
            existingAlert.id
          );

          toast.success(
            "Alert deleted"
          );

          await fetchAlerts();
        } catch (error) {
          console.log(
            "Delete alert error:",
            error
          );

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
        item.product?.name
          ?.toLowerCase()
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
            Manage your saved products and never miss a price drop.
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
        {filteredItems.length > 0 ? (
          filteredItems.map(
            (
              wishlistItem
            ) => {
              const product =
                wishlistItem.product;

              const existingAlert =
                getProductAlert(
                  product?.id
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

                  // change by Gowtham:
                  // passing full product instead of only console logging.
                  // This allows handleAddToCart to get product id and add it to cart.
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

                  // change by Gowtham:
                  // passing loading status to WishlistProductCard.
                  // Use this in card button to show "Adding..." and disable button.
                  cartLoading={
                    Number(cartLoadingId) ===
                    Number(product?.id)
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