// frontend/src/pages/AdminSalesPage.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext'; // Aunque ya está protegido por ruta, es buena práctica
import './AdminSalesPage.css'; // Crea un CSS para esta página

function AdminSalesPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAdmin } = useAuth(); // Para asegurar que es admin (aunque la ruta ya lo protege)

  useEffect(() => {
    if (!isAdmin()) {
      // Esto realmente no debería pasar si ProtectedRoute funciona, pero es una capa extra.
      setLoading(false);
      setError('Acceso denegado. Solo administradores pueden ver las ventas.');
      return;
    }

    const fetchSales = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/ventas/'); // Endpoint para todas las ventas
        setSales(response.data);
      } catch (err) {
        console.error('Error fetching sales:', err);
        setError('Error al cargar las ventas.');
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, [isAdmin]);

  // Función para obtener el detalle de un pedido asociado a una venta (puedes implementarlo o usar OrderDetailPage)
  const handleViewSaleDetails = (pedidoId) => {
    // Redirige a la página de detalle de pedido, que ya muestra los productos
    window.open(`/pedidos/${pedidoId}`, '_blank'); // Abrir en nueva pestaña
  };

  const handleDeleteSale = async (saleId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta venta? Esto no revertirá el stock ni el pedido asociado.')) {
      try {
        await api.delete(`/ventas/${saleId}/`);
        setSales(sales.filter(sale => sale.id !== saleId)); // Actualiza la lista sin recargar
        alert('Venta eliminada con éxito.');
      } catch (err) {
        console.error('Error deleting sale:', err.response?.data || err.message);
        setError('Error al eliminar la venta.');
      }
    }
  };


  if (loading) return <div className="loading-message">Cargando ventas...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-sales-container">
      <h2>Gestión de Ventas</h2>
      {sales.length === 0 ? (
        <p>No hay ventas registradas.</p>
      ) : (
        <table className="sales-table">
          <thead>
            <tr>
              <th>ID Venta</th>
              <th>ID Pedido</th>
              <th>Usuario</th>
              <th>Método Pago</th>
              <th>Monto</th>
              <th>Fecha Transacción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id}>
                <td>{sale.id}</td>
                <td>{sale.pedido_id}</td>
                <td>{sale.usuario_username}</td>
                <td>{sale.metodo_pago_nombre}</td>
                <td>${parseFloat(sale.monto).toFixed(2)}</td>
                <td>{new Date(sale.fecha_transaccion).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleViewSaleDetails(sale.pedido_id)} className="btn btn-info btn-sm">Ver Pedido</button>
                  <button onClick={() => handleDeleteSale(sale.id)} className="btn btn-danger btn-sm">Eliminar Venta</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminSalesPage;