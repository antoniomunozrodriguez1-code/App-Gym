import React, { useState, useMemo } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GymProvider, useGym } from './context/GymContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { WeeklyCalendarStrip } from './components/WeeklyCalendarStrip';
import { ClassCard } from './components/ClassCard';
import { ClassDetailModal } from './components/ClassDetailModal';
import { MembershipScreen } from './components/MembershipScreen';
import { MyBookingsScreen } from './components/MyBookingsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { AccessPassModal } from './components/AccessPassModal';
import { AuthModal } from './components/AuthModal';
import { QuickStatsBar } from './components/QuickStatsBar';
import { Toast } from './components/Toast';
import { GymClass } from './types';
import { Dumbbell, Calendar, Flame, AlertCircle } from 'lucide-react';

function GymAppContent() {
  const [currentTab, setCurrentTab] = useState<string>('clases');
  const [selectedClassForModal, setSelectedClassForModal] = useState<GymClass | null>(null);
  const [isAccessPassOpen, setIsAccessPassOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { classes, selectedDate, selectedCategory, loading, notice, clearNotice } = useGym();
  const { userProfile } = useAuth();

  // Filter classes for the selected date and filters
  const filteredClasses = useMemo(() => {
    return classes.filter((c) => {
      // Date match
      const dateMatch = c.date === selectedDate;
      if (!dateMatch) return false;

      // Category match
      if (selectedCategory !== 'TODAS' && c.category !== selectedCategory) {
        return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = c.title.toLowerCase().includes(query);
        const matchesCoach = c.coachName.toLowerCase().includes(query);
        const matchesDesc = (c.description || '').toLowerCase().includes(query);
        const matchesWod = (c.wod || '').toLowerCase().includes(query);
        return matchesTitle || matchesCoach || matchesDesc || matchesWod;
      }

      return true;
    });
  }, [classes, selectedDate, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0F1115] text-[#F8FAFC] flex flex-col selection:bg-[#FF5E00] selection:text-[#0F1115]">
      
      {/* Toast Alert */}
      <Toast notice={notice} onClose={clearNotice} />

      {/* Top Header Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAccessPass={() => setIsAccessPassOpen(true)}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-5 pb-24 md:pb-12">
        {currentTab === 'clases' && (
          <div className="space-y-6">
            
            {/* Quick KPI Telemetry Bar */}
            <QuickStatsBar
              onOpenAccessPass={() => setIsAccessPassOpen(true)}
              onGoToMembership={() => setCurrentTab('cuota')}
              onGoToBookings={() => setCurrentTab('reservas')}
            />

            {/* Weekly Calendar Carousel & Filter Strip */}
            <WeeklyCalendarStrip
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />

            {/* Classes Section Header */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2">
                <Dumbbell className="w-5 h-5 text-[#FF5E00]" />
                <h2 className="font-display text-lg sm:text-xl font-bold uppercase tracking-wider text-[#F8FAFC]">
                  Sesiones del Día ({filteredClasses.length})
                </h2>
              </div>
              <span className="text-xs text-[#94A3B8] font-mono">
                {selectedDate}
              </span>
            </div>

            {/* Classes Grid */}
            {loading ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-8 h-8 border-2 border-[#FF5E00] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-[#94A3B8]">Cargando programación en tiempo real...</p>
              </div>
            ) : filteredClasses.length === 0 ? (
              <div className="rounded-2xl bg-[#171A21] border border-[#2D333F] p-12 text-center space-y-3">
                <Calendar className="w-12 h-12 text-[#94A3B8] mx-auto opacity-40" />
                <h3 className="font-display text-lg font-bold text-[#F8FAFC]">
                  No Hay Clases para Esta Selección
                </h3>
                <p className="text-xs text-[#94A3B8] max-w-md mx-auto">
                  Prueba a seleccionar otro día en el calendario superior o desactiva los filtros de categoría para ver toda la programación semanal.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredClasses.map((item) => (
                  <ClassCard
                    key={item.id}
                    gymClass={item}
                    onOpenDetails={(c) => setSelectedClassForModal(c)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {currentTab === 'reservas' && (
          <MyBookingsScreen
            onGoToClasses={() => setCurrentTab('clases')}
            onOpenAccessPass={() => setIsAccessPassOpen(true)}
          />
        )}

        {currentTab === 'cuota' && (
          <MembershipScreen
            onOpenAccessPass={() => setIsAccessPassOpen(true)}
          />
        )}

        {currentTab === 'perfil' && (
          <ProfileScreen
            onGoToMembership={() => setCurrentTab('cuota')}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}
      </main>

      {/* Footer Info */}
      <footer className="border-t border-[#2D333F]/70 py-6 text-center text-xs text-[#94A3B8] bg-[#0F1115] hidden md:block">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-display font-bold text-[#F8FAFC]">KINETIC PERFORMANCE</span>
            <span>• Polígono Industrial Los Olivos, Nave 4 • 28021 Madrid</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px]">
            <span>L-V: 06:00 - 22:30</span>
            <span>S-D: 08:00 - 15:00</span>
            <span className="text-[#84CC16]">Torno Automático 24/7 con QR</span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />

      {/* Modals */}
      <ClassDetailModal
        gymClass={selectedClassForModal}
        onClose={() => setSelectedClassForModal(null)}
      />

      <AccessPassModal
        isOpen={isAccessPassOpen}
        onClose={() => setIsAccessPassOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <GymProvider>
        <GymAppContent />
      </GymProvider>
    </AuthProvider>
  );
}
