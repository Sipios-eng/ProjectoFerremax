// frontend/src/components/layout/Header.js

import React from 'react';
import { Link } from 'react-router-dom'; // Importamos Link
import './Header.css';

function Header() {
  return (
    <header className="main-header">
      <nav className="navbar">
        <Link to="/" className="navbar-brand">Ferremax</Link> {/* Usamos Link */}
        <ul className="navbar-nav">
          <li className="nav-item"><Link to="/productos" className="nav-link">Productos</Link></li> {/* Usamos Link */}
          <li className="nav-item"><Link to="/admin" className="nav-link">Administración</Link></li> {/* Usamos Link */}
          <li className="nav-item"><Link to="/carrito" className="nav-link">Carrito</Link></li> {/* Usamos Link */}
          <li className="nav-item"><Link to="/login" className="nav-link">Iniciar Sesión</Link></li> {/* Usamos Link */}
        </ul>
      </nav>
    </header>
  );
}

export default Header;