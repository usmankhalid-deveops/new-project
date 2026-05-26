import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import { handleFirestoreError, OperationType } from '../lib/utils';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    try {
      const cached = localStorage.getItem('hs_cached_profile');
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {}
    return null;
  });
  const [loading, setLoading] = useState(() => {
    try {
      const cached = localStorage.getItem('hs_cached_profile');
      if (cached) return false;
    } catch (e) {}
    return true;
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authenticatedUser) => {
      setUser(authenticatedUser);
      if (authenticatedUser) {
        localStorage.setItem('hs_last_uid', authenticatedUser.uid);
        const cacheKey = `hs_profile_${authenticatedUser.uid}`;
        
        // Optimistic cache update
        try {
          const cached = localStorage.getItem(cacheKey);
          if (cached) {
            setProfile(JSON.parse(cached));
            setLoading(false);
          }
        } catch (e) {}

        const path = `users/${authenticatedUser.uid}`;
        try {
          const docRef = doc(db, 'users', authenticatedUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const freshProfile = docSnap.data() as UserProfile;
            setProfile(freshProfile);
            localStorage.setItem(cacheKey, JSON.stringify(freshProfile));
            localStorage.setItem('hs_cached_profile', JSON.stringify(freshProfile));
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, path);
        }
      } else {
        setProfile(null);
        localStorage.removeItem('hs_cached_profile');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = () => auth.signOut();

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
