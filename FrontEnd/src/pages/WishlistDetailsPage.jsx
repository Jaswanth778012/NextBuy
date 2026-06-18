import React, {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import {
  getWishlistProducts,
  removeProductFromWishlist,
} from "../services/wishlistService";

import { toast } from "react-toastify";

import WishlistProductCard from "../components/wishlist/WishlistProductCard";

import "../styles/Wishlist.css";

function WishlistDetailsPage() {

  const { wishlistId } =
    useParams();

  const [products, setProducts] =
    useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts =
    async () => {
      const data =
        await getWishlistProducts(
          wishlistId
        );

      setProducts(data);
    };

  const handleRemove =
    async (
      wishlistId,
      productId
    ) => {
      await removeProductFromWishlist(
        wishlistId,
        productId
      );

      toast.success(
        "Removed from wishlist"
      );

      fetchProducts();
    };

  return (
    <div>

      <h2>
        Wishlist Products
      </h2>

      <div className="products-grid">

        {products.map(
          (product) => (
            <WishlistProductCard
              key={product.id}
              product={product}
              wishlistId={
                wishlistId
              }
              onRemove={
                handleRemove
              }
            />
          )
        )}

      </div>

    </div>
  );
}

export default WishlistDetailsPage;