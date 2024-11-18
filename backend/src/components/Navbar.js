import React from 'react';
import {useLocation, NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ searchTerm, setSearchTerm }) => {
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="logo">
        <NavLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <img src="/images/e-Shop.png" alt="logo" className="logo-image" />
        </NavLink>
        {location.pathname === '/' && (
          <div className="navbar-search">
          <input
            type="text"
            placeholder="What are you looking for today?"
            value={searchTerm}
            onChange={handleSearch}
          />
          <span className="fas fa-search search-icon"></span>
        </div>
      )}
      </div>
      <div className="account-icons">
        <NavLink
          to="/cart"
          className={({ isActive }) => (isActive ? 'active-link' : '')} 
          style={{ textDecoration: 'none' }} 
        >
          <i className="fas fa-shopping-cart" /> Cart
        </NavLink>
        <NavLink
          to="/wishlist"
          className={({ isActive }) => (isActive ? 'active-link' : '')} 
          style={{ textDecoration: 'none' }} 
        >
          <i className="fas fa-gift" /> Wishlist
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
