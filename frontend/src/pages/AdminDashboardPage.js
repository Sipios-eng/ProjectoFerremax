// frontend/src/pages/AdminDashboardPage.js

import React from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboardPage.css'; // Asegúrate de que tienes CSS para esta página

function AdminDashboardPage() {
  return (
    <div className="admin-dashboard-container">
      <h2>Panel de Administración (Mantenedores)</h2>
      <p>Desde aquí podrás gestionar:</p>
      <ul className="admin-links">
        <li><Link to="/admin/productos">Ver/Editar Productos</Link></li>
        <li><Link to="/admin/users">Gestionar Usuarios</Link></li> {/* <-- NUEVO ENLACE */}
        <li><Link to="/admin/ventas">Ver Ventas</Link></li>
      </ul>
    </div>
  );
}

export default AdminDashboardPage;