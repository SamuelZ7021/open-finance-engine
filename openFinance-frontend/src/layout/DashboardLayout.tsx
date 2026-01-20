// src/layouts/DashboardLayout.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUIStore } from '../store/useUIStore';
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, LogOut, LayoutDashboard, CreditCard, PieChart, Menu, X, TrendingUp, User } from 'lucide-react';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isPrivacyMode, togglePrivacy } = useUIStore();
  const logout = useAuthStore(state => state.logout);
  const user = useAuthStore(state => state.user); // Assuming user is available in auth store
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const navItems = [
    { icon: <LayoutDashboard size={22} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <CreditCard size={22} />, label: 'Mis Cuentas', path: '/accounts' },
    { icon: <TrendingUp size={22} />, label: 'Inversiones', path: '/investments' },
    { icon: <PieChart size={22} />, label: 'Análisis', path: '/analytics' },
    { icon: <User size={22} />, label: 'Configuración', path: '/dashboard/profile' }
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 w-full z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-emerald-600 rounded-lg flex items-center justify-center font-bold text-white shadow-md shadow-emerald-200">
              OF.
            </div>
            <span className="font-bold text-slate-800">OpenFinance</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={togglePrivacy}
            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all"
          >
            {isPrivacyMode ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </header>

      {/* Sidebar: Desktop (Icon Only) & Mobile (Full) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white transition-all duration-300
        ${isMobileMenuOpen ? 'w-64' : 'w-0 lg:w-20 overflow-hidden'}
      `}>
        <div className="flex h-20 items-center justify-center border-b border-slate-100">
          <div className="h-10 w-10 bg-emerald-600 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-emerald-600/20">
            OF.
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-2 p-3 mt-4">
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              active={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                setIsMobileMenuOpen(false);
              }}
              showLabel={isMobileMenuOpen}
            />
          ))}
        </nav>

        <div className="p-3 mb-4">
          <button
            onClick={handleLogout}
            className="group relative flex w-full items-center justify-center rounded-xl p-3 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all border border-transparent hover:border-rose-100"
          >
            <LogOut size={22} />
            {/* Tooltip for Logout */}
            <div className="absolute left-full ml-4 hidden whitespace-nowrap rounded-lg bg-slate-800 px-2 py-1 text-xs font-semibold text-white shadow-xl group-hover:block lg:group-hover:block z-50">
              Cerrar Sesión
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`
        container mx-auto flex-1 transition-all duration-300 min-h-screen
        ${isMobileMenuOpen ? 'lg:pl-64' : 'lg:pl-20'} 
        pt-20 lg:pt-8 px-4 lg:px-10 pb-10
      `}>
        {/* Desktop Header (Privacy + Profile) */}
        <div className="hidden lg:flex justify-end items-center mb-8 gap-4">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-200">
            <span className="text-xs font-medium text-slate-500">Modo Privacidad</span>
            <button
              onClick={togglePrivacy}
              className={`
                relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
                ${isPrivacyMode ? 'bg-emerald-500' : 'bg-slate-200'}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm
                  ${isPrivacyMode ? 'translate-x-4' : 'translate-x-0.5'}
                `}
              />
            </button>
          </div>

          <div className="h-10 w-10 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold shadow-sm cursor-pointer"
          onClick={(_DashboardProfile) => navigate('/dashboard/profile')}>
            {user?.fullName?.charAt(0) || 'U'}
                  
          </div>
        </div>

        {children}
      </main>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  showLabel?: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active = false, showLabel = false, onClick }) => (
  <button
    onClick={onClick}
    className={`group relative flex items-center ${showLabel ? 'justify-start px-4 gap-3' : 'justify-center'} w-full p-3 rounded-xl cursor-pointer transition-all border ${active
        ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm font-semibold'
        : 'text-slate-400 border-transparent hover:bg-slate-50 hover:text-slate-600'
      }`}
  >
    <div className="relative z-10">{icon}</div>

    {/* Text Label (Mobile Menu) */}
    <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${showLabel ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
      }`}>
      {label}
    </span>

    {/* Tooltip for Desktop (Icon Only) */}
    {!showLabel && (
      <div className="absolute left-full ml-4 hidden whitespace-nowrap rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white shadow-xl group-hover:block z-50 animate-in fade-in slide-in-from-left-2">
        {label}
        {/* Arrow */}
        <div className="absolute left-0 top-1/2 -ml-1 -mt-1 h-2 w-2 -rotate-45 border-l border-t border-slate-700 bg-slate-800" />
      </div>
    )}
  </button>
);

export default DashboardLayout;