import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetail.css';

const ProductDetail = ({ products, addToCart, addToWishlist, removeFromWishlist, wishlist }) => {
  const [product, setProduct] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  

  const checkWishlist = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login', { state: { message: 'Please log in to add items to your wishlist.' } });
        return;
      }
      //const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/wishlist/check/${productId}`);
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/wishlist/check/${product._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setIsInWishlist(data.exists);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  useEffect(() => {
    
    const foundProduct = products.find((p) => p._id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      checkWishlist(foundProduct._id);
    } else {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login', { state: { message: 'Please log in to add items to your wishlist.' } });
        return;
      }
      // fetch(`${process.env.REACT_APP_API_BASE_URL}/api/products/${id}`)
      fetch(`${process.env.REACT_APP_API_BASE_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          if (!response.ok) throw new Error('Product not found');
          return response.json();
        })
        .then((data) => {
          setProduct(data);
          checkWishlist(data._id); 
        })
        .catch((error) => console.error('Error fetching product by ID:', error));
    }
  }, [id, products]);

  if (!product) {
    return <div>Product not found</div>;
  }



  const handleAddToCart = (product) => {
    addToCart(product);
    setFeedback('Added to cart!');
    setFeedbackType('success');
    setTimeout(() => {
      setFeedback('');
      setFeedbackType('');
    }, 2000);
  };

  const handleAddToWishlist = async (product) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login', { state: { message: 'Please log in to add items to your wishlist.' } });
        return;
      }
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/wishlist/check/${product._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
  
      if (data.exists) {
        const itemResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/wishlist/item/${product._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const wishlistItem = await itemResponse.json();
        removeFromWishlist(wishlistItem);
        setIsInWishlist(false);
        setFeedback('Removed from wishlist!');
      } else {
        addToWishlist(product);
        setIsInWishlist(true);
        setFeedback('Added to wishlist!');
      }
  
      setFeedbackType('success');
      setTimeout(() => {
        setFeedback('');
        setFeedbackType('');
      }, 2000);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };
  

  return (
    <div className="product-detail">
      {feedback && <div className={`feedback ${feedbackType}`}>{feedback}</div>}
      <div className="product-detail-container">
        <img src={product.image} alt={product.name} className="product-detail-image" />
        <div className="product-detail-info">
        <span className={`clearance-badge ${product.isClearance ? 'CLEARANCE' : 'featured-deal'}`}>{product.Clearance}</span>

          <span className="product-detail-title">{product.name}</span>
          <div className="product-detail-section">
          <p>{product.description}</p>
          </div>
          <div className="price-section">
            <div className="price-info">
              <span className="product-discount-price">${product.discountedPrice.toFixed(2)}</span>
              <span className="product-original-price">${product.OriginalPrice.toFixed(2)}</span>
              <span className="discount-percentage">
                Save {Math.round(product.OriginalPrice - product.discountedPrice)} ({Math.round(((product.OriginalPrice - product.discountedPrice) / product.OriginalPrice) * 100)}% off)
              </span>
            </div>
          </div>
          <span className="final-price">${product.discountedPrice.toFixed(2)}</span>

          <div className="action-buttons">
            <button className="add-to-cart-btn" onClick={() => handleAddToCart(product)}>Add to Cart</button>
            <button className="wishlist-btn" onClick={() => handleAddToWishlist(product)}>
              {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
            <button onClick={() => navigate(-1)} className="back-button">Back</button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
