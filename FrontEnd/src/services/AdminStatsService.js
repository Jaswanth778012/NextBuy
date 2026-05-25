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

// TOP SELLING PRODUCTS

export const getTopSellingProducts = 
  async () => {

      return await API.get(
        "/AdminStats/getTopSellingProducts"
      );
  };


  // CATEGORY SALES STATS
export const getCategoryStats =
  async () => {

    return await API.get(
      "/AdminStats/getCategoryStats"
    );
};