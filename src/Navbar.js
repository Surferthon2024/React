import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/add" className="nav-link">Add</Link>
      <Link to="/detail" className="nav-link">Detail</Link>
      <Link to="/calendar" className="nav-link">Calendar</Link>
    </nav>
  );
};

export default Navbar;