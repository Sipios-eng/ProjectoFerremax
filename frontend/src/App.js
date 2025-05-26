// frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BaseLayout from './components/Layout/BaseLayout';
import './App.css';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Common/ProtectedRoute';

import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/Login/LoginPage.js';
import RegisterPage from './pages/RegisterPage'; // <-- NUEVA IMPORTACIÓN

import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminProductsPage from './pages/AdminProductsPage';
import ProductCreatePage from './pages/ProductCreatePage';
import ProductEditPage from './pages/ProductEditPage';
import AdminUsersPage from './pages/AdminUsersPage'; // <-- NUEVA IMPORTACIÓN
import UserFormPage from './pages/UserFormPage'; // <-- NUEVA IMPORTACIÓN

import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <BaseLayout>
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/productos" element={<ProductsPage />} />
            <Route path="/productos/:id" element={<ProductDetailPage />} />
            <Route path="/carrito" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} /> {/* <-- NUEVA RUTA */}

            {/* Rutas Protegidas para Administradores */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              {/* Rutas de Productos (ya existentes) */}
              <Route path="/admin/productos" element={<AdminProductsPage />} />
              <Route path="/admin/productos/crear" element={<ProductCreatePage />} />
              <Route path="/admin/productos/editar/:id" element={<ProductEditPage />} />
              {/* Rutas de Usuarios (NUEVAS) */}
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/users/create" element={<UserFormPage />} /> {/* Para crear un usuario (admin) */}
              <Route path="/admin/users/edit/:id" element={<UserFormPage />} /> {/* Para editar un usuario (admin) */}
            </Route>

            {/* Ruta para Not Found */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BaseLayout>
      </AuthProvider>
    </Router>
  );
}

export default App;