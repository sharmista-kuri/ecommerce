import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = ({ products, addToCart, addToWishlist, removeFromWishlist, wishlist, searchTerm }) => {
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [wishlistStatus, setWishlistStatus] = useState({});

  useEffect(() => {
    products.forEach((product) => {
      checkWishlistStatus(product._id);
    });
  }, [products]);

  const checkWishlistStatus = async (productId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/wishlist/check/${productId}`);
      const data = await response.json();
      setWishlistStatus((prevState) => ({
        ...prevState,
        [productId]: data.exists,
      }));
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const handleAddToWishlist = async (product) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/wishlist/check/${product._id}`);
      const data = await response.json();

      if (data.exists) {
        const itemResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/wishlist/item/${product._id}`);
        const wishlistItem = await itemResponse.json();
        await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/wishlist/${wishlistItem._id}`, { method: 'DELETE' });
        
        setWishlistStatus((prevState) => ({
          ...prevState,
          [product._id]: false,
        }));
        setFeedback('Removed from wishlist!');
      } else {
        addToWishlist(product);
        setWishlistStatus((prevState) => ({
          ...prevState,
          [product._id]: true,
        }));
        setFeedback('Added to wishlist!');
      }

      setFeedbackType('success');
      setTimeout(() => {
        setFeedback('');
        setFeedbackType('');
      }, 2000);
    } catch (error) {
      console.error('Error handling wishlist status:', error);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setFeedback('Added to cart!');
    setFeedbackType('success');
    setTimeout(() => {
      setFeedback('');
      setFeedbackType('');
    }, 2000);
  };

  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
  };

  const min = parseFloat(minPrice) || 0;
  const max = parseFloat(maxPrice) || Infinity;

  const filteredProducts = products.filter((product) => {
    const matchesSearchTerm = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriceRange = product.price >= min && product.price <= max;
    return matchesSearchTerm && matchesPriceRange;
  });

  return (
    <div className="main-content-wrapper">
      <div className="sidebar">
        <h3>Filter by Price</h3>
        <div className="filter-form">
          <input
            type="number"
            placeholder="Min price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          <button onClick={clearFilters} className="clear-filters-btn">
            Clear Filters
          </button>
        </div>
      </div>

      <div className="product-list-wrapper">
        {feedback && <div className={`feedback ${feedbackType}`}>{feedback}</div>}
        <div className="product-list">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product._id} className="product-item">
                <div className="image-container">
                  <img src={product.image} alt={product.name} className="product-image" />
                  <span className={`product-badge ${product.isClearance ? 'CLEARANCE' : 'featured-deal'}`}>
                    {product.Clearance}
                  </span>
                  <i
                    className={`wishlist-icon ${
                      wishlistStatus[product._id] ? 'fas fa-heart in-wishlist' : 'far fa-heart not-in-wishlist'
                    }`}
                    onClick={() => handleAddToWishlist(product)}
                  ></i>
                </div>
                <Link to={`/product/${product._id}`} className="product-link" style={{textDecoration : 'none', color: 'inherit' }}>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                </Link>
                <div className="price-section">
                  <span className="discount-price">${product.discountedPrice.toFixed(2)}</span>
                  <span className="original-price">${product.OriginalPrice.toFixed(2)}</span>
                </div>
                <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
              </div>
            ))
          ) : (
            <div className="no-products-found">
              <div className="no-products-found-icon">
                <i className="fas fa-box-open"></i>
              </div>
              <p>No products found matching your criteria.</p>
              <button className="clear-filters-btn" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
