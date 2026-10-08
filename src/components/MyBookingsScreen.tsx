import React, { useState } from 'react';
import { 
  BookmarkCheck, 
  Clock, 
  MapPin, 
  Calendar, 
  XCircle, 
  QrCode, 
  CheckCircle2, 
  Flame, 
  AlertCircle,
  Dumbbell
} from 'lucide-react';
import { useGym } from '../context/GymContext';
import { useAuth } from '../context/AuthContext';
import { Booking } from '../types';

interface MyBookingsScreenProps {
  onGoToClasses: () => void;
  onOpenAccessPass: () => void;
}

export const MyBookingsScreen: React.FC<MyBookingsScreenProps> = ({ 
  onGoToClasses, 
  onOpenAccessPass 
}) => {
  const { userBookings, cancelBooking, classes } = useGym();
  const { userProfile } = useAuth();
  
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [activeFilter, setActiveFilter] = useState<'upcoming' | 'all'>('upcoming');

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredBookings = userBookings.filter((b) => {
    if (activeFilter === 'upcoming') {
      return b.classDate >= todayStr;
    }
    return true;
  });

  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;
    setCancellingId(bookingToCancel.id);
    await cancelBooking(bookingToCancel.id, bookingToCancel.classId);
    setCancellingId(null);
    setBookingToCancel(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#84CC16] mb-1">
            <BookmarkCheck className="w-4 h-4" />
            <span>Tus Entrenamientos</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#F8FAFC]">
            MIS RESERVAS DE CLASES
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            Gestiona tus plazas reservadas para los próximos días o libera tu plaza si no puedes asistir.
          </p>
        </div>

        {/* Action Button: Book More */}
        <button
          onClick={onGoToClasses}
          className="self-start sm:self-auto flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#FF5E00] hover:bg-[#ff6e1a] text-[#0F1115] font-display text-xs font-bold uppercase tracking-wider transition-all active:scale-95 glow-ignite"
        >
          <Flame className="w-4 h-4 fill-current" />
          <span>Reservar Otra Clase</span>
        </button>
      </div>

      {/* Quick Summary Pill Bar */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-[#171A21] border border-[#2D333F]">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-[#84CC16]/20 text-[#84CC16] flex items-center justify-center font-display font-bold text-lg">
            {userBookings.length}
          </div>
          <div>
            <p className="text-xs font-bold text-[#F8FAFC]">
              {userBookings.length === 1 ? '1 Clase Reservada' : `${userBookings.length} Clases Reservadas`}
            </p>
            <p className="text-[11px] text-[#94A3B8]">
              Plan {userProfile?.planName || 'Ilimitado Pro'} activo
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAccessPass}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#1F242D] hover:bg-[#2A303C] text-xs font-semibold text-[#84CC16] border border-[#2D333F]"
        >
          <QrCode className="w-4 h-4" />
          <span>Pase Torno</span>
        </button>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="rounded-2xl bg-[#171A21] border border-[#2D333F] p-10 text-center space-x-0 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#1F242D] border border-[#2D333F] text-[#94A3B8] flex items-center justify-center mx-auto">
            <Dumbbell className="w-8 h-8 text-[#FF5E00]" />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-[#F8FAFC]">
              No Tienes Ninguna Clase Reservada
            </h3>
            <p className="text-xs text-[#94A3B8] max-w-sm mx-auto mt-1">
              Explora la programación semanal y asegura tu plaza en el próximo WOD, Halterofilia o sesión Hyrox.
            </p>
          </div>
          <button
            onClick={onGoToClasses}
            className="px-6 py-3 rounded-xl bg-[#FF5E00] hover:bg-[#ff6e1a] text-[#0F1115] font-display text-sm font-bold uppercase tracking-wider glow-ignite transition-all active:scale-95 inline-flex items-center space-x-2"
          >
            <Flame className="w-4 h-4 fill-current" />
            <span>Ver Horarios de Clases</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBookings.map((bkg) => {
            const classObj = classes.find((c) => c.id === bkg.classId);

            return (
              <div
                key={bkg.id}
                className="rounded-xl bg-[#171A21] border border-[#2D333F] hover:border-[#84CC16]/60 p-4 sm:p-5 transition-all shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Left Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#84CC16]/15 text-[#84CC16] border border-[#84CC16]/30 flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Confirmada</span>
                    </span>

                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-[#1F242D] text-[#38BDF8]">
                      {bkg.category}
                    </span>

                    <span className="text-xs text-[#94A3B8] font-mono">
                      {bkg.classDate}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-bold text-[#F8FAFC]">
                      {bkg.classTitle}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#94A3B8] mt-1">
                      <span className="flex items-center space-x-1 text-[#F8FAFC] font-semibold">
                        <Clock className="w-3.5 h-3.5 text-[#FF5E00]" />
                        <span>{bkg.classTime}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-[#38BDF8]" />
                        <span>{classObj?.location || 'Box Central'}</span>
                      </span>
                      {classObj?.coachName && (
                        <span>Coach: <strong className="text-[#F8FAFC]">{classObj.coachName}</strong></span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center space-x-2.5 sm:border-l sm:border-[#2D333F] sm:pl-5">
                  <button
                    onClick={onOpenAccessPass}
                    className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-lg bg-[#1F242D] hover:bg-[#2A303C] border border-[#2D333F] text-xs font-semibold text-[#84CC16] transition-colors flex items-center justify-center space-x-1.5"
                    title="Pase al llegar al box"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Check-in</span>
                  </button>

                  <button
                    onClick={() => setBookingToCancel(bkg)}
                    disabled={cancellingId === bkg.id}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-[#1F242D] hover:bg-red-950/40 hover:border-red-500/50 hover:text-red-400 border border-[#2D333F] text-xs font-bold text-[#94A3B8] transition-all"
                  >
                    {cancellingId === bkg.id ? 'Cancelando...' : 'Cancelar'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancellation Confirmation Dialog */}
      {bookingToCancel && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#171A21] border border-[#2D333F] rounded-2xl p-6 max-w-sm w-full space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
              <XCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-display text-lg font-bold text-[#F8FAFC] uppercase">
                ¿Cancelar Esta Reserva?
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Liberarás tu plaza para <strong className="text-[#F8FAFC]">{bookingToCancel.classTitle}</strong> ({bookingToCancel.classDate} a las {bookingToCancel.classTime}).
              </p>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setBookingToCancel(null)}
                className="flex-1 py-2.5 rounded-lg bg-[#1F242D] text-xs font-semibold text-[#F8FAFC] hover:bg-[#2A303C]"
              >
                No, Mantener
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-display font-bold uppercase tracking-wider text-white"
              >
                Sí, Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
