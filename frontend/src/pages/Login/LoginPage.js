// frontend/src/pages/LoginPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // <-- Importa useAuth
import './LoginPage.css'; // Asegúrate de tener estilos para tu página de login

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Obtén la función de login del contexto

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(username, password); // Llama a la función de login del contexto
      // Redirige al usuario a una página después del login exitoso
      navigate('/admin'); // O a la página de inicio, etc.
    } catch (err) {
      setError('Credenciales inválidas. Por favor, intenta de nuevo.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="username">Usuario:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Iniciando...' : 'Entrar'}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}

export default LoginPage;