import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Trophy, ArrowRight, Download } from 'lucide-react';

const SuccessModal = ({ isOpen, onClose, txDetails, onDownload }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-slate-900 border border-lime-400/30 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl shadow-lime-500/10"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-lime-400/10 p-4 rounded-full">
              <CheckCircle2 size={48} className="text-lime-400" />
            </div>
          </div>

          <h2 className="text-2xl font-black text-white italic mb-2 uppercase">Entry Confirmed!</h2>
          <p className="text-slate-400 text-sm mb-6">
            You're officially in the league. Your transaction was successful.
          </p>

          <div className="bg-slate-800/50 rounded-2xl p-4 mb-6 border border-slate-700">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-500 uppercase font-bold tracking-tighter">Amount</span>
              <span className="text-white font-mono italic">₹{txDetails?.amount}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 uppercase font-bold tracking-tighter">Ref ID</span>
              <span className="text-white font-mono">{txDetails?.razorpay_payment_id?.slice(-8)}</span>
            </div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={onDownload}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <Download size={16} /> Download Receipt
            </button>
            
            <button 
              onClick={onClose}
              className="w-full py-3 bg-lime-400 hover:bg-lime-500 text-slate-950 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all"
            >
              Go to Dashboard <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SuccessModal;