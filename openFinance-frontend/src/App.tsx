// src/App.tsx
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { ProtectedRoute } from './guards/ProtectedRoute';
import { PublicRoute } from './guards/PublicRoute';
import DashboardPage from './pages/dashboard/DashboardPage';
import { DashboardProfile } from './pages/dashboard/DashboardProfile';
import AccountsPage from './pages/accounts/AccountsPage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import InvestmentsPage from './pages/investments/InvestmentsPage';
import AuthPage from './pages/auth/AuthPage';
import AlertContainer from './components/AlertContainer';

export function App() {
  const checkAuth = useAuthStore(state => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <AlertContainer />
      <Routes>
        {/* Agrupamos rutas que requieren que el usuario NO esté logueado */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
        </Route>

        {/* Agrupamos rutas que requieren autenticación */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/profile" element={<DashboardProfile />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/investments" element={<InvestmentsPage />} />
          {/* Redirección por defecto dentro del área protegida */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Fallback global */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}