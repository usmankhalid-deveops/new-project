import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, writeBatch, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import { Stethoscope, Mail, Lock, User, Loader2, AlertCircle, ShieldCheck, Phone } from 'lucide-react';
import { motion } from 'motion/react';
import { Role } from '../../types';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('patient');
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (role === 'doctor' && !licenseNumber.trim()) {
      setError('Doctor license number is required');
      setLoading(false);
      return;
    }

    if (role === 'admin') {
      try {
        const configRef = doc(db, 'systemSettings', 'adminConfig');
        const configSnap = await getDoc(configRef);
        let allowedCode = 'ADMIN123';
        let isLocked = false;
        
        if (configSnap.exists()) {
          const config = configSnap.data();
          allowedCode = config.adminSecretBypassCode || 'ADMIN123';
          isLocked = !!config.adminRegistrationLocked;
        }

        if (isLocked) {
          setError('Admin registration is locked by the system administrator.');
          setLoading(false);
          return;
        }

        if (adminCode !== allowedCode) {
          setError('Invalid admin bypass code. Access denied.');
          setLoading(false);
          return;
        }
      } catch (err: any) {
        // Fallback for bootstrap
        if (adminCode !== 'ADMIN123') {
          setError('Invalid admin bypass code. Access denied.');
          setLoading(false);
          return;
        }
      }
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const batch = writeBatch(db);

      // Create user profile
      const userRef = doc(db, 'users', user.uid);
      const profileData: any = {
        uid: user.uid,
        name,
        email,
        phone: phone.trim(),
        role,
        createdAt: new Date().toISOString()
      };

      if (role === 'doctor') {
        profileData.licenseNumber = licenseNumber;
        profileData.verificationStatus = 'pending';
      }

      batch.set(userRef, profileData);

      // If doctor, create empty doctor profile
      if (role === 'doctor') {
        const doctorRef = doc(db, 'doctors', user.uid);
        batch.set(doctorRef, {
          userId: user.uid,
          name,
          specialization: 'General Practitioner',
          experience: '0 years',
          availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
        });
      }

      await batch.commit();

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 p-8 md:p-10"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 mb-4">
            <Stethoscope className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight text-center font-display">Join HealSync</h1>
          <p className="text-slate-500 mt-2 text-center">Secure healthcare management for everyone</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
            <AlertCircle className="text-red-500 w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl mb-2">
            {(['patient', 'doctor', 'admin'] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs capitalize transition-all ${role === r ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {r === 'patient' ? 'Patient' : r === 'doctor' ? 'Doctor' : 'Admin'}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                placeholder="John Doe"
              />
            </div>
          </div>

          {role === 'doctor' && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">License Number</label>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  required
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                  placeholder="e.g. LIC-98765-ABC"
                />
              </div>
            </div>
          )}

          {role === 'admin' && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Admin Bypass Code</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="password"
                  required
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                  placeholder="Enter ADMIN123"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Email address</label>
            <div className="relative font-sans">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Phone Number (Highly Recommended for Alerts)</label>
            <div className="relative font-sans">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 font-mono"
                placeholder="e.g. +1 555-123-4567"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="animate-spin w-6 h-6" /> : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-bold hover:underline">
            Log in
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
