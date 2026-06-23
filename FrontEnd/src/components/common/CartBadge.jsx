import React from "react";
import { useCart } from "../../context/CartContext";

function CartBadge() {
  const { cartCount } = useCart();

  return (
    <span className="cart-badge">
      {cartCount}
    </span>
  );
}

export default CartBadge;