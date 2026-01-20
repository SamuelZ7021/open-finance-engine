import apiClient from "../api/axiosClient";
import { type Account } from '../types/account';

export const accountService = {
    getAccountSumary: async (): Promise<Account[]> => {
        const { data } = await apiClient.get<Account[]>('/api/v1/accounts');
        return data;
    },

    async getAccountDetails(id: string): Promise<Account> {
        const { data } = await apiClient.get<Account>(`/api/v1/accounts/${id}`);
        return data;
    },

    transferFunds: async (transferData: { sourceAccountId: string; targetAccountNumber: string; amount: number; description: string }): Promise<void> => {
        await apiClient.post('/api/v1/transfers/number', transferData);
    },

    createAccount: async (accountData: { accountNumber: string; type?: string }): Promise<Account> => {
        const { data } = await apiClient.post<Account>('/api/v1/accounts', accountData);
        return data;
    },

    deleteAccount: async (id: string): Promise<void> => {
        await apiClient.delete(`/api/v1/accounts/${id}`);
    }
};

