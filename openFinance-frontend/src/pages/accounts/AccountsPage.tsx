import { useEffect, useState } from 'react';
import { DashboardLayout } from '../../layout/DashboardLayout';
import { AccountCard } from '../../features/dashboard/AccountCard';
import { CreateAccountModal } from '../../features/dashboard/CreateAccountModal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useAlert } from '../../hooks/useAlert';
import { useAccountStore } from '../../store/useAccountStore';
import { Plus, Trash2 } from 'lucide-react';

const AccountsPage = () => {
  const { accounts, fetchAccounts, isLoading, deleteAccount } = useAccountStore();
  const { success, error } = useAlert();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleDeleteClick = (id: string) => {
    setAccountToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!accountToDelete) return;
    setIsDeleting(true);
    try {
      await deleteAccount(accountToDelete);
      success('Cuenta eliminada', 'La cuenta ha sido eliminada correctamente');
      setIsDeleteDialogOpen(false);
      setAccountToDelete(null);
    } catch (err: any) {
      error('Error', err.message || 'No se pudo eliminar la cuenta');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading && accounts.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <div className="inline-block p-4 bg-blue-500/10 rounded-full animate-pulse mb-4">
              <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            </div>
            <p className="text-slate-400">Cargando cuentas...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-black">Mis Cuentas</h1>
            <p className="text-slate-600 mt-2 text-lg">Gestiona todas tus cuentas financieras</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3 rounded-xl font-semibold transition-all"
          >
            <Plus size={20} />
            Nueva Cuenta
          </button>
        </div>

        {/* Grid de Cuentas */}
        {accounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-slate-900/40 border border-slate-800 rounded-2xl">
            <p className="text-black mb-4 text-lg">No tienes cuentas creadas aún</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg transition-all"
            >
              <Plus size={20} />
              Crear primera cuenta
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((account) => (
              <div key={account.id} className="relative group">
                <AccountCard
                  accountNumber={account.accountNumber}
                  balance={account.balance}
                  type="Cuenta"
                  history={[]}
                />
                {/* Overlay con acciones */}
                <div className="absolute inset-0 bg-black/60 rounded-3xl opacity-0 group-hover:opacity-90 transition-opacity flex items-center justify-center gap-3">
                  <button
                    onClick={() => handleDeleteClick(account.id)}
                    className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-3 py-2 rounded-lg transition-all text-sm"
                    title="Eliminar cuenta"
                  >
                    <Trash2 size={16} />
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Resumen de Cuentas */}
        {accounts.length > 0 && (
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Resumen General</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 rounded-xl p-4">
                <p className="text-slate-400 text-sm">Total de Cuentas</p>
                <p className="text-2xl font-bold text-white mt-2">{accounts.length}</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4">
                <p className="text-slate-400 text-sm">Saldo Total</p>
                <p className="text-2xl font-bold text-emerald-400 mt-2">
                  ${accounts.reduce((sum, acc) => sum + acc.balance, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4">
                <p className="text-slate-400 text-sm">Promedio por Cuenta</p>
                <p className="text-2xl font-bold text-blue-400 mt-2">
                  ${(accounts.reduce((sum, acc) => sum + acc.balance, 0) / accounts.length).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4">
                <p className="text-slate-400 text-sm">Total Transacciones</p>
                <p className="text-2xl font-bold text-purple-400 mt-2">
                  {accounts.reduce((sum, acc) => sum + (acc.transactions?.length || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <CreateAccountModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Eliminar cuenta"
        message="¿Estás seguro de que deseas eliminar esta cuenta? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        isDestructive
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </DashboardLayout>
  );
};

export default AccountsPage;
