import API from "./api";

export const createCoupon = async (couponData) => {
  const response = await API.post(
    "/Cupon/create",
    couponData
  );
  return response.data;
};

export const updateCoupon = async (id, couponData) => {
  const response = await API.put(
    `/Cupon/update/${id}`,
    couponData
  );
  return response.data;
};

export const getAllCoupons = async () => {
  const response = await API.get("/Cupon/all");
  return response.data;
};

export const getAvailableCoupons = async () => {
  const response = await API.get("/Cupon/available");
  return response.data;
};

export const deleteCoupon = async (id) => {
  const response = await API.delete(
    `/Cupon/delete/${id}`
  );
  return response.data;
};