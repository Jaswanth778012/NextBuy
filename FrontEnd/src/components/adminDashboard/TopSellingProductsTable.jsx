import React from "react";

function TopSellingProductsTable({

  products = [],

  categories = [],

  subCategories = [],

  selectedCategory,

  setSelectedCategory,

  selectedSubCategory,

  setSelectedSubCategory,

}) {

  return (

    <div className="top-products-section">

      <div className="top-products-header">

        <h2>Top Selling Products</h2>

        <div className="top-products-count">
          Top {products.length}
        </div>

      </div>

      {/* FILTERS */}

      <div className="top-products-filters">

        {/* CATEGORY */}

        <select
          value={selectedCategory?.id || ""}
          onChange={(e) => {

            const category =
              categories.find(
                (cat) =>
                  cat.id ===
                  Number(e.target.value)
              );

            setSelectedCategory(
              category || null
            );
          }}
          className="top-filter-input"
        >

          <option value="">
            All Categories
          </option>

          {categories.map((category) => (

            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>

          ))}

        </select>

        {/* SUB CATEGORY */}

        <select
          value={selectedSubCategory}
          onChange={(e) =>
            setSelectedSubCategory(
              e.target.value
            )
          }
          className="top-filter-input"
        >

          <option value="">
            All Sub Categories
          </option>

          {subCategories.map(
            (subCategory) => (

              <option
                key={subCategory.id}
                value={subCategory.name}
              >
                {subCategory.name}
              </option>

            )
          )}

        </select>

      </div>

      {/* TABLE */}

      <div className="table-wrap">

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

              products.map(
                (product, index) => (

                  <tr
                    key={product.productId}
                  >

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
                            alt={
                              product.productName
                            }
                            className="table-product-img"
                          />

                        ) : (

                          <div className="no-image">
                            No Img
                          </div>

                        )}

                        <div>

                          <strong>
                            {
                              product.productName
                            }
                          </strong>

                          <br />

                          <small>
                            ID:
                            {
                              product.productId
                            }
                          </small>

                        </div>

                      </div>

                    </td>

                    <td>

                      <span className="sales-chip">
                        {
                          product.totalSold
                        }
                      </span>

                    </td>

                    <td>
                      {
                        product.category?.name
                        || "-"
                      }
                    </td>

                    <td>
                      {
                        product.subCategory?.name
                        || "-"
                      }
                    </td>

                  </tr>

                )
              )

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