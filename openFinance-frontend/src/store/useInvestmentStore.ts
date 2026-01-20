// src/store/useInvestmentStore.ts
import { create } from 'zustand';
import apiClient from '../api/axiosClient';

export interface Investment {
    id: string;
    symbol: string;
    name: string;
    type: string;
    quantity: number;
    averagePrice: number;
    currentPrice: number;

    // Computed for UI
    amountInvested: number;
    currentValue: number;
    roi: number; // Percentage
    status: 'Active' | 'Closed';
    startDate: string;
}

interface InvestmentState {
    investments: Investment[];
    isLoading: boolean;
    error: string | null;

    fetchInvestments: () => Promise<void>;
    addInvestment: (data: {
        symbol: string;
        name: string;
        type: string;
        quantity: number;
        price: number;
    }) => Promise<void>;
}

export const useInvestmentStore = create<InvestmentState>((set, get) => ({
    investments: [],
    isLoading: false,
    error: null,

    fetchInvestments: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await apiClient.get<any[]>('/api/investments');

            // Map Backend Entity to Frontend Interface
            const mappedInvestments: Investment[] = data.map(item => {
                const amountInvested = item.quantity * item.averagePrice;
                const currentValue = item.quantity * item.currentPrice;
                const profit = currentValue - amountInvested;
                const roi = amountInvested > 0 ? (profit / amountInvested) * 100 : 0;

                return {
                    id: item.id,
                    symbol: item.symbol,
                    name: item.name,
                    type: item.type,
                    quantity: item.quantity,
                    averagePrice: item.averagePrice,
                    currentPrice: item.currentPrice,

                    amountInvested,
                    currentValue,
                    roi,
                    status: item.quantity > 0 ? 'Active' : 'Closed',
                    startDate: item.lastUpdated // Simplified for now
                };
            });

            set({ investments: mappedInvestments, isLoading: false });
        } catch (error: any) {
            console.error('Error fetching investments:', error);
            set({
                error: error.response?.data?.message || 'Error al cargar inversiones',
                isLoading: false
            });
        }
    },

    addInvestment: async (investmentData) => {
        set({ isLoading: true, error: null });
        try {
            await apiClient.post('/api/investments/buy', {
                symbol: investmentData.symbol,
                name: investmentData.name,
                type: investmentData.type,
                quantity: investmentData.quantity,
                price: investmentData.price // Using price as entry price
            });

            // Refresh list
            await get().fetchInvestments();
        } catch (error: any) {
            console.error('Error adding investment:', error);
            set({
                error: error.response?.data?.message || 'Error al registrar inversión',
                isLoading: false
            });
            throw error;
        }
    }
}));
