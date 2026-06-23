import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";
import {
  applyCuponFetch,
  removeCuponFetch,
} from "../services/cuponFetchService";
import "../styles/CartPage.css";

function CartPage() {
  const navigate = useNavigate();

  const {
    cartItems,
    cartSummary,
    cartLoading,
    removeFromCart,
    increaseQty,
    decreaseQty,
    clearCart,
    loadCart,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [clearLoading, setClearLoading] = useState(false);

  const getImage = (item) => {
    return (
      item.imageUrls?.[0] ||
      item.imageUrl ||
      "https://via.placeholder.com/120"
    );
  };

  const getPrice = (item) => {
    return Number(item.finalPrice || item.price || 0);
  };

  const getMrp = (item) => {
    return Number(
      item.mrp_price ||
        item.mrpPrice ||
        item.mrp ||
        getPrice(item)
    );
  };

  const totalItems = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 1),
    0
  );

  const subtotal = Number(cartSummary.totalPrice || 0);
  const deliveryCharge = Number(cartSummary.shippingCharges || 0);
  const couponDiscount = Number(cartSummary.cuponDiscount || 0);
  const cartDiscountPercent = Number(cartSummary.discount || 0);
  const appliedCouponCode = cartSummary.appliedCouponCode;

  const hasCouponApplied =
    appliedCouponCode !== null &&
    appliedCouponCode !== undefined &&
    appliedCouponCode !== "";

  const cartDiscountAmount = hasCouponApplied
    ? 0
    : subtotal * cartDiscountPercent / 100;

  const visibleCouponDiscount = hasCouponApplied
    ? couponDiscount
    : 0;

  const grandTotal = Math.max(
    subtotal + deliveryCharge - cartDiscountAmount - visibleCouponDiscount,
    0
  );

  const savedAfterDiscount = Math.max(
    subtotal - cartDiscountAmount - visibleCouponDiscount,
    0
  );

  const priceLabel = totalItems > 1 ? "Total Price" : "Selling Price";

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter coupon code");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    try {
      setCouponLoading(true);

      const message = await applyCuponFetch(couponCode);

      setCouponCode("");

      await loadCart();

      toast.success(message || "Cupon applied successfully");
    } catch (error) {
      console.log("Apply coupon error:", error);
      toast.error(error.message || "Unable to apply coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      setCouponLoading(true);

      const message = await removeCuponFetch();

      setCouponCode("");

      await loadCart();

      toast.info(message || "Cupon removed successfully");
    } catch (error) {
      console.log("Remove coupon error:", error);
      toast.error(error.message || "Unable to remove coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleIncrease = async (item) => {
    try {
      setActionLoadingId(item.cartItemId);
      await increaseQty(item.cartItemId);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data ||
          error.message ||
          "Unable to increase quantity"
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDecrease = async (item) => {
    try {
      setActionLoadingId(item.cartItemId);
      await decreaseQty(item.cartItemId);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data ||
          error.message ||
          "Unable to decrease quantity"
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRemoveItem = async (item) => {
    try {
      setActionLoadingId(item.cartItemId);
      await removeFromCart(item.cartItemId);
      toast.info("Item removed from cart");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data ||
          error.message ||
          "Unable to remove item"
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleClearCart = async () => {
    try {
      setClearLoading(true);
      await clearCart();
      setCouponCode("");
      toast.info("Cart cleared");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data ||
          error.message ||
          "Unable to clear cart"
      );
    } finally {
      setClearLoading(false);
    }
  };

  if (cartLoading) {
    return (
      <div className="cart-page">
        <div className="empty-cart-box">
          <div className="empty-cart-icon">🛒</div>
          <h2>Loading cart...</h2>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart-box">
          <div className="empty-cart-icon">🛒</div>

          <h2>Your cart is empty</h2>

          <p>
            Looks like you have not added anything to your cart yet.
          </p>

          <button
            className="continue-shopping-btn"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-left">
          <div className="cart-header">
            <div>
              <h2>My Cart</h2>
              <p>{totalItems} item(s) in your cart</p>
            </div>

            <button
              className="clear-cart-btn"
              onClick={handleClearCart}
              disabled={clearLoading}
            >
              {clearLoading ? "Clearing..." : "Clear Cart"}
            </button>
          </div>

          <div className="cart-items-list">
            {cartItems.map((item) => {
              const price = getPrice(item);
              const mrp = getMrp(item);
              const quantity = Number(item.quantity || 1);
              const itemTotal = price * quantity;

              const discountPercent =
                mrp > price
                  ? Math.round(((mrp - price) / mrp) * 100)
                  : 0;

              const isLoading =
                Number(actionLoadingId) === Number(item.cartItemId);

              return (
                <div
                  className="cart-item-card"
                  key={item.cartItemId || item.id}
                >
                  <div className="cart-product-image-box">
                    <img
                      src={getImage(item)}
                      alt={item.name || "Product"}
                      className="cart-product-image"
                    />
                  </div>

                  <div className="cart-product-info">
                    <h3>{item.name}</h3>

                    <div className="cart-price-row">
                      <span className="cart-final-price">
                        ₹{price.toFixed(2)}
                      </span>

                      {mrp > price && (
                        <span className="cart-mrp-price">
                          ₹{mrp.toFixed(2)}
                        </span>
                      )}

                      {discountPercent > 0 && (
                        <span className="cart-discount">
                          {discountPercent}% OFF
                        </span>
                      )}
                    </div>

                    <p className="cart-stock-text">
                      In stock: {item.availableStock ?? "Available"}
                    </p>

                    <div className="cart-actions-row">
                      <div className="quantity-box">
                        <button
                          onClick={() => handleDecrease(item)}
                          disabled={isLoading}
                        >
                          −
                        </button>

                        <span>{quantity}</span>

                        <button
                          onClick={() => handleIncrease(item)}
                          disabled={isLoading}
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveItem(item)}
                        disabled={isLoading}
                      >
                        {isLoading ? "Please wait..." : "Remove"}
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-total">
                    ₹{itemTotal.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="cart-right">
          <div className="price-summary-card">
            <h3>Price Details</h3>

            <div className="coupon-box">
              <h4>Apply Coupon</h4>

              {!hasCouponApplied ? (
                <div className="coupon-input-row">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) =>
                      setCouponCode(e.target.value.toUpperCase())
                    }
                  />

                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                  >
                    {couponLoading ? "..." : "Apply"}
                  </button>
                </div>
              ) : (
                <div className="applied-coupon">
                  <div>
                    <strong>{appliedCouponCode}</strong>
                    <p>
                      Coupon applied
                      {cartSummary.couponDiscountPercent
                        ? ` (${cartSummary.couponDiscountPercent}% OFF)`
                        : ""}
                    </p>
                  </div>

                  <button
                    onClick={handleRemoveCoupon}
                    disabled={couponLoading}
                  >
                    {couponLoading ? "..." : "Remove"}
                  </button>
                </div>
              )}
            </div>

            <div className="summary-row">
              <span>{priceLabel}</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            {cartDiscountAmount > 0 && !hasCouponApplied && (
              <div className="summary-row discount-row">
                <span>Cart Discount ({cartDiscountPercent}%)</span>
                <span>- ₹{cartDiscountAmount.toFixed(2)}</span>
              </div>
            )}

            {visibleCouponDiscount > 0 && hasCouponApplied && (
              <div className="summary-row coupon-discount-row">
                <span>Coupon Discount</span>
                <span>- ₹{visibleCouponDiscount.toFixed(2)}</span>
              </div>
            )}

            <div className="summary-row">
              <span>Delivery Charges</span>
              <span>
                {deliveryCharge === 0
                  ? "Free"
                  : `₹${deliveryCharge.toFixed(2)}`}
              </span>
            </div>

            <div className="summary-line"></div>

            <div className="summary-total">
              <span>Total Amount</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>

            {(cartDiscountAmount > 0 || visibleCouponDiscount > 0) && (
              <p className="saving-text">
                You saved amount ₹{savedAfterDiscount.toFixed(2)}
              </p>
            )}

            <button
              className="checkout-btn"
              onClick={() =>
                navigate("/checkout", {
                  state: {
                    cartItems,
                    cartSummary,
                    subtotal,
                    priceLabel,
                    cartDiscountAmount,
                    couponDiscount: visibleCouponDiscount,
                    appliedCouponCode,
                    deliveryCharge,
                    grandTotal,
                    savedAfterDiscount,
                    hasCouponApplied,
                  },
                })
              }
            >
              Proceed to Checkout
            </button>

            <button
              className="continue-btn"
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;