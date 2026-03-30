import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../config/supabaseClient';
import api from '../../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (sessionUser) => {
    if (!sessionUser) return; // Safety check

    try {
      // 💡 Pass the ID so the backend knows who to look up in the profiles table
      const res = await api.get(`/user/profile?id=${sessionUser.id}`);

      console.log("✅ Backend Profile Loaded:", res.data);
      setProfile(res.data);
    } catch (err) {
      console.error("❌ Profile Fetch Error:", err);
      // Fallback: If backend fails, at least provide basic Auth data
      setProfile({
        name: sessionUser.user_metadata?.full_name || 'Player',
        email: sessionUser.email,
        role: 'subscriber',
        subscription_status: 'inactive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 1. Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      const sessionUser = session?.user ?? null;
      setUser(sessionUser);
      if (sessionUser) {
        fetchProfile(sessionUser);
      } else {
        setLoading(false);
      }
    });

    // 2. Listen for auth changes (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user ?? null;
      setUser(sessionUser);

      if (sessionUser) {
        fetchProfile(sessionUser);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, fetchProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
