// frontend/src/components/common/ProtectedRoute.js

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isLoggedIn, loading } = useAuth();

  if (loading) {
    return <div>Cargando usuario...</div>; // O un spinner
  }

  if (!isLoggedIn()) {
    // Si no está logueado, redirige a la página de login
    return <Navigate to="/login" replace />;
  }

  // Si se especifican roles permitidos
  if (allowedRoles && user) {
    if (allowedRoles.includes('admin') && !user.is_admin) {
      // Si el rol requerido es admin y el usuario no es admin, redirige al inicio
      return <Navigate to="/" replace />;
    }
    // Puedes añadir más lógica de roles aquí si tienes más roles (ej. 'staff', 'cliente')
  }

  // Si está logueado y cumple con los roles, renderiza el contenido
  return <Outlet />;
};

export default ProtectedRoute;