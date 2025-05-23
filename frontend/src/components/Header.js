// frontend/src/components/Header.js

import React from 'react';
import './Header.css'; // Opcional: para estilos específicos del Header

function Header() {
  return (
    <header className="main-header">
      <nav className="navbar">
        <a href="/" className="navbar-brand">Ferremax</a>
        <ul className="navbar-nav">
          <li className="nav-item"><a href="/productos" className="nav-link">Productos</a></li>
          <li className="nav-item"><a href="/categorias" className="nav-link">Categorías</a></li>
          <li className="nav-item"><a href="/contacto" className="nav-link">Contacto</a></li>
          <li className="nav-item"><a href="/login" className="nav-link">Iniciar Sesión</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;