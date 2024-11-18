import {React, useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import './Cart.css';

const Cart = ({ cart, setCart, setQuantity, incrementQuantity, decrementQuantity, removeFromCart, moveToWishlist }) => {
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState('');

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/cart`);
        const data = await response.json();
        setCart(data); 
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    };
    fetchCartData();
  }, [setCart]);

  const handleMoveToWishlist = (product) => {
    moveToWishlist(product);
    setFeedback("Added to Wishlist!!!");
    setFeedbackType('success');
    setTimeout(() => setFeedback(''), 2000);  
  };

  return (
    <div className="shopping-cart">
      <h2>Shopping Cart</h2>
      {feedback && <div className={`feedback ${feedbackType}`}>{feedback}</div>}
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div className="cart-item" key={`cart-${item.productId}`}>
              <img src={item.image} alt={item.name} className="item-image" />
              <div className="item-details">
                <Link to={`/product/${item.productId}`} className="product-link" style={{textDecoration : 'none', color: 'inherit' }}>
                  <h3 className="item-name">{item.name}</h3>
                </Link>
                <div className="item-actions">
                  <button style={{ textDecoration: 'none' }} onClick={() => decrementQuantity(item)}>-</button>
                  <input className="item-quantity" type="text" value={item.quantity} onChange={(e) => setQuantity(item, e.target.value)}></input>
                  <button style={{ textDecoration: 'none' }} onClick={() => incrementQuantity(item)}>+</button>
                  <button style={{ textDecoration: 'none' }} onClick={() => removeFromCart(item)}>Delete</button>
                  <button style={{ textDecoration: 'none' }} onClick={() => handleMoveToWishlist(item)}>Save for later</button>
                </div>
              </div>
              <div className="item-price">${item.price.toFixed(2)}</div>
            </div>
          ))}

          <div className="cart-summary">
            <span>
              Total ({cart.length} item{cart.length > 1 ? 's' : ''}): $
              {cart.reduce((a, c) => a + c.price * c.quantity, 0).toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
