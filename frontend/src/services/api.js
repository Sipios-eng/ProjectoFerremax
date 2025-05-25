// frontend/src/services/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/', // ¡Importante! Asegúrate de que esta sea la URL base correcta de tu backend.
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;