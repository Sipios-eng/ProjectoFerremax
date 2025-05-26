// frontend/src/pages/RegisterPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './RegisterPage.css'; // Crea un CSS para esta página también

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    telefono: '',
    rut: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Validación básica en el cliente
    if (formData.password !== formData.password2) {
      setError('Las contraseñas no coinciden.');
      setLoading(false);
      return;
    }

    try {
      // Llamar al servicio de registro
      await authService.register(formData);
      setSuccess(true);
      // Opcional: limpiar el formulario o redirigir al login
      setFormData({
        username: '',
        email: '',
        password: '',
        password2: '',
        first_name: '',
        last_name: '',
        telefono: '',
        rut: '',
      });
      setTimeout(() => navigate('/login'), 2000); // Redirige después de 2 segundos
    } catch (err) {
      // Manejo de errores desde el backend (ej. usuario ya existe, validación)
      if (err.response && err.response.data) {
        // Asume que el backend devuelve un objeto con errores de validación
        const errorMessages = Object.values(err.response.data).flat().join(' ');
        setError(errorMessages || 'Error en el registro. Intenta de nuevo.');
      } else {
        setError('Error en el registro. Intenta de nuevo.');
      }
      console.error('Register error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label htmlFor="username">Usuario:</label>
          <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="password2">Confirmar Contraseña:</label>
          <input type="password" id="password2" name="password2" value={formData.password2} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="first_name">Nombre:</label>
          <input type="text" id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="last_name">Apellido:</label>
          <input type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="telefono">Teléfono:</label>
          <input type="text" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="rut">RUT:</label>
          <input type="text" id="rut" name="rut" value={formData.rut} onChange={handleChange} />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">¡Registro exitoso! Ya puedes iniciar sesión.</p>}
      </form>
    </div>
  );
}

export default RegisterPage;