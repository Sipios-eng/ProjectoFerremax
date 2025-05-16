// frontend/src/components/ItemList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Asegúrate de haber instalado axios (npm install axios)

function ItemList() {
  const [items, setItems] = useState([]); // Estado para guardar la lista de ítems
  const [loading, setLoading] = useState(true); // Estado para indicar si está cargando
  const [error, setError] = useState(null); // Estado para manejar errores

  // useEffect se ejecuta después de que el componente se renderiza
  useEffect(() => {
    // URL de tu API de Django
    const API_URL = 'http://localhost:8000/api/items/'; // O 'http://127.0.0.1:8000/api/items/'

    axios.get(API_URL) // Realiza la petición GET usando axios
      .then(response => {
        // Si la petición es exitosa, guarda los datos en el estado 'items'
        setItems(response.data);
        setLoading(false); // Deja de cargar
      })
      .catch(error => {
        // Si hay un error, regístralo y actualiza el estado de error
        console.error('Error fetching items:', error);
        setError('No se pudieron cargar los ítems.');
        setLoading(false); // Deja de cargar aunque haya error
      });
  }, []); // El array vacío [] asegura que este efecto se ejecute solo una vez al montar el componente

  // Mostrar mensajes de estado (cargando, error, sin datos)
  if (loading) {
    return <div>Cargando ítems...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (items.length === 0) {
    return <div>No hay ítems disponibles en la base de datos. Agrega algunos desde el administrador de Django.</div>;
  }

  // Si hay ítems, mostrarlos en una lista
  return (
    <div>
      <h2>Lista de Ítems de Ferremax</h2>
      <ul>
        {items.map(item => (
          // Usa item.id como key, es el campo por defecto que Django crea
          <li key={item.id}>
            {item.name} - Cantidad: {item.quantity} ({item.description})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ItemList; // Exporta el componente para poder usarlo