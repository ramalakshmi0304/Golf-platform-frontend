import { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../../services/api';
import { toast } from 'sonner'; // Recommended for shadcn-like toasts

export const ScoreForm = () => {
  const [score, setScore] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (score < 0 || score > 50) return toast.error("Invalid Stableford score");

    setIsSubmitting(true);
    try {
      await api.post('/user/submit-score', { 
        scoreValue: parseInt(score),
        playedAt: new Date().toISOString()
      });
      toast.success("Score added to your Rolling Five!");
      setScore('');
    } catch (err) {
      toast.error(err.response?.data?.error || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl"
    >
      <h3 className="text-xl font-bold text-white mb-4">Submit Today's Score</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Stableford Points</label>
          <input 
            type="number" 
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className="w-full bg-slate-800 border-slate-700 text-white rounded-md p-2 focus:ring-2 focus:ring-emerald-500"
            placeholder="e.g. 36"
            required
          />
        </div>
        <button 
          disabled={isSubmitting}
          className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-md transition-all disabled:opacity-50"
        >
          {isSubmitting ? "Updating Rolling Five..." : "Submit Score"}
        </button>
      </form>
    </motion.div>
  );
};