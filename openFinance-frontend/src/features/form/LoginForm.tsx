// src/components/auth/LoginForm.tsx
import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';

export const LoginForm = ({ onSwitchToRegister }: { onSwitchToRegister: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isLoading, error: authError } = useAuthStore();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    // Custom Validation
    if (!email) {
      setLocalError('El correo corporativo es obligatorio');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setLocalError('Por favor ingrese un correo válido');
      return;
    }
    if (!password) {
      setLocalError('La contraseña es obligatoria');
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email, password });
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  const error = localError || authError;
  const loading = isLoading || isSubmitting;

  return (
    <div className="w-full animate-fade-in-up">
      <div className="mb-8 text-center sm:text-left">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Bienvenido</h2>
        <p className="text-slate-500 mt-2">Accede a tu panel empresarial</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 ml-1">
            Correo Corporativo
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`block w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium ${localError && localError.includes('correo') ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20' : ''
                }`}
              placeholder="nombre@empresa.com"
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center ml-1">
            <label className="text-sm font-semibold text-slate-700">Contraseña</label>
            <button type="button" className="text-xs font-medium text-emerald-600 hover:text-emerald-500">
              ¿Olvidaste tu contraseña?
            </button>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`block w-full pl-11 pr-12 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium ${localError && localError.includes('contraseña') ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20' : ''
                }`}
              placeholder="••••••••"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              disabled={loading}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-start gap-3 animate-shake">
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
            <p className="text-sm text-rose-700 font-medium">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-emerald-600/20 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Verificando...
            </span>
          ) : (
            'Acceder al Panel'
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-slate-500 text-sm">
          ¿No tienes una cuenta corporativa?{' '}
          <button
            onClick={onSwitchToRegister}
            disabled={loading}
            className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors"
          >
            Registrar Empresa
          </button>
        </p>
      </div>
    </div>
  );
};