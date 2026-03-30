import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../config/supabaseClient';

const ScoreEntry = () => {
  const [scores, setScores] = useState([]);
  const [newScore, setNewScore] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchRecentScores = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase
        .from('user_scores')
        .select('score_value')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }) // Newest first
        .limit(5);

      if (data) setScores(data.map(s => s.score_value).reverse());
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchRecentScores();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('user_scores')
        .insert([{
          user_id: user.id,
          score_value: parseInt(newScore),
          played_at: new Date().toISOString().split('T')[0]
        }]);

      if (error) throw error;

      setScores(prev => [...prev, parseInt(newScore)].slice(-5));
      setNewScore("");
      alert("Score Saved!");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
      <div className="flex gap-2 mb-6">
        {scores.map((s, i) => (
          <div key={i} className="flex-1 h-16 flex items-center justify-center bg-slate-800 rounded-lg font-bold text-lime-400 border border-slate-700">
            {s}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="number"
          value={newScore}
          onChange={(e) => setNewScore(e.target.value)}
          placeholder="Enter Score"
          className="flex-1 bg-slate-950 border border-slate-700 p-2 rounded text-white"
          required
        />
        <button type="submit" className="bg-lime-400 text-black px-4 py-2 rounded font-bold">
          {loading ? "..." : "Add"}
        </button>
      </form>
    </div>
  );
};

export default ScoreEntry;