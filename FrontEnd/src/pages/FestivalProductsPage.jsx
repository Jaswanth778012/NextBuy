import React, { useEffect, useState } from "react";
import {
  useParams,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { toast } from "react-toastify";

import WishlistModal from "../components/wishlist/WishlistModal";
import { useCart } from "../context/CartContext";

import {
  getWishlists,
  removeProductFromWishlist,
} from "../services/wishlistService";

import "../styles/FestivalProducts.css";

function FestivalProductsPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { addToCart, loadCart } = useCart();

  const [products, setProducts] = useState([]);
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [addingProductId, setAddingProductId] = useState(null);
  const [wishlistedProducts, setWishlistedProducts] = useState([]);

  const bannerImage = location.state?.bannerImage;
  const bannerTitle = location.state?.bannerTitle;

  const getStoredUser = () => {
    try {
      const rawUser = localStorage.getItem("user");

      if (
        !rawUser ||
        rawUser === "null" ||
        rawUser === "undefined"
      ) {
        return null;
      }

      return JSON.parse(rawUser);
    } catch {
      return null;
    }
  };

  const user = getStoredUser();

  const isCustomer =
    user?.role === "USER" ||
    user?.role === "user";

  const loadWishlistedProducts = async () => {
    try {
      const wishlists = await getWishlists();

      const items = [];

      wishlists.forEach((wishlist) => {
        wishlist.wishlistItems?.forEach((item) => {
          items.push({
            productId: item.product.id,
            wishlistId: wishlist.id,
          });
        });
      });

      setWishlistedProducts(items);
    } catch (error) {
      console.error("Wishlist load error:", error);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await fetch(
        `http://localhost:9090/festival-banner/festivalProducts/${id}`
      );

      if (!res.ok) {
        throw new Error("Failed to load festival products");
      }

      const data = await res.json();

      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Festival products error:", error);
      setProducts([]);
      toast.error("Unable to load festival products");
    }
  };

  useEffect(() => {
    loadProducts();

    if (isCustomer) {
      loadWishlistedProducts();
    }
  }, [id]);

  const getProductId = (product) => {
    return product?.id || product?.productId;
  };

  const handleAddToCart = async (product) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!isCustomer) {
      toast.error("Only customers can add products to cart");
      return;
    }

    const productId = getProductId(product);

    if (!productId) {
      toast.error("Product id not found");
      return;
    }

    try {
      setAddingProductId(productId);

      const cartProduct = {
        ...product,
        id: productId,
      };

      const message = await addToCart(cartProduct, 1);

      await loadCart();

      toast.success(
        message || "Product added to cart successfully"
      );
    } catch (error) {
      console.log("Add to cart error:", error);

      toast.error(
        error.response?.data?.message ||
          error.response?.data ||
          error.message ||
          "Unable to add product to cart"
      );
    } finally {
      setAddingProductId(null);
    }
  };

  const isWishlisted = (productId) => {
    return wishlistedProducts.some(
      (item) => item.productId === productId
    );
  };

  const getWishlistInfo = (productId) => {
    return wishlistedProducts.find(
      (item) => item.productId === productId
    );
  };

  const toggleWishlist = async (product) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!isCustomer) {
      toast.error(
        "Only customers can add products to wishlist"
      );
      return;
    }

    const productId = getProductId(product);

    if (!productId) {
      toast.error("Product id not found");
      return;
    }

    const existing = getWishlistInfo(productId);

    if (existing) {
      try {
        await removeProductFromWishlist(
          existing.wishlistId,
          productId
        );

        await loadWishlistedProducts();

        toast.success("Removed from wishlist");
      } catch (error) {
        console.error(error);
        toast.error("Failed to remove from wishlist");
      }
    } else {
      setSelectedProductId(productId);
      setShowWishlistModal(true);
    }
  };

  const renderStars = (rating = 4) => {
    const fullStars = Math.floor(Number(rating) || 4);
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          style={{
            color:
              i <= fullStars
                ? "#222222"
                : "#d1d5db",
          }}
        >
          ★
        </span>
      );
    }

    return stars;
  };

  const getImage = (product) => {
    return (
      product?.imageUrls?.[0] ||
      product?.imageUrl ||
      product?.productImage ||
      "https://via.placeholder.com/200"
    );
  };

  const getFinalPrice = (product) => {
    return Number(
      product?.finalPrice ||
        product?.productFinalPrice ||
        product?.price ||
        0
    );
  };

  const getMrpPrice = (product) => {
    return Number(
      product?.mrp_price ||
        product?.mrpPrice ||
        product?.productMrpPrice ||
        product?.mrp ||
        getFinalPrice(product)
    );
  };

  const getDiscountPercentage = (product) => {
    const finalPrice = getFinalPrice(product);
    const mrpPrice = getMrpPrice(product);

    if (mrpPrice > finalPrice) {
      return Math.round(
        ((mrpPrice - finalPrice) / mrpPrice) * 100
      );
    }

    return 0;
  };

  return (
    <div className="fp-page">
      <div className="fp-hero">
        <h1>
          🎉 {bannerTitle || "Festival Special Sale"}
        </h1>

        <p>
          Celebrate this festive season with
          exclusive discounts, limited offers, and
          handpicked products just for you.
        </p>
      </div>

      {bannerImage && (
        <div className="fp-selected-banner">
          <img
            src={bannerImage}
            alt={
              bannerTitle || "Festival Banner"
            }
          />
        </div>
      )}

      <h2 className="fp-title">
        Festival Products
      </h2>

      <div className="fp-grid">
        {products.length > 0 ? (
          products.map((p) => {
            const productId = getProductId(p);
            const finalPrice = getFinalPrice(p);
            const mrpPrice = getMrpPrice(p);
            const discountPercentage =
              getDiscountPercentage(p);

            return (
              <div className="fp-card" key={productId}>
  {/* Discount Badge */}
  {discountPercentage > 0 && (
    <div className="fp-discount-badge">
      {discountPercentage}% OFF
    </div>
  )}

  {/* Wishlist Button */}
  {(!user || isCustomer) && (
    <div className="fp-card-top">
  <button
    className="fp-wishlist-btn"
    onClick={() => toggleWishlist(p)}
  >
    {isWishlisted(productId)
      ? "❤️"
      : "🤍"}
  </button>
</div>
  )}

  {/* Product Image */}
  <div className="fp-image-wrapper">
    <img
      src={getImage(p)}
      alt={
        p.name ||
        p.productName ||
        "Product"
      }
    />
  </div>

  {/* Content */}
  <div className="fp-content">
    <div className="fp-title-row">
      <h4 className="fp-name">
        {p.name || p.productName}
      </h4>

      <div
  className={`fp-stock-chip ${
    p.stockStatus === "AVAILABLE"
      ? "available"
      : p.stockStatus === "LIMITED_STOCK"
      ? "limited"
      : "out-stock"
  }`}
>
  {p.stockStatus === "AVAILABLE" && "🟢 In Stock"}

  {p.stockStatus === "LIMITED_STOCK" &&
    "🟠 Limited Stock"}

  {p.stockStatus === "OUT_OFF_STOCK" &&
    "🔴 Out of Stock"}
</div>
    </div>

    <div className="fp-meta-row">
      <span className="fp-brand">
        {p.brand?.name || "Brand"}
      </span>

      <span className="fp-rating">
        ⭐ {(p.averageRating || 4.5).toFixed(1)}
      </span>
    </div>

    <div className="fp-price-row">
      <span className="fp-final-price">
        ₹{finalPrice.toLocaleString()}
      </span>

      {mrpPrice > finalPrice && (
        <span className="fp-mrp-price">
          ₹{mrpPrice.toLocaleString()}
        </span>
      )}
    </div>

    {mrpPrice > finalPrice && (
      <div className="fp-savings">
        Save ₹
        {(
          mrpPrice - finalPrice
        ).toLocaleString()}
      </div>
    )}
  </div>

  {/* Actions */}
  {(!user || isCustomer) && (
    <div className="fp-card-actions">
      <button
        className="fp-cart-btn"
        onClick={() =>
          handleAddToCart(p)
        }
        disabled={
          addingProductId ===
          productId
        }
      >
        🛒
        {addingProductId ===
        productId
          ? " Adding..."
          : " Cart"}
      </button>
    </div>
  )}
</div>
            );
          })
        ) : (
          <p className="fp-empty">
            No festival products found.
          </p>
        )}
      </div>
<WishlistModal
  show={showWishlistModal}
  onClose={() =>
    setShowWishlistModal(false)
  }
  productId={selectedProductId}
  onWishlistUpdated={
    loadWishlistedProducts
  }
/>
    </div>
  );
}

export default FestivalProductsPage;