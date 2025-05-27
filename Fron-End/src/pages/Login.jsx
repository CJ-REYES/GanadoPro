import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EnvelopeIcon, LockClosedIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });
  const navigate = useNavigate();

  const validate = () => {
    return {
      email: email.trim() === "",
      password: password.trim() === "",
    };
  };

  const errors = validate();
  const isFormValid = !errors.email && !errors.password;

  const handleLogin = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setError("");

    if (!isFormValid) return; // no enviar si hay errores

    try {
      const response = await fetch("http://localhost:5201/api/Users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/layout"); // redirigir al dashboard
      } else {
        setError(data.message || "Error al iniciar sesión");
      }
    } catch (err) {
      console.error(err);
      setError("No se pudo conectar con el servidor");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-lg max-w-md w-full p-8"
        noValidate
      >
        <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">
          Iniciar Sesión
        </h2>

        {error && (
          <p className="flex items-center justify-center text-red-600 mb-6 font-medium">
            <ExclamationCircleIcon className="w-5 h-5 mr-2" />
            {error}
          </p>
        )}

        {/* Email */}
        <label className="block mb-2 text-gray-700 font-medium" htmlFor="email">
          Correo electrónico
        </label>
        <div
          className={`flex items-center border rounded-md mb-6 px-3 py-2 transition
            ${
              touched.email && errors.email
                ? "border-red-500"
                : "border-gray-300 focus-within:border-blue-500"
            }
          `}
        >
          <EnvelopeIcon className="w-5 h-5 text-gray-400 mr-2" />
          <input
            id="email"
            type="email"
            placeholder="tu@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
            className="w-full outline-none text-gray-800 placeholder-gray-400"
          />
        </div>
        {touched.email && errors.email && (
          <p className="text-red-500 text-sm mb-4">El correo es requerido.</p>
        )}

        {/* Password */}
        <label className="block mb-2 text-gray-700 font-medium" htmlFor="password">
          Contraseña
        </label>
        <div
          className={`flex items-center border rounded-md mb-8 px-3 py-2 transition
            ${
              touched.password && errors.password
                ? "border-red-500"
                : "border-gray-300 focus-within:border-blue-500"
            }
          `}
        >
          <LockClosedIcon className="w-5 h-5 text-gray-400 mr-2" />
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
            className="w-full outline-none text-gray-800 placeholder-gray-400"
          />
        </div>
        {touched.password && errors.password && (
          <p className="text-red-500 text-sm mb-4">La contraseña es requerida.</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition"
          disabled={!isFormValid}
        >
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;
