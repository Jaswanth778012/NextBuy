import React, { useEffect, useState } from "react";
import {
  useParams,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { toast } from "react-toastify";

import WishlistModal from "../components/wishlist/WishlistModal";
import { useCart } from "../context/CartContext";

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

  useEffect(() => {
    loadProducts();
  }, [id]);

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

      toast.success(message || "Product added to cart successfully");
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

  const toggleWishlist = (product) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!isCustomer) {
      toast.error("Only customers can add products to wishlist");
      return;
    }

    const productId = getProductId(product);

    if (!productId) {
      toast.error("Product id not found");
      return;
    }

    setSelectedProductId(productId);
    setShowWishlistModal(true);
  };

  const renderStars = (rating = 4) => {
    const fullStars = Math.floor(Number(rating) || 4);
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          style={{
            color: i <= fullStars ? "#222222" : "#d1d5db",
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
      return Math.round(((mrpPrice - finalPrice) / mrpPrice) * 100);
    }

    return 0;
  };

  return (
    <div className="fp-page">
      <div className="fp-hero">
        <h1>🎉 {bannerTitle || "Festival Special Sale"}</h1>

        <p>
          Celebrate this festive season with exclusive discounts,
          limited offers, and handpicked products just for you.
        </p>
      </div>

      {bannerImage && (
        <div className="fp-selected-banner">
          <img
            src={bannerImage}
            alt={bannerTitle || "Festival Banner"}
          />
        </div>
      )}

      <h2 className="fp-title">Festival Products</h2>

      <div className="fp-grid">
        {products.length > 0 ? (
          products.map((p) => {
            const productId = getProductId(p);
            const finalPrice = getFinalPrice(p);
            const mrpPrice = getMrpPrice(p);
            const discountPercentage = getDiscountPercentage(p);

            return (
              <div className="fp-card" key={productId}>
                {(!user || isCustomer) && (
                  <div
                    className="fp-wishlist"
                    onClick={() => toggleWishlist(p)}
                  >
                    🤍
                  </div>
                )}

                <img
                  src={getImage(p)}
                  className="fp-img"
                  alt={p.name || p.productName || "Product"}
                />

                <div className="fp-name">
                  {p.name || p.productName}
                </div>

                <div className="fp-stars">
                  {renderStars(p.averageRating)}
                </div>

                <div className="fp-price-row">
                  <span className="fp-final-price">
                    ₹{finalPrice.toFixed(2)}
                  </span>

                  {mrpPrice > finalPrice && (
                    <span className="fp-mrp-price">
                      ₹{mrpPrice.toFixed(2)}
                    </span>
                  )}

                  {discountPercentage > 0 && (
                    <span className="fp-offer-price">
                      {discountPercentage}% OFF
                    </span>
                  )}
                </div>

                {(!user || isCustomer) && (
                  <div className="fp-actions">
                    <button
                      className="fp-btn"
                      onClick={() => handleAddToCart(p)}
                      disabled={addingProductId === productId}
                    >
                      {addingProductId === productId
                        ? "Adding..."
                        : "Add to Cart"}
                    </button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="fp-empty">No festival products found.</p>
        )}
      </div>

      <WishlistModal
        show={showWishlistModal}
        onClose={() => setShowWishlistModal(false)}
        productId={selectedProductId}
      />
    </div>
  );
}

export default FestivalProductsPage;