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

  // Si está logueado, pero no se ha cargado la información del usuario (podría pasar si authService falla)
  if (!user) {
    // Podría ser un error de autenticación, o un problema al decodificar el token.
    // Podrías redirigir al login aquí o mostrar un mensaje de error.
    console.warn("Usuario autenticado pero sin datos de perfil. Redirigiendo a login.");
    return <Navigate to="/login" replace />;
  }

  // Lógica de verificación de roles:
  // Si no se especifican roles permitidos, cualquier usuario logueado puede acceder.
  // Si se especifican, el usuario debe tener al menos uno de los roles permitidos.
  if (allowedRoles && allowedRoles.length > 0) {
    // Determinar el rol del usuario actual. Suponemos que `user` tiene una propiedad `is_admin`.
    // Si tienes un campo 'role' en el usuario, úsalo:
    // const userRole = user.role; // Asumiendo que el campo se llama 'role'

    // Si tu sistema solo tiene 'user' y 'admin', y 'is_admin' es booleano:
    const userRole = user.is_admin ? 'admin' : 'user';

    if (!allowedRoles.includes(userRole)) {
      // Si el rol del usuario NO está en la lista de roles permitidos, redirige.
      return <Navigate to="/" replace />; // Redirigir al inicio o a una página de "Acceso Denegado"
    }
  }

  // Si está logueado y cumple con los roles, renderiza el contenido
  return <Outlet />;
};

export default ProtectedRoute;