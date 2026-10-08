import React from 'react';
import { Calendar, BookmarkCheck, CreditCard, User, Dumbbell } from 'lucide-react';
import { useGym } from '../context/GymContext';

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, setCurrentTab }) => {
  const { userBookings } = useGym();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0F1115]/90 backdrop-blur-xl border-t border-[#2D333F] pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around">
        
        {/* Clases */}
        <button
          onClick={() => setCurrentTab('clases')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            currentTab === 'clases'
              ? 'text-[#FF5E00]'
              : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          <Calendar className="w-5 h-5 mb-1" />
          <span className="font-display text-[10px] font-bold tracking-wider uppercase">
            Clases
          </span>
          {currentTab === 'clases' && (
            <span className="w-1 h-1 rounded-full bg-[#FF5E00] mt-0.5"></span>
          )}
        </button>

        {/* Mis Reservas */}
        <button
          onClick={() => setCurrentTab('reservas')}
          className={`flex flex-col items-center justify-center flex-1 py-1 relative transition-all ${
            currentTab === 'reservas'
              ? 'text-[#FF5E00]'
              : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          <div className="relative">
            <BookmarkCheck className="w-5 h-5 mb-1" />
            {userBookings.length > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[#84CC16] text-[#0F1115] text-[9px] font-bold flex items-center justify-center font-mono">
                {userBookings.length}
              </span>
            )}
          </div>
          <span className="font-display text-[10px] font-bold tracking-wider uppercase">
            Reservas
          </span>
          {currentTab === 'reservas' && (
            <span className="w-1 h-1 rounded-full bg-[#FF5E00] mt-0.5"></span>
          )}
        </button>

        {/* Center Quick Action: WOD of the day */}
        <div className="flex items-center justify-center -mt-5">
          <button
            onClick={() => setCurrentTab('clases')}
            title="WOD de hoy"
            className="w-12 h-12 rounded-full bg-[#FF5E00] text-[#0F1115] flex items-center justify-center shadow-lg shadow-[#FF5E00]/40 ring-4 ring-[#0F1115] active:scale-95 transition-transform"
          >
            <Dumbbell className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Cuota */}
        <button
          onClick={() => setCurrentTab('cuota')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            currentTab === 'cuota'
              ? 'text-[#FF5E00]'
              : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          <CreditCard className="w-5 h-5 mb-1" />
          <span className="font-display text-[10px] font-bold tracking-wider uppercase">
            Cuota
          </span>
          {currentTab === 'cuota' && (
            <span className="w-1 h-1 rounded-full bg-[#FF5E00] mt-0.5"></span>
          )}
        </button>

        {/* Perfil */}
        <button
          onClick={() => setCurrentTab('perfil')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            currentTab === 'perfil'
              ? 'text-[#FF5E00]'
              : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          <User className="w-5 h-5 mb-1" />
          <span className="font-display text-[10px] font-bold tracking-wider uppercase">
            Atleta
          </span>
          {currentTab === 'perfil' && (
            <span className="w-1 h-1 rounded-full bg-[#FF5E00] mt-0.5"></span>
          )}
        </button>

      </div>
    </div>
  );
};
