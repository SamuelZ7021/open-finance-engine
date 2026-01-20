// src/pages/investments/InvestmentsPage.tsx
import { useEffect, useState, useMemo } from 'react';
import { DashboardLayout } from '../../layout/DashboardLayout';
import { useInvestmentStore } from '../../store/useInvestmentStore';
import { InvestmentCard } from '../../features/investments/InvestmentCard';
import { CreateInvestmentModal } from '../../features/investments/CreateInvestmentModal';
import { Plus, TrendingUp, PieChart, DollarSign } from 'lucide-react';

const InvestmentsPage = () => {
    const { investments, fetchInvestments, isLoading } = useInvestmentStore();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        fetchInvestments();
    }, [fetchInvestments]);

    const stats = useMemo(() => {
        const totalInvested = investments.reduce((acc, curr) => acc + curr.amountInvested, 0);
        const currentValue = investments.reduce((acc, curr) => acc + curr.currentValue, 0);
        const totalProfit = currentValue - totalInvested;
        const roi = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

        return { totalInvested, currentValue, totalProfit, roi };
    }, [investments]);

    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-emerald-500 tracking-tight">Portafolio de Inversiones</h1>
                    <p className="text-black mt-1 text-lg">Gestión de activos corporativos y rendimiento</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
                >
                    <Plus size={20} />
                    Nueva Inversión
                </button>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <DollarSign size={80} className="text-emerald-500" />
                    </div>
                    <p className="text-slate-400 text-sm font-medium mb-1">Valor Total del Portafolio</p>
                    <h2 className="text-3xl font-bold text-slate-100">${stats.currentValue.toLocaleString()}</h2>
                    <div className="flex items-center gap-2 mt-4 text-sm">
                        <span className="text-slate-500">Invertido: ${stats.totalInvested.toLocaleString()}</span>
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp size={80} className="text-blue-500" />
                    </div>
                    <p className="text-slate-400 text-sm font-medium mb-1">Rendimiento Global (ROI)</p>
                    <h2 className={`text-3xl font-bold ${stats.roi >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {stats.roi >= 0 ? '+' : ''}{stats.roi.toFixed(2)}%
                    </h2>
                    <div className="flex items-center gap-2 mt-4 text-sm">
                        <span className={stats.totalProfit >= 0 ? 'text-emerald-500' : 'text-rose-500'}>
                            {stats.totalProfit >= 0 ? '+' : '-'}${Math.abs(stats.totalProfit).toLocaleString()}
                        </span>
                        <span className="text-slate-500">Ganancia/Pérdida</span>
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <PieChart size={80} className="text-purple-500" />
                    </div>
                    <p className="text-slate-400 text-sm font-medium mb-1">Activos Totales</p>
                    <h2 className="text-3xl font-bold text-white">{investments.length}</h2>
                    <div className="flex items-center gap-2 mt-4 text-sm">
                        <span className="text-purple-400">Diversificación activa</span>
                    </div>
                </div>
            </div>

            {/* Investments Grid */}
            <h3 className="text-2xl font-bold text-emerald-500 mb-4">Activos en Cartera</h3>

            {isLoading ? (
                <div className="text-center py-20">
                    <p className="text-emerald-500 animate-pulse">Cargando portafolio...</p>
                </div>
            ) : investments.length === 0 ? (
                <div className="flex items-center justify-around p-16 bg-slate-200 border-slate-800 rounded-3xl">
                    <div className="h-16 w-16 rounded-full flex items-center justify-center mb-4 text-slate-500">
                        <TrendingUp size={100} color="#059669"/>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                    <h3 className="text-emerald-500 font-bold text-5xl mb-7">Comienza a Invertir</h3>
                    <p className="text-black text-center max-w-sm mb-6 text-1xl">
                        Registra tus activos corporativos aquí para llevar un control detallado del ROI y valorización.
                    </p>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold transition-all"
                    >
                        Registrar Primera Inversión
                    </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in-up">
                    {investments.map(inv => (
                        <InvestmentCard key={inv.id} investment={inv} />
                    ))}
                </div>
            )}

            <CreateInvestmentModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
        </DashboardLayout>
    );
};

export default InvestmentsPage;
