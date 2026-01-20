import React from 'react';
import { useUIStore } from '../../store/useUIStore';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import type { Account } from '../../types/account';

interface AccountAnalyticsProps {
  accounts: Account[];
}

export const AccountAnalytics: React.FC<AccountAnalyticsProps> = ({ accounts }) => {
  const { isPrivacyMode } = useUIStore();

  // Calcular totales
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalTransactions = accounts.reduce((sum, acc) => sum + (acc.transactions?.length || 0), 0);

  // Calcular ingresos y gastos
  const { totalIncome, totalExpenses } = accounts.reduce(
    (acc, account) => {
      const txs = account.transactions || [];
      const income = txs
        .filter(tx => tx.category === 'CREDIT')
        .reduce((sum, tx) => sum + tx.amount, 0);
      const expenses = txs
        .filter(tx => tx.category === 'DEBIT')
        .reduce((sum, tx) => sum + tx.amount, 0);
      return {
        totalIncome: acc.totalIncome + income,
        totalExpenses: acc.totalExpenses + expenses
      };
    },
    { totalIncome: 0, totalExpenses: 0 }
  );

  const netBalance = totalIncome - totalExpenses;

  const formatAmount = (amount: number) => {
    if (isPrivacyMode) return '••,•••.••';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Balance */}
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/20 border border-blue-500/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-700 text-sm font-semibold uppercase">Saldo Total</h3>
            <DollarSign size={20} className="text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-blue-400">{formatAmount(totalBalance)}</p>
          <p className="text-sm text-slate-700 mt-2">{accounts.length} cuenta(s) activa(s)</p>
        </div>

        {/* Net Balance */}
        <div className={`bg-gradient-to-br ${netBalance >= 0 ? 'from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20' : 'from-rose-500/10 to-rose-600/5 border border-rose-500/20'} rounded-2xl p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-700 text-sm font-semibold uppercase">Balance Neto</h3>
            {netBalance >= 0 ? (
              <TrendingUp size={20} className="text-emerald-500" />
            ) : (
              <TrendingDown size={20} className="text-rose-500" />
            )}
          </div>
          <p className={`text-3xl font-bold ${netBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatAmount(netBalance)}
          </p>
          <p className="text-sm text-slate-600 mt-2">
            {totalTransactions} transacción(es)
          </p>
        </div>

        {/* Ingresos */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-700 text-sm font-semibold uppercase">Ingresos</h3>
            <TrendingUp size={20} className="text-emerald-500" />
          </div>
          <p className="text-3xl font-bold text-emerald-400">{formatAmount(totalIncome)}</p>
          <p className="text-sm text-slate-600 mt-2">Este período</p>
        </div>

        {/* Gastos */}
        <div className="bg-gradient-to-br from-rose-500/10 to-rose-600/5 border border-rose-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-700 text-sm font-semibold uppercase">Gastos</h3>
            <TrendingDown size={20} className="text-rose-500" />
          </div>
          <p className="text-3xl font-bold text-rose-400">{formatAmount(totalExpenses)}</p>
          <p className="text-sm text-slate-600 mt-2">Este período</p>
        </div>
      </div>

      {/* Detalles por Cuenta */}
      {accounts.length > 0 && (
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Detalles por Cuenta</h3>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {accounts.map((account) => {
              const accountBalance = account.balance;
              const accountTxs = account.transactions || [];
              return (
                <div key={account.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors">
                  <div>
                    <p className="text-white font-medium">Cuenta {account.accountNumber.slice(-4)}</p>
                    <p className="text-sm text-slate-300">{accountTxs.length} transacciones</p>
                  </div>
                  <p className="text-white font-semibold">{formatAmount(accountBalance)}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
