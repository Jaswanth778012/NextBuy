import API from "./api";

const productService = {
    // Get all products (public endpoint)
    getAllProducts: () => API.get("/Product/viewAllProducts"),
    
    // ✅ FIXED: Correct endpoint URL
    getAllCategories: () => API.get("/Categories/allCategories"),
    
    // Get products by category
    getProductsByCategory: (categoryId) => API.get(`/Product/category/${categoryId}`),
    
    // Search products
    searchProducts: (query) => API.get(`/Product/search?query=${encodeURIComponent(query)}`),
    
    // Get single product by ID
    getProductById: (id) => API.get(`/Product/${id}`)
};

export default productService;