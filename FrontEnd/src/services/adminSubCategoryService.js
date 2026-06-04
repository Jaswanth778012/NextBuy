import API from "./api";

// ==========================
// CREATE SUBCATEGORY
// ==========================

export const addSubCategory = async (
  categoryId,
  subCategoryData
) => {
  const response = await API.post(
    `/Subcategories/subCate/${categoryId}`,
    subCategoryData
  );

  return response.data;
};

// ==========================
// GET ALL SUBCATEGORIES
// ==========================

export const getAllSubCategories = async () => {
  const response = await API.get(
    "/Subcategories/getAllSubCategories"
  );

  return response.data;
};

// ==========================
// GET SUBCATEGORIES BY CATEGORY
// ==========================

export const getSubCategoriesByCategory = async (
  categoryId
) => {
  const response = await API.get(
    `/Subcategories/subCategoryByCategory/${categoryId}`
  );

  return response.data;
};

// ==========================
// GET SUBCATEGORY BY ID
// ==========================

export const getSubCategoryById = async (id) => {
  const response = await API.get(
    `/Subcategories/subCategoryById/${id}`
  );

  return response.data;
};

// ==========================
// UPDATE SUBCATEGORY
// ==========================

export const updateSubCategory = async (
  id,
  subCategoryData
) => {
  const response = await API.put(
    `/Subcategories/updateSubCategory/${id}`,
    subCategoryData
  );

  return response.data;
};

// ==========================
// DELETE SUBCATEGORY
// ==========================

export const deleteSubCategory = async (id) => {
  const response = await API.delete(
    `/Subcategories/deleteSubCategory/${id}`
  );

  return response.data;
};