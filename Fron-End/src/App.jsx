// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from '@/components/Layout';
import DashboardPage from '@/pages/DashboardPage';
import GanadoPage from '@/pages/GanadoPage';
import OrdenesVentaPage from '@/pages/OrdenesVentaPage';
import CompradoresPage from '@/pages/CompradoresPage';
import ProductoresPage from '@/pages/ProductoresPage';
import ExportacionPage from '@/pages/ExportacionPage';
import Login from '@/pages/Login';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AuthProvider } from '@/context/AuthContext';
import RanchoPage from './pages/RanchoPage';
import LotesPage from './pages/LotesPage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route 
          path="/layout" 
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Business', 'User']}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route 
            index 
            element={<Navigate to="/layout/dashboard" replace />} 
          />
          
          <Route 
            path="dashboard" 
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Business', 'User']}>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="ganado" 
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Business']}>
                <GanadoPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="Lotes" 
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Business','User']}>
                <LotesPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="Ranchos" 
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Business', 'User']}>
                <RanchoPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="ordenes-venta" 
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Business']}>
                <OrdenesVentaPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="compradores" 
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Business']}>
                <CompradoresPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="productores" 
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Business']}>
                <ProductoresPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="exportacion" 
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Business']}>
                <ExportacionPage />
              </ProtectedRoute>
            } 
          />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {/* ToastContainer para mostrar notificaciones */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </AuthProvider>
  );
}

export default App;