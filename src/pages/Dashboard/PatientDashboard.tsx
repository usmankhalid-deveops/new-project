import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { Appointment, MedicalRecord } from '../../types';
import { Calendar, FileText, ArrowRight, Clock, CheckCircle2, AlertCircle, ChevronRight, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { cn, handleFirestoreError, OperationType } from '../../lib/utils';

const PatientDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [recentRecords, setRecentRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const downloadAllRecords = () => {
    if (recentRecords.length === 0) {
      alert("No medical records available to download.");
      return;
    }

    let content = `HEAL SYNC - COMPLETE MEDICAL HISTORY\n`;
    content += `Patient: ${profile?.name}\n`;
    content += `Date Generated: ${format(new Date(), 'PPPP')}\n`;
    content += `-------------------------------------------\n\n`;

    recentRecords.forEach((record, index) => {
      content += `RECORD #${index + 1}\n`;
      content += `Diagnosis: ${record.diagnosis}\n`;
      content += `Date: ${format(new Date(record.timestamp), 'PPP')}\n`;
      content += `Doctor: Dr. ${record.doctorName}\n`;
      content += `Prescription: ${record.prescription}\n`;
      if (record.notes) content += `Notes: ${record.notes}\n`;
      content += `-------------------------------------------\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `medical_history_${user?.uid}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        // Fetch recent appointments
        const apptPath = 'appointments';
        const recordPath = 'medicalRecords';

        // Fetch appointments (sort on client side to avoid index requirement)
        const apptQuery = query(
          collection(db, apptPath),
          where('patientId', '==', user.uid),
          limit(10) // Fetch more then slice
        );
        
        try {
          const apptSnap = await getDocs(apptQuery);
          const appts = apptSnap.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as Appointment))
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 3);
          setRecentAppointments(appts);
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, apptPath);
        }

        // Fetch records (sort on client side)
        const recordQuery = query(
          collection(db, recordPath),
          where('patientId', '==', user.uid),
          limit(10)
        );
        try {
          const recordSnap = await getDocs(recordQuery);
          const records = recordSnap.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as MedicalRecord))
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 3);
          setRecentRecords(records);
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, recordPath);
        }
      } catch (err) {
        console.error("Error fetching patient dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Hello, {profile?.name}!</h1>
        <p className="text-slate-500 mt-1">Here's what's happening with your health profile.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Recent Appointments */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="text-blue-600 w-6 h-6" />
                Recent Appointments
              </h2>
              <Link to="/appointments" className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1">
                View All <ArrowRight size={14} />
              </Link>
            </div>

            <div className="space-y-3">
              {recentAppointments.length > 0 ? (
                recentAppointments.map((appt) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={appt.id} 
                    className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4 transition-all hover:border-blue-200 hover:shadow-sm"
                  >
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex flex-col items-center justify-center">
                      <span className="text-xs font-bold uppercase">{format(new Date(appt.date), 'MMM')}</span>
                      <span className="text-lg font-black leading-none">{format(new Date(appt.date), 'dd')}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 truncate">Dr. {appt.doctorName}</h4>
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <Clock size={12} /> {appt.time}
                      </p>
                    </div>
                    <div className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold uppercase",
                      appt.status === 'confirmed' ? "bg-green-100 text-green-700" :
                      appt.status === 'pending' ? "bg-yellow-100 text-yellow-700" :
                      appt.status === 'completed' ? "bg-blue-100 text-blue-700" :
                      "bg-slate-100 text-slate-500"
                    )}>
                      {appt.status}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center">
                  <p className="text-slate-500">No appointments scheduled.</p>
                  <Link to="/doctors" className="mt-2 inline-block text-blue-600 font-bold hover:underline">Book your first one</Link>
                </div>
              )}
            </div>
          </section>

          {/* Recent Records */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="text-blue-600 w-6 h-6" />
                Medical Records
              </h2>
              <Link to="/records" className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1">
                View All <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentRecords.length > 0 ? (
                recentRecords.map((record) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={record.id} 
                    className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-200 transition-all group"
                  >
                    <div className="w-10 h-10 bg-slate-100 text-slate-500 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      <FileText size={20} />
                    </div>
                    <h4 className="font-bold text-slate-900 truncate">{record.diagnosis}</h4>
                    <p className="text-xs text-slate-500 mb-2">By Dr. {record.doctorName}</p>
                    <div className="text-xs font-medium text-slate-400">
                      {format(new Date(record.timestamp), 'MMM dd, yyyy')}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center">
                  <p className="text-slate-500">No medical records found.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-200 overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Quick Actions</h3>
              <p className="text-blue-100 text-sm mb-6">Access common features quickly.</p>
              <div className="space-y-3">
                <Link to="/doctors" className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl px-4 flex items-center justify-between group transition-all">
                  <span className="font-semibold">Book Appointment</span>
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/records" className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl px-4 flex items-center justify-between group transition-all">
                  <span className="font-semibold">Upload Report</span>
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <button 
                  onClick={downloadAllRecords}
                  className="w-full py-3 bg-white text-blue-600 hover:bg-blue-50 rounded-xl px-4 flex items-center justify-between group transition-all font-bold"
                >
                  <span className="flex items-center gap-2">
                    <Download size={18} />
                    Download History
                  </span>
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute top-10 -left-10 w-24 h-24 bg-white/5 rounded-full blur-xl" />
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="text-green-500 w-5 h-5" />
              Health Tips
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <p className="text-sm text-slate-600">Drink at least 8 glasses of water today.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                <p className="text-sm text-slate-600">Aim for 15 minutes of sunlight in the morning.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                <p className="text-sm text-slate-600">Practice mindful breathing for 5 minutes.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
