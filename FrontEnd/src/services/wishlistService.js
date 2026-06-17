import API from "./api";

const wishlistService = {
    // Add product to wishlist
    addToWishlist: (productId) => API.post("/Wishlist/add", { productId }),
    
    // Get user's wishlist
    getMyWishlist: () => API.get("/Wishlist/"),
    
    // Remove from wishlist
    removeFromWishlist: (productId) => API.delete(`/Wishlist/remove/${productId}`),
    
    // Move wishlist item to cart
    moveToCart: (productId) => API.post(`/Wishlist/move-to-cart/${productId}`)
};

export default wishlistService;