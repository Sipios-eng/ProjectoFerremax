// frontend/src/pages/UserFormPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import './UserFormPage.css'; // Crea un CSS para esta página

function UserFormPage() {
  const { id } = useParams(); // Para modo edición
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '', // Solo para actualización, no se lee la original
    first_name: '',
    last_name: '',
    telefono: '',
    rut: '',
    rol: '', // ID del rol
    is_staff: false,
    is_active: true,
  });
  const [roles, setRoles] = useState([]); // Para la lista de roles
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const isEditMode = Boolean(id); // true si estamos editando, false si creando

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      try {
        // Cargar roles
        const rolesResponse = await api.get('/roles/');
        setRoles(rolesResponse.data);

        if (isEditMode) {
          // Cargar datos del usuario si estamos en modo edición
          const userResponse = await api.get(`/users/${id}/`);
          // Asegúrate de mapear los campos para que coincidan con el estado
          setFormData({
            username: userResponse.data.username || '',
            email: userResponse.data.email || '',
            password: '', // No precargamos la contraseña por seguridad
            first_name: userResponse.data.first_name || '',
            last_name: userResponse.data.last_name || '',
            telefono: userResponse.data.telefono || '',
            rut: userResponse.data.rut || '',
            rol: userResponse.data.rol || '', // El ID del rol
            is_staff: userResponse.data.is_staff || false,
            is_active: userResponse.data.is_active || false,
          });
        }
      } catch (err) {
        console.error('Error cargando datos:', err);
        setError('Error al cargar datos del usuario o roles.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const dataToSend = { ...formData };
      // Eliminar password si está vacío en modo edición para no actualizarla sin querer
      if (isEditMode && !dataToSend.password) {
        delete dataToSend.password;
      }
      // Eliminar password si está vacío en modo creación (aunque debería ser requerido)
      if (!isEditMode && !dataToSend.password) {
        setError("La contraseña es requerida para un nuevo usuario.");
        setSubmitting(false);
        return;
      }

      if (isEditMode) {
        await api.put(`/users/${id}/`, dataToSend);
      } else {
        // Para la creación, usamos el endpoint de registro, pero la vista de UserListCreateAPIView también permite POST
        // Usaremos UserListCreateAPIView para que el admin pueda crear usuarios completos.
        await api.post('/users/', dataToSend);
      }
      navigate('/admin/users'); // Redirige a la lista de usuarios
    } catch (err) {
      console.error('Error al guardar usuario:', err);
      if (err.response && err.response.data) {
        const errorMessages = Object.values(err.response.data).flat().join(' ');
        setError(errorMessages || 'Error al guardar usuario.');
      } else {
        setError('Error al guardar usuario.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Cargando formulario...</div>;

  return (
    <div className="user-form-container">
      <h2>{isEditMode ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h2>
      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-group">
          <label htmlFor="username">Usuario:</label>
          <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña (dejar vacío para no cambiar):</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
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

        <div className="form-group">
          <label htmlFor="rol">Rol:</label>
          <select id="rol" name="rol" value={formData.rol || ''} onChange={handleChange}>
            <option value="">Seleccione un Rol</option>
            {roles.map(rol => (
              <option key={rol.id} value={rol.id}>{rol.nombre}</option>
            ))}
          </select>
        </div>

        <div className="form-group checkbox-group">
          <input type="checkbox" id="is_staff" name="is_staff" checked={formData.is_staff} onChange={handleChange} />
          <label htmlFor="is_staff">¿Es administrador?</label>
        </div>

        <div className="form-group checkbox-group">
          <input type="checkbox" id="is_active" name="is_active" checked={formData.is_active} onChange={handleChange} />
          <label htmlFor="is_active">¿Está activo?</label>
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Guardando...' : 'Guardar Usuario'}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}

export default UserFormPage;