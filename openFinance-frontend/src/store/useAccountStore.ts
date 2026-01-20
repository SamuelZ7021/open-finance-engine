// src/store/useAccountStore.ts
import { create } from 'zustand';
import { type Account } from '../types/account';
import { accountService } from '../services/accountService';

interface AccountState {
  accounts: Account[];
  isLoading: boolean;
  error: string | null;
  fetchAccounts: () => Promise<void>;
  refreshAccounts: () => Promise<void>;
  executeTransfer: (data: { sourceAccountId: string; targetAccountNumber: string; amount: number; description: string }) => Promise<void>;
  createAccount: (accountData: { accountNumber: string; type?: string }) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
}

export const useAccountStore = create<AccountState>((set, get) => ({
  accounts: [],
  isLoading: false,
  error: null,

  refreshAccounts: async () => {
    // Background refresh without setting isLoading
    try {
      const data = await accountService.getAccountSumary();
      set({ accounts: data });
    } catch (err: any) {
      // Slient fail or log to console, don't disrupt UI with error state for background sync
      console.error('Background sync failed:', err);
    }
  },

  fetchAccounts: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await accountService.getAccountSumary();
      set({ accounts: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  executeTransfer: async (transferData: { sourceAccountId: string; targetAccountNumber: string; amount: number; description: string }) => {
    set({ isLoading: true, error: null });
    try {
      await accountService.transferFunds(transferData);
      // Refrescar las cuentas después de transferir
      await get().fetchAccounts();
      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  createAccount: async (accountData) => {
    set({ isLoading: true, error: null });
    try {
      await accountService.createAccount(accountData);
      // Refrescar las cuentas después de crear una nueva
      await get().fetchAccounts();
      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  deleteAccount: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await accountService.deleteAccount(id);
      // Refrescar las cuentas después de eliminar
      await get().fetchAccounts();
      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },
}));