import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import { Stethoscope, Mail, Lock, Loader2, AlertCircle, ArrowLeft, User, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Forgot Password fields
  const [isForgotPass, setIsForgotPass] = useState(false);
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const authenticatedUser = userCredential.user;
      localStorage.setItem('hs_last_uid', authenticatedUser.uid);
      
      // Fetch and cache user profile immediately for instant transition
      try {
        const docRef = doc(db, 'users', authenticatedUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const profileData = docSnap.data() as any;
          localStorage.setItem(`hs_profile_${authenticatedUser.uid}`, JSON.stringify(profileData));
          localStorage.setItem('hs_cached_profile', JSON.stringify(profileData));
        }
      } catch (profileErr) {
        console.warn('Non-blocking cache error during login:', profileErr);
      }

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setResetError('');
    setResetSuccess('');

    const input = resetIdentifier.trim();
    if (!input) {
      setResetError('Please enter your full name (username) or email address.');
      setResetLoading(false);
      return;
    }

    try {
      let targetEmail = '';

      if (input.includes('@')) {
        targetEmail = input;
      } else {
        // Query users collection by full name
        const q = query(collection(db, 'users'), where('name', '==', input));
        const querySnap = await getDocs(q);
        
        if (querySnap.empty) {
          setResetError(`No credential profiles matched the name "${input}". Please double-check spelling.`);
          setResetLoading(false);
          return;
        }

        // Use the email from the matching user profile
        const userDoc = querySnap.docs[0].data();
        targetEmail = userDoc.email;
      }

      // Generate the password reset email
      await sendPasswordResetEmail(auth, targetEmail);
      setResetSuccess(`Password reset link successfully generated and dispatched to: ${targetEmail}`);
    } catch (err: any) {
      setResetError(err.message || 'Error occurred generating recovery link. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  if (isForgotPass) {
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
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-display text-center">Reset Password</h1>
            <p className="text-slate-500 mt-2 text-center text-sm">Enter your username (full name) or email to generate a restore link.</p>
          </div>

          {resetSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="text-green-600 w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700 font-medium">{resetSuccess}</p>
            </div>
          )}

          {resetError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
              <AlertCircle className="text-red-500 w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 font-medium">{resetError}</p>
            </div>
          )}

          <form onSubmit={handleForgotSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Username or Email</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  required
                  value={resetIdentifier}
                  onChange={(e) => setResetIdentifier(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-sm"
                  placeholder="e.g. John Doe or john@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={resetLoading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {resetLoading ? <Loader2 className="animate-spin w-6 h-6" /> : 'Request Reset Link'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <button
              onClick={() => {
                setIsForgotPass(false);
                setResetSuccess('');
                setResetError('');
              }}
              className="text-blue-600 font-bold hover:underline inline-flex items-center gap-2 text-sm"
            >
              <ArrowLeft size={16} /> Back to Log In
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 p-8 md:p-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 mb-4">
            <Stethoscope className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-display">Welcome back</h1>
          <p className="text-slate-500 mt-2 text-center">Login to your HealSync account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-shake">
            <AlertCircle className="text-red-500 w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Email address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-sm"
                placeholder="doctor@healsync.com"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5 ml-1">
              <label className="block text-sm font-semibold text-slate-700">Password</label>
              <button
                type="button"
                onClick={() => {
                  setIsForgotPass(true);
                  setResetIdentifier('');
                }}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin w-6 h-6" /> : 'Log In'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-100 text-center">
          <p className="text-slate-600 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-bold hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
