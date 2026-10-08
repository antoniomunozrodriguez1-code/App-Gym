import React from 'react';
import { 
  X, 
  Clock, 
  MapPin, 
  Users, 
  Dumbbell, 
  Flame, 
  CheckCircle2, 
  AlertCircle,
  Share2,
  Calendar
} from 'lucide-react';
import { GymClass } from '../types';
import { useGym } from '../context/GymContext';

interface ClassDetailModalProps {
  gymClass: GymClass | null;
  onClose: () => void;
}

export const ClassDetailModal: React.FC<ClassDetailModalProps> = ({ gymClass, onClose }) => {
  const { bookClass, cancelBooking, isClassBookedByUser, getUserBookingForClass, allBookings } = useGym();

  if (!gymClass) return null;

  const isBooked = isClassBookedByUser(gymClass.id);
  const userBooking = getUserBookingForClass(gymClass.id);
  const spotsRemaining = Math.max(0, gymClass.capacity - gymClass.bookedCount);
  const isFull = spotsRemaining === 0;

  // List of confirmed attendees for this class
  const classAttendees = allBookings.filter(
    (b) => b.classId === gymClass.id && b.status === 'confirmed'
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in overflow-y-auto">
      <div 
        className="bg-[#171A21] border border-[#2D333F] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header / Banner */}
        <div className="sticky top-0 bg-[#171A21]/95 backdrop-blur-md z-10 p-5 border-b border-[#2D333F] flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FF5E00]/20 text-[#FF5E00] border border-[#FF5E00]/30">
                {gymClass.category}
              </span>
              <span className="text-xs text-[#94A3B8] font-mono">
                {gymClass.date}
              </span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#F8FAFC]">
              {gymClass.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#1F242D] hover:bg-[#2A303C] text-[#94A3B8] hover:text-[#F8FAFC] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-6">
          
          {/* Metrics & Info Bar */}
          <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-[#1F242D] border border-[#2D333F]">
            <div className="text-center">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8] block mb-0.5">
                Horario
              </span>
              <span className="font-display text-base font-bold text-[#F8FAFC] tnum">
                {gymClass.startTime}
              </span>
              <span className="text-[10px] text-[#94A3B8] block">a {gymClass.endTime}</span>
            </div>

            <div className="text-center border-x border-[#2D333F]">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8] block mb-0.5">
                Capacidad
              </span>
              <span className="font-display text-base font-bold text-[#F8FAFC] tnum">
                {gymClass.bookedCount}/{gymClass.capacity}
              </span>
              <span className={`text-[10px] block ${spotsRemaining <= 3 ? 'text-[#FF5E00] font-bold' : 'text-[#84CC16]'}`}>
                {spotsRemaining} libres
              </span>
            </div>

            <div className="text-center">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8] block mb-0.5">
                Ubicación
              </span>
              <span className="font-display text-xs font-bold text-[#38BDF8] block truncate px-1">
                {gymClass.location}
              </span>
              <span className="text-[10px] text-[#94A3B8] block">Pista Climatizada</span>
            </div>
          </div>

          {/* Coach Card */}
          <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-[#1F242D]/70 border border-[#2D333F]">
            <img
              src={gymClass.coachAvatar}
              alt={gymClass.coachName}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-[#FF5E00]/50"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-[#F8FAFC]">
                  {gymClass.coachName}
                </h4>
                <span className="text-[10px] font-mono text-[#FF5E00] uppercase">
                  Coach Asignado
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                {gymClass.coachBio || 'Entrenador oficial de Kinetic Performance'}
              </p>
            </div>
          </div>

          {/* Programming WOD Section */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#FF5E00]">
              <Dumbbell className="w-4 h-4" />
              <span>Programación de la Sesión (WOD)</span>
            </div>
            
            <div className="p-4 rounded-xl bg-[#0F1115] border border-[#2D333F] text-xs font-mono text-[#F8FAFC] whitespace-pre-line leading-relaxed selection:bg-[#FF5E00] selection:text-[#0F1115]">
              {gymClass.wod || 'Programación detallada revelada 1 hora antes de la sesión.'}
            </div>
          </div>

          {/* Class Guidelines */}
          <div className="p-3.5 rounded-xl bg-[#1F242D]/40 border border-[#2D333F] text-xs space-y-1.5 text-[#94A3B8]">
            <p className="font-semibold text-[#F8FAFC] flex items-center space-x-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Normas de Acceso al Box</span>
            </p>
            <ul className="list-disc list-inside space-y-1 pl-1 text-[11px]">
              <li>Llegar con al menos 5 minutos de antelación para el calentamiento articular.</li>
              <li>Traer toalla de entrenamiento y calzado específico para cross-training.</li>
              <li>Cancelaciones sin penalización hasta 1 hora antes de la clase.</li>
            </ul>
          </div>

          {/* Attendees List Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#94A3B8]">
              <span className="font-semibold uppercase tracking-wider text-[#F8FAFC] flex items-center space-x-1">
                <Users className="w-3.5 h-3.5 text-[#84CC16]" />
                <span>Atletas Confirmados ({classAttendees.length})</span>
              </span>
              <span className="text-[11px]">
                {spotsRemaining > 0 ? `${spotsRemaining} plazas disponibles` : 'Completa'}
              </span>
            </div>

            {classAttendees.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar">
                {classAttendees.map((att, i) => (
                  <span
                    key={att.id || i}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] bg-[#1F242D] border border-[#2D333F] text-[#F8FAFC]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]"></span>
                    <span>{att.userName}</span>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#94A3B8] italic">
                Sé el primer socio en reservar su plaza para esta sesión.
              </p>
            )}
          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="sticky bottom-0 bg-[#171A21]/95 backdrop-blur-md p-5 border-t border-[#2D333F] flex items-center space-x-3">
          {isBooked ? (
            <div className="w-full flex items-center space-x-3">
              <div className="flex-1 h-12 rounded-xl bg-[#84CC16]/10 border border-[#84CC16]/50 text-[#84CC16] font-display text-sm font-bold uppercase tracking-wider flex items-center justify-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#84CC16]" />
                <span>Tienes Reserva Confirmada</span>
              </div>
              <button
                type="button"
                onClick={async () => {
                  if (userBooking) {
                    await cancelBooking(userBooking.id, gymClass.id);
                  }
                }}
                className="h-12 px-5 rounded-xl bg-[#1F242D] hover:bg-red-950/40 hover:border-red-500/50 hover:text-red-400 border border-[#2D333F] text-xs font-bold text-[#94A3B8] transition-colors"
              >
                Cancelar
              </button>
            </div>
          ) : isFull ? (
            <div className="w-full h-12 rounded-xl bg-[#1F242D] border border-[#2D333F] text-[#94A3B8] font-display text-sm font-bold uppercase tracking-wider flex items-center justify-center">
              Clase Completa (Sin Plazas Libres)
            </div>
          ) : (
            <button
              type="button"
              onClick={async () => {
                await bookClass(gymClass);
              }}
              className="w-full h-12 rounded-xl bg-[#FF5E00] hover:bg-[#ff6e1a] text-[#0F1115] font-display text-base font-bold uppercase tracking-wider transition-transform active:scale-[0.98] flex items-center justify-center space-x-2 glow-ignite cursor-pointer"
            >
              <Flame className="w-5 h-5 fill-current" />
              <span>Confirmar Reserva de Plaza</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
