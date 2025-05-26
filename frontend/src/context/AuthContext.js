// frontend/src/context/AuthContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Contendrá información del usuario logueado
  const [loading, setLoading] = useState(true); // Para saber si ya se cargó el estado de auth
  const navigate = useNavigate(); // Para redirigir en caso de logout forzado

  useEffect(() => {
    // Intenta cargar el usuario al inicio
    const checkAuthStatus = async () => {
      const loggedIn = authService.isLoggedIn();
      if (loggedIn) {
        setUser(authService.getCurrentUser());
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (username, password) => {
    try {
      const userData = await authService.login(username, password);
      setUser(userData);
      return true; // Éxito
    } catch (error) {
      setUser(null);
      throw error; // Propaga el error para que el componente de login lo maneje
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    navigate('/login'); // Redirige al login después de desloguear
  };

  // Función para obtener si el usuario es administrador (o tiene un rol específico)
  const isAdmin = () => {
    return user && user.is_admin; // Asume que el token decodificado tiene 'is_admin'
  };

  const authContextValue = {
    user,
    loading,
    login,
    logout,
    isLoggedIn: authService.isLoggedIn, // Puedes usar la función del servicio directamente
    isAdmin,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {loading ? <div>Cargando autenticación...</div> : children} {/* Puedes mostrar un spinner aquí */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);