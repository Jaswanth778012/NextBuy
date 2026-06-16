import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getActiveFestivalBanners } from "../../services/adminFestivalBannerService";
import "../../styles/FestivalBanner.css";

function FestivalBanner() {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    loadBanners();
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === banners.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(timer);
  }, [banners]);

  const loadBanners = async () => {
    try {
      const res = await getActiveFestivalBanners();
      setBanners(res.data || []);
    } catch (err) {
      console.log("Error loading banners", err);
    }
  };

  // ✅ FIX: send banner data properly
  const handleClick = (banner) => {
    navigate(`/festival-products/${banner.id}`, {
      state: {
        bannerImage: banner.imageUrl,
        bannerTitle: banner.title || "Festival Sale",
      },
    });
  };

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === banners.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? banners.length - 1 : prev - 1
    );
  };

  if (!banners || banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex];

  return (
    <div className="festival-slider">

      {/* LEFT ARROW */}
      <button
        type="button"
        className="slider-arrow left"
        onClick={prevSlide}
      >
        ❮
      </button>

      {/* IMAGE */}
      <img
        key={currentIndex}
        src={currentBanner.imageUrl}
        alt="banner"
        className="slider-image banner-slide"
        onClick={() => handleClick(currentBanner)}
      />

      {/* RIGHT ARROW */}
      <button
        type="button"
        className="slider-arrow right"
        onClick={nextSlide}
      >
        ❯
      </button>

      {/* DOTS */}
      <div className="slider-dots">
        {banners.map((banner, index) => (
          <span
            key={banner.id}
            className={`dot ${
              currentIndex === index ? "active-dot" : ""
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default FestivalBanner;