import { create } from 'zustand';
import apiClient from '../api/axiosClient';

export interface BalancePoint {
    month: string;
    value: number;
}

export interface MonthlyFlow {
    month: string;
    income: number;
    expenses: number;
}

interface AnalyticsState {
    balanceHistory: BalancePoint[];
    monthlyFlows: MonthlyFlow[];
    isLoading: boolean;
    error: string | null;

    fetchAnalytics: () => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
    balanceHistory: [],
    monthlyFlows: [],
    isLoading: false,
    error: null,

    fetchAnalytics: async () => {
        set({ isLoading: true, error: null });
        try {
            const [balanceRes, flowsRes] = await Promise.all([
                apiClient.get<BalancePoint[]>('/api/analytics/balance-history'),
                apiClient.get<MonthlyFlow[]>('/api/analytics/income-vs-expenses')
            ]);

            set({
                balanceHistory: balanceRes.data,
                monthlyFlows: flowsRes.data,
                isLoading: false
            });
        } catch (error: any) {
            console.error('Error fetching analytics:', error);
            set({
                error: error.response?.data?.message || 'Error al cargar analíticas',
                isLoading: false
            });
        }
    }
}));
