// src/guards/PublicRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

/**
 * Guard para rutas públicas (Login/Register).
 * Si el usuario ya está logueado, lo redirige al dashboard.
 */
export const PublicRoute: React.FC = () => {
  const { accessToken } = useAuthStore();

  if (accessToken) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};