// frontend/src/services/authService.js

import api from './api';
import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_DATA_KEY = 'user_data'; // Nueva clave para guardar la info del usuario decodificada

const authService = {
  login: async (username, password) => {
    try {
      const response = await api.post('token/', { username, password });
      const { access, refresh } = response.data;
      localStorage.setItem(TOKEN_KEY, access);
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh);

      // Decodificar el token para extraer información del usuario y guardarla
      const decodedToken = jwtDecode(access);
      const userData = {
        id: decodedToken.user_id,
        username: decodedToken.username,
        // *** CAMBIO CLAVE AQUÍ: Leer 'is_admin' del token, no 'is_staff' ***
        is_admin: decodedToken.is_admin || false,
        is_active: decodedToken.is_active || false,
        rol: decodedToken.rol || null, // Si el rol puede ser nulo
      };
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData)); // Guardar info del usuario

      return userData; // Devuelve la información del usuario al AuthContext
    } catch (error) {
      console.error('Error durante el login:', error.response?.data || error.message);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY); // Limpiar también la info del usuario
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
      const currentTime = Date.now() / 1000; // en segundos
      return decodedToken.exp > currentTime;
    } catch (error) {
      return false; // Error al decodificar o token inválido
    }
  },

  // Obtener la información del usuario directamente de localStorage
  getCurrentUser: () => {
    const userData = localStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null; // Leer directamente de localStorage
  },

  // Opcional: Refrescar el token de acceso
  refreshToken: async () => {
    try {
      const refreshToken = authService.getRefreshToken();
      if (!refreshToken) throw new Error('No refresh token available');
      const response = await api.post('token/refresh/', { refresh: refreshToken });
      const newAccessToken = response.data.access;
      localStorage.setItem(TOKEN_KEY, newAccessToken);

      // Al refrescar el token, también actualiza la información del usuario si ha cambiado
      const decodedNewToken = jwtDecode(newAccessToken);
      const newUserData = {
        id: decodedNewToken.user_id,
        username: decodedNewToken.username,
        // *** CAMBIO CLAVE AQUÍ: Leer 'is_admin' del token, no 'is_staff' ***
        is_admin: decodedNewToken.is_admin || false,
        is_active: decodedNewToken.is_active || false,
        rol: decodedNewToken.rol || null,
      };
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(newUserData)); // Actualizar info del usuario

      return newAccessToken;
    } catch (error) {
      console.error('Error refreshing token:', error.response?.data || error.message);
      authService.logout();
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('register/', userData);
      return response.data;
    } catch (error) {
      console.error('Error durante el registro:', error.response?.data || error.message);
      throw error;
    }
  },
};

export default authService;