// frontend/src/pages/UserOrdersPage.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './UserOrdersPage.css'; // Crea un CSS para esta página

function UserOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn()) {
      setLoading(false);
      setError('Debes iniciar sesión para ver tus pedidos.');
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/pedidos/'); // Endpoint para pedidos del usuario
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching user orders:', err);
        setError('Error al cargar tus pedidos.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [isLoggedIn]);

  if (loading) return <div className="loading-message">Cargando tus pedidos...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="user-orders-container">
      <h2>Mis Pedidos</h2>
      {orders.length === 0 ? (
        <p>No tienes pedidos realizados aún.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID Pedido</th>
              <th>Fecha del Pedido</th>
              <th>Estado</th>
              <th>Total de Ítems</th>
              <th>Monto Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{new Date(order.fecha_pedido).toLocaleDateString()}</td>
                <td>{order.estado_nombre}</td>
                <td>{order.total_cantidad}</td>
                <td>${parseFloat(order.total_monto).toFixed(2)}</td>
                <td>
                  <Link to={`/pedidos/${order.id}`} className="btn btn-info btn-sm">Ver Detalles</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserOrdersPage;