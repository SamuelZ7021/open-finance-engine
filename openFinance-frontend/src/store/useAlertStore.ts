import { create } from 'zustand';
import type { AlertType } from '../components/ui/Alert';

export interface AlertState {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  autoCloseDuration?: number;
}

interface AlertStoreState {
  alerts: AlertState[];
  addAlert: (alert: Omit<AlertState, 'id'>) => string;
  removeAlert: (id: string) => void;
  clearAlerts: () => void;
}

export const useAlertStore = create<AlertStoreState>((set) => ({
  alerts: [],

  addAlert: (alert) => {
    const id = Date.now().toString();
    set((state) => ({
      alerts: [...state.alerts, { ...alert, id }]
    }));
    return id;
  },

  removeAlert: (id) => {
    set((state) => ({
      alerts: state.alerts.filter((alert) => alert.id !== id)
    }));
  },

  clearAlerts: () => {
    set({ alerts: [] });
  }
}));
