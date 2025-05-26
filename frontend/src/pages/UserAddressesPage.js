// frontend/src/pages/UserAddressesPage.js

import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './UserAddressesPage.css'; // Crea este CSS

function UserAddressesPage() {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newAddress, setNewAddress] = useState({
        direccion: '',
        ciudad: '',
        region: '',
        codigo_postal: '',
    });
    const { isLoggedIn } = useAuth();

    const fetchAddresses = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/direcciones/');
            setAddresses(response.data);
        } catch (err) {
            console.error("Error fetching addresses:", err.response?.data || err.message);
            setError("Error al cargar las direcciones.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoggedIn()) {
            fetchAddresses();
        } else {
            setError("Debes iniciar sesión para ver tus direcciones.");
            setLoading(false);
        }
    }, [isLoggedIn]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAddress({ ...newAddress, [name]: value });
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            await api.post('/direcciones/', newAddress);
            alert('Dirección añadida con éxito.');
            setNewAddress({ direccion: '', ciudad: '', region: '', codigo_postal: '' }); // Limpiar formulario
            fetchAddresses(); // Recargar la lista
        } catch (err) {
            console.error("Error adding address:", err.response?.data || err.message);
            setError("Error al añadir la dirección: " + (err.response?.data?.detail || err.message));
        }
    };

    const handleDeleteAddress = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta dirección?')) {
            try {
                await api.delete(`/direcciones/${id}/`);
                alert('Dirección eliminada con éxito.');
                fetchAddresses(); // Recargar la lista
            } catch (err) {
                console.error("Error deleting address:", err.response?.data || err.message);
                setError("Error al eliminar la dirección: " + (err.response?.data?.detail || err.message));
            }
        }
    };


    if (loading) return <div className="loading-message">Cargando direcciones...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="user-addresses-container">
            <h2>Mis Direcciones</h2>

            <form onSubmit={handleAddAddress} className="address-form">
                <h3>Añadir Nueva Dirección</h3>
                <div className="form-group">
                    <label htmlFor="direccion">Dirección:</label>
                    <input type="text" id="direccion" name="direccion" value={newAddress.direccion} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="ciudad">Ciudad:</label>
                    <input type="text" id="ciudad" name="ciudad" value={newAddress.ciudad} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="region">Región:</label>
                    <input type="text" id="region" name="region" value={newAddress.region} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="codigo_postal">Código Postal:</label>
                    <input type="text" id="codigo_postal" name="codigo_postal" value={newAddress.codigo_postal} onChange={handleInputChange} required />
                </div>
                <button type="submit" className="btn-primary">Guardar Dirección</button>
            </form>

            <h3>Direcciones Guardadas</h3>
            {addresses.length === 0 ? (
                <p>No tienes direcciones guardadas.</p>
            ) : (
                <ul className="address-list">
                    {addresses.map(addr => (
                        <li key={addr.id} className="address-item">
                            <p><strong>Dirección:</strong> {addr.direccion}</p>
                            <p><strong>Ciudad:</strong> {addr.ciudad}</p>
                            <p><strong>Región:</strong> {addr.region}</p>
                            <p><strong>Código Postal:</strong> {addr.codigo_postal}</p>
                            <button onClick={() => handleDeleteAddress(addr.id)} className="btn-danger">Eliminar</button>
                            {/* Puedes añadir un botón para editar si implementas esa funcionalidad */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default UserAddressesPage;