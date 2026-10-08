import React, { useState } from 'react';
import { 
  User, 
  Trophy, 
  Flame, 
  ShieldCheck, 
  Phone, 
  Mail, 
  Calendar, 
  Edit3, 
  Sparkles, 
  LogOut, 
  Save, 
  X,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEMO_MEMBERS } from '../lib/seedData';

interface ProfileScreenProps {
  onGoToMembership: () => void;
  onOpenAuth: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ 
  onGoToMembership,
  onOpenAuth 
}) => {
  const { userProfile, updateUserProfileData, loginAsDemoMember, logout, isDemoMode } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    phone: userProfile?.phone || '+34 612 345 678',
    emergencyContact: userProfile?.emergencyContact || 'Laura Muñoz (+34 699 111 222)'
  });

  // Athletic Benchmarks / PRs stored locally
  const [benchmarks, setBenchmarks] = useState({
    snatch: '85 KG',
    cleanJerk: '110 KG',
    backSquat: '150 KG',
    deadlift: '190 KG',
    run5k: '21:40 MIN',
    murph: '42:15 MIN'
  });
  const [isEditingPRs, setIsEditingPRs] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfileData({
      name: formData.name,
      phone: formData.phone,
      emergencyContact: formData.emergencyContact
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Title Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#FF5E00] mb-1">
          <User className="w-4 h-4" />
          <span>Ficha de Socio & Telemetría</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#F8FAFC]">
          PERFIL DEL ATLETA
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8]">
          Información personal, credenciales de acceso y registro de marcas personales (PRs).
        </p>
      </div>

      {/* Main Profile Info Card */}
      <div className="rounded-2xl bg-[#171A21] border border-[#2D333F] p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={
                  userProfile?.avatarUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
                }
                alt="Avatar socio"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-4 ring-[#FF5E00]/40"
              />
              <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#84CC16] border-2 border-[#171A21] flex items-center justify-center text-[10px] text-[#0F1115] font-bold">
                ✓
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-display text-xl sm:text-2xl font-bold text-[#F8FAFC]">
                  {userProfile?.name}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#FF5E00]/20 text-[#FF5E00] border border-[#FF5E00]/30">
                  {userProfile?.role === 'admin' ? 'Coach / Admin' : 'Socio Atleta'}
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
                Nº Socio: <strong className="text-[#84CC16]">{userProfile?.membershipNumber || 'KP-0842'}</strong>
              </p>
              <p className="text-xs text-[#94A3B8] flex items-center space-x-1 mt-1">
                <Mail className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>{userProfile?.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#1F242D] hover:bg-[#2A303C] text-xs font-semibold text-[#F8FAFC] border border-[#2D333F] transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cerrar Edición' : 'Editar Datos'}</span>
            </button>
            <button
              onClick={logout}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-red-950/30 hover:bg-red-900/40 text-xs font-semibold text-red-400 border border-red-800/40 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Salir</span>
            </button>
          </div>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="pt-4 border-t border-[#2D333F] space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-[#94A3B8] uppercase block mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1F242D] border border-[#2D333F] rounded-lg text-xs text-[#F8FAFC] focus:outline-none focus:border-[#FF5E00]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#94A3B8] uppercase block mb-1">
                  Teléfono de Contacto
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1F242D] border border-[#2D333F] rounded-lg text-xs text-[#F8FAFC] focus:outline-none focus:border-[#FF5E00]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#94A3B8] uppercase block mb-1">
                  Contacto de Emergencia
                </label>
                <input
                  type="text"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1F242D] border border-[#2D333F] rounded-lg text-xs text-[#F8FAFC] focus:outline-none focus:border-[#FF5E00]"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 rounded-lg bg-[#1F242D] text-xs font-semibold text-[#94A3B8]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-[#FF5E00] text-xs font-display font-bold uppercase text-[#0F1115] hover:brightness-110 flex items-center space-x-1"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Guardar Cambios</span>
              </button>
            </div>
          </form>
        )}

        {/* Socio Plan Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-[#1F242D] border border-[#2D333F] gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-[#FF5E00]/20 text-[#FF5E00] flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[#94A3B8]">
                Suscripción en Vigor
              </p>
              <p className="font-display text-base font-bold text-[#F8FAFC]">
                {userProfile?.planName || 'ILIMITADO PRO'}
              </p>
            </div>
          </div>

          <button
            onClick={onGoToMembership}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#171A21] hover:bg-[#2A303C] text-xs font-semibold text-[#FF5E00] border border-[#FF5E00]/30 transition-colors"
          >
            <span>Ver Detalles & Cambiar Plan</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* Athletic Benchmarks / Personal Records (PRs) */}
      <div className="rounded-2xl bg-[#171A21] border border-[#2D333F] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-[#84CC16]" />
            <h3 className="font-display text-lg font-bold text-[#F8FAFC] uppercase">
              RÉCORDS PERSONALES (PRS) & BENCHMARKS
            </h3>
          </div>

          <button
            onClick={() => setIsEditingPRs(!isEditingPRs)}
            className="text-xs text-[#FF5E00] hover:underline font-semibold"
          >
            {isEditingPRs ? 'Listo' : 'Actualizar Marcas'}
          </button>
        </div>

        <p className="text-xs text-[#94A3B8]">
          Tus mejores marcas registradas en tarima y pista para el cálculo de porcentajes de WOD.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          
          {/* Snatch */}
          <div className="p-3.5 rounded-xl bg-[#1F242D] border border-[#2D333F] space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">
              Snatch (Arrancada)
            </span>
            {isEditingPRs ? (
              <input
                type="text"
                value={benchmarks.snatch}
                onChange={(e) => setBenchmarks({ ...benchmarks, snatch: e.target.value })}
                className="w-full bg-[#171A21] border border-[#2D333F] rounded px-2 py-1 text-sm font-display font-bold text-[#F8FAFC]"
              />
            ) : (
              <p className="font-display text-2xl font-bold text-[#84CC16] tnum">
                {benchmarks.snatch}
              </p>
            )}
            <span className="text-[10px] text-[#94A3B8]">1RM Oficial</span>
          </div>

          {/* Clean & Jerk */}
          <div className="p-3.5 rounded-xl bg-[#1F242D] border border-[#2D333F] space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">
              Clean & Jerk (Dos Tiempos)
            </span>
            {isEditingPRs ? (
              <input
                type="text"
                value={benchmarks.cleanJerk}
                onChange={(e) => setBenchmarks({ ...benchmarks, cleanJerk: e.target.value })}
                className="w-full bg-[#171A21] border border-[#2D333F] rounded px-2 py-1 text-sm font-display font-bold text-[#F8FAFC]"
              />
            ) : (
              <p className="font-display text-2xl font-bold text-[#84CC16] tnum">
                {benchmarks.cleanJerk}
              </p>
            )}
            <span className="text-[10px] text-[#94A3B8]">1RM Oficial</span>
          </div>

          {/* Back Squat */}
          <div className="p-3.5 rounded-xl bg-[#1F242D] border border-[#2D333F] space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">
              Back Squat (Sentadilla)
            </span>
            {isEditingPRs ? (
              <input
                type="text"
                value={benchmarks.backSquat}
                onChange={(e) => setBenchmarks({ ...benchmarks, backSquat: e.target.value })}
                className="w-full bg-[#171A21] border border-[#2D333F] rounded px-2 py-1 text-sm font-display font-bold text-[#F8FAFC]"
              />
            ) : (
              <p className="font-display text-2xl font-bold text-[#FF5E00] tnum">
                {benchmarks.backSquat}
              </p>
            )}
            <span className="text-[10px] text-[#94A3B8]">1RM Oficial</span>
          </div>

          {/* Deadlift */}
          <div className="p-3.5 rounded-xl bg-[#1F242D] border border-[#2D333F] space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">
              Deadlift (Peso Muerto)
            </span>
            {isEditingPRs ? (
              <input
                type="text"
                value={benchmarks.deadlift}
                onChange={(e) => setBenchmarks({ ...benchmarks, deadlift: e.target.value })}
                className="w-full bg-[#171A21] border border-[#2D333F] rounded px-2 py-1 text-sm font-display font-bold text-[#F8FAFC]"
              />
            ) : (
              <p className="font-display text-2xl font-bold text-[#FF5E00] tnum">
                {benchmarks.deadlift}
              </p>
            )}
            <span className="text-[10px] text-[#94A3B8]">1RM Oficial</span>
          </div>

          {/* 5K Run */}
          <div className="p-3.5 rounded-xl bg-[#1F242D] border border-[#2D333F] space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">
              Carrera 5K (Pista)
            </span>
            {isEditingPRs ? (
              <input
                type="text"
                value={benchmarks.run5k}
                onChange={(e) => setBenchmarks({ ...benchmarks, run5k: e.target.value })}
                className="w-full bg-[#171A21] border border-[#2D333F] rounded px-2 py-1 text-sm font-display font-bold text-[#F8FAFC]"
              />
            ) : (
              <p className="font-display text-2xl font-bold text-[#38BDF8] tnum">
                {benchmarks.run5k}
              </p>
            )}
            <span className="text-[10px] text-[#94A3B8]">Tiempo Hyrox Base</span>
          </div>

          {/* Murph Time */}
          <div className="p-3.5 rounded-xl bg-[#1F242D] border border-[#2D333F] space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">
              WOD Hero 'Murph'
            </span>
            {isEditingPRs ? (
              <input
                type="text"
                value={benchmarks.murph}
                onChange={(e) => setBenchmarks({ ...benchmarks, murph: e.target.value })}
                className="w-full bg-[#171A21] border border-[#2D333F] rounded px-2 py-1 text-sm font-display font-bold text-[#F8FAFC]"
              />
            ) : (
              <p className="font-display text-2xl font-bold text-[#38BDF8] tnum">
                {benchmarks.murph}
              </p>
            )}
            <span className="text-[10px] text-[#94A3B8]">Con chaleco 9kg</span>
          </div>

        </div>
      </div>

      {/* Switch Demo Athletes / Quick Sign-In Options */}
      <div className="rounded-2xl bg-[#171A21] border border-[#2D333F] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-[#FF5E00]" />
            <h3 className="font-display text-lg font-bold text-[#F8FAFC] uppercase">
              CAMBIAR DE SOCIO (MODO PRUEBAS)
            </h3>
          </div>
          <button
            onClick={onOpenAuth}
            className="text-xs font-bold text-[#FF5E00] hover:underline"
          >
            Crear Nueva Cuenta / Login Firebase
          </button>
        </div>

        <p className="text-xs text-[#94A3B8]">
          Puedes alternar rápidamente entre diferentes perfiles de socios preconfigurados para comprobar cómo cada uno ve sus clases reservadas y su cuota:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {DEMO_MEMBERS.map((m) => {
            const isCurrent = userProfile?.id === m.id;
            return (
              <button
                key={m.id}
                onClick={() => loginAsDemoMember(m.id)}
                className={`p-3.5 rounded-xl border text-left flex items-center space-x-3 transition-all ${
                  isCurrent
                    ? 'bg-[#1F242D] border-[#FF5E00] shadow-md shadow-[#FF5E00]/20'
                    : 'bg-[#171A21] border-[#2D333F] hover:bg-[#1F242D]'
                }`}
              >
                <img
                  src={m.avatarUrl}
                  alt={m.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#2D333F]"
                />
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-[#F8FAFC] truncate">
                    {m.name}
                  </p>
                  <p className="text-[10px] text-[#84CC16] font-mono">
                    {m.membershipNumber}
                  </p>
                  <p className="text-[10px] text-[#94A3B8] truncate">
                    {m.planName}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
