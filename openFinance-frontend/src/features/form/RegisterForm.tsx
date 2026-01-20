// src/features/form/RegisterForm.tsx
import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useAlert } from '../../hooks/useAlert';
import {
  Mail, Loader2, Building2, Briefcase,
  Palette, ArrowRight, ArrowLeft, Check, Lock, Eye, EyeOff, AlertTriangle
} from 'lucide-react';

export const RegisterForm = ({ onSwitchToLogin }: { onSwitchToLogin: () => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    industry: 'fintech',
    primaryColor: '#10b981'
  });

  const [showPassword, setShowPassword] = useState(false);
  const { register, isLoading, error } = useAuthStore();
  const { success } = useAlert();
  const [localError, setLocalError] = useState<string | null>(null);

  const industries = [
    { value: 'fintech', label: 'Fintech / Banca' },
    { value: 'retail', label: 'Retail / Comercio' },
    { value: 'logistics', label: 'Logística' },
    { value: 'software', label: 'Software / SaaS' },
    { value: 'other', label: 'Otro' }
  ];

  const themeColors = [
    { value: '#2563eb', label: 'Azul Corporativo' },
    { value: '#059669', label: 'Verde Finanzas' },
    { value: '#7c3aed', label: 'Violeta Innovación' },
    { value: '#db2777', label: 'Rosa Moderno' },
    { value: '#ea580c', label: 'Naranja Energía' },
    { value: '#0f172a', label: 'Negro Clásico' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalError(null);
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    // Manual Validation
    if (step === 1) {
      if (!formData.email) {
        setLocalError('El correo es obligatorio');
        return;
      }
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setLocalError('El formato del correo es inválido');
        return;
      }
      if (!formData.password || formData.password.length < 6) {
        setLocalError('La contraseña debe tener al menos 6 caracteres');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setLocalError('Las contraseñas no coinciden');
        return;
      }
    }

    if (step === 2) {
      if (!formData.companyName) {
        setLocalError('El nombre de la empresa es obligatorio');
        return;
      }
    }

    setStep(s => s + 1);
  };

  const handleBack = () => {
    setStep(s => s - 1);
    setLocalError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData.email, formData.password, formData.companyName);
      success('Empresa Registrada', 'Bienvenido a OpenFinance Enterprise.');
      setTimeout(onSwitchToLogin, 1500);
    } catch (err) {
      // Error is handled in store
    }
  };

  const progress = (step / 3) * 100;

  return (
    <div className="w-full animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Alta Corporativa</h2>
        <p className="mt-2 text-slate-500">Configura tu entorno empresarial en 3 pasos.</p>

        {/* Progress Bar */}
        <div className="mt-6 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <form onSubmit={step === 3 ? handleSubmit : handleNext} className="space-y-6" noValidate>
        {(error || localError) && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium animate-fade-in">
            <AlertTriangle size={16} /> {error || localError}
          </div>
        )}

        {/* STEP 1: CREDENTIALS */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in-right">
            <div className="group space-y-2">
              <label className="text-sm font-medium text-slate-700 ml-1">Correo de Administrador</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                <input
                  name="email" type="email"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-slate-900 placeholder-slate-400 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  placeholder="admin@empresa.com"
                  value={formData.email} onChange={handleChange}
                />
              </div>
            </div>

            <div className="group space-y-2">
              <label className="text-sm font-medium text-slate-700 ml-1">Contraseña Maestra</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                <input
                  name="password" type={showPassword ? "text" : "password"}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-12 text-slate-900 placeholder-slate-400 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  placeholder="••••••••"
                  value={formData.password} onChange={handleChange}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="group space-y-2">
              <label className="text-sm font-medium text-slate-700 ml-1">Confirmar Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                <input
                  name="confirmPassword" type="password"
                  className={`w-full rounded-xl border bg-white py-3.5 pl-12 pr-4 text-slate-900 placeholder-slate-400 outline-none focus:ring-1 transition-all ${formData.confirmPassword && formData.password !== formData.confirmPassword
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500'
                    : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500'
                    }`}
                  placeholder="••••••••"
                  value={formData.confirmPassword} onChange={handleChange}
                />
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-rose-500 ml-1">Las contraseñas no coinciden</p>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: COMPANY DETAILS */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in-right">
            <div className="group space-y-2">
              <label className="text-sm font-medium text-slate-700 ml-1">Nombre de la Empresa</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                <input
                  name="companyName" type="text"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-slate-900 placeholder-slate-400 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  placeholder="Acme Corp"
                  value={formData.companyName} onChange={handleChange}
                />
              </div>
            </div>

            <div className="group space-y-2">
              <label className="text-sm font-medium text-slate-700 ml-1">Industria</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                <select
                  name="industry"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-slate-900 placeholder-slate-400 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all appearance-none"
                  value={formData.industry} onChange={handleChange}
                >
                  {industries.map(ind => (
                    <option key={ind.value} value={ind.value}>{ind.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: VISUAL IDENTITY */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in-right">
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700 ml-1 flex items-center gap-2">
                <Palette size={16} /> Color Corporativo
              </label>
              <p className="text-xs text-slate-500">Selecciona el color principal para tu panel de control.</p>

              <div className="grid grid-cols-3 gap-3">
                {themeColors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, primaryColor: color.value })}
                    className={`group relative h-12 rounded-lg border transition-all ${formData.primaryColor === color.value
                      ? 'border-slate-800 ring-2 ring-offset-2 ring-offset-white ring-slate-200'
                      : 'border-transparent hover:scale-105 shadow-sm'
                      }`}
                    style={{ backgroundColor: color.value }}
                  >
                    {formData.primaryColor === color.value && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="text-white drop-shadow-md" size={20} />
                      </div>
                    )}
                    <span className="sr-only">{color.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs text-slate-500 uppercase font-bold mb-2">Vista Previa</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shadow-sm" style={{ backgroundColor: formData.primaryColor }}>
                  {formData.companyName.charAt(0) || "A"}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{formData.companyName || "Tu Empresa"}</p>
                  <p className="text-xs text-slate-500">Administrador</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-2">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3.5 font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
            >
              <ArrowLeft size={18} /> Atrás
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="flex-[2] flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 font-bold text-white hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              step === 3 ? "Finalizar Registro" : <>Siguiente <ArrowRight size={18} /></>
            )}
          </button>
        </div>
      </form>

      <div className="text-center mt-6">
        <p className="text-slate-500 text-sm">
          ¿Ya tienes cuenta?{' '}
          <button onClick={onSwitchToLogin} className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors ml-1">
            Iniciar Sesión
          </button>
        </p>
      </div>
    </div>
  );
};