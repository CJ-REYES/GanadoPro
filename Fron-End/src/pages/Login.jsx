// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from '@/context/AuthContext';
import { setToken, clearToken, setUser } from '@/hooks/useToken';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  // Validaciones del formulario
  const errors = {
    email: !email,
    password: !password,
  };

  const isFormValid = email && password;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setError("");

    if (!isFormValid) return;

    setIsLoading(true);
    clearToken(); // Limpiamos cualquier token previo

    try {
      const res = await fetch('http://localhost:5201/api/Users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // Manejar errores de conexión
      if (res.status === 0) {
        throw new Error("Error de conexión con el servidor");
      }

      // Manejar errores HTTP
      if (!res.ok) {
        // Intentar parsear error como JSON, si falla usar texto plano
        try {
          const errorData = await res.json();
          throw new Error(errorData.message || `Error ${res.status}: ${res.statusText}`);
        } catch (jsonError) {
          const errorText = await res.text();
          throw new Error(errorText || `Error ${res.status}: ${res.statusText}`);
        }
      }

      // Parsear respuesta exitosa
      const data = await res.json();
      
      // Validar estructura de la respuesta (con propiedades en mayúscula)
      if (!data.Token || !data.User) {
        throw new Error("Respuesta del servidor inválida");
      }
      
      // Normalizar el objeto de usuario
      const normalizedUser = {
        id: data.User.Id_User,
        name: data.User.Name,
        email: data.User.Email,
        upp: data.User.Upp,
        telefono: data.User.Telefono,
        rol: data.User.Rol
      };
      
      // Guardar token y usuario
      setToken(data.Token);
      setUser(normalizedUser);
      
      // Actualizar contexto de autenticación
      login(data.Token, normalizedUser);

      // Mostrar notificación de éxito
      toast.success('Sesión iniciada correctamente', {
        position: "top-right",
        autoClose: 3000,
      });
      
      // Redirigir al dashboard
      navigate('/layout/dashboard', { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
      
      // Mostrar notificación de error
      toast.error(`Error: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Wrapper>
      <div className="card">
        <div className="card2">
          <form className="form" onSubmit={handleSubmit}>
            <p id="heading">Iniciar Sesión</p>

            {error && <p className="error-message">{error}</p>}

            <div className="field">
              <svg className="input-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 2v.01L12 13 4 6.01V6h16zM4 18V8l8 5 8-5v10H4z"/>
              </svg>
              <input
                type="text"
                placeholder="Correo electrónico"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched({ ...touched, email: true })}
              />
            </div>
            {touched.email && errors.email && <p className="error-message">El correo es requerido.</p>}

            <div className="field">
              <svg className="input-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 8V6a5 5 0 0 0-10 0v2H5v14h14V8h-2zM9 6a3 3 0 0 1 6 0v2H9V6zm3 5a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/>
              </svg>
              <input
                type="password"
                placeholder="Contraseña"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched({ ...touched, password: true })}
              />
            </div>
            {touched.password && errors.password && <p className="error-message">La contraseña es requerida.</p>}

            <div className="btn">
              <button 
                type="submit" 
                className="button1" 
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? (
                  <span className="spinner"></span>
                ) : (
                  "Iniciar Sesión"
                )}
              </button>
            </div>
            
            <div className="help-link">
              <a href="#" onClick={(e) => {
                e.preventDefault();
                setError("¿Necesitas ayuda? Contacta al administrador del sistema.");
              }}>
                ¿Problemas para iniciar sesión?
              </a>
            </div>
          </form>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  position: relative;
  background: linear-gradient(135deg, rgb(3, 41, 77), rgb(4, 1, 7), rgb(25, 12, 73));
  background-size: 400% 400%;
  animation: gradientBG 15s ease infinite;
  display: flex;
  justify-content: center;
  align-items: center;

  .card {
    background-image: linear-gradient(163deg, #00ff75 0%, #3700ff 100%);
    padding: 2px;
    border-radius: 22px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 0px 20px rgba(0, 255, 117, 0.3);
    animation: fadeInUp 0.6s ease-out both;
  }

  .card2 {
    border-radius: 20px;
    background-color: #171717;
    padding: 2em;
    min-width: 320px;
    max-width: 380px;
    width: 100%;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  #heading {
    text-align: center;
    margin-bottom: 1em;
    color: white;
    font-size: 1.7em;
    font-weight: 600;
  }

  .error-message {
    color: #ff4d4d;
    text-align: center;
    margin: 0.5em 0;
    font-size: 0.9em;
    min-height: 1.5em;
  }

  .field {
    display: flex;
    align-items: center;
    gap: 0.5em;
    background-color: #171717;
    padding: 0.8em 1.2em;
    border-radius: 25px;
    box-shadow: inset 2px 5px 10px rgb(5, 5, 5);
    transition: box-shadow 0.3s;
  }

  .field:focus-within {
    box-shadow: inset 2px 5px 10px rgb(5, 5, 5), 0 0 0 2px #00ff75;
  }

  .input-icon {
    height: 1.9em;
    width: 1.9em;
    fill: white;
  }

  .input-field {
    background: none;
    border: none;
    outline: none;
    width: 100%;
    color: #f0f0f0;
    font-size: 1em;
    &::placeholder {
      color: #888;
    }
  }

  .btn {
    display: flex;
    justify-content: center;
    margin-top: 1.5em;
  }

  .button1 {
    padding: 0.8em 2.5em;
    border-radius: 30px;
    border: none;
    background: linear-gradient(to right, #00ff75, #3700ff);
    color: white;
    font-size: 1em;
    font-weight: 500;
    transition: all 0.3s;
    cursor: pointer;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 44px;
    width: 100%;
    max-width: 280px;
  }

  .button1:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 255, 117, 0.4);
  }

  .button1:disabled {
    background: #3a3a3a;
    cursor: not-allowed;
    opacity: 0.7;
  }

  .spinner {
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
  }

  .help-link {
    text-align: center;
    margin-top: 1.5rem;
    a {
      color: #00ff75;
      text-decoration: none;
      font-size: 0.9em;
      transition: color 0.2s;
      &:hover {
        color: #00cc66;
        text-decoration: underline;
      }
    }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes fadeInUp {
    0% {
      opacity: 0;
      transform: translateY(30px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes gradientBG {
    0% {background-position: 0% 50%;}
    50% {background-position: 100% 50%;}
    100% {background-position: 0% 50%;}
  }
`;

export default Login;