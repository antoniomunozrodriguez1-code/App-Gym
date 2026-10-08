import React, { useState } from 'react';
import { 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  XCircle,
  Flame,
  ChevronRight
} from 'lucide-react';
import { GymClass } from '../types';
import { useGym } from '../context/GymContext';

interface ClassCardProps {
  gymClass: GymClass;
  onOpenDetails: (gymClass: GymClass) => void;
}

export const ClassCard: React.FC<ClassCardProps> = ({ gymClass, onOpenDetails }) => {
  const { bookClass, cancelBooking, isClassBookedByUser, getUserBookingForClass } = useGym();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const isBooked = isClassBookedByUser(gymClass.id);
  const userBooking = getUserBookingForClass(gymClass.id);
  const spotsRemaining = Math.max(0, gymClass.capacity - gymClass.bookedCount);
  const isFull = spotsRemaining === 0;

  // Category Accent styling
  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'WOD - CROSSFIT':
        return {
          badge: 'bg-[#FF5E00]/15 text-[#FF5E00] border-[#FF5E00]/30',
          indicator: 'bg-[#FF5E00]'
        };
      case 'OLYMPIC LIFTING':
        return {
          badge: 'bg-[#84CC16]/15 text-[#84CC16] border-[#84CC16]/30',
          indicator: 'bg-[#84CC16]'
        };
      case 'HYROX':
        return {
          badge: 'bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/30',
          indicator: 'bg-[#38BDF8]'
        };
      case 'OPEN BOX':
        return {
          badge: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
          indicator: 'bg-purple-400'
        };
      case 'MOBILITY':
        return {
          badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          indicator: 'bg-emerald-400'
        };
      default:
        return {
          badge: 'bg-[#1F242D] text-[#94A3B8] border-[#2D333F]',
          indicator: 'bg-[#94A3B8]'
        };
    }
  };

  const categoryStyle = getCategoryStyles(gymClass.category);

  const handleBook = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSubmitting || isFull || isBooked) return;
    setIsSubmitting(true);
    await bookClass(gymClass);
    setIsSubmitting(false);
  };

  const handleCancel = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userBooking || isSubmitting) return;
    setIsSubmitting(true);
    await cancelBooking(userBooking.id, gymClass.id);
    setIsSubmitting(false);
    setShowCancelConfirm(false);
  };

  return (
    <>
      <div 
        onClick={() => onOpenDetails(gymClass)}
        className={`group relative rounded-xl bg-[#171A21] border transition-all duration-200 cursor-pointer overflow-hidden hover:border-[#FF5E00]/50 hover:shadow-xl hover:shadow-black/40 ${
          isBooked 
            ? 'border-[#84CC16]/50 bg-[#171A21] ring-1 ring-[#84CC16]/30' 
            : 'border-[#2D333F]'
        }`}
      >
        {/* Left Category Edge Highlight Strip */}
        <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${categoryStyle.indicator}`} />

        <div className="p-4 sm:p-5 pl-5 sm:pl-6 space-y-3.5">
          
          {/* Header Row: Time & Category */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-[#F8FAFC] tnum flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-[#FF5E00]" />
                <span>{gymClass.startTime} - {gymClass.endTime}</span>
              </span>
            </div>

            {/* Category Badge */}
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${categoryStyle.badge}`}>
              {gymClass.category}
            </span>
          </div>

          {/* Class Title & Description Preview */}
          <div>
            <h3 className="font-display text-base sm:text-lg font-bold text-[#F8FAFC] group-hover:text-[#FF5E00] transition-colors flex items-center justify-between">
              <span>{gymClass.title}</span>
              <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#FF5E00] transition-transform group-hover:translate-x-1" />
            </h3>
            <p className="text-xs text-[#94A3B8] line-clamp-1 mt-0.5">
              {gymClass.description}
            </p>
          </div>

          {/* Location & Coach Row */}
          <div className="flex items-center justify-between pt-1 text-xs text-[#94A3B8] border-t border-[#2D333F]/50">
            <div className="flex items-center space-x-2">
              <img
                src={gymClass.coachAvatar}
                alt={gymClass.coachName}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-[#2D333F]"
              />
              <div>
                <p className="font-medium text-[#F8FAFC] leading-none text-xs">
                  {gymClass.coachName}
                </p>
                <p className="text-[10px] text-[#94A3B8] flex items-center space-x-1 mt-0.5">
                  <MapPin className="w-2.5 h-2.5 text-[#38BDF8]" />
                  <span>{gymClass.location}</span>
                </p>
              </div>
            </div>

            {/* Capacity / Remaining Spots Pill */}
            <div>
              {isFull ? (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-red-900/30 text-red-400 border border-red-800/40">
                  COMPLETA
                </span>
              ) : spotsRemaining <= 3 ? (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#FF5E00]/15 text-[#FF5E00] border border-[#FF5E00]/30 animate-pulse flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>¡Solo {spotsRemaining} {spotsRemaining === 1 ? 'plaza' : 'plazas'}!</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#1F242D] text-[#94A3B8] border border-[#2D333F] tnum flex items-center space-x-1">
                  <Users className="w-3 h-3 text-[#38BDF8]" />
                  <span>{spotsRemaining} libres</span>
                </span>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2">
            {isBooked ? (
              <div className="flex items-center space-x-2">
                {/* Booked Status Badge */}
                <div className="flex-1 h-11 px-3 rounded-lg bg-[#84CC16]/10 border border-[#84CC16]/50 text-[#84CC16] font-display text-sm font-bold uppercase tracking-wider flex items-center justify-center space-x-2 glow-lime">
                  <CheckCircle2 className="w-4 h-4 text-[#84CC16]" />
                  <span>Plaza Reservada</span>
                </div>

                {/* Cancel Trigger */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowCancelConfirm(true);
                  }}
                  disabled={isSubmitting}
                  className="h-11 px-4 rounded-lg bg-[#1F242D] hover:bg-red-950/40 hover:border-red-500/50 hover:text-red-400 border border-[#2D333F] text-xs font-semibold text-[#94A3B8] transition-all"
                >
                  Cancelar
                </button>
              </div>
            ) : isFull ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDetails(gymClass);
                }}
                className="w-full h-11 rounded-lg bg-[#1F242D] text-[#94A3B8] border border-[#2D333F] font-display text-sm font-bold uppercase tracking-wider hover:bg-[#2A303C] transition-colors"
              >
                Clase Llena • Ver Detalles
              </button>
            ) : (
              <button
                type="button"
                onClick={handleBook}
                disabled={isSubmitting}
                className="w-full h-12 rounded-lg bg-[#FF5E00] hover:bg-[#ff6e1a] text-[#0F1115] font-display text-base font-bold uppercase tracking-wider transition-all duration-150 transform active:scale-[0.98] flex items-center justify-center space-x-2 glow-ignite cursor-pointer"
              >
                <Flame className="w-4 h-4 fill-current" />
                <span>{isSubmitting ? 'Confirmando...' : 'Reservar Plaza'}</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Confirmation Modal for Booking Cancellation */}
      {showCancelConfirm && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="bg-[#171A21] border border-[#2D333F] rounded-2xl p-6 max-w-sm w-full space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
              <XCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-display text-lg font-bold text-[#F8FAFC] uppercase">
                ¿Cancelar tu reserva?
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Liberarás tu plaza para <strong className="text-[#F8FAFC]">{gymClass.title}</strong> el {gymClass.date} a las {gymClass.startTime}.
              </p>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 py-2.5 rounded-lg bg-[#1F242D] text-xs font-semibold text-[#F8FAFC] hover:bg-[#2A303C] transition-colors"
              >
                Mantener Reserva
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-display font-bold uppercase tracking-wider text-white transition-colors"
              >
                {isSubmitting ? 'Cancelando...' : 'Sí, Cancelar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
