import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import './Wishlist.css';

const Wishlist = ({ wishlist, moveToCart, removeFromWishlist }) => {
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState('');

  const handleMoveToCart = (product) => {
    moveToCart(product);
    setFeedback('Moved to cart!');
    setFeedbackType('success');
    setTimeout(() => setFeedback(''), 2000);  
  };

  return (
    <div className="wishlist">
      <h1>Your Wishlist</h1>
      {feedback && <div className={`feedback ${feedbackType}`}>{feedback}</div>}
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty</p>
      ) : (
        <div>
          {wishlist.map((item) => (
            <div className="wishlist-item" key={`wishlist-${item.productId}`}>
              <img src={item.image} alt={item.name} className="item-image" />
              <div className="item-details">
                <Link to={`/product/${item.productId}`} className="product-link" style={{textDecoration : 'none', color: 'inherit' }}>
                  <h3 className="item-name">{item.name}</h3>
                </Link>
                <div className="item-actions">
                  <button style={{ textDecoration: 'none' }} onClick={() => handleMoveToCart(item)}>Move to Cart</button>
                  <button style={{ textDecoration: 'none' }} onClick={() => removeFromWishlist(item)}>Remove</button>
                </div>
              </div>
              <div className="item-price">${item.price.toFixed(2)}</div>
            </div>
          ))}
          <div className="wishlist-summary">
            Total items: {wishlist.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
