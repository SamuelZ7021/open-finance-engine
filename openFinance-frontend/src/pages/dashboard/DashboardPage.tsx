import { useEffect, useMemo, useState } from 'react';
import { DashboardLayout } from '../../layout/DashboardLayout';
import { AccountCard } from '../../features/dashboard/AccountCard';
import { RecentTransactions } from '../../features/dashboard/RecentTransactions';
import { CreateAccountModal } from '../../features/dashboard/CreateAccountModal';
import { TransferModal } from '../../features/dashboard/TransferModal';
import { useAccountStore } from '../../store/useAccountStore';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { BalanceEvolutionChart } from '../../features/dashboard/charts/BalanceEvolutionChart';
import { IncomeVsExpensesChart } from '../../features/dashboard/charts/IncomeVsExpensesChart';
import { Plus, ArrowRightLeft, Radio, ArrowRight, Loader2 } from 'lucide-react';

const DashboardPage = () => {
  const { accounts, fetchAccounts, refreshAccounts, isLoading } = useAccountStore();
  const { fetchAnalytics } = useAnalyticsStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  useEffect(() => {
    fetchAccounts();
    fetchAnalytics();
    const interval = setInterval(() => {
      refreshAccounts();
      fetchAnalytics(); // Poll analytics too if desired, or skip
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchAccounts, refreshAccounts, fetchAnalytics]);

  // Guidelines: ... remainder of component
  // Sorting transactions
  const globalTransactions = useMemo(() => {
    return accounts
      .flatMap(acc => (acc.transactions || []).map(tx => ({ ...tx, accountId: acc.id })))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 6);
  }, [accounts]);

  if (isLoading && accounts.length === 0) {
    return <DashboardLoadingState />;
  }

  return (
    <DashboardLayout>
      {/* System Status / Alerts Banner */}
      <div className="mb-8 p-5 bg-white border border-slate-100 rounded-2xl flex items-center justify-between shadow-sm animate-fade-in">
        <div className="flex items-center gap-4">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <Radio className="animate-pulse" size={20} />
            <span className="absolute top-2 right-2 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Sistema Conectado</h3>
            <p className="text-xs text-slate-500 mt-0.5">Sincronización en tiempo real: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
        <div className="hidden sm:block">
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-slate-50 text-slate-500 border border-slate-200">v3.0 Light</span>
        </div>
      </div>

      {/* Header Actions */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Panel General</h1>
          <p className="text-slate-500 text-sm mt-1">Visión global de liquidez y movimientos</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsTransferModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-200 active:scale-95"
          >
            <ArrowRightLeft size={18} />
            Transferir
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl font-bold text-sm border border-slate-200 transition-all active:scale-95 shadow-sm"
          >
            <Plus size={18} />
            Nueva Cuenta
          </button>
        </div>
      </div>

      {/* Charts Section (New) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
        <BalanceEvolutionChart />
        <IncomeVsExpensesChart />
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Column: Accounts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Cuentas Activas</h2>
            {accounts.length > 0 && (
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">{accounts.length} Total</span>
            )}
          </div>

          {accounts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white border border-dashed border-slate-200 rounded-2xl">
              <p className="text-slate-400 text-sm mb-4 font-medium">No hay cuentas configuradas</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="text-emerald-600 hover:text-emerald-500 text-sm font-bold flex items-center gap-1"
              >
                Configurar ahora <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {accounts.map((acc) => (
                <div key={acc.id} className="transition-all hover:-translate-y-1">
                  <AccountCard
                    accountNumber={acc.accountNumber}
                    balance={acc.balance}
                    type="Cuenta Corporativa"
                    history={[]}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Column: Recent Activity */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-800">Últimos Movimientos</h2>
          <div className="bg-white rounded-2xl border border-slate-100 p-1 shadow-sm">
            <RecentTransactions transactions={globalTransactions} />
          </div>

          <button className="w-full py-3 rounded-xl border border-slate-200 text-slate-500 text-sm font-bold hover:bg-slate-50 hover:text-slate-700 transition-all bg-white">
            Ver reporte completo
          </button>
        </div>
      </div>

      <CreateAccountModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      <TransferModal isOpen={isTransferModalOpen} onClose={() => setIsTransferModalOpen(false)} />
    </DashboardLayout>
  );
};

const DashboardLoadingState = () => (
  <div className="flex h-screen items-center justify-center bg-slate-50 animate-fade-in">
    <div className="space-y-4 text-center">
      <Loader2 className="h-10 w-10 text-emerald-600 animate-spin mx-auto" />
      <p className="text-slate-500 text-sm font-medium animate-pulse">Cargando entorno...</p>
    </div>
  </div>
);

export default DashboardPage;