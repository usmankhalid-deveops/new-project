import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { DoctorProfile } from '../../types';
import { Calendar, Clock, AlertCircle, Loader2, CheckCircle2, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';

const BookAppointment: React.FC = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!doctorId) return;
      try {
        const docSnap = await getDoc(doc(db, 'doctors', doctorId));
        if (docSnap.exists()) {
          setDoctor({ userId: docSnap.id, ...docSnap.data() } as DoctorProfile);
        } else {
          setError('Doctor not found');
        }
      } catch (err) {
        console.error("Error fetching doctor:", err);
        setError('Failed to load doctor details');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [doctorId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile || !doctor) return;
    
    setSubmitting(true);
    setError('');
    
    try {
      await addDoc(collection(db, 'appointments'), {
        patientId: user.uid,
        patientName: profile.name,
        doctorId: doctor.userId,
        doctorName: doctor.name,
        date,
        time,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setSuccess(true);
      setTimeout(() => navigate('/appointments'), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to book appointment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-blue-600" /></div>;

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-12 text-center p-8 bg-white rounded-3xl border border-slate-200 shadow-xl shadow-blue-500/5">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Appointment Requested!</h2>
        <p className="text-slate-500 mt-2">Your request has been sent to Dr. {doctor?.name}. Redirecting you to your appointments...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-semibold transition-colors"
      >
        <ChevronLeft size={20} />
        Back to list
      </button>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="bg-blue-600 p-8 text-white relative">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold tracking-tight">Book Appointment</h1>
            <p className="text-blue-100 mt-2">Specify your preferred date and time for Dr. {doctor?.name}.</p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-full bg-white/5 skew-x-12 transform -mr-8" />
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700 text-sm font-medium animate-shake">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 flex items-center gap-2">
                <Calendar size={16} className="text-blue-600" />
                Select Date
              </label>
              <input 
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider pl-1">
                Available: {doctor?.availableDays.join(', ')}
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 flex items-center gap-2">
                <Clock size={16} className="text-blue-600" />
                Select Time
              </label>
              <select 
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
              >
                <option value="">Choose a slot...</option>
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="03:00 PM">03:00 PM</option>
                <option value="04:00 PM">04:00 PM</option>
                <option value="05:00 PM">05:00 PM</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-slate-500">
              <div className="p-2 bg-slate-100 rounded-full">
                <AlertCircle size={16} />
              </div>
              <p className="text-xs font-medium">Your request will be sent for review.</p>
            </div>
            
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center gap-2"
            >
              {submitting ? <Loader2 className="animate-spin w-5 h-5" /> : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
