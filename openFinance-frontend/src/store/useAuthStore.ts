// src/store/useAuthStore.ts
import { create } from 'zustand';
import apiClient from '../api/axiosClient';
import type { User } from '../types/User';

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  setAccessToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isInitializing: true, // Empezamos en true para que los Guards esperen
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await apiClient.post('/api/v1/auth/login', credentials);
      set({
        accessToken: data.accessToken,
        user: data.user,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error de autenticación',
        isLoading: false
      });
      throw error;
    }
  },

  checkAuth: async () => {
    try {
      // El backend debe responder con un nuevo accessToken si la cookie refresh_token es válida
      const { data } = await apiClient.post('/api/v1/auth/refresh');
      set({
        accessToken: data.accessToken,
        user: data.user,
        isAuthenticated: true,
        isInitializing: false
      });
    } catch {
      set({ accessToken: null, user: null, isAuthenticated: false, isInitializing: false });
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      // Llamar al backend para invalidar la sesión
      await apiClient.post('/api/v1/auth/logout');
    } catch (error) {
      // Incluso si falla, limpiamos el estado local
      console.error('Error al logout:', error);
    } finally {
      set({
        accessToken: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitializing: false
      });
    }
  },

  register: async (email: string, password: string, fullName: string) => {
    set({ isLoading: true, error: null });
    try {
      // Enviamos email y password como espera el backend
      await apiClient.post('/api/v1/auth/register', { email, password, fullName });
      set({ isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Error en el registro'
      });
      throw error;
    }
  },

  setAccessToken: (token) => set({ accessToken: token, isAuthenticated: !!token })
}));