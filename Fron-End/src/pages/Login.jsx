// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validate = () => ({
    email: email.trim() === "",
    password: password.trim() === "",
  });

  const errors = validate();
  const isFormValid = !errors.email && !errors.password;

  const handleLogin = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setError("");
    
    if (!isFormValid) {
      return;
    }

    setIsLoading(true);

    try {
      // Use environment variable for API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5201/';
const response = await fetch(`${API_BASE_URL}api/Users/login`, {

        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          Email: email,
          Password: password 
        }),
      });

      // Handle HTTP errors first
      if (!response.ok) {
        // Special handling for 401 Unauthorized
        if (response.status === 401) {
          throw new Error("Credenciales inválidas");
        }
        
        // Handle non-JSON responses
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          throw new Error(text || `Error ${response.status}: ${response.statusText}`);
        }
        
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      // Process successful response
      const data = await response.json();
      const token = data.token || data.Token;
      const userResponse = data.user || data.User;
      
      if (!token || !userResponse) {
        throw new Error("Formato de respuesta inesperado del servidor");
      }

      const userData = {
        id: userResponse.id || userResponse.Id_User,
        name: userResponse.name || userResponse.Name,
        email: userResponse.email || userResponse.Email,
        rol: userResponse.rol || userResponse.Rol
      };
      
      if (!userData.id || !userData.rol) {
        throw new Error("Faltan datos esenciales del usuario");
      }
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      login(userData);
      navigate("/layout/dashboard");
    } catch (err) {
      let errorMessage = "Error al iniciar sesión";
      
      if (err.message.includes("Failed to fetch")) {
        errorMessage = "Error de conexión con el servidor";
      } else if (err.message.includes("401") || err.message.includes("Credenciales")) {
        errorMessage = "Credenciales incorrectas. Por favor verifica tu email y contraseña.";
      } else {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      console.error("Error detallado:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Wrapper>
      <div className="card">
        <div className="card2">
          <form className="form" onSubmit={handleLogin}>
            <p id="heading">Login</p>

            {error && <p className="text-red">{error}</p>}

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
            {touched.email && errors.email && <p className="text-red">El correo es requerido.</p>}

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
            {touched.password && errors.password && <p className="text-red">La contraseña es requerida.</p>}

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
            
            {/* Enlace de ayuda */}
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
  }

  .text-red {
    color: red;
    text-align: center;
    margin-bottom: 0.5em;
  }

  .field {
    display: flex;
    align-items: center;
    gap: 0.5em;
    background-color: #171717;
    padding: 0.6em 1em;
    border-radius: 25px;
    box-shadow: inset 2px 5px 10px rgb(5, 5, 5);
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
    color: #d3d3d3;
    font-size: 1em;
  }

  .btn {
    display: flex;
    justify-content: center;
    margin-top: 1.5em;
  }

  .button1 {
    padding: 0.6em 2em;
    border-radius: 5px;
    border: none;
    background-color: #252525;
    color: white;
    font-size: 1em;
    transition: background 0.3s;
    cursor: pointer;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 36px;
  }

  .button1:hover {
    background-color: black;
  }

  .button1:disabled {
    background-color: #3a3a3a;
    cursor: not-allowed;
    opacity: 0.7;
  }

  /* Spinner para estado de carga */
  .spinner {
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
  }

  /* Enlace de ayuda */
  .help-link {
    text-align: center;
    margin-top: 1rem;
    a {
      color: #00ff75;
      text-decoration: none;
      font-size: 0.9em;
      &:hover {
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