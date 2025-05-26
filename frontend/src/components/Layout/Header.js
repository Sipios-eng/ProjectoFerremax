// frontend/src/components/layout/Header.js

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

function Header() {
  const { user, isLoggedIn, logout, isAdmin } = useAuth();

  return (
    <header className="main-header"> {/* Asegúrate que es "main-header" para que funcione el CSS */}
      <nav className="navbar">
        <Link to="/" className="navbar-brand">Ferremax</Link>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/productos" className="nav-link">Productos</Link>
          </li>
          <li className="nav-item">
            <Link to="/carrito" className="nav-link">Carrito</Link>
          </li>

          {isLoggedIn() ? (
            <>
              {isAdmin() && (
                <li className="nav-item">
                  <Link to="/admin" className="nav-link">Admin</Link>
                </li>
              )}
              <li className="nav-item">
                <span className="nav-link">Hola, {user ? user.username : 'Usuario'}!</span>
              </li>
              <li className="nav-item">
                <button onClick={logout} className="nav-link logout-button">Salir</button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">Iniciar Sesión</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link">Registrarse</Link> {/* <-- NUEVO ENLACE */}
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;