import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/loginStyles.module.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json' // Añadir este encabezado
        },
        body: JSON.stringify({ 
          email: email.trim(), // Limpiar espacios
          password: password.trim() 
        }),
      });

      // Manejar errores de red
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `Error HTTP: ${response.status}`
        );
      }

      const data = await response.json();

      // Validar estructura de la respuesta
      if (!data.token || !data.user) {
        throw new Error('Respuesta inválida del servidor');
      }

      // Almacenar token y datos de usuario
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirigir al dashboard
      navigate('/dashboard');
    } catch (err) {
      // Manejar diferentes tipos de errores
      const errorMessage = err.message.includes('JSON')
        ? 'Error de conexión con el servidor'
        : err.message;

      setError(errorMessage || 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h2 className={styles.title}>Panel Ganadero Pro</h2>
        
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.inputField}
              required
              autoFocus
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.inputField}
              required
            />
          </div>

          {error && (
            <div className={styles.errorMessage}>
              ⚠️ {error}
            </div>
          )}

          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className={styles.spinner}></span>
            ) : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;