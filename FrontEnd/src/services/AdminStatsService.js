import API from "./api";

// GET TOTAL STATS
export const getTotalStats = async () => {
  return await API.get("/AdminStats/getTotalStats");
};
// GET LOW STOCK PRODUCTS
export const getLowStockProducts =
  async () => {

    return await API.get(
      "/AdminStats/lowStockProducts"
    );
};

// HIGH STOCK PRODUCTS
export const getHighStockProducts =
  async () => {

    return await API.get(
      "/AdminStats/limitedStockProducts"
    );
};

// MONTHLY ORDER COUNT
export const getMonthlyOrderCount =
  async () => {

    return await API.get(
      "/AdminStats/monthlyOrderCount"
    );
};