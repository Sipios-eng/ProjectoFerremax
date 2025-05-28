// frontend/src/pages/AdminSalesPage.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- Importa useNavigate
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './AdminSalesPage.css';

function AdminSalesPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAdmin } = useAuth();
  const navigate = useNavigate(); // <-- Instancia useNavigate

  useEffect(() => {
    if (!isAdmin()) {
      setLoading(false);
      setError('Acceso denegado. Solo administradores pueden ver las ventas.');
      return;
    }

    const fetchSales = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/ventas/');
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

  // Función para redirigir a la nueva página de detalle de venta/pedido
  const handleViewSaleDetails = (saleId) => { // Cambiado a saleId para ver detalles de la venta
    // Usamos navigate para ir a la nueva ruta que crearemos
    navigate(`/admin/ventas/${saleId}`); // <-- CAMBIO CLAVE AQUÍ
  };

  const handleDeleteSale = async (saleId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta venta? Esto no revertirá el stock ni el pedido asociado.')) {
      try {
        await api.delete(`/ventas/${saleId}/`);
        setSales(sales.filter(sale => sale.id !== saleId));
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
                  {/* CAMBIAR onClick para usar handleViewSaleDetails con sale.id */}
                  <button onClick={() => handleViewSaleDetails(sale.id)} className="btn btn-info btn-sm">Ver Detalles Venta</button>
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