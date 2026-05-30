import API from './api';

export const getBrands = async () => {
  const res = await API.get('/Brands/brand/all');
  return res.data;
};

export const getCategories = async () => {
  const res = await API.get('/Categories/allCategories');
  return res.data;
};

export const getSubCategoriesByCategory = async (categoryId) => {
  if (!categoryId) return [];
  const res = await API.get(`/Subcategories/subCategoryByCategory/${categoryId}`);
  return res.data;
};

export default {
  getBrands,
  getCategories,
  getSubCategoriesByCategory,
};
