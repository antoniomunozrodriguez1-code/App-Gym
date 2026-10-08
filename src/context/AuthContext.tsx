import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserProfile } from '../types';
import { DEMO_MEMBERS } from '../lib/seedData';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  loginAsDemoMember: (memberId: string) => void;
  logout: () => Promise<void>;
  updateUserPlan: (planId: string, planName: string) => Promise<void>;
  updateUserProfileData: (data: Partial<UserProfile>) => Promise<void>;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Sync or fetch profile when Firebase Auth user changes
  useEffect(() => {
    // Check if demo user was saved in localStorage
    const savedDemoId = localStorage.getItem('kinetic_demo_user_id');
    if (savedDemoId) {
      const demoUser = DEMO_MEMBERS.find(m => m.id === savedDemoId) || DEMO_MEMBERS[0];
      setUserProfile(demoUser);
      setIsDemoMode(true);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        setIsDemoMode(false);
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            setUserProfile(snap.data() as UserProfile);
          } else {
            // Create initial profile in Firestore
            const initialProfile: UserProfile = {
              id: user.uid,
              name: user.displayName || user.email?.split('@')[0] || 'Atleta Kinetic',
              email: user.email || '',
              avatarUrl: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
              role: 'member',
              currentPlanId: 'plan-pro-unlimited',
              planName: 'ILIMITADO PRO',
              planRenewalDate: '1 de Noviembre, 2026',
              membershipNumber: `KP-${Math.floor(1000 + Math.random() * 9000)}`,
              phone: '+34 600 000 000',
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, initialProfile);
            setUserProfile(initialProfile);
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
          // Fallback to local profile
          setUserProfile({
            id: user.uid,
            name: user.displayName || 'Atleta Kinetic',
            email: user.email || '',
            role: 'member',
            currentPlanId: 'plan-pro-unlimited',
            planName: 'ILIMITADO PRO',
            planRenewalDate: '1 de Noviembre, 2026',
            membershipNumber: 'KP-8821',
            createdAt: new Date().toISOString()
          });
        }
      } else {
        // If no user and no demo set, default to first demo member for instant review
        const defaultMember = DEMO_MEMBERS[0];
        setUserProfile(defaultMember);
        setIsDemoMode(true);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    localStorage.removeItem('kinetic_demo_user_id');
    setIsDemoMode(false);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      console.error('Google Sign In Error:', err);
      throw err;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    localStorage.removeItem('kinetic_demo_user_id');
    setIsDemoMode(false);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err) {
      console.error('Email Login Error:', err);
      throw err;
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    localStorage.removeItem('kinetic_demo_user_id');
    setIsDemoMode(false);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (cred.user) {
        await updateProfile(cred.user, { displayName: name });
        const newProfile: UserProfile = {
          id: cred.user.uid,
          name,
          email,
          role: 'member',
          currentPlanId: 'plan-pro-unlimited',
          planName: 'ILIMITADO PRO',
          planRenewalDate: '1 de Noviembre, 2026',
          membershipNumber: `KP-${Math.floor(1000 + Math.random() * 9000)}`,
          phone: '',
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'users', cred.user.uid), newProfile);
        setUserProfile(newProfile);
      }
    } catch (err) {
      console.error('Email Register Error:', err);
      throw err;
    }
  };

  const loginAsDemoMember = (memberId: string) => {
    const member = DEMO_MEMBERS.find(m => m.id === memberId) || DEMO_MEMBERS[0];
    localStorage.setItem('kinetic_demo_user_id', member.id);
    setIsDemoMode(true);
    setUserProfile(member);
    setCurrentUser(null);
  };

  const logout = async () => {
    localStorage.removeItem('kinetic_demo_user_id');
    setIsDemoMode(false);
    setUserProfile(null);
    setCurrentUser(null);
    await firebaseSignOut(auth);
  };

  const updateUserPlan = async (planId: string, planName: string) => {
    if (!userProfile) return;
    const updated = {
      ...userProfile,
      currentPlanId: planId,
      planName: planName,
      planRenewalDate: '1 de Diciembre, 2026'
    };
    setUserProfile(updated);

    if (!isDemoMode && currentUser) {
      try {
        await updateDoc(doc(db, 'users', currentUser.uid), {
          currentPlanId: planId,
          planName: planName,
          planRenewalDate: '1 de Diciembre, 2026'
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}`);
      }
    } else if (isDemoMode) {
      try {
        await setDoc(doc(db, 'users', userProfile.id), updated, { merge: true });
      } catch (err) {
        console.warn('Demo plan update error:', err);
      }
    }
  };

  const updateUserProfileData = async (data: Partial<UserProfile>) => {
    if (!userProfile) return;
    const updated = { ...userProfile, ...data };
    setUserProfile(updated);

    const targetId = isDemoMode ? userProfile.id : currentUser?.uid;
    if (targetId) {
      try {
        await setDoc(doc(db, 'users', targetId), updated, { merge: true });
      } catch (err) {
        console.warn('Profile update error:', err);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        loginAsDemoMember,
        logout,
        updateUserPlan,
        updateUserProfileData,
        isDemoMode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
