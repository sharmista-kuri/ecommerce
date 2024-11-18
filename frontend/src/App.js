import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Cart from './components/Cart';
import Wishlist from './components/Wishlist';
import ProductDetail from './components/ProductDetail';
import Registration from './components/Registration';
import Login from './components/Login';
import Profile from './components/Profile';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './style.css';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const isAuthenticated = localStorage.getItem('token') !== null;

  // Function to log out and redirect
  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login'; // Redirect to login page
  };

  // Function to fetch with authentication and handle token expiration
  const fetchWithAuth = useCallback(async (url, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await fetch(url, { ...options, headers });
      if (response.status === 401) {
        // If token is expired or invalid, log out
        logout();
      }
      return response;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  }, []); // empty dependency array ensures fetchWithAuth does not change

  // Protects routes requiring authentication
  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/products`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error fetching product data:', error));
    
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWithAuth(`${process.env.REACT_APP_API_BASE_URL}/api/wishlist`)
        .then((response) => response.json())
        .then((data) => setWishlist(data))
        .catch((error) => console.error('Error fetching wishlist data:', error));

      fetchWithAuth(`${process.env.REACT_APP_API_BASE_URL}/api/cart`)
        .then((response) => response.json())
        .then((data) => setCart(data))
        .catch((error) => console.error('Error fetching cart data:', error));
    }
  }, [isAuthenticated, fetchWithAuth]);


  const addToCart = (product) => {
    fetchWithAuth(`${process.env.REACT_APP_API_BASE_URL}/api/cart/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: product._id,
        name: product.name,
        price: product.price || 0,
        quantity: 1,
        image: product.image,
      }),
    })
      .then((response) => response.json())
      .then((newProduct) => setCart((prevCart) => [...prevCart, newProduct]))
      .catch((error) => console.error('Error adding product to cart:', error));
  };

  const addToWishlist = (product) => {
    fetchWithAuth(`${process.env.REACT_APP_API_BASE_URL}/api/wishlist/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
      }),
    })
      .then((response) => response.json())
      .then((newItem) => setWishlist([...wishlist, newItem]))
      .catch((error) => console.error('Error adding product to wishlist:', error));
  };

  const removeFromCart = (product) => {
    fetchWithAuth(`${process.env.REACT_APP_API_BASE_URL}/api/cart/${product._id}`, {
      method: 'DELETE',
    })
      .then(() => setCart(cart.filter((item) => item._id !== product._id)))
      .catch((error) => console.error('Error removing product from cart:', error));
  };

  const removeFromWishlist = (product) => {
    fetchWithAuth(`${process.env.REACT_APP_API_BASE_URL}/api/wishlist/${product._id}`, {
      method: 'DELETE',
    })
      .then(() => setWishlist(wishlist.filter((item) => item._id !== product._id)))
      .catch((error) => console.error('Error removing product from wishlist:', error));
  };

  const moveToWishlistFromCart = async (product) => {
    const response = await fetchWithAuth(`${process.env.REACT_APP_API_BASE_URL}/api/wishlist/check/${product.productId}`);
    const data = await response.json();

    if (!data.exists) {
      addToWishlist(product);
    }
    removeFromCart(product);
  };

  const moveToCartFromWishlist = (product) => {
    addToCart(product);
    removeFromWishlist(product);
  };

  const incrementQuantity = (product) => {
    const newQuantity = product.quantity + 1;
    fetchWithAuth(`${process.env.REACT_APP_API_BASE_URL}/api/cart/${product._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: newQuantity }),
    })
      .then((response) => response.json())
      .then(() => setCart(cart.map((item) =>
        item._id === product._id ? { ...item, quantity: newQuantity } : item
      )))
      .catch((error) => console.error('Error incrementing product quantity:', error));
  };

  const decrementQuantity = (product) => {
    const newQuantity = product.quantity - 1;

    if (newQuantity > 0) {
      fetchWithAuth(`${process.env.REACT_APP_API_BASE_URL}/api/cart/${product._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      })
        .then((response) => response.json())
        .then(() => setCart(cart.map((item) =>
          item._id === product._id ? { ...item, quantity: newQuantity } : item
        )))
        .catch((error) => console.error('Error decrementing product quantity:', error));
    } else {
      removeFromCart(product);
    }
  };

  const setQuantity = (product, value) => {
    const quantity = Math.max(1, parseInt(value, 10) || 1);
    fetchWithAuth(`${process.env.REACT_APP_API_BASE_URL}/api/cart/${product._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    })
      .then((response) => response.json())
      .then((updatedItem) => {
        setCart(cart.map((item) =>
          item._id === updatedItem._id ? updatedItem : item
        ));
      })
      .catch((error) => console.error('Error updating quantity:', error));
  };

  return (
    <Router>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Routes>
        <Route path="/" element={<Home products={products} addToCart={addToCart} addToWishlist={addToWishlist} removeFromWishlist={removeFromWishlist} wishlist={wishlist} searchTerm={searchTerm} />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/cart" element={<PrivateRoute><Cart cart={cart} setQuantity={setQuantity} incrementQuantity={incrementQuantity} decrementQuantity={decrementQuantity} removeFromCart={removeFromCart} moveToWishlist={moveToWishlistFromCart} /></PrivateRoute>} />
        <Route path="/wishlist" element={<PrivateRoute><Wishlist wishlist={wishlist} moveToCart={moveToCartFromWishlist} removeFromWishlist={removeFromWishlist} /></PrivateRoute>} />
        <Route path="/product/:id" element={<ProductDetail products={products} addToCart={addToCart} addToWishlist={addToWishlist} removeFromWishlist={removeFromWishlist} wishlist={wishlist} />} />
      </Routes>
    </Router>
  );
};

export default App;
