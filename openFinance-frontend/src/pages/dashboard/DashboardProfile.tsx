import { useEffect, useState } from 'react';
import { DashboardLayout } from '../../layout/DashboardLayout';
import { useAccountStore } from '../../store/useAccountStore';
import { useUIStore } from '../../store/useUIStore';
import { RecentTransactions } from '../../features/dashboard/RecentTransactions';
import { User, Calendar, TrendingUp, Wallet, Activity } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export const DashboardProfile = () => {
  const { accounts, fetchAccounts, isLoading } = useAccountStore();
  const { isPrivacyMode } = useUIStore();
  const [stats, setStats] = useState({
    totalAccounts: 0,
    totalBalance: 0,
    totalTransactions: 0,
    averageBalance: 0,
    lastTransaction: null as string | null
  });

  const { user } = useAuthStore();

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  useEffect(() => {
    const totalAccounts = accounts.length;
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const totalTransactions = accounts.reduce((sum, acc) => sum + (acc.transactions?.length || 0), 0);
    const averageBalance = totalAccounts > 0 ? totalBalance / totalAccounts : 0;

    const allTransactions = accounts
      .flatMap(acc => acc.transactions || [])
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const lastTransaction = allTransactions.length > 0
      ? new Date(allTransactions[0].timestamp).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      : null;

    setStats({
      totalAccounts,
      totalBalance,
      totalTransactions,
      averageBalance,
      lastTransaction
    });
  }, [accounts]);

  const formatAmount = (amount: number) => {
    if (isPrivacyMode) return '••,•••.••';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (isLoading && accounts.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <div className="inline-block p-4 bg-blue-500/10 rounded-full animate-pulse mb-4">
              <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            </div>
            <p className="text-slate-400">Cargando perfil...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-5xl font-bold text-black mb-2">Mi Perfil</h1>
          <p className="text-slate-700 text-lg">Resumen de tu información financiera</p>
        </div>

        {/* Tarjeta de Perfil del Usuario */}
        <div className=" bg-slate-900 border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-colors rounded-2xl p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
                <User className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{user?.fullName || 'Usuario'}</h2>
                <p className="text-slate-400 text-sm mt-1">Miembro desde {new Date().getFullYear()}</p>
              </div>
            </div>
          </div>

          {/* Estadísticas de Perfil */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-blue-500/20">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white text-sm">
                <Wallet className="w-4 h-4" />
                <span>Cuentas</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats.totalAccounts}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>Saldo Total</span>
              </div>
              <p className="text-2xl font-bold text-emerald-400">{formatAmount(stats.totalBalance)}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white text-sm">
                <Activity className="w-4 h-4" />
                <span>Transacciones</span>
              </div>
              <p className="text-2xl font-bold text-purple-400">{stats.totalTransactions}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white text-sm">
                <Calendar className="w-4 h-4" />
                <span>Última Tx</span>
              </div>
              <p className="text-sm font-semibold text-blue-400/95">
                {stats.lastTransaction || 'Sin transacciones'}
              </p>
            </div>
          </div>
        </div>

        {/* Estadísticas por Cuenta */}
        <div>
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-black flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
              Detalles de Cuentas
            </h3>
            <p className="text-black mt-2 text-lg">Análisis individual de cada cuenta</p>
          </div>

          {accounts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-slate-900/40 border border-slate-800 rounded-2xl">
              <p className="text-black mb-4">No tienes cuentas creadas aún</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accounts.map((acc) => {
                const accountTransactions = acc.transactions || [];
                // Sort by timestamp (descending)
                const sortedTxs = accountTransactions
                  .slice()
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

                const recentTxs = sortedTxs.slice(0, 10);

                let runningBalance = acc.balance;
                const balanceHistory = [runningBalance];

                // Calculate history backwards from current balance
                for (const tx of recentTxs) {
                  // If CREDIT (Income), it increased balance, so previous was less: minus
                  // If DEBIT (Expense), it decreased balance, so previous was more: plus
                  if (tx.category === 'CREDIT') {
                    runningBalance -= tx.amount;
                  } else {
                    runningBalance += tx.amount;
                  }
                  balanceHistory.unshift(runningBalance);
                }

                return (
                  <div key={acc.id} className="bg-slate-900 border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-colors rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-sm">Cuenta</p>
                        <p className="text-xl font-bold text-white">{acc.accountNumber}</p>
                      </div>
                      <div className="px-3 py-1 bg-slate-800 rounded-full text-xs font-semibold text-slate-300">
                        {acc.accountNumber}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-white text-xs uppercase tracking-wider">Saldo Actual</p>
                      <p className="text-2xl font-bold text-emerald-400">{formatAmount(acc.balance)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-white text-xs uppercase tracking-wider">Transacciones</p>
                      <p className="text-lg font-semibold text-white">{accountTransactions.length} movimientos</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Últimas Transacciones */}
        {accounts.length > 0 && (
          <div>
            <div className="mb-6">
              <h3 className="text-3xl font-bold text-black flex items-center gap-2">
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                Actividad Reciente
              </h3>
              <p className="text-slate-700 mt-2 text-lg">Últimos movimientos en todas tus cuentas</p>
            </div>
            <RecentTransactions
              transactions={accounts
                .flatMap(acc => acc.transactions || [])
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .slice(0, 10)
              }
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};