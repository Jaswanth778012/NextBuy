import API from "./api";

// ==========================
// CREATE CATEGORY
// ==========================

export const addCategory = async (categoryData) => {
  const response = await API.post(
    "/Categories/addCategory",
    categoryData
  );

  return response.data;
};

// ==========================
// GET ALL CATEGORIES
// ==========================

export const getAllCategories = async () => {
  const response = await API.get(
    "/Categories/allCategories"
  );

  return response.data;
};

// ==========================
// GET CATEGORY BY ID
// ==========================

export const getCategoryById = async (id) => {
  const response = await API.get(
    `/Categories/getcategoryById/${id}`
  );

  return response.data;
};

// ==========================
// UPDATE CATEGORY
// ==========================

export const updateCategory = async (
  id,
  categoryData
) => {
  const response = await API.put(
    `/Categories/updateCategory/${id}`,
    categoryData
  );

  return response.data;
};

// ==========================
// DELETE CATEGORY
// ==========================

export const deleteCategory = async (id) => {
  const response = await API.delete(
    `/Categories/deleteCategory/${id}`
  );

  return response.data;
};