import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, DollarSign, PlayCircle, Loader2, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'sonner';

const AdminDrawPage = () => {
  const [stats, setStats] = useState({ totalPlayers: 0, prizePool: 0, lastDraw: 'None' });
  const [loading, setLoading] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  // Fetch current pool stats on load
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/draw-stats');
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats");
      }
    };
    fetchStats();
  }, []);

  const handleRunDraw = async () => {
    if (!window.confirm("Are you sure? This will finalize the monthly winners and notify them!")) return;
    
    setIsDrawing(true);
    try {
      const { data } = await api.post('/admin/run-monthly-draw');
      toast.success(`Draw Complete! Winners: ${data.winners.join(', ')}`);
      // Refresh stats
      setStats(prev => ({ ...prev, lastDraw: new Date().toLocaleDateString() }));
    } catch (err) {
      toast.error(err.response?.data?.error || "Draw failed to execute");
    } finally {
      setIsDrawing(false);
    }
  };

  return (
    <div className="bg-slate-950/50 border border-slate-800 rounded-3xl p-8 text-white">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-black tracking-tight">Prize Draw Control</h1>
          <p className="text-slate-400 mt-2">Manage the monthly charity distribution and player rewards.</p>
        </header>

        {/* --- Stats Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard icon={<Users className="text-blue-400" />} label="Active Subscribers" value={stats.totalPlayers} />
          <StatCard icon={<DollarSign className="text-emerald-400" />} label="Current Prize Pool" value={`$${stats.prizePool}`} />
          <StatCard icon={<CheckCircle className="text-purple-400" />} label="Last Draw Date" value={stats.lastDraw} />
        </div>

        {/* --- The "Big Red Button" Section --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-12 text-center relative overflow-hidden"
        >
          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />

          <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">Execute Monthly Draw</h2>
          <p className="text-slate-400 max-w-md mx-auto mb-8">
            Clicking the button below will run the prize algorithm, split the 10% charity fee, and assign 1st, 2nd, and 3rd place winners.
          </p>

          <button
            onClick={handleRunDraw}
            disabled={isDrawing}
            className="group relative px-12 py-5 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-black text-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
          >
            {isDrawing ? (
              <span className="flex items-center gap-3">
                <Loader2 className="animate-spin w-6 h-6" /> Randomizing...
              </span>
            ) : (
              <span className="flex items-center gap-3">
                <PlayCircle className="group-hover:rotate-12 transition-transform" /> RUN DRAW NOW
              </span>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ icon, label, value }) => (
  <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
    <div className="flex items-center gap-4 mb-2">
      <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">{icon}</div>
      <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">{label}</span>
    </div>
    <div className="text-3xl font-bold">{value}</div>
  </div>
);

export default AdminDrawPage;