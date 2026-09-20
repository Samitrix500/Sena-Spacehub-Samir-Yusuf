// App.tsx
// Enrutamiento principal: rutas públicas (login), rutas protegidas por
// autenticación (dashboard, equipos, préstamos) y protegidas además por rol
// (creación/edición/eliminación de equipos, solo Administrador).
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import MainLayout from './layouts/MainLayout/MainLayout';

import LoginPage from './pages/LoginPage/LoginPage';
import ForbiddenPage from './pages/ForbiddenPage/ForbiddenPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import EquiposPage from './pages/EquiposPage/EquiposPage';
import NuevoEquipoPage from './pages/NuevoEquipoPage/NuevoEquipoPage';
import DetalleEquipoPage from './pages/DetalleEquipoPage/DetalleEquipoPage';
import PrestamosPage from './pages/PrestamosPage/PrestamosPage';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/403" element={<ForbiddenPage />} />

        {/* Rutas que solo requieren estar autenticado */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/equipos" element={<EquiposPage />} />
            <Route path="/prestamos" element={<PrestamosPage />} />

            {/* Rutas restringidas además por rol: solo Administrador */}
            <Route element={<ProtectedRoute requiredRole="Administrador" />}>
              <Route path="/equipos/nuevo" element={<NuevoEquipoPage />} />
              <Route path="/equipos/:placaSena" element={<DetalleEquipoPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}
