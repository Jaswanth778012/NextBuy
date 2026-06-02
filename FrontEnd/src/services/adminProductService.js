import API from './api';


const productBase = '/Product';

export const listProducts = async () => {
  const res = await API.get(`${productBase}/viewAllProducts`);
  return res.data;
};

export const createProduct = async (productObj, file) => {
  const fd = new FormData();
  

  fd.append(
    'product', 
    new Blob([JSON.stringify(productObj)], { type: 'application/json' })
  );
  
  if (file) fd.append('image', file);
  
  const res = await API.post(`${productBase}/addProduct`, fd);
  return res.data;
};

export const updateProduct = async (id, productObj, file) => {
  const fd = new FormData();
  
  // 👇 CHANGE THIS LINE ALSO: Wrap JSON string in a Blob here too
  fd.append(
    'product', 
    new Blob([JSON.stringify(productObj)], { type: 'application/json' })
  );
  
  if (file) fd.append('image', file);
  
  const res = await API.patch(`${productBase}/updateProduct/${id}`, fd);
  return res.data;
};





export const deleteProduct = async (name, productId) => {

  if (!name || !productId) {
    console.error(
      'Missing arguments',
      { name, productId }
    );
    return;
  }

  const sanitizedName = encodeURIComponent(name.trim());

  const res = await API.delete(`${productBase}/deleteProduct/${sanitizedName}/${productId}`);

  return res.data;
};


export const updateStock = async (id, stock) => {
  const res = await API.patch(`${productBase}/updateProductStockQality/${id}/${stock}`);
  return res.data;
};


export const updateStatus = async (productId, status) => {
  // Generates a clean endpoint path: /Product/updateProductStatus/105/DRAFT
  const res = await API.patch(`${productBase}/updateProductStatus/${productId}/${status}`);
  return res.data;
};

export const updateDiscount = async (id, discount) => {
  const res = await API.patch(`${productBase}/updateDisCount/${id}/${discount}`);
  return res.data;
};

export const compareProducts = async (products) => {
  const params = products.map((product) => `products=${encodeURIComponent(product)}`).join('&');
  const res = await API.get(`${productBase}/compare?${params}`);
  return res.data;
};

export default {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  updateStatus,
  updateDiscount,
  compareProducts,
};