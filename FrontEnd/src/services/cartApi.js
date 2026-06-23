import API from './api';

export const cartApi = {
  addToCart: (productId, quantity = 1) => 
    API.post('/Cart/addCart', { productId, quantity }),
    
  getCart: () => 
    API.get('/Cart/viewCart'),
    
  updateQuantity: (cartItemId, quantity) => 
    API.put(`/Cart/updateQuantity/${cartItemId}/${quantity}`),
    
  removeItem: (cartItemId) => 
    API.delete(`/Cart/delete/${cartItemId}`),
    
  clearCart: () => 
    API.delete('/Cart/clearCart'),
    
  applyCoupon: (code) => 
    API.post(`/Cart/applyCoupon?code=${encodeURIComponent(code)}`),
    
  removeCoupon: () => 
    API.post('/Cart/removeCoupon'),
    
  getItemCount: () => 
    API.get('/Cart/itemCount'),
};