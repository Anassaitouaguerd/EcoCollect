export interface User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
    birthDate: string;
    profilePhoto?: string;
    role: 'particulier' | 'collecteur';
    points: number;
    requests: RecyclingRequest[];
  }
  
  export interface RecyclingRequest {
    id: string;
    wasteType: 'plastique' | 'verre' | 'papier' | 'metal';
    photos?: string[];
    weight: number; // in grams
    address: string;
    date: string; // ISO date string
    timeSlot: string;
    notes?: string;
    status: 'en attente' | 'occupée' | 'en cours' | 'validée' | 'rejetée';
  }