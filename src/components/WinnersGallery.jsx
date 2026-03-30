import { useEffect, useState } from 'react';
import { supabase } from '../config/supabaseClient';
import { Trophy, Calendar, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';

const WinnersGallery = () => {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true); // 👈 Add a loading state


  useEffect(() => {
    const fetchWinners = async () => {
      try {
        setLoading(true);

        // 1. Try fetching from your Backend API first
        const response = await api.get('/scores/hall-of-fame');

        if (Array.isArray(response.data) && response.data.length > 0) {
          setWinners(response.data);
        } else {
          // 2. Fallback: Direct Supabase fetch from the CORRECT winners table
          const { data, error } = await supabase
            .from('draw_results') // 👈 Pointing to your winner history table
            .select('*')
            .order('draw_date', { ascending: false }) // ✅ Uses the actual draw date
            .limit(3);

          if (!error && data) {
            setWinners(data);
          }
        }
      } catch (error) {
        console.error("Error fetching winners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWinners();
  }, []);

  // Show a simple skeleton or nothing while loading to prevent "flicker"
  if (loading) return <div className="w-full h-40 animate-pulse bg-slate-900/20 rounded-3xl" />;

  if (winners.length === 0) {
    return (
      <div className="w-full p-10 border border-dashed border-slate-800 rounded-3xl text-center text-slate-600">
        <Trophy className="mx-auto mb-2 opacity-20" />
        <p className="text-xs uppercase tracking-widest font-bold">No Champions Crowned Yet</p>
      </div>
    );
  }


  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white uppercase tracking-widest flex items-center gap-2">
          <Trophy size={20} className="text-yellow-500" /> Hall of Fame
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {winners.map((winner, index) => (
          <motion.div
            key={winner.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group hover:border-lime-400/50 transition-colors"
          >
            {/* Background Icon Decoration */}
            <Trophy className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5 group-hover:text-lime-400/10 transition-colors" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${index === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                  index === 1 ? 'bg-slate-300/20 text-slate-300' :
                    'bg-orange-500/20 text-orange-500'
                  }`}>
                  <Trophy size={16} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  {index === 0 ? 'Latest Winner' : 'Past Champion'}
                </span>
              </div>

              <h3 className="text-xl font-black text-white truncate mb-1">
                {winner.winner_name || 'Anonymous Champion'}
              </h3>

              <div className="flex items-center gap-4 text-xs font-bold">
                <span className="text-lime-400">
                  {winner.prize_amount || "£500"}
                </span>
                <span className="text-slate-500 flex items-center gap-1">
                  <Calendar size={12} />
                  {winner.draw_date && !isNaN(Date.parse(winner.draw_date))
                    ? new Date(winner.draw_date).toLocaleDateString('en-GB', {
                      month: 'short',
                      year: 'numeric'
                    })
                    : 'Mar 2026'}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default WinnersGallery;