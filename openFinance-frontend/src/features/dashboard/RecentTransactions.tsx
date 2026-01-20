import React from 'react';
import { ArrowUpRight, ArrowDownLeft, ArrowRightLeft } from 'lucide-react';
import { type Transaction } from '../../types/Transaction';

interface Props {
  transactions: Transaction[];
}

export const RecentTransactions: React.FC<Props> = ({ transactions }) => {
  // const { isPrivacyMode } = useUIStore(); // Unused in this simplified light theme version

  if (transactions.length === 0) {
    return (
      <div className="text-center py-10 px-4">
        <div className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
          <ArrowRightLeft className="text-slate-300" size={20} />
        </div>
        <p className="text-slate-400 text-sm font-medium">Sin movimientos recientes</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all cursor-default border border-transparent hover:border-slate-100"
        >
          <div className="flex items-center gap-3">
            <div className={`
              h-10 w-10 rounded-full flex items-center justify-center border
              ${tx.amount > 0
                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                : 'bg-rose-50 text-rose-600 border-rose-100'
              }
            `}>
              {tx.amount > 0 ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
            </div>

            <div className="flex flex-col">
              <span className="text-[15.5px] font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
                {tx.description || 'Transferencia'}
              </span>
              <span className="text-[12px] text-slate-400 font-medium">
                {new Date(tx.timestamp).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className={`text-sm font-bold tracking-tight ${tx.amount > 0 ? 'text-emerald-600' : 'text-slate-800'
            }`}>
            {tx.amount > 0 ? '+' : ''}
            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(tx.amount)}
          </div>
        </div>
      ))}
    </div>
  );
};