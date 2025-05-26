// frontend/src/services/authService.js

import api from './api';
import { jwtDecode } from 'jwt-decode'; // Importa jwt-decode

const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

const authService = {
  login: async (username, password) => {
    try {
      const response = await api.post('token/', { username, password });
      const { access, refresh } = response.data;
      localStorage.setItem(TOKEN_KEY, access);
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
      // Opcional: decodificar el token para obtener info del usuario si es necesario
      const user = jwtDecode(access);
      return user; // Devuelve la información del usuario del token
    } catch (error) {
      console.error('Error durante el login:', error.response?.data || error.message);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  getAccessToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  getRefreshToken: () => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  isLoggedIn: () => {
    const token = authService.getAccessToken();
    if (!token) return false;
    try {
      const decodedToken = jwtDecode(token);
      // Comprueba si el token ha expirado
      const currentTime = Date.now() / 1000; // en segundos
      return decodedToken.exp > currentTime;
    } catch (error) {
      return false; // Error al decodificar o token inválido
    }
  },

  // Opcional: Decodificar y obtener la información del usuario del token
  getCurrentUser: () => {
    const token = authService.getAccessToken();
    if (!token) return null;
    try {
      const decodedToken = jwtDecode(token);
      // Puedes mapear los campos a tu gusto (ej. user_id a id, etc.)
      return {
        id: decodedToken.user_id,
        username: decodedToken.username, // Asume que el username está en el token
        is_admin: decodedToken.is_staff, // Asume que el is_staff está en el token (lo añadiremos)
        // ... otros campos que necesites del token
      };
    } catch (error) {
      return null;
    }
  },

  // Opcional: Refrescar el token de acceso
  refreshToken: async () => {
    try {
      const refreshToken = authService.getRefreshToken();
      if (!refreshToken) throw new Error('No refresh token available');
      const response = await api.post('token/refresh/', { refresh: refreshToken });
      localStorage.setItem(TOKEN_KEY, response.data.access);
      return response.data.access;
    } catch (error) {
      console.error('Error refreshing token:', error.response?.data || error.message);
      authService.logout(); // Si el refresh token también falla, desloguear
      throw error;
    }
  },
  
  register: async (userData) => {
    try {
      // Envía los datos del usuario al endpoint de registro
      const response = await api.post('register/', userData);
      // No se espera un token, solo la confirmación de registro
      return response.data; // Devuelve los datos del usuario creado
    } catch (error) {
      console.error('Error durante el registro:', error.response?.data || error.message);
      throw error;
    }
  },
};

export default authService;