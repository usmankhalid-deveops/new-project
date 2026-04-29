import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { MedicalRecord, Appointment } from '../../types';
import { FileText, Plus, Search, Calendar, User, Download, X, Upload, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

const MedicalRecords: React.FC = () => {
  const { user, profile } = useAuth();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form state for doctor
  const [patientEmail, setPatientEmail] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchRecords = async () => {
      if (!user || !profile) return;
      try {
        const field = profile.role === 'patient' ? 'patientId' : 'doctorId';
        const q = query(
          collection(db, 'medicalRecords'),
          where(field, '==', user.uid)
        );
        const snap = await getDocs(q);
        setRecords(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as MedicalRecord)));
      } catch (err) {
        console.error("Error fetching records:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, [user, profile]);

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    setSubmitting(true);

    try {
      // 1. Find patient by email (simple approach for this exercise)
      const userQ = query(collection(db, 'users'), where('email', '==', patientEmail));
      const userSnap = await getDocs(userQ);
      if (userSnap.empty) throw new Error("Patient not found with this email");
      
      const patientData = userSnap.docs[0].data();
      const patientId = userSnap.docs[0].id;

      let fileUrl = '';
      if (file) {
        const storageRef = ref(storage, `medical_files/${user.uid}/${Date.now()}_${file.name}`);
        const uploadResult = await uploadBytes(storageRef, file);
        fileUrl = await getDownloadURL(uploadResult.ref);
      }

      const newRecord = {
        patientId,
        patientName: patientData.name,
        doctorId: user.uid,
        doctorName: profile.name,
        diagnosis,
        prescription,
        notes,
        fileUrl,
        timestamp: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'medicalRecords'), newRecord);
      setRecords(prev => [{ id: docRef.id, ...newRecord } as MedicalRecord, ...prev]);
      
      // Reset form
      setShowAddForm(false);
      setPatientEmail('');
      setDiagnosis('');
      setPrescription('');
      setNotes('');
      setFile(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRecords = records.filter(r => 
    r.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Medical Records</h1>
          <p className="text-slate-500 mt-1">
            {profile?.role === 'patient' 
              ? "Access your full medical history and prescriptions." 
              : "Review and manage medical records for your patients."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search diagnosis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
            />
          </div>
          {profile?.role === 'doctor' && (
            <button 
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
              <Plus size={18} />
              Add Record
            </button>
          )}
        </div>
      </header>

      {profile?.role === 'doctor' && showAddForm && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-blue-200 p-8 shadow-xl shadow-blue-500/5 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />
          <button 
            onClick={() => setShowAddForm(false)}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-all"
          >
            <X size={20} />
          </button>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 underline decoration-blue-200 underline-offset-8">
            <Plus className="text-blue-600" /> New Medical Record
          </h2>

          <form onSubmit={handleAddRecord} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700 ml-1">Patient Email</label>
                <input 
                  type="email" 
                  required
                  placeholder="patient@example.com"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700 ml-1">Diagnosis</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Common Flu, Hypertension"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Prescription</label>
              <textarea 
                required
                rows={3}
                placeholder="List medications and dosage..."
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Observation Notes</label>
              <textarea 
                rows={3}
                placeholder="Additional notes about patient condition..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
              />
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 pt-4">
              <div className="w-full md:w-auto flex-1">
                <label className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all text-slate-500 hover:text-blue-600 font-medium group">
                  <Upload size={20} className="group-hover:-translate-y-1 transition-transform" />
                  {file ? file.name : "Upload Lab Report (PDF/Image)"}
                  <input 
                    type="file" 
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden" 
                  />
                </label>
              </div>
              <button 
                type="submit"
                disabled={submitting}
                className="w-full md:w-48 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 className="animate-spin" /> : 'Save Record'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {filteredRecords.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
          {filteredRecords.map((record) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={record.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col shadow-sm transition-all hover:border-blue-200 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  <FileText size={24} />
                </div>
                <p className="text-xs font-bold text-slate-400 flex items-center gap-1">
                  <Calendar size={12} /> {format(new Date(record.timestamp), 'MMM dd, yyyy')}
                </p>
              </div>

              <h3 className="text-xl font-bold text-slate-800 mb-1">{record.diagnosis}</h3>
              <p className="text-sm text-slate-500 mb-4 flex items-center gap-2">
                <User size={14} /> 
                {profile?.role === 'patient' ? `Dr. ${record.doctorName}` : record.patientName}
              </p>

              <div className="space-y-4 mb-6">
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-50">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-blue-600 mb-1">Prescription</h4>
                  <p className="text-sm text-slate-700 leading-relaxed italic">{record.prescription}</p>
                </div>
                {record.notes && (
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Doctor's Notes</h4>
                    <p className="text-sm text-slate-600 line-clamp-3">{record.notes}</p>
                  </div>
                )}
              </div>

              {record.fileUrl && (
                <a 
                  href={record.fileUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="mt-auto py-3 border border-slate-200 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
                >
                  <Download size={16} /> 
                  Download Attachment
                </a>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-6">
            <FileText size={40} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">No records found</h3>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto">Either you are perfectly healthy or your doctor hasn't uploaded your records yet!</p>
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;
