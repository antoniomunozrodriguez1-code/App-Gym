import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { 
  collection, 
  doc, 
  onSnapshot, 
  runTransaction,
  writeBatch,
  query,
  where
} from 'firebase/firestore';
import confetti from 'canvas-confetti';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { GymClass, Booking, MembershipPlan } from '../types';
import { useAuth } from './AuthContext';
import { ensureSeedDataLoaded, INITIAL_PLANS, generateSeedClasses } from '../lib/seedData';

interface GymContextType {
  classes: GymClass[];
  userBookings: Booking[];
  allBookings: Booking[];
  plans: MembershipPlan[];
  loading: boolean;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  bookClass: (classItem: GymClass) => Promise<{ success: boolean; message: string }>;
  cancelBooking: (bookingId: string, classId: string) => Promise<{ success: boolean; message: string }>;
  isClassBookedByUser: (classId: string) => boolean;
  getUserBookingForClass: (classId: string) => Booking | undefined;
  resetDemoData: () => Promise<void>;
  notice: { message: string; type: 'success' | 'error' | 'info' } | null;
  clearNotice: () => void;
}

const GymContext = createContext<GymContextType | undefined>(undefined);

export const GymProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userProfile } = useAuth();
  const [classes, setClasses] = useState<GymClass[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [plans, setPlans] = useState<MembershipPlan[]>(INITIAL_PLANS);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Default selected date to today (YYYY-MM-DD)
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedCategory, setSelectedCategory] = useState<string>('TODAS');

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotice({ message, type });
    setTimeout(() => {
      setNotice((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  const clearNotice = () => setNotice(null);

  // Initialize seed data on start
  useEffect(() => {
    let mounted = true;
    ensureSeedDataLoaded().then(() => {
      if (mounted) {
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Listen to classes collection in Firestore
  useEffect(() => {
    const unsubscribeClasses = onSnapshot(
      collection(db, 'classes'),
      (snapshot) => {
        const loaded: GymClass[] = [];
        snapshot.forEach((d) => {
          loaded.push({ ...(d.data() as GymClass), id: d.id });
        });
        if (loaded.length > 0) {
          // Sort by start time
          loaded.sort((a, b) => a.startTime.localeCompare(b.startTime));
          setClasses(loaded);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'classes');
      }
    );

    // Listen to plans
    const unsubscribePlans = onSnapshot(
      collection(db, 'plans'),
      (snapshot) => {
        const loadedPlans: MembershipPlan[] = [];
        snapshot.forEach((d) => {
          loadedPlans.push({ ...(d.data() as MembershipPlan), id: d.id });
        });
        if (loadedPlans.length > 0) {
          setPlans(loadedPlans);
        }
      },
      (error) => {
        console.warn('Error fetching plans from firestore:', error);
      }
    );

    // Listen to bookings
    const unsubscribeBookings = onSnapshot(
      collection(db, 'bookings'),
      (snapshot) => {
        const loadedBookings: Booking[] = [];
        snapshot.forEach((d) => {
          loadedBookings.push({ ...(d.data() as Booking), id: d.id });
        });
        setAllBookings(loadedBookings);
      },
      (error) => {
        console.warn('Error fetching bookings from firestore:', error);
      }
    );

    return () => {
      unsubscribeClasses();
      unsubscribePlans();
      unsubscribeBookings();
    };
  }, []);

  // Filter bookings for active user
  const userBookings = useMemo(() => {
    if (!userProfile) return [];
    return allBookings.filter(
      (b) => b.userId === userProfile.id && b.status === 'confirmed'
    );
  }, [allBookings, userProfile]);

  const isClassBookedByUser = (classId: string): boolean => {
    return userBookings.some((b) => b.classId === classId);
  };

  const getUserBookingForClass = (classId: string): Booking | undefined => {
    return userBookings.find((b) => b.classId === classId);
  };

  // Book a class
  const bookClass = async (classItem: GymClass): Promise<{ success: boolean; message: string }> => {
    if (!userProfile) {
      showToast('Debes iniciar sesión para reservar una clase', 'error');
      return { success: false, message: 'No autenticado' };
    }

    if (isClassBookedByUser(classItem.id)) {
      showToast('Ya tienes una plaza reservada para esta sesión', 'info');
      return { success: false, message: 'Ya reservada' };
    }

    try {
      const classRef = doc(db, 'classes', classItem.id);
      const bookingId = `bkg-${userProfile.id}-${classItem.id}`;
      const bookingRef = doc(db, 'bookings', bookingId);

      await runTransaction(db, async (transaction) => {
        const classDoc = await transaction.get(classRef);
        if (!classDoc.exists()) {
          throw new Error('La clase no existe o ha sido cancelada.');
        }

        const classData = classDoc.data() as GymClass;
        if (classData.bookedCount >= classData.capacity) {
          throw new Error('Lo sentimos, todas las plazas de esta clase se han completado.');
        }

        const newBooking: Booking = {
          id: bookingId,
          classId: classItem.id,
          userId: userProfile.id,
          userName: userProfile.name,
          userEmail: userProfile.email,
          classTitle: classItem.title,
          classDate: classItem.date,
          classTime: `${classItem.startTime} - ${classItem.endTime}`,
          category: classItem.category,
          status: 'confirmed',
          bookedAt: new Date().toISOString()
        };

        transaction.set(bookingRef, newBooking);
        transaction.update(classRef, {
          bookedCount: (classData.bookedCount || 0) + 1
        });
      });

      // Confetti burst for great athletic feedback
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#FF5E00', '#84CC16', '#38BDF8']
        });
      } catch {
        // Safe fallback
      }

      showToast(`¡Plaza confirmada en ${classItem.title}!`, 'success');
      return { success: true, message: 'Reserva completada con éxito' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al reservar la clase';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  // Cancel a booking
  const cancelBooking = async (bookingId: string, classId: string): Promise<{ success: boolean; message: string }> => {
    if (!userProfile) {
      showToast('Debes iniciar sesión para gestionar tu reserva', 'error');
      return { success: false, message: 'No autenticado' };
    }

    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      const classRef = doc(db, 'classes', classId);

      await runTransaction(db, async (transaction) => {
        const classDoc = await transaction.get(classRef);
        
        transaction.delete(bookingRef);

        if (classDoc.exists()) {
          const currentCount = classDoc.data().bookedCount || 0;
          const newCount = Math.max(0, currentCount - 1);
          transaction.update(classRef, {
            bookedCount: newCount
          });
        }
      });

      showToast('Reserva cancelada. La plaza ha quedado liberada.', 'info');
      return { success: true, message: 'Reserva cancelada' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cancelar la reserva';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  // Reset/reseed demo data if user wants fresh classes
  const resetDemoData = async () => {
    try {
      setLoading(true);
      const batch = writeBatch(db);
      const freshClasses = generateSeedClasses();
      for (const cls of freshClasses) {
        batch.set(doc(db, 'classes', cls.id), cls);
      }
      for (const p of INITIAL_PLANS) {
        batch.set(doc(db, 'plans', p.id), p);
      }
      await batch.commit();
      showToast('Datos del box y calendario reiniciados correctamente', 'success');
    } catch (err) {
      console.error('Error resetting demo data:', err);
      showToast('Error al reiniciar datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GymContext.Provider
      value={{
        classes,
        userBookings,
        allBookings,
        plans,
        loading,
        selectedDate,
        setSelectedDate,
        selectedCategory,
        setSelectedCategory,
        bookClass,
        cancelBooking,
        isClassBookedByUser,
        getUserBookingForClass,
        resetDemoData,
        notice,
        clearNotice
      }}
    >
      {children}
    </GymContext.Provider>
  );
};

export const useGym = () => {
  const context = useContext(GymContext);
  if (!context) {
    throw new Error('useGym must be used within a GymProvider');
  }
  return context;
};
