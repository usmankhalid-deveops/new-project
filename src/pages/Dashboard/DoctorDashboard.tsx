import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, limit, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { Appointment, AppointmentStatus } from '../../types';
import { Users, Calendar, CheckCircle2, XCircle, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { format } from 'date-fns';

import { cn, handleFirestoreError, OperationType } from '../../lib/utils';

const DoctorDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const apptPath = 'appointments';
        const apptQuery = query(
          collection(db, apptPath),
          where('doctorId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        
        try {
          const apptSnap = await getDocs(apptQuery);
          const apptList = apptSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
          
          setAppointments(apptList.slice(0, 5)); // Show recent 5
          setStats({
            total: apptList.length,
            pending: apptList.filter(a => a.status === 'pending').length,
            completed: apptList.filter(a => a.status === 'completed').length,
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, apptPath);
        }
      } catch (err) {
        console.error("Error fetching doctor dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const updateStatus = async (apptId: string, newStatus: AppointmentStatus) => {
    const apptPath = `appointments/${apptId}`;
    try {
      await updateDoc(doc(db, 'appointments', apptId), { status: newStatus });
      setAppointments(prev => prev.map(a => a.id === apptId ? { ...a, status: newStatus } : a));
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, apptPath);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome, Dr. {profile?.name}</h1>
        <p className="text-slate-500 mt-1">Review your patient schedule and health records.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Appointments</p>
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Pending Requests</p>
            <p className="text-2xl font-bold text-slate-900">{stats.pending}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Completed Sessions</p>
            <p className="text-2xl font-bold text-slate-900">{stats.completed}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section>
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-xl font-bold text-slate-900">Recent Appointments</h2>
              <Link to="/appointments" className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">
                View Schedule <ArrowRight size={14} />
              </Link>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                      <th className="px-6 py-4">Patient</th>
                      <th className="px-6 py-4">Date & Time</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {appointments.length > 0 ? (
                      appointments.map((appt) => (
                        <tr key={appt.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-sm">
                                {appt.patientName.charAt(0)}
                              </div>
                              <span className="font-semibold text-slate-900">{appt.patientName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-slate-900">{format(new Date(appt.date), 'MMM dd, yyyy')}</p>
                            <p className="text-xs text-slate-500">{appt.time}</p>
                          </td>
                          <td className="px-6 py-4 text-xs font-bold uppercase">
                            <span className={cn(
                              "px-2.5 py-1 rounded-full",
                              appt.status === 'confirmed' ? "bg-green-100 text-green-700" :
                              appt.status === 'pending' ? "bg-yellow-100 text-yellow-700" :
                              appt.status === 'completed' ? "bg-blue-100 text-blue-700" :
                              "bg-red-50 text-red-600"
                            )}>
                              {appt.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {appt.status === 'pending' && (
                              <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={() => updateStatus(appt.id, 'confirmed')}
                                  className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                  title="Accept"
                                >
                                  <CheckCircle2 size={18} />
                                </button>
                                <button 
                                  onClick={() => updateStatus(appt.id, 'cancelled')}
                                  className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                  title="Reject"
                                >
                                  <XCircle size={18} />
                                </button>
                              </div>
                            )}
                            {appt.status === 'confirmed' && (
                              <button 
                                onClick={() => updateStatus(appt.id, 'completed')}
                                className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                Complete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                          No recent appointments found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
            <h3 className="text-lg font-bold mb-4">Patient Management</h3>
            <div className="space-y-4">
              <Link to="/records" className="block p-4 bg-white/10 hover:bg-white/15 rounded-2xl border border-white/10 transition-all group">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Users size={20} />
                  </div>
                  <ArrowRight size={16} className="text-white/40 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                </div>
                <h4 className="font-bold">Medical History</h4>
                <p className="text-xs text-white/60">Review and update health records for patients.</p>
              </Link>
              <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                <h4 className="text-xs font-black uppercase text-blue-400 mb-2 mt-1 tracking-widest">Tip of the day</h4>
                <p className="text-sm font-medium text-white/80">Always verify patient allergy records before prescribing new medication summaries.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
