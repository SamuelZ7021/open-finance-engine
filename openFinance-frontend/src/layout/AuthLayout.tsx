// src/layouts/AuthLayout.tsx
import React from 'react';
import type { ReactNode } from 'react';

import { ShieldCheck } from 'lucide-react';

interface AuthLayoutProps {
    children: ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
    children
}) => {
    return (
        <div className="min-h-screen flex bg-slate-50 animate-fade-in font-sans selection:bg-emerald-100 selection:text-emerald-900">

            {/* Branding Section (Left) - Hidden on mobile */}
            <div className="hidden lg:flex flex-col justify-between w-[45%] bg-slate-900 p-12 relative overflow-hidden">
                {/* Background Patterns */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="h-12 w-12 bg-emerald-600 rounded-xl flex items-center justify-center font-bold text-2xl text-white shadow-xl shadow-emerald-900/20">
                            OF.
                        </div>
                        <span className="text-2xl font-bold text-white tracking-tight">OpenFinance</span>
                    </div>

                    <div className="space-y-6 max-w-md">
                        <h1 className="text-5xl font-bold text-white leading-tight">
                            Gestiona tu futuro financiero.
                        </h1>
                        <p className="text-lg text-slate-400">
                            La plataforma empresarial definitiva para el control total de tus activos, inversiones y liquidez corporativa.
                        </p>
                    </div>
                </div>

                {/* Footer / Trust Indicators */}
                {/* <div className="relative z-10 flex items-center gap-8">
                    <div>
                        <p className="text-3xl font-bold text-white">99.9%</p>
                        <p className="text-sm text-slate-500 font-medium">Uptime Garantizado</p>
                    </div>
                    <div className="h-10 w-px bg-slate-800"></div>
                    <div>
                        <p className="text-3xl font-bold text-white">+50k</p>
                        <p className="text-sm text-slate-500 font-medium">Empresas Activas</p>
                    </div>
                </div> */}
            </div>

            {/* Form Section (Right) */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 relative">
                <div className="w-full max-w-[480px]">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
                        <div className="h-10 w-10 bg-emerald-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg">
                            OF.
                        </div>
                    </div>

                    {children}

                    {/* Security Badge */}
                    <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 opacity-60 hover:opacity-100 transition-opacity">
                        <ShieldCheck size={16} />
                        <span className="text-xs font-semibold tracking-wide">ENCRIPTACIÓN DE NIVEL BANCARIO</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
