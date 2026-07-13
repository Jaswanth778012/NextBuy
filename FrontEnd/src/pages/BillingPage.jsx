import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import CheckoutSteps from "../components/checkout/CheckoutSteps";
import { useCart } from "../context/CartContext";
import "../styles/CheckoutPages.css";

function BillingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { cartItems, cartSummary, clearCart } = useCart();

  const savedAddress = sessionStorage.getItem("deliveryAddress");

  const deliveryAddress =
    location.state?.deliveryAddress ||
    (savedAddress ? JSON.parse(savedAddress) : null);

  const billingData = useMemo(() => {
    const totalItems = cartItems.reduce(
      (total, item) => total + Number(item.quantity || 1),
      0
    );

    const subtotal = Number(
      location.state?.subtotal ?? cartSummary.totalPrice ?? 0
    );

    const deliveryCharge = Number(
      location.state?.deliveryCharge ?? cartSummary.shippingCharges ?? 0
    );

    const couponDiscount = Number(
      location.state?.couponDiscount ?? cartSummary.cuponDiscount ?? 0
    );

    const cartDiscountAmount = Number(
      location.state?.cartDiscountAmount ?? 0
    );

    const grandTotal = Math.max(
      subtotal + deliveryCharge - cartDiscountAmount - couponDiscount,
      0
    );

    const priceLabel = totalItems > 1 ? "Total Price" : "Selling Price";

    return {
      totalItems,
      subtotal,
      deliveryCharge,
      couponDiscount,
      cartDiscountAmount,
      grandTotal,
      priceLabel,
      appliedCouponCode:
        location.state?.appliedCouponCode || cartSummary.appliedCouponCode,
    };
  }, [cartItems, cartSummary, location.state]);

  const handlePlaceOrder = async () => {
    if (!deliveryAddress) {
      toast.error("Please add delivery address first");
      navigate("/address");
      return;
    }

    toast.success("Order placed successfully");

    await clearCart();

    sessionStorage.removeItem("deliveryAddress");

    navigate("/", {
      replace: true,
    });
  };

  return (
    <div className="checkout-page">
      <CheckoutSteps currentStep={3} />

      <div className="billing-container">
        <div className="billing-left">
          <div className="billing-card">
            <h2>Billing Section</h2>
            <p>Review your order, address, and payment details.</p>

            <div className="billing-section">
              <h3>Delivery Address</h3>

              {deliveryAddress ? (
                <div className="address-preview">
                  <h4>{deliveryAddress.fullName}</h4>
                  <p>{deliveryAddress.addressLine}</p>
                  <p>
                    {deliveryAddress.city}, {deliveryAddress.state} -{" "}
                    {deliveryAddress.pincode}
                  </p>
                  <p>Mobile: {deliveryAddress.mobileNumber}</p>

                  {deliveryAddress.landmark && (
                    <p>Landmark: {deliveryAddress.landmark}</p>
                  )}

                  <button
                    className="small-change-btn"
                    onClick={() => navigate("/address")}
                  >
                    Change Address
                  </button>
                </div>
              ) : (
                <button
                  className="checkout-main-btn"
                  onClick={() => navigate("/address")}
                >
                  Add Address
                </button>
              )}
            </div>

            <div className="billing-section">
              <h3>Payment Method</h3>

              <div className="payment-option active">
                <span>💵</span>
                <div>
                  <h4>Cash on Delivery</h4>
                  <p>Pay when your order arrives.</p>
                </div>
              </div>

              <div className="payment-option disabled">
                <span>💳</span>
                <div>
                  <h4>Online Payment</h4>
                  <p>Coming soon.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="billing-right">
          <div className="billing-summary-card">
            <h3>Order Summary</h3>

            <div className="summary-row">
              <span>{billingData.priceLabel}</span>
              <span>₹{billingData.subtotal.toFixed(2)}</span>
            </div>

            {billingData.cartDiscountAmount > 0 && (
              <div className="summary-row discount-row">
                <span>Cart Discount</span>
                <span>- ₹{billingData.cartDiscountAmount.toFixed(2)}</span>
              </div>
            )}

            {billingData.couponDiscount > 0 && (
              <div className="summary-row coupon-discount-row">
                <span>
                  Coupon Discount
                  {billingData.appliedCouponCode
                    ? ` (${billingData.appliedCouponCode})`
                    : ""}
                </span>
                <span>- ₹{billingData.couponDiscount.toFixed(2)}</span>
              </div>
            )}

            <div className="summary-row">
              <span>Delivery Charges</span>
              <span>
                {billingData.deliveryCharge === 0
                  ? "Free"
                  : `₹${billingData.deliveryCharge.toFixed(2)}`}
              </span>
            </div>

            <div className="summary-line"></div>

            <div className="summary-total">
              <span>Total Amount</span>
              <span>₹{billingData.grandTotal.toFixed(2)}</span>
            </div>

            <button
              className="checkout-main-btn full-btn"
              onClick={handlePlaceOrder}
            >
              Place Order
            </button>

            <button
              className="checkout-secondary-btn full-btn"
              onClick={() => navigate("/cart")}
            >
              Back to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BillingPage;