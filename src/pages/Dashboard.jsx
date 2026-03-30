import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import TransactionHistory from '../components/TransactionHistory';
import { SubscribeButton } from '../components/SubscribeButton';
import { useAuth } from '../context/useAuth';
import { LogOut, ShieldAlert, Loader2, Activity, Trophy, CheckCircle } from 'lucide-react';
import { supabase } from '../config/supabaseClient';

// Components
import ScoreEntry from '../components/score/ScoreEntry';
import DrawCountdown from '../components/DrawCountdown';
import AdminControls from '../components/AdminControls';
import WinnersGallery from '../components/WinnersGallery'; // New Hall of Fame Component

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile, loading } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // Loading State
  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-lime-400 gap-4">
      <Loader2 className="w-10 h-10 animate-spin" />
      <span className="font-black tracking-widest uppercase">Syncing League Data...</span>
    </div>
  );
console.log("Current User Role:", profile?.role);
  const isAdmin = profile?.role === 'admin';

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      {/* HEADER SECTION */}
      <header className="max-w-7xl mx-auto mb-10 flex justify-between items-center">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-black tracking-tighter italic"
        >
          {isAdmin ? (
            <span className="flex items-center gap-2 text-white">
              <ShieldAlert className="text-lime-400" /> ADMIN <span className="text-slate-500">PORTAL</span>
            </span>
          ) : (
            <>PLAYER <span className="text-lime-400">DASHBOARD</span></>
          )}
        </motion.h1>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-red-400 transition-all active:scale-95"
        >
          Logout <LogOut size={16} />
        </button>
      </header>

      <main className="max-w-7xl mx-auto flex flex-col gap-10">

        {/* 1. CONDITIONAL PRIMARY VIEW (Admin Table vs Player Score Form) */}
        {isAdmin ? (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
              <h2 className="text-xl font-bold text-lime-400 mb-8 flex items-center gap-2">
                <ShieldAlert size={20} /> League Oversight
              </h2>
              <AdminControls />
            </div>
          </motion.section>
        ) : (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Activity size={20} className="text-lime-400" /> Your Performance
              </h2>
              <span className="text-xs text-slate-500 font-bold bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                ROLLING 5 SYSTEM
              </span>
            </div>

            <div className="bg-slate-900/30 border border-slate-800/50 p-8 rounded-3xl">
              <ScoreEntry />
            </div>
          </motion.section>
        )}

        {/* 2. HALL OF FAME (Visible to Everyone) */}
        <WinnersGallery />

        {/* 3. PRIZE POOL SECTION (Visible to Everyone) */}
        <aside className="w-full space-y-6">
          <div className="bg-lime-400 text-black p-10 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
            <div className="space-y-2 text-center md:text-left relative z-10">
              <h3 className="font-black uppercase tracking-widest text-xs opacity-70">Global Prize Pool Status</h3>
              <p className="text-3xl font-black italic tracking-tighter">THE FAIRWAY PRIZE POOL</p>
              <p className="text-sm font-medium max-w-xs opacity-80">Entries close at midnight on the last day of the month.</p>
            </div>
            <div className="bg-black/10 p-6 rounded-2xl backdrop-blur-sm relative z-10 border border-black/10">
              <DrawCountdown targetDate="2026-04-01" />
            </div>
          </div>
          {!isAdmin && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {profile?.subscription_status === 'active' ? (
                  /* ✅ ACTIVE MEMBER STATE */
                  <div className="group relative overflow-hidden flex flex-col items-center justify-center p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl transition-all hover:border-emerald-500/40">
                    <div className="flex items-center gap-2 text-emerald-500 font-black tracking-[0.2em] text-[10px] uppercase">
                      <CheckCircle size={16} className="animate-pulse" />
                      League Member: Entry Confirmed
                    </div>
                    <p className="text-[10px] text-emerald-600/60 mt-2 font-medium uppercase tracking-widest">
                      You are eligible for the next draw
                    </p>
                  </div>
                ) : (
                  /* ⏳ PENDING/INACTIVE STATE */
                  <div className="group flex flex-col items-center justify-center p-8 bg-slate-900/50 border border-slate-800 rounded-3xl gap-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 text-slate-500 font-bold tracking-[0.2em] text-[10px] uppercase mb-1">
                        <Activity size={14} />
                        Pending Entry
                      </div>
                      <p className="text-[10px] text-slate-600 uppercase tracking-widest">
                        Join the Pool to start competing
                      </p>
                    </div>

                    {/* 🚀 ADD THE BUTTON HERE */}
                    <SubscribeButton />
                    <p className="text-[10px] text-slate-600 mt-2 uppercase tracking-widest">
                      Secure Payment via Razorpay
                    </p>
                  </div>
                )}
              </motion.div>

              <div className="w-full">
                <TransactionHistory />
              </div>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
};

export default Dashboard;