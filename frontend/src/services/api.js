// frontend/src/services/api.js

import axios from 'axios';
import authService from './authService'; // <-- Importa authService

const API_BASE_URL = 'http://localhost:8000/api/'; // URL de tu API de Django

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token de autenticación a cada petición
api.interceptors.request.use(
  (config) => {
    const token = authService.getAccessToken(); // Obtiene el token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Añade el encabezado Authorization
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar tokens expirados y refrescarlos
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Si el error es 401 (Unauthorized) y no es una petición de refresco de token,
    // y ya habíamos intentado refrescar (para evitar bucles infinitos)
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Marca la petición como reintentada
      try {
        const newAccessToken = await authService.refreshToken(); // Intenta refrescar el token
        // Actualiza el encabezado de la petición original con el nuevo token
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        // Reenvía la petición original con el nuevo token
        return api(originalRequest);
      } catch (refreshError) {
        // Si el refresco falla (ej. refresh token expirado), desloguea al usuario
        authService.logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;