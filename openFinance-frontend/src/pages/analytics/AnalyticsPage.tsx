import { useEffect } from 'react';
import { DashboardLayout } from '../../layout/DashboardLayout';
import { AccountAnalytics } from '../../features/dashboard/AccountAnalytics';
import { useAccountStore } from '../../store/useAccountStore';

const AnalyticsPage = () => {
  const { accounts, fetchAccounts, isLoading } = useAccountStore();

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  if (isLoading && accounts.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <div className="inline-block p-4 bg-blue-500/10 rounded-full animate-pulse mb-4">
              <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            </div>
            <p className="text-slate-400">Cargando análisis...</p>
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
          <h1 className="text-4xl font-bold text-black">Análisis Financiero</h1>
          <p className="text-slate-600 mt-2 text-lg">Visualiza tu panorama financiero completo</p>
        </div>

        {/* Analytics */}
        {accounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-slate-900/40 border border-slate-800 rounded-2xl">
            <p className="text-black text-lg">No hay datos para analizar</p>
            <p className="text-slate-500 mt-2">Crea tu primera cuenta para ver análisis detallados</p>
          </div>
        ) : (
          <AccountAnalytics accounts={accounts} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
