import React, { useState } from 'react';
import { 
  X, 
  Flame, 
  Mail, 
  Lock, 
  User, 
  Sparkles, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEMO_MEMBERS } from '../lib/seedData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { 
    loginWithGoogle, 
    loginWithEmail, 
    registerWithEmail, 
    loginAsDemoMember 
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await loginWithEmail(email, password);
      } else {
        if (!name.trim()) {
          throw new Error('Por favor, indica tu nombre completo');
        }
        await registerWithEmail(email, password, name);
      }
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error en la autenticación';
      if (msg.includes('auth/invalid-credential') || msg.includes('auth/wrong-password')) {
        setErrorMsg('Credenciales incorrectas. Verifica tu email y contraseña.');
      } else if (msg.includes('auth/email-already-in-use')) {
        setErrorMsg('Este correo ya está registrado. Prueba a iniciar sesión.');
      } else if (msg.includes('auth/weak-password')) {
        setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      } else if (msg.includes('auth/operation-not-allowed')) {
        setErrorMsg('Email/Password requiere ser activado en Firebase. Puedes usar Google o el acceso Demo para probar.');
      } else {
        setErrorMsg(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al conectar con Google';
      if (!msg.includes('popup-closed-by-user')) {
        setErrorMsg('Error de autenticación con Google. Prueba con el acceso demo rápido.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div 
        className="bg-[#171A21] border border-[#2D333F] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-[#FF5E00] flex items-center justify-center text-[#0F1115]">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="font-display text-lg font-bold text-[#F8FAFC]">
                PORTAL KINETIC
              </span>
              <p className="text-[10px] text-[#94A3B8]">
                Autenticación Segura de Socios
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#1F242D] text-[#94A3B8] hover:text-[#F8FAFC] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle: Iniciar Sesión vs Registro */}
        <div className="flex p-1 rounded-xl bg-[#1F242D] border border-[#2D333F]">
          <button
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-display font-bold uppercase tracking-wider rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-[#FF5E00] text-[#0F1115] shadow-md'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => {
              setMode('register');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-display font-bold uppercase tracking-wider rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-[#FF5E00] text-[#0F1115] shadow-md'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            Nuevo Registro
          </button>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/50 text-red-400 text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl bg-[#1F242D] hover:bg-[#2A303C] border border-[#2D333F] text-xs font-semibold text-[#F8FAFC] flex items-center justify-center space-x-2 transition-all active:scale-95"
        >
          {/* Google Color G icon */}
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continuar con Google</span>
        </button>

        <div className="flex items-center space-x-2">
          <div className="h-px bg-[#2D333F] flex-1" />
          <span className="text-[10px] uppercase font-bold text-[#94A3B8]">
            o con tu correo
          </span>
          <div className="h-px bg-[#2D333F] flex-1" />
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="text-[11px] font-bold text-[#94A3B8] uppercase block mb-1">
                Nombre y Apellidos
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                  type="text"
                  required
                  placeholder="Ej: Marcos Gómez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#1F242D] border border-[#2D333F] rounded-lg text-xs text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#FF5E00]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold text-[#94A3B8] uppercase block mb-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input
                type="email"
                required
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#1F242D] border border-[#2D333F] rounded-lg text-xs text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#FF5E00]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#94A3B8] uppercase block mb-1">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#1F242D] border border-[#2D333F] rounded-lg text-xs text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#FF5E00]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#FF5E00] hover:bg-[#ff6e1a] text-[#0F1115] font-display text-sm font-bold uppercase tracking-wider glow-ignite transition-all active:scale-95 flex items-center justify-center space-x-1"
          >
            <span>{loading ? 'Procesando...' : mode === 'login' ? 'Acceder al Box' : 'Crear Ficha de Socio'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast-Login Section */}
        <div className="pt-3 border-t border-[#2D333F] space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold uppercase tracking-wider text-[#94A3B8] flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-[#84CC16]" />
              <span>Acceso Rápido con Socio Demo</span>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {DEMO_MEMBERS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  loginAsDemoMember(m.id);
                  onClose();
                }}
                className="p-2 rounded-lg bg-[#1F242D] hover:bg-[#2A303C] border border-[#2D333F] text-center transition-colors group"
              >
                <img
                  src={m.avatarUrl}
                  alt={m.name}
                  className="w-7 h-7 rounded-full object-cover mx-auto ring-1 ring-[#FF5E00]/40 group-hover:scale-105 transition-transform"
                />
                <p className="text-[10px] font-bold text-[#F8FAFC] truncate mt-1">
                  {m.name.split(' ')[0]}
                </p>
                <p className="text-[9px] font-mono text-[#84CC16]">
                  {m.membershipNumber}
                </p>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
