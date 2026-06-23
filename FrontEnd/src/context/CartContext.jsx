import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  addCartItem,
  viewCart,
  deleteCartItem,
  clearBackendCart,
  updateCartQuantity,
} from "../services/cartService";

const CartContext = createContext(null);

const emptySummary = {
  id: null,
  totalPrice: 0,
  discount: 0,
  finalPrice: 0,
  shippingCharges: 0,
  cuponDiscount: 0,
  itemCount: 0,
  appliedCouponCode: null,
  couponDiscountPercent: 0,
};

const mapBackendItem = (item) => {
  return {
    id: item.productId,
    cartItemId: item.id,

    name: item.productName,
    slug: item.productSlug,

    imageUrl: item.productImage,
    imageUrls: item.productImage ? [item.productImage] : [],

    finalPrice: item.productFinalPrice,
    price: item.productFinalPrice,

    mrp_price: item.productMrpPrice,
    mrpPrice: item.productMrpPrice,

    quantity: item.quantity,
    actualProdPrice: item.actualProdPrice,
    availableStock: item.availableStock,
  };
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartSummary, setCartSummary] = useState(emptySummary);
  const [cartLoading, setCartLoading] = useState(false);

  const isLoggedIn = () => {
    const token = localStorage.getItem("token");

    return (
      token &&
      token !== "null" &&
      token !== "undefined" &&
      token !== ""
    );
  };

  const loadCart = async () => {
    if (!isLoggedIn()) {
      setCartItems([]);
      setCartSummary(emptySummary);
      return;
    }

    try {
      setCartLoading(true);

      const data = await viewCart();

      const items = Array.isArray(data?.items)
        ? data.items.map(mapBackendItem)
        : [];

      setCartItems(items);

      setCartSummary({
        id: data?.id || null,
        totalPrice: Number(data?.totalPrice || 0),
        discount: Number(data?.discount || 0),
        finalPrice: Number(data?.finalPrice || 0),
        shippingCharges: Number(data?.shippingCharges || 0),
        cuponDiscount: Number(data?.cuponDiscount || 0),
        itemCount: Number(data?.itemCount || items.length || 0),
        appliedCouponCode: data?.appliedCouponCode || null,
        couponDiscountPercent: Number(
          data?.couponDiscountPercent || 0
        ),
      });
    } catch (error) {
      console.log("Load cart error:", error);

      setCartItems([]);
      setCartSummary(emptySummary);
    } finally {
      setCartLoading(false);
    }
  };

  useEffect(() => {
    localStorage.removeItem("cart");
    loadCart();
  }, []);

  const findCartItem = (id) => {
    return cartItems.find(
      (item) =>
        Number(item.id) === Number(id) ||
        Number(item.cartItemId) === Number(id)
    );
  };

  const addToCart = async (product, quantity = 1) => {
    const productId = product?.id || product?.productId;

    if (!productId) {
      throw new Error("Product id not found");
    }

    const message = await addCartItem(productId, quantity);

    if (
      typeof message === "string" &&
      !message.toLowerCase().includes("success")
    ) {
      throw new Error(message);
    }

    await loadCart();

    return message;
  };

  const removeFromCart = async (id) => {
    const item = findCartItem(id);

    if (!item?.cartItemId) {
      throw new Error("Cart item not found");
    }

    const message = await deleteCartItem(item.cartItemId);

    await loadCart();

    return message;
  };

  const increaseQty = async (id) => {
    const item = findCartItem(id);

    if (!item?.cartItemId) {
      throw new Error("Cart item not found");
    }

    const currentQuantity = Number(item.quantity || 1);
    const newQuantity = currentQuantity + 1;

    if (
      item.availableStock !== undefined &&
      item.availableStock !== null &&
      newQuantity > Number(item.availableStock)
    ) {
      throw new Error(
        `Only ${item.availableStock} item(s) available in stock`
      );
    }

    const message = await updateCartQuantity(
      item.cartItemId,
      newQuantity
    );

    await loadCart();

    return message;
  };

  const decreaseQty = async (id) => {
    const item = findCartItem(id);

    if (!item?.cartItemId) {
      throw new Error("Cart item not found");
    }

    const currentQuantity = Number(item.quantity || 1);

    if (currentQuantity <= 1) {
      return removeFromCart(item.cartItemId);
    }

    const message = await updateCartQuantity(
      item.cartItemId,
      currentQuantity - 1
    );

    await loadCart();

    return message;
  };

  const clearCart = async () => {
    const message = await clearBackendCart();

    setCartItems([]);
    setCartSummary(emptySummary);

    await loadCart();

    return message;
  };

  const cartCount = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  const cartTotal = Number(cartSummary.finalPrice || 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartSummary,
        cartLoading,

        cartCount,
        cartTotal,

        loadCart,
        refreshCart: loadCart,

        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be inside CartProvider");
  }

  return context;
};