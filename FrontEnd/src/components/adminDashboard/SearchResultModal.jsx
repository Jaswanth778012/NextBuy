import React from "react";

function SearchResultModal({
  selectedResult,
  selectedType,
  setSelectedResult,
}) {
  if (!selectedResult) return null;

  return (
    <div className="modal-overlay">
      <div className="result-modal">
        {/* HEADER */}
        <div className="modal-header">
          <h2>{selectedType.toUpperCase()} DETAILS</h2>

          <button
            className="close-btn"
            onClick={() => setSelectedResult(null)}
          >
            ✕
          </button>
        </div>

        {/* PRODUCT */}
        {selectedType === "product" && (
          <div className="modal-content">
            <img
              src={selectedResult.imageUrl}
              alt={selectedResult.name}
              className="product-image"
            />

            <h3>{selectedResult.name}</h3>

            <p>{selectedResult.description}</p>

            <div className="detail-grid">
              <div>
                <strong>Brand:</strong>{" "}
                {selectedResult.brand?.name}
              </div>

              <div>
                <strong>Category:</strong>{" "}
                {selectedResult.category?.name}
              </div>

              <div>
                <strong>Sub Category:</strong>{" "}
                {selectedResult.subCategory?.name}
              </div>

              <div>
                <strong>Stock:</strong>{" "}
                {selectedResult.stockQuantity}
              </div>

              <div>
                <strong>MRP:</strong> ₹
                {selectedResult.mrp_price}
              </div>

              <div>
                <strong>Final Price:</strong> ₹
                {selectedResult.finalPrice}
              </div>

              <div>
                <strong>Status:</strong>{" "}
                {selectedResult.stockStatus}
              </div>

              <div>
                <strong>Condition:</strong>{" "}
                {selectedResult.productCondition}
              </div>
            </div>
          </div>
        )}

        {/* USER */}
        {selectedType === "user" && (
          <div className="modal-content">
            <img
              src={selectedResult.dpUrl}
              alt={selectedResult.username}
              className="user-image"
            />

            <h3>{selectedResult.username}</h3>

            <div className="detail-grid">
              <div>
                <strong>ID:</strong> {selectedResult.id}
              </div>
              <div>
                <strong>Name:</strong> {selectedResult.name}
              </div>

              <div>
                <strong>Email:</strong> {selectedResult.email}
              </div>

              <div>
                <strong>Mobile:</strong>{" "}
                {selectedResult.mobileNumber}
              </div>

              <div>
                <strong>Gender:</strong>{" "}
                {selectedResult.gender}
              </div>

              <div>
                <strong>Role:</strong> {selectedResult.role}
              </div>

              <div>
                <strong>DOB:</strong> {selectedResult.dob}
              </div>

              <div>
                <strong>Address:</strong>{" "}
                {selectedResult.addressLine1}
              </div>
            </div>
          </div>
        )}

        {/* BRAND */}
        {selectedType === "brand" && (
          <div className="modal-content">
            <img
              src={selectedResult.logoUrl}
              alt={selectedResult.name}
              className="brand-image"
            />

            <h3>{selectedResult.name}</h3>

            <div className="detail-grid">
               <div>
                <strong>ID:</strong>{" "}
                {selectedResult.id}
              </div>

              <div>
                <strong>Description:</strong>{" "}
                {selectedResult.description}
              </div>

              <div>
                <strong>Country:</strong>{" "}
                {selectedResult.country}
              </div>

              <div>
                <strong>Created At:</strong>{" "}
                {selectedResult.createdAt}
              </div>
            </div>
          </div>
        )}

        {/* CATEGORY */}
        {selectedType === "category" && (
          <div className="modal-content">
            <h3>{selectedResult.name}</h3>

            <div className="detail-grid">
              <div>
                <strong>ID:</strong> {selectedResult.id}
              </div>
            </div>
          </div>
        )}

        {/* SUB CATEGORY */}
        {selectedType === "subCategory" && (
          <div className="modal-content">
            <h3>{selectedResult.name}</h3>

            <div className="detail-grid">
              <div>
                <strong>ID:</strong> {selectedResult.id}
              </div>

              <div>
                <strong>Category:</strong>{" "}
                {selectedResult.category?.name}
              </div>
            </div>
          </div>
        )}

        {/* ORDER */}
        {selectedType === "order" && (
          <div className="modal-content">
            <h3>{selectedResult.orderNumber}</h3>

            <div className="detail-grid">
              <div>
                <strong>Status:</strong>{" "}
                {selectedResult.status}
              </div>

              <div>
                <strong>Total:</strong> ₹
                {selectedResult.finalPrice}
              </div>

              <div>
                <strong>Payment:</strong>{" "}
                {selectedResult.payment?.paymentMethod}
              </div>

              <div>
                <strong>Payment Status:</strong>{" "}
                {selectedResult.payment?.paymentStatus}
              </div>

              <div>
                <strong>Ordered At:</strong>{" "}
                {selectedResult.orderedAt}
              </div>
            </div>

            <h4 style={{ marginTop: "20px" }}>
              Order Items
            </h4>

            {selectedResult.orderItems?.map((item) => (
              <div key={item.id} className="order-item">
                <p>
                  <strong>Product:</strong>{" "}
                  {item.product?.name}
                </p>

                <p>
                  <strong>Quantity:</strong>{" "}
                  {item.quantity}
                </p>

                <p>
                  <strong>Total:</strong> ₹
                  {item.totalAmount}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResultModal;