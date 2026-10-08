import { 
  collection, 
  doc, 
  getDocs, 
  writeBatch, 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { GymClass, MembershipPlan, Booking } from '../types';

export const INITIAL_PLANS: MembershipPlan[] = [
  {
    id: 'plan-pro-unlimited',
    name: 'ILIMITADO PRO',
    badge: 'MÁS POPULAR',
    price: 79,
    billingPeriod: 'mensual',
    popular: true,
    accessHours: 'Acceso total de 06:00 a 22:30',
    description: 'Tarifa completa sin límites de clases dirigidas ni uso de instalaciones. Diseñado para atletas que entrenan a diario.',
    features: [
      'Clases ilimitadas de WOD CrossFit',
      'Acceso total a sesiones Hyrox y Halterofilia',
      'Open Box libre en horario ininterrumpido',
      'Reserva anticipada con 7 días de antelación',
      'Planificación digital diaria (WOD y cargas)',
      'Descuento 15% en cafetería y suplementación',
      'Invitación gratuita a 2 amigos al mes'
    ]
  },
  {
    id: 'plan-hyrox-athletic',
    name: 'HYROX & ATHLETIC',
    badge: 'RESISTENCIA',
    price: 65,
    billingPeriod: 'mensual',
    popular: false,
    accessHours: 'Lunes a Sábado de 07:00 a 21:00',
    description: 'Orientado a atletas que buscan competir en Hyrox, carreras de obstáculos o maximizar su capacidad cardiovascular y fuerza.',
    features: [
      'Todas las sesiones de Hyrox & Engine 60\'',
      'Acceso a pista exterior y Skierg / Rower Zone',
      '3 clases semanales de WOD o Halterofilia',
      'Reserva con 5 días de antelación',
      'Pacing test mensual y registro de marcas'
    ]
  },
  {
    id: 'plan-crossfit-3x',
    name: 'CROSSFIT 3X SEMANA',
    badge: 'FLEXIBLE',
    price: 49,
    billingPeriod: 'mensual',
    popular: false,
    accessHours: 'Hasta 3 clases semanales',
    description: 'Ideal para compaginar el entrenamiento funcional de alta intensidad con otras disciplinas deportivas o trabajo.',
    features: [
      '3 reservas semanales de cualquier clase',
      'Acceso libre a Open Box los sábados',
      'Reserva con 4 días de antelación',
      'Recuperación de clases no disfrutadas (15 días)',
      'App de tracking y tabla de récords'
    ]
  },
  {
    id: 'plan-openbox',
    name: 'OPEN BOX ACCESS',
    badge: 'AUTÓNOMO',
    price: 39,
    billingPeriod: 'mensual',
    popular: false,
    accessHours: '06:00 a 22:00 todos los días',
    description: 'Uso libre de todas las jaulas de potencia, tarimas de halterofilia, mancuernas y máquinas de cardio sin monitor.',
    features: [
      'Acceso libre a zona de barras y mancuernas',
      'Disponibilidad de material de competición (Rogue/Eleiko)',
      'Zona de estiramientos y mobility equipment',
      'Check-in automático con código QR',
      'No incluye clases dirigidas con entrenador'
    ]
  }
];

export const DEMO_MEMBERS = [
  {
    id: 'socio-antonio-munoz',
    name: 'Antonio Muñoz',
    email: 'antoniomunozrodriguez1@gmail.com',
    role: 'member' as const,
    currentPlanId: 'plan-pro-unlimited',
    planName: 'ILIMITADO PRO',
    planRenewalDate: '1 de Noviembre, 2026',
    membershipNumber: 'KP-0842',
    phone: '+34 612 345 678',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    createdAt: new Date().toISOString()
  },
  {
    id: 'socio-elena-rivas',
    name: 'Elena Rivas',
    email: 'elena.crossfit@kinetic.es',
    role: 'member' as const,
    currentPlanId: 'plan-pro-unlimited',
    planName: 'ILIMITADO PRO',
    planRenewalDate: '28 de Octubre, 2026',
    membershipNumber: 'KP-0719',
    phone: '+34 688 123 456',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
    createdAt: new Date().toISOString()
  },
  {
    id: 'socio-carlos-ortiz',
    name: 'Carlos Ortiz',
    email: 'carlos.hyrox@kinetic.es',
    role: 'member' as const,
    currentPlanId: 'plan-hyrox-athletic',
    planName: 'HYROX & ATHLETIC',
    planRenewalDate: '15 de Noviembre, 2026',
    membershipNumber: 'KP-1025',
    phone: '+34 644 987 654',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    createdAt: new Date().toISOString()
  }
];

// Helper to generate dates relative to today
function getDateString(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

export function generateSeedClasses(): GymClass[] {
  const coaches = [
    {
      name: 'Marcos "Viking" Torres',
      avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=200&q=80',
      bio: 'Head Coach L3 CrossFit, competidor nacional y especialista en programación de fuerza.'
    },
    {
      name: 'Laura Vega',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      bio: 'Entrenadora de Halterofilia FEDH y gimnásticos avanzados. 8 años en Kinetic.'
    },
    {
      name: 'Adrián Castillo',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      bio: 'Especialista en Hyrox Elite, biomecánica de carrera y test de umbrales.'
    },
    {
      name: 'Sofi Valero',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      bio: 'Fisioterapeuta deportiva y coach de movilidad, recuperación y readaptación.'
    }
  ];

  const templates = [
    {
      title: 'WOD CrossFit: Murph Preparation',
      category: 'WOD - CROSSFIT' as const,
      startTime: '07:00',
      endTime: '08:00',
      coach: coaches[0],
      capacity: 14,
      bookedCount: 12,
      location: 'Box Central A',
      description: 'Sesión enfocada en volumen aeróbico y resistencia muscular.',
      wod: 'WARM-UP: 3 Rondas 200m Run + 10 Air Squats + 5 Inchworms.\nSTRENGTH: Strict Pull-ups 4x6 @tempo 21X1.\nMETCON: 5 RFT (Time Cap 22\'): 400m Run + 20 Push-ups + 30 Air Squats.'
    },
    {
      title: 'Olympic Lifting: Snatch Technique',
      category: 'OLYMPIC LIFTING' as const,
      startTime: '08:30',
      endTime: '09:30',
      coach: coaches[1],
      capacity: 10,
      bookedCount: 9, // only 1 spot left!
      location: 'Tarimas Halterofilia',
      description: 'Trabajo técnico de primer tirón y recepción en sentadilla.',
      wod: 'WARM-UP: Barbell complex (Hang Muscle Snatch + OHS).\nDRILL: 5x2 Snatch Balance @60%.\nMAIN: Snatch from Blocks: 6x1 aumentando carga (hasta 85% 1RM).'
    },
    {
      title: 'Hyrox Engine 60\'',
      category: 'HYROX' as const,
      startTime: '10:00',
      endTime: '11:00',
      coach: coaches[2],
      capacity: 16,
      bookedCount: 10,
      location: 'Pista Exterior & Sled Track',
      description: 'Simulación de estaciones de carrera combinadas con empuje de trineo.',
      wod: 'PARTNERS WORKOUT:\n4 Rondas por tiempo:\n- 1.000m SkiErg\n- 50m Sled Push (120kg)\n- 1.000m Row\n- 80 Wall Balls (9kg / 6kg)'
    },
    {
      title: 'Open Box Asistido',
      category: 'OPEN BOX' as const,
      startTime: '12:00',
      endTime: '13:30',
      coach: coaches[0],
      capacity: 12,
      bookedCount: 4,
      location: 'Box Central B',
      description: 'Espacio libre para realizar trabajo accesorio o recuperar el WOD del día con supervisión técnica.',
      wod: 'Libre elección del atleta. Coach disponible para corrección de técnica y control de cargas.'
    },
    {
      title: 'WOD Power & Cleans',
      category: 'WOD - CROSSFIT' as const,
      startTime: '14:00',
      endTime: '15:00',
      coach: coaches[1],
      capacity: 14,
      bookedCount: 13, // 1 spot left!
      location: 'Box Central A',
      description: 'Combinación de fuerza explosiva con barra y acondicionamiento metabólico.',
      wod: 'EMOM 10\': 2 Power Cleans @75%.\nLUEGO AMRAP 12\': 12 Burpees over the bar + 9 Bar-Facing Wall Walks + 6 Squat Cleans (60/40kg).'
    },
    {
      title: 'Mobility & Joint Recovery',
      category: 'MOBILITY' as const,
      startTime: '17:00',
      endTime: '18:00',
      coach: coaches[3],
      capacity: 12,
      bookedCount: 6,
      location: 'Sala Wellness & Recovery',
      description: 'Descompresión espinal, apertura de cadera y movilidad torácica para favorecer la recuperación neuromuscular.',
      wod: 'Foam rolling miofascial, trabajo con gomas elásticas, estiramientos activos PNF y respiración diafragmática 4-7-8.'
    },
    {
      title: 'WOD CrossFit Prime Time',
      category: 'WOD - CROSSFIT' as const,
      startTime: '18:30',
      endTime: '19:30',
      coach: coaches[0],
      capacity: 16,
      bookedCount: 15, // 1 spot left!
      location: 'Box Central A',
      description: 'La sesión estrella de la tarde con el equipo completo.',
      wod: 'CHIPPER FOR TIME:\n- 50 Cal Echo Bike\n- 40 Toes to Bar\n- 30 Box Jumps Over (24"/20")\n- 20 Dumbbell Snatches (22.5/15kg)\n- 10 Muscle-ups / Chest to Bar'
    },
    {
      title: 'Hyrox Intensity & Laps',
      category: 'HYROX' as const,
      startTime: '19:45',
      endTime: '20:45',
      coach: coaches[2],
      capacity: 14,
      bookedCount: 11,
      location: 'Pista Exterior',
      description: 'Control de cadencia de carrera en cinta y estaciones de Burpee Broad Jumps.',
      wod: 'Intervalos aeróbicos al 85% VO2max:\n6 series de 800m Run + 80m Lunges con saco lastrado (20kg) + 200m Farmers Carry.'
    },
    {
      title: 'Endurance & Capillary Run',
      category: 'ENDURANCE' as const,
      startTime: '20:45',
      endTime: '21:30',
      coach: coaches[2],
      capacity: 14,
      bookedCount: 7,
      location: 'Pista Exterior',
      description: 'Ritmo suave de base aeróbica para cerrar la jornada.',
      wod: 'Zona 2 continua en tapices curvos y remo Concept2. 40 minutos sin interrupción con monitor de frecuencia cardíaca.'
    }
  ];

  const classes: GymClass[] = [];

  // Generate for days -1 (yesterday) through +5 (next 5 days)
  for (let dayOffset = -1; dayOffset <= 5; dayOffset++) {
    const classDate = getDateString(dayOffset);
    templates.forEach((tpl, idx) => {
      classes.push({
        id: `class-${classDate}-${idx}`,
        title: tpl.title,
        category: tpl.category,
        date: classDate,
        startTime: tpl.startTime,
        endTime: tpl.endTime,
        coachName: tpl.coach.name,
        coachAvatar: tpl.coach.avatar,
        coachBio: tpl.coach.bio,
        capacity: tpl.capacity,
        bookedCount: Math.min(tpl.capacity, tpl.bookedCount),
        description: tpl.description,
        location: tpl.location,
        wod: tpl.wod
      });
    });
  }

  return classes;
}

export function generateSeedBookings(classes: GymClass[]): Booking[] {
  const antonio = DEMO_MEMBERS[0];
  const elena = DEMO_MEMBERS[1];

  // Book Antonio in 2 classes (one today, one tomorrow)
  const todayStr = getDateString(0);
  const tomorrowStr = getDateString(1);

  const bookings: Booking[] = [];

  const todayClass = classes.find(c => c.date === todayStr && c.category === 'WOD - CROSSFIT');
  if (todayClass) {
    bookings.push({
      id: `booking-${antonio.id}-${todayClass.id}`,
      classId: todayClass.id,
      userId: antonio.id,
      userName: antonio.name,
      userEmail: antonio.email,
      classTitle: todayClass.title,
      classDate: todayClass.date,
      classTime: `${todayClass.startTime} - ${todayClass.endTime}`,
      category: todayClass.category,
      status: 'confirmed',
      bookedAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString()
    });
  }

  const tomorrowClass = classes.find(c => c.date === tomorrowStr && c.category === 'OLYMPIC LIFTING');
  if (tomorrowClass) {
    bookings.push({
      id: `booking-${antonio.id}-${tomorrowClass.id}`,
      classId: tomorrowClass.id,
      userId: antonio.id,
      userName: antonio.name,
      userEmail: antonio.email,
      classTitle: tomorrowClass.title,
      classDate: tomorrowClass.date,
      classTime: `${tomorrowClass.startTime} - ${tomorrowClass.endTime}`,
      category: tomorrowClass.category,
      status: 'confirmed',
      bookedAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString()
    });
  }

  // Elena's booking
  const elenaClass = classes.find(c => c.date === todayStr && c.category === 'HYROX');
  if (elenaClass) {
    bookings.push({
      id: `booking-${elena.id}-${elenaClass.id}`,
      classId: elenaClass.id,
      userId: elena.id,
      userName: elena.name,
      userEmail: elena.email,
      classTitle: elenaClass.title,
      classDate: elenaClass.date,
      classTime: `${elenaClass.startTime} - ${elenaClass.endTime}`,
      category: elenaClass.category,
      status: 'confirmed',
      bookedAt: new Date().toISOString()
    });
  }

  return bookings;
}

export async function ensureSeedDataLoaded(): Promise<void> {
  try {
    // Check if plans exist
    const plansSnap = await getDocs(collection(db, 'plans'));
    const classesSnap = await getDocs(collection(db, 'classes'));

    const batch = writeBatch(db);
    let countToCommit = 0;

    // Seed plans if none exist
    if (plansSnap.empty) {
      console.log('Seeding initial membership plans...');
      for (const plan of INITIAL_PLANS) {
        batch.set(doc(db, 'plans', plan.id), plan);
        countToCommit++;
      }
    }

    // Seed demo members in users collection
    for (const member of DEMO_MEMBERS) {
      batch.set(doc(db, 'users', member.id), member, { merge: true });
      countToCommit++;
    }

    // Seed classes if empty or outdated
    let seededClasses: GymClass[] = [];
    if (classesSnap.empty || classesSnap.size < 5) {
      console.log('Seeding classes calendar...');
      seededClasses = generateSeedClasses();
      for (const cls of seededClasses) {
        batch.set(doc(db, 'classes', cls.id), cls);
        countToCommit++;
      }

      // Seed sample bookings
      const sampleBookings = generateSeedBookings(seededClasses);
      for (const bkg of sampleBookings) {
        batch.set(doc(db, 'bookings', bkg.id), bkg);
        countToCommit++;
      }
    }

    if (countToCommit > 0) {
      await batch.commit();
      console.log(`Seed data committed: ${countToCommit} operations.`);
    }
  } catch (error) {
    console.warn('Initial seeding encountered an error (or already initialized):', error);
  }
}
