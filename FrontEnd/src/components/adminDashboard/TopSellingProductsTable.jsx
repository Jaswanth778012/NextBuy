import React from "react";

function TopSellingProductsTable({ products = [] }) {
  return (
    <div className="top-products-section">
      <div className="top-products-header">
        <h2>Top Selling Products</h2>

        <div className="top-products-count">
          Top {products.length}
        </div>
      </div>

      <div className="table-wrapper">
        <table className="product-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Product</th>
              <th>Total Sold</th>
              <th>Category</th>
              <th>Sub Category</th>
            </tr>
          </thead>

          <tbody>
            {products.length > 0 ? (
              products.map((product, index) => (
                <tr key={product.productId}>
                  <td>
                    <div className="rank-badge">
                      #{index + 1}
                    </div>
                  </td>

                  <td>
                    <div className="product-name-cell">
                      {product.img ? (
                        <img
                          src={product.img}
                          alt={product.productName}
                          className="table-product-img"
                        />
                      ) : (
                        <div className="no-image">
                          No Img
                        </div>
                      )}

                      <div>
                        <strong>{product.productName}</strong>
                        <br />
                        <small>ID: {product.productId}</small>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="sales-chip">
                      {product.totalSold}
                    </span>
                  </td>

                  <td>
                    {product.category?.name || "-"}
                  </td>

                  <td>
                    {product.subCategory?.name || "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    padding: "30px",
                  }}
                >
                  No top selling products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TopSellingProductsTable;