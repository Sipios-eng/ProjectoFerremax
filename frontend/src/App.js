// frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BaseLayout from './components/Layout/BaseLayout';
import './App.css';

// Importa el AuthProvider
import { AuthProvider } from './context/AuthContext'; // <-- NUEVA IMPORTACIÓN

// Importa ProtectedRoute
import ProtectedRoute from './components/Common/ProtectedRoute.js'; // <-- NUEVA IMPORTACIÓN

// Importa tus páginas
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/Login/LoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminProductsPage from './pages/AdminProductsPage';
import ProductCreatePage from './pages/ProductCreatePage';
import ProductEditPage from './pages/ProductEditPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <AuthProvider> {/* <-- ENVUELVE TODA LA APP CON AuthProvider */}
        <BaseLayout>
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/productos" element={<ProductsPage />} />
            <Route path="/productos/:id" element={<ProductDetailPage />} />
            <Route path="/carrito" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Rutas Protegidas para Administradores */}
            {/* Si el usuario NO es admin, estas rutas redirigirán */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}> {/* Protege estas rutas */}
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/productos" element={<AdminProductsPage />} />
              <Route path="/admin/productos/crear" element={<ProductCreatePage />} />
              <Route path="/admin/productos/editar/:id" element={<ProductEditPage />} />
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