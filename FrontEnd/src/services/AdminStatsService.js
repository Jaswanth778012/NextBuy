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
  async (
    category = "",
    subCategory = "",
  ) => {

    let url =
      "/AdminStats/getTopSellingProducts";

    const params =
      new URLSearchParams();

    if (category) {

      params.append(
        "category",
        category
      );
    }

    if (subCategory) {

      params.append(
        "subCategory",
        subCategory
      );
    }

    if (params.toString()) {

      url += `?${params.toString()}`;
    }

    return await API.get(url);
};


  // CATEGORY SALES STATS
export const getCategoryStats =
  async () => {

    return await API.get(
      "/AdminStats/getCategoryStats"
    );
};

// GET SUB CATEGORY STATS
export const getSubCategoryStats =
  async (categoryId) => {

    return await API.get(
      `/AdminStats/getSubCatagoryStats/${categoryId}`
    );
};


// GET ALL CATEGORIES

export const getAllCategories =
  async () => {

    return await API.get(
      "/Categories/allCategories"
    );
};

// GET SUBCATEGORIES BY CATEGORY

export const getSubCategoriesByCategory =
  async (categoryId) => {

    return await API.get(
      `/Subcategories/subCategoryByCategory/${categoryId}`
    );
};
