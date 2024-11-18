import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Cart from './components/Cart';
import Wishlist from './components/Wishlist';
import ProductDetail from './components/ProductDetail';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './style.css';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/products`)
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error fetching product data:', error));
  }, []);

  
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/wishlist`)
      .then((response) => response.json())
      .then((data) => setWishlist(data))
      .catch((error) => console.error('Error fetching wishlist data:', error));
  }, []);

  const addToCart = (product) => {
    console.log('Adding to cart:', {
      productId: product._id,
      name: product.name,
      price: product.price, 
      quantity: 1,
      image: product.image
    });
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/cart/add`, {
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
      .then((newProduct) => setCart((prevCart) => [...prevCart, {
        ...newProduct,
        price: newProduct.price || 0,
        quantity: newProduct.quantity || 1
      }]))
      .catch((error) => console.error('Error adding product to cart:', error));
  };

  

  const addToWishlist = async (product) => {
    console.log('Moving product to wishlist:', product);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/wishlist/check/${product._id}`);
      const data = await response.json();
  
      if (!data.exists) {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/wishlist/add`, {
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
      } else {
        console.log('Product already in wishlist, skipping addition');
      }
    } catch (error) {
      console.error('Error checking product in wishlist:', error);
    }
    
  };
  

  const removeFromCart = (product) => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/cart/${product._id}`, { method: 'DELETE' })
      .then(() => setCart(cart.filter((item) => item._id !== product._id)))
      .catch((error) => console.error('Error removing product from cart:', error));
  };

  const removeFromWishlist = (product) => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/wishlist/${product._id}`, { method: 'DELETE' })
      .then(() => setWishlist(wishlist.filter((item) => item._id !== product._id)))
      .catch((error) => console.error('Error removing product from wishlist:', error));
  };

  const moveToWishlistFromCart = async (product) => {
    console.log('Moving product to cart:', product);
    console.log('Moving product to cart, productId:', product.productId);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/wishlist/check/${product.productId}`);
      const data = await response.json();
  
      if (!data.exists) {
        console.log('Adding product to wishlist:', product);
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/wishlist/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: product.productId,  
            name: product.name,
            price: product.price,
            image: product.image,
          }),
        })
          .then((response) => response.json())
          .then((newItem) => setWishlist([...wishlist, newItem]))
          .catch((error) => console.error('Error adding product to wishlist:', error));
      } else {
        console.log('Product already in wishlist, skipping addition');
      }
      removeFromCart(product);
    } catch (error) {
      console.error('Error checking product in wishlist:', error);
    }
  };

  const moveToCartFromWishlist = async (product) => {
    console.log('Moving product to cart:', product);
    console.log('Moving product to cart, productId:', product.productId);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/cart/check/${product.productId}`);
      const data = await response.json();
  
      if (!data.exists) {
        console.log('Adding product to cart:', product);
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/cart/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: product.productId,
            name: product.name,
            price: product.price || 0, 
            quantity: 1,
            image: product.image,
          }),
        })
          .then((response) => response.json())
          .then((newProduct) => setCart((prevCart) => [...prevCart, {
            ...newProduct,
            price: newProduct.price || 0,
            quantity: newProduct.quantity || 1
          }]))
          .catch((error) => console.error('Error adding product to cart:', error));
      } else {
        console.log('Product already in cart, skipping addition');
      }
      removeFromWishlist(product);
    } catch (error) {
      console.error('Error checking product in cart:', error);
    }
  };
  

  const incrementQuantity = (product) => {
    const newQuantity = product.quantity + 1;
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/cart/${product._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: newQuantity }),
    })
      .then((response) => response.json())
      .then((updatedItem) => {
        setCart(cart.map((item) =>
          item._id === product._id ? { ...item, quantity: newQuantity } : item
        ));
      })
      .catch((error) => console.error('Error incrementing product quantity:', error));
  };

  const decrementQuantity = (product) => {
    const newQuantity = product.quantity - 1;
    if (newQuantity > 0) {
      fetch(`${process.env.REACT_APP_API_BASE_URL}/api/cart/${product._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      })
        .then((response) => response.json())
        .then((updatedItem) => {
          setCart(cart.map((item) =>
            item._id === product._id ? { ...item, quantity: newQuantity } : item
          ));
        })
        .catch((error) => console.error('Error decrementing product quantity:', error));
    } else {
      removeFromCart(product);
    }
  };

  const setQuantity = (product, value) => {
    const quantity = Math.max(1, parseInt(value, 10) || 1); 
  
    setCart(cart.map((item) =>
      item._id === product._id
        ? { ...item, quantity, total: quantity * item.price }
        : item
    ));
  
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/cart/${product._id}`, {
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
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
      <Routes>
        <Route path="/" element={<Home products={products} addToCart={addToCart} addToWishlist={addToWishlist} removeFromWishlist={removeFromWishlist} wishlist={wishlist} searchTerm={searchTerm} />} />
        <Route path="/cart" element={<Cart cart={cart} setCart={setCart} setQuantity={setQuantity} incrementQuantity={incrementQuantity} decrementQuantity={decrementQuantity} removeFromCart={removeFromCart} moveToWishlist={moveToWishlistFromCart} />} />
        <Route path="/wishlist" element={<Wishlist wishlist={wishlist} moveToCart={moveToCartFromWishlist} removeFromWishlist={removeFromWishlist} />} />
        <Route path="/product/:id" element={<ProductDetail products={products} addToCart={addToCart} addToWishlist={addToWishlist} removeFromWishlist={removeFromWishlist} wishlist={wishlist} />} />
      </Routes>
    </Router>
  );
};

export default App;
