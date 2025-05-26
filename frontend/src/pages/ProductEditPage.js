// frontend/src/pages/ProductEditPage.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Importa useParams y useNavigate
import ProductForm from '../components/products/ProductForm';
import productService from '../services/productService';

function ProductEditPage() {
  const { id } = useParams(); // Obtiene el ID del producto de la URL
  const navigate = useNavigate(); // Para redirigir después de la edición

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (err) {
        setError('No se pudo cargar el producto para editar.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]); // El efecto se ejecuta cuando cambia el ID de la URL

  const handleProductUpdated = (updatedProduct) => {
    console.log('Producto actualizado exitosamente:', updatedProduct);
    // Redirigir al usuario a la lista de productos o al detalle del producto actualizado
    navigate('/productos'); // O '/admin/productos' si es una vista de administración
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Cargando datos del producto para editar...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>{error}</div>;
  }

  if (!product) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Producto no encontrado.</div>;
  }

  return (
    <div className="product-edit-page-container">
      <h2>Editar Producto</h2>
      {/* Pasamos los datos del producto al formulario */}
      <ProductForm initialData={product} onProductCreated={handleProductUpdated} isEditMode={true} />
    </div>
  );
}

export default ProductEditPage;