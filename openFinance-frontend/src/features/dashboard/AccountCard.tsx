import React, { useState } from 'react';
import { useUIStore } from '../../store/useUIStore';
import { CreditCard, Check, Copy } from 'lucide-react';
import { type AccountType } from '../../types/AccountType';
import { type Account } from '../../types/account';

interface AccountCardProps {
  account?: Account;
  accountNumber?: string;
  balance?: number;
  type?: string | AccountType;
  history?: Array<{ value: number }>;
  accountType?: AccountType;
  trend?: number;
  isPrivate?: boolean;
}

export const AccountCard: React.FC<AccountCardProps> = ({
  account,
  accountNumber,
  balance,
  type,
  accountType,
  isPrivate
}) => {
  const { isPrivacyMode } = useUIStore();
  const effectivePrivacy = isPrivate ?? isPrivacyMode;

  // Normalize props
  const finalAccountNumber = account?.accountNumber ?? accountNumber ?? '••••';
  const finalBalance = account?.balance ?? balance ?? 0;
  const finalType = accountType ?? type ?? 'Cuenta';

  const [copied, setCopied] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatAccountNumber = (num: string) => {
    if (!num) return '•••• •••• ••••';
    const parts = num.match(/.{1,4}/g);
    return parts ? parts.join(' ') : num;
  };

  const copyToClipboard = () => {
    if (finalAccountNumber) {
      navigator.clipboard.writeText(finalAccountNumber).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className={`relative p-6 rounded-2xl border transition-all duration-300 group overflow-hidden ${effectivePrivacy
        ? 'bg-slate-50 border-slate-200'
        : 'bg-white border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-emerald-900/5 hover/-translate-y-1'
      }`}>

      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
        <div className="h-24 w-24 rounded-full bg-emerald-500 blur-2xl"></div>
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
            <CreditCard size={20} />
          </div>
          <button
            onClick={copyToClipboard}
            className="text-slate-400 hover:text-emerald-600 transition-colors p-1"
            title="Copiar número"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>

        <div className="space-y-1 mb-4">
          <p className="text-sm font-medium text-slate-500">{finalType}</p>
          <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
            {effectivePrivacy ? '•••• •••• ••••' : formatCurrency(finalBalance)}
          </h3>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs font-mono text-slate-400 tracking-wider">
            {effectivePrivacy ? '** ** ' + finalAccountNumber.slice(-4) : formatAccountNumber(finalAccountNumber)}
          </p>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">Activa</span>
          </div>
        </div>
      </div>
    </div>
  );
};