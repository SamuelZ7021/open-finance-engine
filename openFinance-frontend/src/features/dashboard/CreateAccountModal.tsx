import React, { useState } from 'react';
import { useAccountStore } from '../../store/useAccountStore';
import { useAlert } from '../../hooks/useAlert';
import { X, Plus, Loader2 } from 'lucide-react';

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateAccountModal: React.FC<CreateAccountModalProps> = ({ isOpen, onClose }) => {
  const { createAccount, isLoading } = useAccountStore();
  const { success, error: showError } = useAlert();
  const [accountNumber, setAccountNumber] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Force LIABILITY type for user accounts to fix balance logic
      await createAccount({
        accountNumber: accountNumber,
        type: 'LIABILITY'
      });
      success('Cuenta creada', `Cuenta ${accountNumber} creada correctamente`);
      setAccountNumber('');
      onClose();
    } catch (err: any) {
      showError('Error', err.message || 'No se pudo crear la cuenta');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Plus size={24} className="text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">Nueva Cuenta</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Número de Cuenta</label>
            <input
              type="text"
              required
              placeholder="ej: 1234567890"
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Creando...
              </>
            ) : (
              <>
                <Plus size={20} />
                Crear CuentaPersonal
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
