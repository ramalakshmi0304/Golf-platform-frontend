import { useEffect, useState } from 'react';
import { supabase } from '../config/supabaseClient';
import Confetti from 'react-confetti'; // Install: npm install react-confetti
import { Trophy, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WinnerOverlay = () => {
  const [winner, setWinner] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const checkWinner = async () => {
      const { data, error } = await supabase
        .from('draw_results')
        .select('*')
        .order('draw_date', { ascending: false })
        .limit(1)
        .single();

      if (data && !error) {
        // Only show if the draw happened in the last 24 hours
        const drawDate = new Date(data.draw_date);
        const now = new Date();
        const diffHours = Math.abs(now - drawDate) / 36e5;

        if (diffHours < 24) {
          setWinner(data);
          setShow(true);
        }
      }
    };

    checkWinner();
  }, []);

  if (!show || !winner) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-xl">
        <Confetti numberOfPieces={300} recycle={false} colors={['#A3E635', '#ffffff', '#1E293B']} />
        
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          className="relative max-w-lg w-full p-10 text-center bg-slate-900 border border-lime-400/30 rounded-[40px] shadow-[0_0_50px_rgba(163,230,53,0.2)]"
        >
          <button 
            onClick={() => setShow(false)}
            className="absolute top-6 right-6 text-slate-500 hover:text-white"
          >
            <X size={24} />
          </button>

          <div className="w-24 h-24 bg-lime-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(163,230,53,0.4)]">
            <Trophy size={48} className="text-black" />
          </div>

          <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-lime-400 mb-2">Monthly Match-5 Winner</h2>
          <h1 className="text-5xl font-black italic text-white mb-4 uppercase tracking-tighter">
            {winner.winner_name}
          </h1>
          
          <div className="inline-block px-6 py-2 bg-slate-800 rounded-full border border-slate-700 mb-8">
            <span className="text-slate-400 font-bold uppercase text-[11px] tracking-widest">Prize Claimed: </span>
            <span className="text-white font-black">{winner.prize_amount}</span>
          </div>

          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Congratulations! You've been randomly selected from the Match-5 eligible pool for this month's charity prize.
          </p>

          <button 
            onClick={() => setShow(false)}
            className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-lime-400 transition-all uppercase tracking-widest text-xs"
          >
            Close & Keep Grinding
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default WinnerOverlay;