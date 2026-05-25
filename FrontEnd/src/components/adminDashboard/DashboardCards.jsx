import React, { useState } from "react";

import DashboardCard from "./DashboardCard";

import {
  getLowStockProducts,
  getHighStockProducts
} from "../../services/AdminStatsService";

function DashboardCards({ stats }) {

  // MODAL STATE
  const [showModal, setShowModal] =
    useState(false);

  // PRODUCTS STATE (USED FOR BOTH LOW & HIGH)
  const [products, setProducts] =
    useState([]);

  // MODAL TYPE (LOW / HIGH)
  const [modalTitle, setModalTitle] =
    useState("");

  // FETCH LOW STOCK PRODUCTS
  const handleLowStockClick =
    async () => {

      try {

        const response =
          await getLowStockProducts();

        setProducts(response.data);

        setModalTitle("Low Stock Products");

        setShowModal(true);

      } catch (error) {

        console.log(error);

      }
    };

  // FETCH HIGH STOCK PRODUCTS
  const handleHighStockClick =
    async () => {

      try {

        const response =
          await getHighStockProducts();

        setProducts(response.data);

        setModalTitle("Limited Stock Products");

        setShowModal(true);

      } catch (error) {

        console.log(error);

      }
    };

  // CARDS
  const cards = [

    {
      title: "Total Users",
      value: stats.totalUsers
    },

    {
      title: "Total Products",
      value: stats.totalProducts
    },

    {
      title: "Total Revenue",
      value: `₹${stats.TotalRevanue}`
    },

    {
      title: "Delivered Orders",
      value: stats.deliveredOrders
    },

    {
      title: "Low- Stock Products",
      value: stats.TotallowStockProducts,
      onClick: handleLowStockClick
    },

    {
      title: "Limited- Stock Products",
      value: stats.TotalLimitedStockProducts,
      onClick: handleHighStockClick
    }
  ];

  return (

    <>

      {/* CARDS */}
      <div className="dashboard-cards">

        {cards.map((card, index) => (

          <DashboardCard
            key={index}
            title={card.title}
            value={card.value}
            onClick={card.onClick}
          />

        ))}

      </div>

      {/* MODAL */}
      {showModal && (

        <div
          className="modal-overlay"
          onClick={() => setShowModal(false)}
        >

          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >

            {/* HEADER */}
            <div className="modal-header">

              <h2>{modalTitle}</h2>

              <button
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                ✖
              </button>

            </div>

            {/* TABLE */}
            <div className="table-wrapper">

              <table className="product-table">

                <thead>

                  <tr>

                    <th>ID</th>

                    <th>Product</th>

                    <th>Category</th>

                    <th>Sub Category</th>

                    <th>Image</th>

                    <th>Stock</th>

                  </tr>

                </thead>

                <tbody>

                  {products.map((product) => (

                    <tr key={product.productId}>

                      <td>{product.productId}</td>

                      <td>{product.productName}</td>

                      <td>{product.category?.name}</td>

                      <td>{product.subCategory?.name || "N/A"}</td>

                      <td>

                        {product.img ? (

                          <img
                            src={product.img}
                            alt="product"
                            className="table-product-img"
                          />

                        ) : (

                          "No Image"
                        )}

                      </td>

                      <td>{product.stockQuantity}</td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      )}

    </>

  );
}

export default DashboardCards;