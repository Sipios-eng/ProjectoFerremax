// frontend/src/context/CurrencyContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios'; // Usamos axios directamente para esta API externa

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [usdRate, setUsdRate] = useState(null); // Tasa de CLP por 1 USD
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayCurrency, setDisplayCurrency] = useState('CLP'); // 'CLP' o 'USD'

  useEffect(() => {
    const fetchUsdRate = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('https://mindicador.cl/api/dolar');
        console.log('Respuesta cruda de Mindicador:', response.data); // Deja este log para futuras depuraciones

        // *** CAMBIO CLAVE AQUÍ: Acceder a 'serie[0].valor' ***
        if (response.data && response.data.serie && response.data.serie.length > 0 && response.data.serie[0].valor) {
          setUsdRate(response.data.serie[0].valor); // Acceder al valor más reciente
        } else {
          // Si la API cambió de nuevo o devuelve algo inesperado
          throw new Error('Formato de respuesta de API de dólar inesperado. No se encontró serie[0].valor');
        }
      } catch (err) {
        console.error('Error al obtener la cotización del dólar:', err);
        setError('No se pudo obtener la cotización del dólar.');
        setUsdRate(null); // Asegúrate de que la tasa sea null si hay error
      } finally {
        setLoading(false);
      }
    };

    fetchUsdRate();
    // Opcional: Refrescar la tasa cada cierto tiempo si es necesario
    // const intervalId = setInterval(fetchUsdRate, 3600000); // Cada hora
    // return () => clearInterval(intervalId);
  }, []);

  const convertToUsd = (clpAmount) => {
    if (usdRate && typeof clpAmount === 'number') {
      return clpAmount / usdRate;
    }
    return null; // O clpAmount, dependiendo de cómo quieras manejarlo sin tasa
  };

  const toggleDisplayCurrency = () => {
     setDisplayCurrency(prev => prev === 'CLP' ? 'USD' : 'CLP');
  };

  const contextValue = {
    usdRate,
    loading,
    error,
    convertToUsd,
    displayCurrency,
    toggleDisplayCurrency,
    // Otras funciones si necesitas convertir de USD a CLP o viceversa
  };

  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);