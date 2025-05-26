// frontend/src/pages/AdminDashboardPage.js

import React from 'react';
import { Link } from 'react-router-dom';

function AdminDashboardPage() {
  return (
    <div style={{ textAlign: 'center', padding: '50px 0' }}>
      <h1>Panel de Administración (Mantenedores)</h1>
      <p>Desde aquí podrás gestionar:</p>
      <ul>
        {/* Este enlace lleva a la página de listado de productos para el admin */}
        <li><Link to="/admin/productos">Ver/Editar Productos</Link></li> {/* <-- ENLACE MODIFICADO */}
        {/* El enlace de "Crear Nuevo Producto" lo tenemos dentro de AdminProductsPage ahora */}
        {/* <li><Link to="/admin/productos/crear">Crear Nuevo Producto</Link></li>  <-- ESTE PODRÍA SER ELIMINADO SI QUIERES QUE EL BOTÓN ESTÉ SOLO EN LA LISTA*/}
        <li><Link to="/admin/usuarios">Gestionar Usuarios</Link></li>
        <li><Link to="/admin/ventas">Ver Ventas</Link></li>
        {/* Agrega más enlaces a otros mantenedores aquí */}
      </ul>
    </div>
  );
}

export default AdminDashboardPage;