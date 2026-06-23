import API from "./api";

export const addCartItem = async (productId, quantity = 1) => {
  const response = await API.post("/Cart/addCart", {
    productId,
    quantity,
  });

  return response.data;
};

export const viewCart = async () => {
  const response = await API.get("/Cart/viewCart");
  return response.data;
};

export const deleteCartItem = async (cartItemId) => {
  const response = await API.delete(`/Cart/delete/${cartItemId}`);
  return response.data;
};

export const clearBackendCart = async () => {
  const response = await API.delete("/Cart/clearCart");
  return response.data;
};

export const updateCartQuantity = async (cartItemId, quantity) => {
  const response = await API.put(
    `/Cart/updateQuantity/${cartItemId}/${quantity}`
  );

  return response.data;
};

export const getCartItemCount = async () => {
  const response = await API.get("/Cart/itemCount");
  return response.data;
};