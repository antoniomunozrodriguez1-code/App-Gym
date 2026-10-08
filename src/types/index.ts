export type UserRole = 'member' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  currentPlanId?: string;
  planName?: string;
  planRenewalDate?: string;
  membershipNumber?: string;
  phone?: string;
  emergencyContact?: string;
  createdAt: string;
}

export type ClassCategory = 
  | 'WOD - CROSSFIT'
  | 'OLYMPIC LIFTING'
  | 'HYROX'
  | 'ENDURANCE'
  | 'OPEN BOX'
  | 'MOBILITY';

export interface GymClass {
  id: string;
  title: string;
  category: ClassCategory;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  coachName: string;
  coachAvatar: string;
  coachBio?: string;
  capacity: number;
  bookedCount: number;
  description: string;
  location: string;
  wod?: string;
}

export interface Booking {
  id: string;
  classId: string;
  userId: string;
  userName: string;
  userEmail: string;
  classTitle: string;
  classDate: string;
  classTime: string;
  category: ClassCategory;
  status: 'confirmed' | 'cancelled';
  bookedAt: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  badge: string;
  price: number;
  billingPeriod: string; // 'mensual' | 'trimestral' | 'anual'
  popular?: boolean;
  accessHours: string;
  description: string;
  features: string[];
}
