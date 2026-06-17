import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "../styles/FestivalProducts.css";

function FestivalProductsPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [wishlist, setWishlist] = useState([]);

  const bannerImage = location.state?.bannerImage;
  const bannerTitle = location.state?.bannerTitle;

  useEffect(() => {
    loadProducts();
  }, [id]);

  const loadProducts = async () => {
    try {
      const res = await fetch(
        `http://localhost:9090/festival-banner/festivalProducts/${id}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      const data = await res.json();
      setProducts(data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const addToCart = (p) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(p);
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const toggleWishlist = (p) => {
    let list = [...wishlist];
    const exists = list.find((x) => x.id === p.id);

    if (exists) {
      list = list.filter((x) => x.id !== p.id);
    } else {
      list.push(p);
    }

    setWishlist(list);
  };

  const isWishlisted = (id) => {
    return wishlist.some((p) => p.id === id);
  };

  const renderStars = (rating = 4) => {
    const fullStars = Math.floor(rating);
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          style={{
            color: i <= fullStars ? "#222222" : "#d1d5db",
          }}
        >
          ★
        </span>
      );
    }

    return stars;
  };

  return (
    <div className="fp-page">

      {/* HERO */}
      <div className="fp-hero">
        <h1>🎉 Festival Special Sale</h1>
        <p>
          Celebrate this festive season with exclusive discounts,
          limited offers, and handpicked products just for you.
        </p>
      </div>

      {/* BANNER */}
      {bannerImage && (
        <div className="fp-selected-banner">
          <img src={bannerImage} alt="banner" />
        </div>
      )}

      <h2 className="fp-title">Festival Products</h2>

      {/* GRID */}
      <div className="fp-grid">
        {products.map((p) => (
          <div className="fp-card" key={p.id}>

            {/* WISHLIST */}
            <div
              className="fp-wishlist"
              onClick={() => toggleWishlist(p)}
              style={{
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              {isWishlisted(p.id) ? "❤️" : "🤍"}
            </div>

            {/* IMAGE (CLICK TO OPEN DETAILS PAGE) */}
            <img
              src={p.imageUrl || "https://via.placeholder.com/200"}
              className="fp-img"
              alt={p.name}
              
             
            />

            {/* NAME */}
            <div className="fp-name">{p.name}</div>

            {/* STARS */}
            <div className="fp-stars">
              {renderStars(p.averageRating)}
            </div>

            {/* PRICE ROW */}
            <div className="fp-price-row">
              <span className="fp-final-price">₹{p.finalPrice}</span>
              <span className="fp-mrp-price">₹{p.mrp_price}</span>
              <span className="fp-offer-price">
                {p.discountPercentage}% OFF
              </span>
            </div>

            {/* ACTIONS */}
            <div className="fp-actions">
              <button
                className="fp-btn"
                onClick={() => addToCart(p)}
              >
                Add to Cart
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

export default FestivalProductsPage;