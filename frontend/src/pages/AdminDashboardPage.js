// frontend/src/pages/AdminDashboardPage.js

import React from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboardPage.css';

function AdminDashboardPage() {
  return (
    <div className="admin-dashboard-container">
      <h2>Panel de Administración (Mantenedores)</h2>
      <p>Desde aquí podrás gestionar:</p>
      <ul className="admin-links">
        <li><Link to="/admin/productos">Ver/Editar Productos</Link></li>
        <li><Link to="/admin/users">Gestionar Usuarios</Link></li>
        <li><Link to="/admin/ventas">Gestionar Ventas</Link></li> {/* <-- NUEVO ENLACE */}
        {/* Aquí podrías añadir enlaces para gestionar marcas, tipos de producto, estados de pedido, etc. si lo necesitas */}
      </ul>
    </div>
  );
}

export default AdminDashboardPage;