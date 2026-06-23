import { useState } from 'react';
import { useCart } from '../../context/CartContext';

const AddToCartButton = ({ productId, stockQuantity }) => {
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const { addToCart } = useCart();

  const handleAdd = async () => {
    if (stockQuantity <= 0) { setMsg('Out of stock'); return; }
    if (qty > stockQuantity) { setMsg(`Only ${stockQuantity} available`); return; }
    
    setLoading(true); setMsg('');
    try {
      const result = await addToCart(productId, qty);
      setMsg(result || 'Added to cart');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(err.response?.data || 'Failed to add');
    } finally { setLoading(false); }
  };

  return (
    <div className="add-to-cart-wrapper">
      <div className="qty-selector">
        <button onClick={() => setQty(Math.max(1, qty-1))} className="qty-btn">-</button>
        <span className="qty-value">{qty}</span>
        <button onClick={() => setQty(Math.min(stockQuantity, qty+1))} className="qty-btn">+</button>
      </div>
      <button
        onClick={handleAdd}
        disabled={loading || stockQuantity <= 0}
        className={`add-cart-btn ${stockQuantity <= 0 ? 'disabled' : ''}`}
      >
        {loading ? 'Adding...' : 'Add to Cart'}
      </button>
      {msg && (
        <p className={`cart-msg ${msg.includes('success') || msg.includes('Added') ? 'success' : 'error'}`}>
          {msg}
        </p>
      )}
    </div>
  );
};

export default AddToCartButton;