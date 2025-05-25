// frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BaseLayout from './components/Layout/BaseLayout'; // Importamos el componente de layout base
import ItemList from './components/products/ProductList'; // Tu componente ItemList
import './App.css'; // Mantén o modifica tus estilos CSS generales de App.js
//---
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage'; // Página de selección de productos
import ProductDetailPage from './pages/ProductDetailPage'; // Detalle de un producto (ej. /productos/1)
import CartPage from './pages/CartPage'; // Carrito
import LoginPage from './pages/LoginPage'; // Inicio de sesión
import AdminDashboardPage from './pages/AdminDashboardPage'; // Página para mantenedores (genérica por ahora)
import NotFoundPage from './pages/NotFoundPage'; // Página 404
///---

function App() {
  return (
    // En lugar de un <div> con header y main directos,
    // usamos nuestro BaseLayout.
    <Router> {/* Envuelve toda tu aplicación con el Router */}
      <BaseLayout>
        <Routes> {/* Aquí se definen todas tus rutas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/productos/:id" element={<ProductDetailPage />} /> {/* Ruta para el detalle de un producto */}
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} /> {/* Ruta para el dashboard de administración/mantenedores */}
          {/* Añade más rutas según tus mantenedores (ej. /admin/usuarios, /admin/productos) */}

          {/* Ruta para cualquier otra URL no definida (Página 404) */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        {/*
          Todo lo que pongas aquí dentro de <BaseLayout>
          se renderizará en el espacio de {children} que definimos
          en BaseLayout.js.
          Así, Header y Footer siempre serán visibles.
        */}

        {/* Puedes borrar o comentar el contenido anterior de <header className="App-header">
            ya que BaseLayout ya incluye un Header y un Footer. */}
      </BaseLayout>
    </Router>
  );
}

export default App;