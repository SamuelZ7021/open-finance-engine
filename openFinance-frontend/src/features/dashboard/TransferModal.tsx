import React, { useState } from 'react';
import { useAccountStore } from '../../store/useAccountStore';
import { useAlert } from '../../hooks/useAlert';
import { Send, X, Loader2 } from 'lucide-react';

export const TransferModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { accounts, executeTransfer, isLoading } = useAccountStore();
  const { success, warning } = useAlert();
  const [formData, setFormData] = useState({
    sourceAccountId: '',
    targetAccountNumber: '',
    amount: '',
    description: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!formData.sourceAccountId) {
      warning('Validación', 'Selecciona una cuenta de origen');
      return;
    }
    if (!formData.targetAccountNumber) {
      warning('Validación', 'Ingresa el Número de Cuenta destino');
      return;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      warning('Validación', 'Ingresa un monto válido');
      return;
    }
    if (!formData.description.trim()) {
      warning('Validación', 'Ingresa una descripción');
      return;
    }

    try {
      await executeTransfer({
        sourceAccountId: formData.sourceAccountId,
        targetAccountNumber: formData.targetAccountNumber,
        amount: parseFloat(formData.amount),
        description: formData.description
      });
      success('Transferencia completada', `Transferencia de $${parseFloat(formData.amount).toLocaleString()} realizada exitosamente`);
      // Limpiar formulario y cerrar
      setFormData({ sourceAccountId: '', targetAccountNumber: '', amount: '', description: '' });
      onClose();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al procesar la transferencia';
      warning('Error', errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">Nueva Transferencia</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Cuenta de Origen</label>
            <select
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              value={formData.sourceAccountId}
              onChange={(e) => setFormData({ ...formData, sourceAccountId: e.target.value })}
            >
              <option value="">Selecciona una cuenta</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.accountNumber} - Bal: ${acc.balance.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Cuenta Destino (Número)</label>
            <input
              required
              placeholder="Ej: 1234567890"
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              value={formData.targetAccountNumber}
              onChange={(e) => setFormData({ ...formData, targetAccountNumber: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Monto</label>
              <input
                type="number"
                required
                step="0.01"
                placeholder="0.00"
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Descripción</label>
              <input
                required
                placeholder="ej: Pago de servicios"
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Procesando...
              </>
            ) : (
              <>
                <Send size={20} />
                Confirmar Transferencia
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};