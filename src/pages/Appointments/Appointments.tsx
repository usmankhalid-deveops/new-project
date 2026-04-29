import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { Appointment, AppointmentStatus } from '../../types';
import { Calendar, Clock, User, CheckCircle2, XCircle, Search, Filter, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

const Appointments: React.FC = () => {
  const { user, profile } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<AppointmentStatus | 'all'>('all');

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user || !profile) return;
      try {
        const field = profile.role === 'patient' ? 'patientId' : 'doctorId';
        const q = query(
          collection(db, 'appointments'),
          where(field, '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        setAppointments(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment)));
      } catch (err) {
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [user, profile]);

  const updateStatus = async (apptId: string, newStatus: AppointmentStatus) => {
    try {
      await updateDoc(doc(db, 'appointments', apptId), { status: newStatus });
      setAppointments(prev => prev.map(a => a.id === apptId ? { ...a, status: newStatus } : a));
    } catch (err) {
      console.error("Error updating appointment status:", err);
    }
  };

  const filteredAppointments = filter === 'all' 
    ? appointments 
    : appointments.filter(a => a.status === filter);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Appointments</h1>
          <p className="text-slate-500 mt-1">Manage your scheduled sessions and consultations.</p>
        </div>

        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 self-start">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab as any)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all",
                filter === tab 
                  ? "bg-slate-900 text-white shadow-sm" 
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {filteredAppointments.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredAppointments.map((appt) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={appt.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center gap-6 hover:border-blue-200 hover:shadow-sm transition-all"
              >
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] font-black uppercase leading-none mb-1">{format(new Date(appt.date), 'MMM')}</span>
                  <span className="text-xl font-black leading-none">{format(new Date(appt.date), 'dd')}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900 text-lg truncate flex items-center gap-2">
                       {profile?.role === 'patient' ? `Dr. ${appt.doctorName}` : appt.patientName}
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4">
                    <p className="text-sm text-slate-500 flex items-center gap-1.5 font-medium">
                      <Clock size={14} className="text-slate-400" /> {appt.time}
                    </p>
                    <p className="text-sm text-slate-500 flex items-center gap-1.5 font-medium">
                      <Calendar size={14} className="text-slate-400" /> {format(new Date(appt.date), 'EEEE')}
                    </p>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-2 border-t md:border-t-0 pt-4 md:pt-0">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                    appt.status === 'confirmed' ? "bg-green-100 text-green-700" :
                    appt.status === 'pending' ? "bg-yellow-100 text-yellow-700" :
                    appt.status === 'completed' ? "bg-blue-100 text-blue-700" :
                    "bg-red-50 text-red-600"
                  )}>
                    {appt.status}
                  </span>

                  {profile?.role === 'doctor' && appt.status === 'pending' && (
                    <div className="flex items-center gap-2 mt-2">
                      <button 
                        onClick={() => updateStatus(appt.id, 'confirmed')}
                        className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-200/50"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => updateStatus(appt.id, 'cancelled')}
                        className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-200 transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  )}

                  {profile?.role === 'doctor' && appt.status === 'confirmed' && (
                    <button 
                      onClick={() => updateStatus(appt.id, 'completed')}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      Mark Completed
                    </button>
                  )}

                  {profile?.role === 'patient' && appt.status === 'pending' && (
                    <button 
                      onClick={() => updateStatus(appt.id, 'cancelled')}
                      className="mt-2 text-xs font-bold text-red-500 hover:underline"
                    >
                      Cancel Request
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-6">
            <Calendar size={40} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">No appointments found</h3>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto">You don't have any appointments matching the selected filter.</p>
        </div>
      )}
    </div>
  );
};

// Utils
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default Appointments;
