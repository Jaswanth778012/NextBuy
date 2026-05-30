import React from "react";
import ProductList from "../components/adminProduct/ProductList";
import "../styles/AdminProduct.css";
import { useOutletContext } from "react-router-dom";

function Products() {

  const {
    sidebarOpen,
    theme,
  } = useOutletContext();

  return (

    <div
      className={`products-page ${
        sidebarOpen
          ? "sidebar-open"
          : "sidebar-closed"
      } ${
        theme === "dark"
          ? "dark-mode"
          : ""
      }`}
    >

      <ProductList />

    </div>
  );
}

export default Products;