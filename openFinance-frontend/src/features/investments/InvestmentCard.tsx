// src/features/investments/InvestmentCard.tsx
import React from 'react';
import type { Investment } from '../../store/useInvestmentStore';
import { TrendingUp, TrendingDown, Calendar, Briefcase } from 'lucide-react';

interface InvestmentCardProps {
    investment: Investment;
}

export const InvestmentCard: React.FC<InvestmentCardProps> = ({ investment }) => {
    const isPositive = investment.roi >= 0;

    return (
        <div className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition-all hover:bg-slate-900 hover:shadow-lg hover:shadow-blue-900/10 hover:-translate-y-1">

            {/* Status Indicator */}
            <div className={`absolute top-0 right-0 h-16 w-16 -translate-y-8 translate-x-8 rotate-45 transform ${isPositive ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`} />

            <div className="flex items-start justify-between mb-4">
                <div className="flex gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-white transition-colors">
                        <Briefcase size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg">{investment.name}</h3>
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider bg-slate-800/50 px-2 py-0.5 rounded border border-slate-700/50">
                            {investment.type}
                        </span>
                    </div>
                </div>

                <div className={`flex items-center gap-1 text-sm font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {Math.abs(investment.roi).toFixed(2)}%
                </div>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Valor Actual</p>
                        <p className="text-xl font-bold text-white tracking-tight">
                            ${investment.currentValue.toLocaleString()}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Inversión Inicial</p>
                        <p className="text-sm font-semibold text-slate-300">
                            ${investment.amountInvested.toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-800/50 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>Inicio: {new Date(investment.startDate).toLocaleDateString()}</span>
                    </div>
                    <span className={investment.status === 'Active' ? 'text-emerald-500' : 'text-slate-500'}>
                        • {investment.status === 'Active' ? 'Activo' : 'Cerrado'}
                    </span>
                </div>
            </div>
        </div>
    );
};
