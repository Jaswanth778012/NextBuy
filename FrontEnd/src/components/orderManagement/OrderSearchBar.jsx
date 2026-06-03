import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

function OrderSearchBar({ onSearch, onReset }) {
  const [type, setType] = useState("orderId");
  const [value, setValue] = useState("");
  const [year, setYear] = useState("");

  const handleSearch = () => {
    onSearch({
      searchType: type,
      searchValue: value,
      year,
    });
  };

  const handleReset = () => {
    setType("orderId");
    setValue("");
    setYear("");
    onReset();
  };

  const renderInput = () => {
    switch (type) {
      case "orderId":
      case "userId":
        return (
          <input
            className="order-input"
            type="text"
            placeholder={`Search ${type === "orderId" ? "Order ID" : "User ID"}...`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        );

      case "status":
        return (
          <select
            className="order-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          >
            <option value="">Select Status</option>
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="RETURNED">RETURNED</option>
          </select>
        );

      case "date":
        return (
          <input
            className="order-input"
            type="date"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        );

      case "month":
        return (
          <input
            className="order-input"
            type="number"
            placeholder="Enter Month"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        );

      case "year":
        return (
          <input
            className="order-input"
            type="number"
            placeholder="Enter Year"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        );

      case "monthYear":
        return (
          <div className="order-month-year">
            <input
              className="order-input"
              type="number"
              placeholder="Month"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <input
              className="order-input"
              type="number"
              placeholder="Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="order-search-wrapper">

      {/* LEFT - DROPDOWN */}
      <div className="order-left">
        <select
          className="order-input"
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setValue("");
            setYear("");
          }}
        >
          <option value="orderId">Order ID</option>
          <option value="userId">User ID</option>
          <option value="status">Status</option>
          <option value="date">Date</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
          <option value="monthYear">Month + Year</option>
        </select>
      </div>

      {/* CENTER - SEARCH */}
      <div className="order-center">
        <div className="order-search-box">
          <FaSearch className="order-icon" />
          {renderInput()}
        </div>
      </div>

      {/* RIGHT - BUTTONS (UNCHANGED STYLE EXPECTED FROM YOUR CSS) */}
      <div className="order-right">
        <button className="search-btn" onClick={handleSearch}>
          Search
        </button>

        <button className="reset-btn" onClick={handleReset}>
          Reset
        </button>
      </div>

    </div>
  );
}

export default OrderSearchBar;