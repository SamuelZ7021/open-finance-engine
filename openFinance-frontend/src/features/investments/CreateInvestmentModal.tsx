// src/features/investments/CreateInvestmentModal.tsx
import React, { useState } from 'react';
import { useInvestmentStore } from '../../store/useInvestmentStore';
import { X, Save, TrendingUp } from 'lucide-react';

interface CreateInvestmentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateInvestmentModal: React.FC<CreateInvestmentModalProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        symbol: '',
        name: '',
        type: 'Stock',
        quantity: '' as any,
        price: '' as any
    });

    const { addInvestment, isLoading } = useInvestmentStore();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.symbol || !formData.name || !formData.quantity || !formData.price) return;

        await addInvestment({
            symbol: formData.symbol,
            name: formData.name,
            type: formData.type,
            quantity: Number(formData.quantity),
            price: Number(formData.price)
        });

        // Reset and Close
        setFormData({
            symbol: '',
            name: '',
            type: 'Stock',
            quantity: '',
            price: ''
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl animate-scale-in">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <TrendingUp className="text-emerald-600" size={24} />
                        Registrar Inversión
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-800 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Símbolo / Ticker</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ej: AAPL"
                                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all uppercase"
                                    value={formData.symbol}
                                    onChange={e => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Tipo</label>
                                <select
                                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-slate-800 outline-none focus:border-emerald-500"
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="Stock">Acciones</option>
                                    <option value="Bond">Bonos</option>
                                    <option value="Real Estate">Bienes Raíces</option>
                                    <option value="Crypto">Criptomonedas</option>
                                    <option value="Fund">Fondos de Inv.</option>
                                    <option value="Other">Otro</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Nombre del Activo</label>
                            <input
                                type="text"
                                required
                                placeholder="Ej: Apple Inc."
                                className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Cantidad</label>
                                <input
                                    type="number"
                                    required
                                    min="0.00000001"
                                    step="any"
                                    placeholder="0.00"
                                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-emerald-500 outline-none transition-all"
                                    value={formData.quantity}
                                    onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Precio Unitario ($)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="any"
                                    placeholder="0.00"
                                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-emerald-500 outline-none transition-all"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                        </div>

                        {formData.quantity && formData.price && (
                            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 flex justify-between items-center text-sm">
                                <span className="text-emerald-700 font-medium">Total Estimado:</span>
                                <span className="text-emerald-800 font-bold text-lg">
                                    ${(Number(formData.quantity) * Number(formData.price)).toLocaleString()}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 font-semibold transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 transition-all"
                        >
                            <Save size={18} />
                            {isLoading ? 'Guardando...' : 'Registrar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
