import React from "react";
import "../../styles/CouponCelebration.css";

function CouponCelebration({ show, message }) {
  if (!show) return null;

  const icons = ["🎉", "✨", "🛍️", "💸", "🎊", "⭐"];

  return (
    <div className="coupon-celebration-layer">
      {Array.from({ length: 28 }).map((_, index) => (
        <span className="confetti-piece" key={index}>
          {icons[index % icons.length]}
        </span>
      ))}

      <div className="coupon-celebration-card">
        <div className="coupon-celebration-icon">🎁</div>
        <h2>Coupon Applied!</h2>
        <p>{message || "Your savings are unlocked successfully."}</p>

        <div className="coupon-celebration-saving">
          Extra savings added to your cart
        </div>
      </div>
    </div>
  );
}

export default CouponCelebration;