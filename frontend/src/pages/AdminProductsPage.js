// frontend/src/pages/AdminProductsPage.js (PÁGINA PARA EL ADMINISTRADOR)

import React from 'react';
import AdminProductList from '../components/admin/AdminProductList'; // <-- Importa el RENOMBRADO AdminProductList
import { Link } from 'react-router-dom'; // Para el botón de "Crear Producto"

function AdminProductsPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Gestión de Productos</h1>
      <div style={{ textAlign: 'right', marginBottom: '20px' }}>
        <Link to="/admin/productos/crear" className="create-new-button">
          Crear Nuevo Producto
        </Link>
      </div>
      <AdminProductList /> {/* <-- Renderiza el AdminProductList */}
    </div>
  );
}

export default AdminProductsPage;