import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Activity, Trophy, Heart, Users } from 'lucide-react'; // Lucide icons for a modern feel

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    subscribers: 1240,
    prizePool: 18600,
    charityTotal: 3100,
  });

  const runDrawSimulation = async () => {
    // Call POST /api/admin/run-draw with { simulate: true }
    alert("Simulation started. Checking for potential Match-5 winners...");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-lime-400 font-mono text-sm mb-1 uppercase tracking-widest">System Oversight</p>
            <h1 className="text-5xl font-black tracking-tighter">ADMIN <span className="text-slate-500">PORTAL</span></h1>
          </div>
          <button 
            onClick={runDrawSimulation}
            className="bg-lime-400 text-black font-bold px-6 py-3 rounded-full hover:scale-105 transition-transform"
          >
            Run Monthly Draw Simulation
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard title="Active Subs" value={stats.subscribers} icon={<Users />} />
          <StatCard title="Current Pool" value={`$${stats.prizePool}`} icon={<Trophy />} color="text-lime-400" />
          <StatCard title="Charity Fund" value={`$${stats.charityTotal}`} icon={<Heart />} />
          <StatCard title="Avg. Stableford" value="34.2" icon={<Activity />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Winner Verification List */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
            <h2 className="text-xl font-bold mb-4">Pending Winner Verification</h2>
            <div className="space-y-4">
              <WinnerRow name="John Doe" tier="Match 5" status="Pending Proof" />
              <WinnerRow name="Sarah Smith" tier="Match 4" status="Verified" />
            </div>
          </div>

          {/* Charity Management */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
            <h2 className="text-xl font-bold mb-4">Active Charities</h2>
            <button className="w-full py-4 border-2 border-dashed border-slate-700 rounded-2xl text-slate-500 hover:border-lime-400 hover:text-lime-400 transition-colors">
              + Add New Charity Partner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color = "text-white" }) => (
  <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-slate-800 rounded-xl">{icon}</div>
    </div>
    <p className="text-slate-400 text-sm font-medium">{title}</p>
    <p className={`text-3xl font-black ${color}`}>{value}</p>
  </div>
);

const WinnerRow = ({ name, tier, status }) => (
  <div className="flex justify-between items-center p-4 bg-slate-800/40 rounded-2xl">
    <div>
      <p className="font-bold">{name}</p>
      <p className="text-xs text-slate-500">{tier} Winner</p>
    </div>
    <span className={`text-xs px-3 py-1 rounded-full font-bold ${status === 'Verified' ? 'bg-lime-400/10 text-lime-400' : 'bg-orange-400/10 text-orange-400'}`}>
      {status}
    </span>
  </div>
);

export default AdminDashboard;