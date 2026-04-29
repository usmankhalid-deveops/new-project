import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { DoctorProfile } from '../../types';
import { Search, MapPin, Star, Clock, Stethoscope, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

const DoctorList: React.FC = () => {
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'doctors'));
        const docList = querySnapshot.docs.map(doc => ({ ...doc.data() } as DoctorProfile));
        setDoctors(docList);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Available Doctors</h1>
          <p className="text-slate-500 mt-1">Book an appointment with specialist doctors near you.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
          />
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(n => (
            <div key={n} className="bg-white h-64 rounded-3xl animate-pulse border border-slate-100" />
          ))}
        </div>
      ) : filteredDoctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={doc.userId}
              className="bg-white rounded-3xl border border-slate-200 p-6 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all group flex flex-col"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100 flex-shrink-0">
                  <Stethoscope size={30} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900 text-lg truncate">Dr. {doc.name}</h3>
                    <div className="flex items-center gap-0.5 text-xs font-bold text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded">
                      <Star size={10} fill="currentColor" />
                      4.9
                    </div>
                  </div>
                  <p className="text-blue-600 font-semibold text-sm">{doc.specialization}</p>
                  <p className="text-slate-500 text-xs mt-1 flex items-center gap-1">
                    <Clock size={12} /> {doc.experience} experience
                  </p>
                </div>
              </div>

              <div className="mt-auto space-y-4">
                <div className="flex flex-wrap gap-2">
                  {doc.availableDays?.slice(0, 3).map(day => (
                    <span key={day} className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-1 rounded-md">
                      {day}
                    </span>
                  ))}
                  {doc.availableDays?.length > 3 && (
                    <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-1 rounded-md">
                      +{doc.availableDays.length - 3}
                    </span>
                  )}
                </div>

                <Link 
                  to={`/appointments/book/${doc.userId}`}
                  className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 group-hover:bg-blue-600 transition-colors"
                >
                  Book Appointment
                  <ChevronRight size={18} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-4">
            <Search size={30} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No doctors found</h3>
          <p className="text-slate-500 mt-2">Try adjusting your search criteria.</p>
          <button 
            onClick={() => setSearchTerm('')}
            className="mt-4 text-blue-600 font-bold hover:underline"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
};

export default DoctorList;
