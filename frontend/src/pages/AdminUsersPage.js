// frontend/src/pages/AdminUsersPage.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api'; // Tu instancia de axios con el interceptor de token
import './AdminUsersPage.css'; // Crea un CSS para esta página

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/users/'); // Endpoint de tu API
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Error al cargar usuarios.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar a este usuario?')) {
      try {
        await api.delete(`/users/${userId}/`);
        fetchUsers(); // Vuelve a cargar la lista de usuarios después de eliminar
      } catch (err) {
        console.error('Error deleting user:', err);
        setError('Error al eliminar usuario.');
      }
    }
  };

  if (loading) return <div>Cargando usuarios...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-users-container">
      <h2>Gestión de Usuarios</h2>
      <Link to="/admin/users/create" className="btn btn-primary mb-3">Crear Nuevo Usuario</Link> {/* Enlace para crear */}

      {users.length === 0 ? (
        <p>No hay usuarios registrados.</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Email</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Teléfono</th>
              <th>RUT</th>
              <th>Rol</th>
              <th>Admin</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.telefono}</td>
                <td>{user.rut}</td>
                <td>{user.rol_nombre || 'N/A'}</td> {/* Muestra el nombre del rol si existe */}
                <td>{user.is_staff ? 'Sí' : 'No'}</td>
                <td>
                  <Link to={`/admin/users/edit/${user.id}`} className="btn btn-info btn-sm">Editar</Link>
                  <button onClick={() => handleDelete(user.id)} className="btn btn-danger btn-sm">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminUsersPage;