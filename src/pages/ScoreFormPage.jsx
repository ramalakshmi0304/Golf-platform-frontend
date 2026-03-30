import { motion } from 'framer-motion';
import { ScoreForm } from '../components/score/ScoreForm'; // Assuming you named it this
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ScoreFormPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">Submit Score</h1>
          <p className="text-slate-400 mb-8">Enter your Stableford points for today's round.</p>
          
          <ScoreForm />
        </motion.div>
      </div>
    </div>
  );
};

export default ScoreFormPage;