import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import productService from '../services/productService';
import wishlistService from '../services/wishlistService';
import '../styles/ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [addingToWishlist, setAddingToWishlist] = useState(false);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await productService.getProductById(id);
            setProduct(response.data);
        } catch (err) {
            toast.error('Failed to load product');
            navigate('/products');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToWishlist = async () => {
        try {
            setAddingToWishlist(true);
            await wishlistService.addToWishlist(product.id);
            toast.success('Added to wishlist!');
        } catch (err) {
            if (err?.response?.status === 401) {
                toast.error('Please login first');
                navigate('/login');
            } else {
                toast.error(err?.response?.data?.message || 'Failed to add to wishlist');
            }
        } finally {
            setAddingToWishlist(false);
        }
    };

    const formatPrice = (price) => {
        if (!price && price !== 0) return 'N/A';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    if (loading) {
        return (
            <div className="product-detail-loading">
                <div className="spinner"></div>
                <p>Loading product...</p>
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="product-detail-page">
            <div className="product-detail-container">
                <div className="product-gallery">
                    <div className="main-image">
                        <img src={product.imageUrl || '/placeholder-product.png'} alt={product.name} />
                    </div>
                </div>
                
                <div className="product-info-detail">
                    <span className="detail-category">{product.category?.name || 'Product'}</span>
                    <h1 className="detail-name">{product.name}</h1>
                    
                    <div className="detail-price-row">
                        <span className="detail-final-price">{formatPrice(product.finalPrice)}</span>
                        {product.mrpPrice > product.finalPrice && (
                            <span className="detail-mrp">{formatPrice(product.mrpPrice)}</span>
                        )}
                        {product.discountPercentage > 0 && (
                            <span className="detail-discount">-{Math.round(product.discountPercentage)}%</span>
                        )}
                    </div>

                    <p className="detail-description">{product.description}</p>

                    <div className="detail-meta">
                        <div className="meta-item">
                            <span>Brand:</span>
                            <strong>{product.brand?.name || 'N/A'}</strong>
                        </div>
                        <div className="meta-item">
                            <span>Stock:</span>
                            <strong className={product.stockQuantity > 0 ? 'in-stock' : 'out-stock'}>
                                {product.stockQuantity > 0 ? `${product.stockQuantity} available` : 'Out of stock'}
                            </strong>
                        </div>
                        <div className="meta-item">
                            <span>Delivery:</span>
                            <strong>{product.deliveryTimeInDays || 2} days</strong>
                        </div>
                    </div>

                    <div className="detail-actions">
                        <button className="btn-add-cart-detail" onClick={() => toast.info('Cart feature coming soon!')}>
                            Add to Cart
                        </button>
                        <button 
                            className="btn-wishlist-detail" 
                            onClick={handleAddToWishlist}
                            disabled={addingToWishlist}
                        >
                            {addingToWishlist ? 'Adding...' : '♡ Add to Wishlist'}
                        </button>
                    </div>

                    <button className="btn-set-alert" onClick={() => navigate(`/wishlist/alerts?productId=${product.id}`)}>
                        🔔 Set Price Alert
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;