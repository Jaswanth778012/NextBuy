import {
  applyCartCoupon,
  removeCartCoupon,
} from "./cartService";

export const applyCouponToCart = async (code) => {
  return applyCartCoupon(code);
};

export const applyCoupon = async (code) => {
  return applyCartCoupon(code);
};

export const removeCoupon = async () => {
  return removeCartCoupon();
};