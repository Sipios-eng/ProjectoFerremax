// frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BaseLayout from './components/Layout/BaseLayout';
import './App.css';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/Common/ProtectedRoute';

import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/Login/LoginPage.js';
import RegisterPage from './pages/RegisterPage';

import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminProductsPage from './pages/AdminProductsPage';
import ProductCreatePage from './pages/ProductCreatePage';
import ProductEditPage from './pages/ProductEditPage';
import AdminUsersPage from './pages/AdminUsersPage';
import UserFormPage from './pages/UserFormPage';

import NotFoundPage from './pages/NotFoundPage';

// Importaciones para Pedidos y Ventas
import UserOrdersPage from './pages/UserOrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import AdminSalesPage from './pages/AdminSalesPage';
import UserAddressesPage from './pages/UserAddressesPage'; // <-- NUEVA IMPORTACIÓN

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <BaseLayout>
            <Routes>
              {/* Rutas Públicas */}
              <Route path="/" element={<HomePage />} />
              <Route path="/productos" element={<ProductsPage />} />
              <Route path="/productos/:id" element={<ProductDetailPage />} />
              <Route path="/carrito" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Rutas Protegidas para Usuarios Logueados */}
              <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
                 <Route path="/mis-pedidos" element={<UserOrdersPage />} />
                 <Route path="/pedidos/:id" element={<OrderDetailPage />} />
                 <Route path="/perfil/direcciones" element={<UserAddressesPage />} /> {/* <--- AÑADIDA ESTA RUTA */}
              </Route>

              {/* Rutas Protegidas para Administradores */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<AdminDashboardPage />} />
                {/* Rutas de Productos */}
                <Route path="/admin/productos" element={<AdminProductsPage />} />
                <Route path="/admin/productos/crear" element={<ProductCreatePage />} />
                <Route path="/admin/productos/editar/:id" element={<ProductEditPage />} />
                {/* Rutas de Usuarios */}
                <Route path="/admin/users" element={<AdminUsersPage />} />
                <Route path="/admin/users/create" element={<UserFormPage />} />
                <Route path="/admin/users/edit/:id" element={<UserFormPage />} />
                {/* Rutas de Ventas */}
                <Route path="/admin/ventas" element={<AdminSalesPage />} />
              </Route>

              {/* Ruta para Not Found */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BaseLayout>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;