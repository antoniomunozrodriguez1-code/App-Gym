import React, { useMemo } from 'react';
import { useGym } from '../context/GymContext';
import { Search, Filter, CalendarDays } from 'lucide-react';

interface WeeklyCalendarStripProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const CATEGORIES = [
  'TODAS',
  'WOD - CROSSFIT',
  'OLYMPIC LIFTING',
  'HYROX',
  'OPEN BOX',
  'MOBILITY',
  'ENDURANCE'
];

export const WeeklyCalendarStrip: React.FC<WeeklyCalendarStripProps> = ({
  searchQuery,
  setSearchQuery
}) => {
  const { 
    selectedDate, 
    setSelectedDate, 
    selectedCategory, 
    setSelectedCategory,
    userBookings,
    classes
  } = useGym();

  // Generate 7 days around today: today - 1 to today + 5
  const weekDays = useMemo(() => {
    const days = [];
    const baseDate = new Date();
    
    // Start from yesterday or today
    for (let i = -1; i <= 5; i++) {
      const d = new Date();
      d.setDate(baseDate.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      
      const dayName = d.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase().replace('.', '');
      const dayNumber = d.getDate();
      const isToday = i === 0;

      // Count user bookings for this day
      const hasBooking = userBookings.some((b) => b.classDate === dateStr);
      // Count total classes available on this day
      const totalClassesOnDay = classes.filter((c) => c.date === dateStr).length;

      days.push({
        dateStr,
        dayName,
        dayNumber,
        isToday,
        hasBooking,
        totalClassesOnDay
      });
    }
    return days;
  }, [userBookings, classes]);

  return (
    <div className="space-y-4">
      
      {/* Date Carousel Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CalendarDays className="w-4 h-4 text-[#FF5E00]" />
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-[#F8FAFC]">
            Calendario Semanal
          </h2>
        </div>
        <span className="text-[11px] text-[#94A3B8]">
          Desliza para elegir fecha
        </span>
      </div>

      {/* Horizontal Swipeable Calendar Strip */}
      <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1 pt-1 -mx-2 px-2 scroll-smooth">
        {weekDays.map((item) => {
          const isSelected = selectedDate === item.dateStr;
          return (
            <button
              key={item.dateStr}
              onClick={() => setSelectedDate(item.dateStr)}
              className={`flex-shrink-0 w-14 py-2.5 rounded-xl flex flex-col items-center justify-center transition-all relative ${
                isSelected
                  ? 'bg-[#FF5E00] text-[#0F1115] shadow-lg shadow-[#FF5E00]/30 scale-105'
                  : 'bg-[#171A21] hover:bg-[#1F242D] border border-[#2D333F] text-[#94A3B8]'
              }`}
            >
              {/* Today Badge */}
              {item.isToday && (
                <span
                  className={`text-[8px] font-bold tracking-tighter uppercase px-1 rounded-sm mb-0.5 ${
                    isSelected
                      ? 'bg-[#0F1115] text-[#FF5E00]'
                      : 'bg-[#FF5E00]/20 text-[#FF5E00]'
                  }`}
                >
                  HOY
                </span>
              )}

              {/* Day Name (LUN, MAR, etc.) */}
              <span
                className={`text-[10px] uppercase font-semibold tracking-wider ${
                  isSelected ? 'text-[#0F1115] font-bold' : 'text-[#94A3B8]'
                }`}
              >
                {item.dayName}
              </span>

              {/* Day Number (18, 19, etc.) in Oswald */}
              <span
                className={`font-display text-xl font-bold leading-none my-0.5 ${
                  isSelected ? 'text-[#0F1115]' : 'text-[#F8FAFC]'
                }`}
              >
                {item.dayNumber}
              </span>

              {/* Booking Indicator Dot */}
              <div className="h-2 flex items-center justify-center space-x-0.5">
                {item.hasBooking && (
                  <span
                    title="Tienes una reserva este día"
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-[#0F1115]' : 'bg-[#84CC16]'
                    }`}
                  ></span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Search and Category Filter Bar */}
      <div className="space-y-3 pt-1">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Buscar clase, coach o movimiento..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#171A21] border border-[#2D333F] rounded-lg text-xs text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#FF5E00] focus:ring-1 focus:ring-[#FF5E00] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#94A3B8] hover:text-[#F8FAFC]"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Pills Strip */}
        <div className="flex space-x-1.5 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all ${
                  isSelected
                    ? 'bg-[#1F242D] text-[#FF5E00] border border-[#FF5E00]/60 shadow-sm'
                    : 'bg-[#171A21] text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1F242D] border border-[#2D333F]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
