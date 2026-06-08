import React, {
  useEffect,
  useState,
} from "react";

import { toast } from "react-toastify";

import {
  updateCoupon,
} from "../../services/adminCuponService";

function EditCouponModal({
  showModal,
  setShowModal,
  coupon,
  fetchCoupons,
}) {

  const [loading, setLoading] =
    useState(false);

  const [couponData,
    setCouponData] =
    useState({
      code: "",
      discountPercentage: "",
      description: "",
      minimumAmount: "",
      expiryDate: "",
      cuponStatus: "ACTIVE",
    });

  useEffect(() => {

    if (
      showModal &&
      coupon
    ) {

      setCouponData({
        code:
          coupon.code || "",

        discountPercentage:
          coupon.discountPercentage || "",

        description:
          coupon.description || "",

        minimumAmount:
          coupon.minimumAmount || "",

        expiryDate:
          coupon.expiryDate
            ?.slice(0, 16) || "",

        cuponStatus:
          coupon.cuponStatus || "ACTIVE",
      });
    }

  }, [
    showModal,
    coupon,
  ]);

  const handleChange =
    (e) => {

      const {
        name,
        value,
      } = e.target;

      setCouponData(
        (prev) => ({
          ...prev,
          [name]: value,
        })
      );
    };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        await updateCoupon(
          coupon.id,
          {
            ...couponData,
            discountPercentage:
              Number(
                couponData.discountPercentage
              ),

            minimumAmount:
              Number(
                couponData.minimumAmount
              ),
          }
        );

        toast.success(
          "Coupon Updated Successfully"
        );

        await fetchCoupons();

        setShowModal(false);

      } catch (error) {

  console.error(error);
const message =
  error?.response?.data?.message ||
  error?.response?.data ||
  "Cannot update Expired coupon";

toast.error(message);
} finally {

  setLoading(false);
}
    };

  if (
    !showModal ||
    !coupon
  ) {
    return null;
  }

  return (

    <div
      className="coupon-modal-overlay"
      onClick={() =>
        setShowModal(false)
      }
    >

      <div
        className="coupon-modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        <div className="coupon-modal-header">

          <h2>
            Edit Coupon
          </h2>

          <button
            className="coupon-close-btn"
            onClick={() =>
              setShowModal(false)
            }
          >
            ✕
          </button>

        </div>

        <form
          className="coupon-form"
          onSubmit={
            handleSubmit
          }
        >

          <div className="coupon-form-grid">

            <input
              type="text"
              name="code"
              placeholder="Coupon Code"
              value={
                couponData.code
              }
              onChange={
                handleChange
              }
              required
            />

            <input
              type="number"
              name="discountPercentage"
              placeholder="Discount %"
              value={
                couponData.discountPercentage
              }
              onChange={
                handleChange
              }
              required
            />

            <input
              type="number"
              name="minimumAmount"
              placeholder="Minimum Amount"
              value={
                couponData.minimumAmount
              }
              onChange={
                handleChange
              }
              required
            />

            <input
              type="datetime-local"
              name="expiryDate"
              value={
                couponData.expiryDate
              }
              onChange={
                handleChange
              }
              required
            />

          </div>

          <textarea
            name="description"
            placeholder="Coupon Description"
            value={
              couponData.description
            }
            onChange={
              handleChange
            }
            rows={4}
            required
          />

          <select
            name="cuponStatus"
            value={couponData.cuponStatus}
            onChange={handleChange}
          >

            <option value="ACTIVE">
              ACTIVE
            </option>

            <option value="INACTIVE">
              INACTIVE
            </option>

          </select>

          <button
            type="submit"
            className="coupon-submit-btn"
            disabled={loading}
          >

            {loading
              ? "Updating..."
              : "Update Coupon"}

          </button>

        </form>

      </div>

    </div>
  );
}

export default EditCouponModal;