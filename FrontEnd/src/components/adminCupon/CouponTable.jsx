import React from "react";

import { FaEdit, FaTrash } from "react-icons/fa";

import { toast } from "react-toastify";

import { deleteCoupon } from "../../services/adminCuponService";

function CouponTable({ coupons, fetchCoupons, openEditModal }) {
  const handleDelete = async (coupon) => {
    try {
      await deleteCoupon(coupon.id);

      toast.success("Coupon deleted");

      fetchCoupons();
    } catch {
      toast.error("Failed to delete coupon");
    }
  };

  return (
    <div className="coupon-table-shell">
      <div className="coupon-table-wrapper">
        <table className="coupon-grid-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Code</th>
              <th>Discount</th>
              <th>Expiry</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {coupons.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-coupons">
                  No Coupons Found
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon.id}>
                  <td>{coupon.id}</td>

                  <td>{coupon.code}</td>

                  <td>{coupon.discountPercentage}%</td>

                  <td>
                    {new Date(coupon.expiryDate).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>

                  <td>
                    <span
                      className={`coupon-status ${(coupon.cuponStatus || "INACTIVE").toLowerCase()}`}
                    >
                      {coupon.cuponStatus}
                    </span>
                  </td>

                  <td>
                    <div className="coupon-actions">
                      <button
                        className="edit-btn"
                        onClick={() => openEditModal(coupon)}
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(coupon)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CouponTable;
