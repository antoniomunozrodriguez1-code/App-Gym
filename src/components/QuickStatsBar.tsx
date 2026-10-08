import React from 'react';
import { Flame, Calendar, Trophy, QrCode, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGym } from '../context/GymContext';

interface QuickStatsBarProps {
  onOpenAccessPass: () => void;
  onGoToMembership: () => void;
  onGoToBookings: () => void;
}

export const QuickStatsBar: React.FC<QuickStatsBarProps> = ({
  onOpenAccessPass,
  onGoToMembership,
  onGoToBookings
}) => {
  const { userProfile } = useAuth();
  const { userBookings } = useGym();

  const nextBooking = userBookings[0];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
      
      {/* Stat 1: Reservas Activas */}
      <div 
        onClick={onGoToBookings}
        className="p-3 sm:p-4 rounded-xl bg-[#171A21] border border-[#2D333F] hover:border-[#FF5E00]/50 transition-colors cursor-pointer group"
      >
        <div className="flex items-center justify-between text-[#94A3B8] mb-1">
          <span className="text-[10px] uppercase font-bold tracking-wider">
            Clases Reservadas
          </span>
          <Calendar className="w-3.5 h-3.5 text-[#FF5E00]" />
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="font-display text-2xl sm:text-3xl font-bold text-[#F8FAFC] tnum">
            {userBookings.length}
          </span>
          <span className="text-[10px] text-[#84CC16] font-semibold">
            {userBookings.length > 0 ? 'Confirmadas' : 'Sin reservas'}
          </span>
        </div>
      </div>

      {/* Stat 2: Próximo WOD / Sesión */}
      <div 
        onClick={onGoToBookings}
        className="p-3 sm:p-4 rounded-xl bg-[#171A21] border border-[#2D333F] hover:border-[#FF5E00]/50 transition-colors cursor-pointer group"
      >
        <div className="flex items-center justify-between text-[#94A3B8] mb-1">
          <span className="text-[10px] uppercase font-bold tracking-wider">
            Próxima Sesión
          </span>
          <Flame className="w-3.5 h-3.5 text-[#84CC16]" />
        </div>
        <div>
          {nextBooking ? (
            <p className="font-display text-sm font-bold text-[#F8FAFC] truncate">
              {nextBooking.classTitle}
            </p>
          ) : (
            <p className="font-display text-sm font-bold text-[#94A3B8]">
              Ninguna hoy
            </p>
          )}
          <span className="text-[10px] text-[#38BDF8] font-mono">
            {nextBooking ? `${nextBooking.classDate} • ${nextBooking.classTime.split(' - ')[0]}` : 'Reserva en calendario'}
          </span>
        </div>
      </div>

      {/* Stat 3: Plan de Cuota */}
      <div 
        onClick={onGoToMembership}
        className="p-3 sm:p-4 rounded-xl bg-[#171A21] border border-[#2D333F] hover:border-[#FF5E00]/50 transition-colors cursor-pointer group"
      >
        <div className="flex items-center justify-between text-[#94A3B8] mb-1">
          <span className="text-[10px] uppercase font-bold tracking-wider">
            Cuota Kinetic
          </span>
          <ShieldCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
        </div>
        <div>
          <p className="font-display text-sm font-bold text-[#F8FAFC] truncate">
            {userProfile?.planName || 'ILIMITADO PRO'}
          </p>
          <span className="text-[10px] text-[#84CC16] font-semibold flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]"></span>
            <span>Al día</span>
          </span>
        </div>
      </div>

      {/* Stat 4: Acceso Torno QR */}
      <div 
        onClick={onOpenAccessPass}
        className="p-3 sm:p-4 rounded-xl bg-[#1F242D] border border-[#84CC16]/40 hover:border-[#84CC16] transition-all cursor-pointer group flex flex-col justify-between"
      >
        <div className="flex items-center justify-between text-[#94A3B8] mb-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#84CC16]">
            Pase Digital
          </span>
          <QrCode className="w-3.5 h-3.5 text-[#84CC16]" />
        </div>
        <div className="flex items-center justify-between">
          <span className="font-display text-xs font-bold text-[#F8FAFC] uppercase tracking-wider">
            Abrir Torno
          </span>
          <span className="text-[10px] font-mono text-[#84CC16]">
            {userProfile?.membershipNumber || 'KP-0842'}
          </span>
        </div>
      </div>

    </div>
  );
};
