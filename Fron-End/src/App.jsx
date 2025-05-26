
    import React from 'react';
    import { Routes, Route } from 'react-router-dom';
    import Layout from '@/components/Layout';
    import DashboardPage from '@/pages/DashboardPage';
    import GanadoPage from '@/pages/GanadoPage';
    import CorralesPage from '@/pages/CorralesPage';
    import OrdenesVentaPage from '@/pages/OrdenesVentaPage';
    import CompradoresPage from '@/pages/CompradoresPage';
    import ProductoresPage from '@/pages/ProductoresPage';
    import ExportacionPage from '@/pages/ExportacionPage';
    import { Toaster } from '@/components/ui/toaster';

    function App() {
      return (
        <>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<DashboardPage />} />
              <Route path="ganado" element={<GanadoPage />} />
              <Route path="corrales" element={<CorralesPage />} />
              <Route path="ordenes-venta" element={<OrdenesVentaPage />} />
              <Route path="compradores" element={<CompradoresPage />} />
              <Route path="productores" element={<ProductoresPage />} />
              <Route path="exportacion" element={<ExportacionPage />} />
            </Route>
          </Routes>
          <Toaster />
        </>
      );
    }

    export default App;
  