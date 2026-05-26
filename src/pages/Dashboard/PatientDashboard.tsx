import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, limit, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { Appointment, MedicalRecord } from '../../types';
import { Calendar, FileText, ArrowRight, Clock, CheckCircle2, AlertCircle, ChevronRight, Download, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { cn, handleFirestoreError, OperationType } from '../../lib/utils';
import { generateMedicalHistoryPDF } from '../../lib/pdfUtils';

const PatientDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>(() => {
    try {
      const lastUid = localStorage.getItem('hs_last_uid');
      if (lastUid) {
        const cached = localStorage.getItem(`hs_cached_patient_appts_${lastUid}`);
        if (cached) return JSON.parse(cached);
      }
    } catch (e) {}
    return [];
  });
  const [recentRecords, setRecentRecords] = useState<MedicalRecord[]>(() => {
    try {
      const lastUid = localStorage.getItem('hs_last_uid');
      if (lastUid) {
        const cached = localStorage.getItem(`hs_cached_patient_records_${lastUid}`);
        if (cached) return JSON.parse(cached);
      }
    } catch (e) {}
    return [];
  });
  const [patientEmails, setPatientEmails] = useState<any[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<any | null>(null);
  const [currentPhone, setCurrentPhone] = useState(profile?.phone || '');
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [tempPhone, setTempPhone] = useState('');
  const [phoneSaving, setPhoneSaving] = useState(false);

  useEffect(() => {
    if (profile?.phone) {
      setCurrentPhone(profile.phone);
    }
  }, [profile?.phone]);

  const savePhoneNumber = async () => {
    if (!user) return;
    setPhoneSaving(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { phone: tempPhone.trim() });
      setCurrentPhone(tempPhone.trim());
      
      // Update local storage cached profile
      const cacheKey = `hs_profile_${user.uid}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        parsed.phone = tempPhone.trim();
        localStorage.setItem(cacheKey, JSON.stringify(parsed));
        localStorage.setItem('hs_cached_profile', JSON.stringify(parsed));
      }
      setIsEditingPhone(false);
    } catch (err: any) {
      alert("Failed to update mobile device number: " + err.message);
    } finally {
      setPhoneSaving(false);
    }
  };
  const [loading, setLoading] = useState(() => {
    try {
      const lastUid = localStorage.getItem('hs_last_uid');
      if (lastUid) {
        const cachedAppts = localStorage.getItem(`hs_cached_patient_appts_${lastUid}`);
        const cachedRecords = localStorage.getItem(`hs_cached_patient_records_${lastUid}`);
        if (cachedAppts && cachedRecords) return false;
      }
    } catch (e) {}
    return true;
  });

  const downloadAllRecords = () => {
    if (recentRecords.length === 0) {
      alert("No medical records available to download.");
      return;
    }
    generateMedicalHistoryPDF(profile?.name || 'Patient', recentRecords);
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
          localStorage.setItem(`hs_cached_patient_appts_${user.uid}`, JSON.stringify(appts));
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
          localStorage.setItem(`hs_cached_patient_records_${user.uid}`, JSON.stringify(records));
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, recordPath);
        }

        // Fetch secure system emails
        try {
          const emailQuery = query(
            collection(db, 'patient_emails'),
            where('patientId', '==', user.uid),
            limit(15)
          );
          const emailSnap = await getDocs(emailQuery);
          const emails = emailSnap.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          setPatientEmails(emails);
        } catch (mailErr) {
          console.warn("Could not retrieve secure patient notifications:", mailErr);
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
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-display">Hello, {profile?.name}!</h1>
        <p className="text-slate-500 mt-1">Here's what's happening with your health profile.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Recent Appointments */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 font-display">
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
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 font-display">
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

          {/* Secure System Emails Inbox */}
          <section className="bg-slate-50/50 p-6 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200/60 pb-3">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 font-display">
                <Mail className="text-blue-600 w-5.5 h-5.5" />
                Secure Clinical Emails
              </h2>
              <span className="text-[10px] bg-blue-100/70 text-blue-700 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                {patientEmails.length} Received
              </span>
            </div>

            {patientEmails.length > 0 ? (
              <div className="space-y-3">
                {patientEmails.map((email) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={email.id}
                    onClick={() => setSelectedEmail(email)}
                    className="bg-white p-4.5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xs cursor-pointer transition-all flex items-start gap-3.5 group"
                  >
                    <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                      <Mail size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">System Auto-Mailer</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {format(new Date(email.timestamp), 'MMM dd, h:mm a')}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm mt-1 truncate group-hover:text-blue-600 transition-colors">{email.subject}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-1 font-sans">
                        {email.body}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 text-center border border-slate-100">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-3">
                  <Mail size={20} />
                </div>
                <p className="text-slate-500 text-xs font-semibold">Your secure mailbox is currently empty.</p>
                <p className="text-slate-400 text-[10px] mt-1">When doctors confirm an appointment, official automated notification emails are sent in real-time to your registered address.</p>
              </div>
            )}
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

          {/* Linked Mobile Device Notifications Setup */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Phone className="text-blue-600 w-5 h-5 animate-pulse" />
              SMS Alert Phone
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              Enter the cellular number associated with the handheld device you carry. System dispatch logs send copies straight to your phone.
            </p>
            {isEditingPhone ? (
              <div className="space-y-3">
                <input 
                  type="tel"
                  value={tempPhone}
                  onChange={(e) => setTempPhone(e.target.value)}
                  placeholder="e.g. +1 (555) 123-4567"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold font-mono outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2 font-sans">
                  <button 
                    onClick={savePhoneNumber}
                    disabled={phoneSaving}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-extrabold transition-all"
                  >
                    {phoneSaving ? 'Saving...' : 'Save Phone'}
                  </button>
                  <button 
                    onClick={() => setIsEditingPhone(false)}
                    className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-extrabold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="min-w-0 font-sans">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Phone Device</span>
                  <span className="text-xs font-black font-mono text-slate-800 block truncate mt-0.5">
                    {currentPhone || 'No registered device'}
                  </span>
                </div>
                <button 
                  onClick={() => { setTempPhone(currentPhone); setIsEditingPhone(true); }}
                  className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 rounded-xl text-[10px] font-extrabold transition-all font-sans shrink-0"
                >
                  Manage
                </button>
              </div>
            )}
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

      {/* Email Viewer Modal */}
      <AnimatePresence>
        {selectedEmail && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full shadow-2xl overflow-hidden"
            >
              {/* Mail client toolbar */}
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-2 font-mono">Secure Portal Mailbox</span>
                </div>
                <button 
                  onClick={() => setSelectedEmail(null)}
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 bg-slate-200/50 hover:bg-slate-200 rounded-xl transition-all"
                >
                  Close Message
                </button>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                {/* Header info */}
                <div className="space-y-3 pb-4 border-b border-dashed border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">{selectedEmail.subject}</h3>
                  <div className="flex justify-between items-start gap-4 text-xs">
                    <div>
                      <p className="font-semibold text-slate-700">From: <span className="font-normal text-slate-500">Heal Sync Secure Mailer &lt;auto-confirm@healsync.com&gt;</span></p>
                      <p className="font-semibold text-slate-700 mt-1">To: <span className="font-normal text-slate-500 font-mono">{selectedEmail.patientEmail}</span></p>
                    </div>
                    <span className="text-slate-400 font-mono text-[10px] shrink-0 text-right">
                      {format(new Date(selectedEmail.timestamp), 'MMM dd, yyyy')}<br />
                      {format(new Date(selectedEmail.timestamp), 'h:mm a')}
                    </span>
                  </div>
                </div>

                {/* Email Body content */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-150 text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-line max-h-80 overflow-y-auto">
                  {selectedEmail.body}
                </div>

                {/* Secure footer info */}
                <div className="pt-2 flex items-center gap-2.5 text-[10px] text-slate-400 font-medium">
                  <AlertCircle size={14} className="text-blue-500 shrink-0" />
                  <span>This automated transmission confirms official doctor schedule confirmation delivered through secure electronic notification interfaces.</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PatientDashboard;
