export type Role = 'patient' | 'doctor' | 'admin';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: Role;
  createdAt?: any;
  licenseNumber?: string;
  verificationStatus?: 'pending' | 'verified' | 'rejected';
  phone?: string;
}

export interface DoctorProfile {
  userId: string;
  name: string;
  specialization: string;
  experience: string;
  availableDays: string[];
  bio?: string;
  rating?: number;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  createdAt: any;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  diagnosis: string;
  prescription: string;
  notes: string;
  fileUrl?: string;
  timestamp: any;
}
