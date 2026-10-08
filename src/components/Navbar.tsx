import React, { useState } from 'react';
import { 
  Flame, 
  QrCode, 
  User as UserIcon, 
  LogOut, 
  ChevronDown, 
  Bell, 
  RotateCcw,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGym } from '../context/GymContext';
import { DEMO_MEMBERS } from '../lib/seedData';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenAccessPass: () => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenAuth, 
  onOpenAccessPass,
  currentTab,
  setCurrentTab
}) => {
  const { userProfile, isDemoMode, loginAsDemoMember, logout } = useAuth();
  const { userBookings, resetDemoData } = useGym();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-[#0F1115]/90 backdrop-blur-md border-b border-[#2D333F]">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand & Logo */}
        <div 
          onClick={() => setCurrentTab('clases')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF5E00] to-[#E04F00] flex items-center justify-center shadow-lg shadow-[#FF5E00]/25 group-hover:scale-105 transition-transform">
            <Flame className="w-6 h-6 text-[#0F1115] fill-current" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-display text-xl font-bold tracking-wider text-[#F8FAFC]">
                KINETIC
              </span>
              <span className="font-display text-xl font-bold tracking-wider text-[#FF5E00]">
                PERFORMANCE
              </span>
            </div>
            <div className="flex items-center space-x-2 text-[10px] uppercase tracking-wider text-[#94A3B8]">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#84CC16] animate-pulse"></span>
              <span>Box Abierto • 06:00 - 22:30</span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1">
          <button
            onClick={() => setCurrentTab('clases')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentTab === 'clases'
                ? 'bg-[#1F242D] text-[#FF5E00] border border-[#2D333F]'
                : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#171A21]'
            }`}
          >
            Clases & WODs
          </button>
          <button
            onClick={() => setCurrentTab('reservas')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${
              currentTab === 'reservas'
                ? 'bg-[#1F242D] text-[#FF5E00] border border-[#2D333F]'
                : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#171A21]'
            }`}
          >
            Mis Reservas
            {userBookings.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#84CC16] text-[#0F1115]">
                {userBookings.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setCurrentTab('cuota')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentTab === 'cuota'
                ? 'bg-[#1F242D] text-[#FF5E00] border border-[#2D333F]'
                : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#171A21]'
            }`}
          >
            Cuota & Planes
          </button>
          <button
            onClick={() => setCurrentTab('perfil')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentTab === 'perfil'
                ? 'bg-[#1F242D] text-[#FF5E00] border border-[#2D333F]'
                : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#171A21]'
            }`}
          >
            Mi Perfil
          </button>
        </nav>

        {/* Right Action Icons: QR Pass + User Avatar */}
        <div className="flex items-center space-x-3">
          
          {/* Quick QR Access Pass for Gym Turnstile */}
          <button
            onClick={onOpenAccessPass}
            title="Pase digital para torno"
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#1F242D] hover:bg-[#2A303C] border border-[#2D333F] text-[#F8FAFC] text-xs font-semibold transition-colors active:scale-95"
          >
            <QrCode className="w-4 h-4 text-[#84CC16]" />
            <span className="hidden sm:inline font-mono">TORNO</span>
          </button>

          {/* User Profile / Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center space-x-2.5 p-1 sm:px-2.5 sm:py-1 rounded-lg bg-[#171A21] hover:bg-[#1F242D] border border-[#2D333F] transition-all"
            >
              <img
                src={
                  userProfile?.avatarUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                }
                alt="Avatar socio"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#FF5E00]/40"
              />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-[#F8FAFC] leading-tight max-w-[120px] truncate">
                  {userProfile?.name || 'Socio'}
                </p>
                <p className="text-[10px] text-[#84CC16] font-mono leading-tight">
                  {userProfile?.membershipNumber || 'KP-0842'}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
            </button>

            {/* Dropdown Menu */}
            {showUserDropdown && (
              <div 
                className="absolute right-0 mt-2 w-72 rounded-xl bg-[#171A21] border border-[#2D333F] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Active user header */}
                <div className="p-3 rounded-lg bg-[#1F242D] border border-[#2D333F]/50 mb-2">
                  <div className="flex items-center space-x-3">
                    <img
                      src={userProfile?.avatarUrl || ''}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-[#FF5E00]"
                    />
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-[#F8FAFC] truncate">
                        {userProfile?.name}
                      </p>
                      <p className="text-xs text-[#94A3B8] truncate">
                        {userProfile?.email}
                      </p>
                      <div className="mt-1 flex items-center space-x-1.5">
                        <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[#FF5E00]/20 text-[#FF5E00]">
                          {userProfile?.planName || 'Plan Activo'}
                        </span>
                        <span className="text-[10px] text-[#84CC16] font-mono">
                          {userProfile?.membershipNumber}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="space-y-1 mb-2">
                  <button
                    onClick={() => {
                      setCurrentTab('perfil');
                      setShowUserDropdown(false);
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs text-[#F8FAFC] hover:bg-[#1F242D] transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-[#38BDF8]" />
                    <span>Ver Mi Perfil y Récords PR</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentTab('cuota');
                      setShowUserDropdown(false);
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs text-[#F8FAFC] hover:bg-[#1F242D] transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#84CC16]" />
                    <span>Gestionar Mi Cuota</span>
                  </button>
                </div>

                {/* Demo Switcher for testing */}
                <div className="pt-2 border-t border-[#2D333F]">
                  <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1.5 flex items-center justify-between">
                    <span>Cambiar de Socio Demo:</span>
                    <Sparkles className="w-3 h-3 text-[#FF5E00]" />
                  </p>
                  <div className="space-y-1">
                    {DEMO_MEMBERS.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => {
                          loginAsDemoMember(m.id);
                          setShowUserDropdown(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                          userProfile?.id === m.id
                            ? 'bg-[#FF5E00]/20 text-[#FF5E00] font-semibold'
                            : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1F242D]'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <img
                            src={m.avatarUrl}
                            alt={m.name}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span>{m.name}</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#84CC16]">
                          {m.membershipNumber}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reseed / Reset data option */}
                <div className="pt-2 mt-2 border-t border-[#2D333F]">
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      setShowResetConfirm(true);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1F242D] transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Recargar Clases y Calendario</span>
                  </button>
                </div>

                {/* Auth trigger */}
                <div className="pt-2 mt-2 border-t border-[#2D333F] space-y-1">
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onOpenAuth();
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold text-[#FF5E00] hover:bg-[#FF5E00]/10 transition-colors"
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>Iniciar Sesión / Registrar Nuevo Socio</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      logout();
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#171A21] border border-[#2D333F] rounded-2xl p-6 max-w-sm w-full space-y-4">
            <h3 className="font-display text-lg font-bold text-[#F8FAFC] uppercase">
              Recargar Datos de Ejemplo
            </h3>
            <p className="text-xs text-[#94A3B8]">
              Esto regenerará la parrilla de clases semanales y planes en Firestore con horarios frescos para los próximos días.
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 rounded-lg bg-[#1F242D] text-xs font-semibold text-[#F8FAFC] hover:bg-[#2A303C]"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  setShowResetConfirm(false);
                  await resetDemoData();
                }}
                className="flex-1 py-2 rounded-lg bg-[#FF5E00] text-xs font-display font-bold uppercase text-[#0F1115] hover:brightness-110"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
