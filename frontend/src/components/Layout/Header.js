// frontend/src/components/layout/Header.js

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext'; // <-- NUEVA IMPORTACIÓN
import './Header.css';

function Header() {
  const { user, isLoggedIn, logout, isAdmin } = useAuth();
  const { cart } = useCart(); // <-- Obtén el carrito del contexto

  // Calcula la cantidad total de ítems en el carrito
  const cartItemCount = cart?.detalles ? cart.detalles.reduce((sum, item) => sum + item.cantidad, 0) : 0;

  return (
    <header className="main-header">
      <nav className="navbar">
        <Link to="/" className="navbar-brand">Ferremas</Link>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/productos" className="nav-link">Productos</Link>
          </li>
          <li className="nav-item cart-icon-container"> {/* Añade una clase para el icono */}
            <Link to="/carrito" className="nav-link cart-link">
              Carrito
              {cartItemCount > 0 && <span className="cart-item-count">{cartItemCount}</span>}
            </Link>
          </li>

          {isLoggedIn() ? (
            <>
              {isAdmin() && (
                <li className="nav-item">
                  <Link to="/admin" className="nav-link">Admin</Link>
                </li>
              )}
               {/* Nuevo enlace para ver pedidos de usuario (visible para todos los logueados) */}
              <li className="nav-item">
                <Link to="/mis-pedidos" className="nav-link">Mis Pedidos</Link>
              </li>
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
                <Link to="/register" className="nav-link">Registrarse</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;