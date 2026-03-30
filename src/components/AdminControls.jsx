import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabaseClient';
import { 
  Trophy, Play, AlertCircle, Loader2, 
  FileDown, RotateCcw, ShieldCheck, Search,
  Users, Activity, CircleDollarSign
} from 'lucide-react';
import { toast } from 'sonner';

const AdminControls = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchLeagueData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id, name, role, 
        user_scores (score_value, created_at)
      `)
      .order('created_at', { foreignTable: 'user_scores', ascending: false });

    if (error) toast.error("Failed to load league data");
    else setPlayers(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchLeagueData(); }, []);

  // Calculate League Stats Dynamically
  const stats = useMemo(() => {
    const totalPlayers = players.length;
    const totalRounds = players.reduce((acc, p) => acc + (p.user_scores?.length || 0), 0);
    const prizePool = totalPlayers * 10; // Logic: £10 per player registered
    return { totalPlayers, totalRounds, prizePool };
  }, [players]);

  const filteredPlayers = players.filter(player => 
    player.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRunDraw = async () => {
  try {
    // 1. Fetch profiles AND roles
    const { data: players, error: fetchError } = await supabase
      .from('profiles')
      .select(`
        id, 
        name, 
        email,
        role,
        user_scores!user_id (id) 
      `);

    if (fetchError) throw fetchError;

    // 2. Filter for eligibility: 
    // MUST have 5 rounds AND MUST NOT be an admin
    const eligible = players.filter(p => 
      p.user_scores && 
      p.user_scores.length >= 5 && 
      p.role !== 'admin' // 👈 THIS LINE FIXES IT
    );

    if (eligible.length === 0) {
      toast.error("No eligible non-admin players found.");
      return;
    }

    // 3. Random Selection from the filtered pool
    const winner = eligible[Math.floor(Math.random() * eligible.length)];

    // 4. Record the win...
    const { error: insertError } = await supabase
      .from('draw_results')
      .insert([{
        winner_id: winner.id,
        winner_name: winner.name,
        winner_email: winner.email,
        prize_amount: "£500.00",
        draw_date: new Date().toISOString()
      }]);

    if (insertError) throw insertError;

    toast.success(`🎉 Draw Complete! Winner: ${winner.name}`);
    setTimeout(() => window.location.reload(), 2000);

  } catch (err) {
    console.error("Draw Error:", err);
    toast.error("Error running draw.");
  }
};

  const handleExportCSV = async () => {
    try {
      const { data, error } = await supabase.from('user_scores').select(`score_value, created_at, profiles (name)` ).order('created_at', { ascending: false });
      if (error) throw error;
      let csv = "Player Name,Score,Date\n";
      data.forEach(r => csv += `${r.profiles?.name || "Unknown"},${r.score_value},${new Date(r.created_at).toLocaleDateString()}\n`);
      const blob = new Blob([csv], { type: 'text/csv' });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `League_Backup_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      toast.success("Backup downloaded!");
    } catch (err) { toast.error("Export failed."); }
  };

  const handleResetLeague = async () => {
    if (!window.confirm("ARE YOU SURE? This deletes ALL scores.")) return;
    try {
      const { error } = await supabase.from('user_scores').delete().neq('score_value', -1);
      if (error) throw error;
      toast.success("League reset!");
      window.location.reload();
    } catch (err) { toast.error("Reset failed."); }
  };

  if (loading) return (
    <div className="flex flex-col items-center py-20 text-slate-500 gap-3">
      <Loader2 className="animate-spin" size={32} />
      <p className="text-sm font-black uppercase tracking-widest italic">Syncing League Data...</p>
    </div>
  );

  return (
    <div className="space-y-10">
      
      {/* --- STATS OVERVIEW --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl flex items-center gap-5 group hover:border-lime-400/30 transition-all">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-lime-400 group-hover:shadow-[0_0_15px_rgba(163,230,53,0.1)]">
            <Users size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Roster</p>
            <p className="text-2xl font-black italic">{stats.totalPlayers} PLAYERS</p>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl flex items-center gap-5 group hover:border-lime-400/30 transition-all">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-lime-400">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">League Activity</p>
            <p className="text-2xl font-black italic">{stats.totalRounds} ROUNDS</p>
          </div>
        </div>

        <div className="bg-lime-400 p-6 rounded-3xl flex items-center gap-5 shadow-xl shadow-lime-500/10">
          <div className="p-4 bg-black/10 rounded-2xl border border-black/5 text-black">
            <CircleDollarSign size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-black/60 uppercase tracking-widest">Current Pot</p>
            <p className="text-2xl font-black italic text-black uppercase">£{stats.prizePool}.00</p>
          </div>
        </div>
      </div>

      {/* --- ACTION BAR --- */}
      <div className="flex flex-wrap items-center gap-4 bg-slate-950/50 p-5 rounded-3xl border border-slate-800/50 shadow-2xl">
        <button onClick={handleRunDraw} className="flex items-center gap-2 bg-lime-400 text-black font-black px-8 py-3.5 rounded-2xl hover:bg-white transition-all shadow-[0_0_25px_rgba(163,230,53,0.2)]">
          <Play size={18} fill="currentColor" /> RUN DRAW
        </button>
        <button onClick={handleExportCSV} className="flex items-center gap-2 bg-slate-800 text-white font-bold px-6 py-3.5 rounded-2xl hover:bg-slate-700 border border-slate-700">
          <FileDown size={18} /> BACKUP
        </button>
        <button onClick={handleResetLeague} className="flex items-center gap-2 text-red-500 font-bold px-6 py-3.5 rounded-2xl hover:bg-red-500/10 border border-red-500/20 ml-auto">
          <RotateCcw size={18} /> RESET LEAGUE
        </button>
      </div>

      {/* --- SEARCH & TABLE --- */}
      <div className="space-y-4">
        <div className="relative w-full max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-lime-400 transition-colors" size={18} />
          <input type="text" placeholder="Search roster..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl py-3.5 pl-12 text-sm focus:outline-none focus:border-lime-400/50 transition-all placeholder:text-slate-600"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead>
              <tr className="text-slate-500 text-[10px] uppercase tracking-[0.3em] font-black px-6">
                <th className="px-6">Athlete</th>
                <th className="px-6">Recent Rounds</th>
                <th className="px-6 text-center">Authorization</th>
                <th className="px-6 text-right">Eligibility</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlayers.map((player) => (
                <tr key={player.id} className="bg-slate-900/30 group hover:bg-slate-800/40 transition-all">
                  <td className="px-6 py-5 rounded-l-3xl border-l border-y border-slate-800/40">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-[11px] font-black text-lime-400">
                        {player.name?.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="font-bold text-sm tracking-tight text-slate-200">{player.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 border-y border-slate-800/40">
                    <div className="flex gap-2">
                      {player.user_scores?.slice(0, 5).map((s, i) => (
                        <span key={i} className="text-[10px] bg-slate-950/50 border border-slate-800/80 px-3 py-1.5 rounded-xl text-slate-400 font-mono">
                          {s.score_value}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5 border-y border-slate-800/40 text-center">
                    <span className={`text-[9px] font-black tracking-widest uppercase px-3.5 py-1.5 rounded-xl border ${player.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-lime-500/10 text-lime-400 border-lime-500/20'}`}>
                      {player.role || 'Member'}
                    </span>
                  </td>
                  <td className="px-6 py-5 rounded-r-3xl border-r border-y border-slate-800/40 text-right">
                    {player.user_scores?.length >= 5 ? 
                      <div className="flex items-center justify-end gap-2 text-lime-400"><span className="text-[9px] font-black uppercase">Qualified</span><ShieldCheck size={20} /></div> : 
                      <div className="flex items-center justify-end gap-2 text-slate-700"><span className="text-[9px] font-black uppercase">{player.user_scores?.length}/5</span><AlertCircle size={20} /></div>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminControls;