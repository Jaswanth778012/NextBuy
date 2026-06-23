import API from "./api"; // your axios instance

export const getWishlists = async () => {
  const response = await API.get("/Wishlist/getWishList");
  return response.data;
};

export const createWishlist = async (wishlistData) => {
  const response = await API.post(
    "/Wishlist/create",
    wishlistData
  );
  return response.data;
};

export const deleteWishlist = async (wishlistId) => {
  const response = await API.delete(
    `/Wishlist/removeWishlist/${wishlistId}`
  );
  return response.data;
};

export const addProductToWishlist = async (
  wishlistId,
  productId
) => {
  const response = await API.post(
    `/Wishlist/addProduct/${wishlistId}/${productId}`
  );

  return response.data;
};

export const removeProductFromWishlist = async (
  wishlistId,
  productId
) => {
  const response = await API.delete(
    `/Wishlist/removeProduct/${wishlistId}/${productId}`
  );

  return response.data;
};

export const getWishlistProducts = async (
  wishlistId
) => {
  const response = await API.get(
    `/Wishlist/getWishListProducts/${wishlistId}`
  );

  return response.data;
};

export const addWishlistToCart = async (
  wishlistId
) => {
  const response = await API.post(
    `/Wishlist/addWishlistToCart/${wishlistId}`
  );

  return response.data;
};