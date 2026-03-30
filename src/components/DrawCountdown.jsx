import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Trophy, Calendar } from 'lucide-react';

const DrawCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      // Target: First day of the next month at 00:00:00
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const difference = nextMonth - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft(); // Initial call

    return () => clearInterval(timer);
  }, []);

  const TimeUnit = ({ value, label }) => (
    <div className="flex flex-col items-center px-3 sm:px-5">
      <div className="relative overflow-hidden bg-slate-950 border border-slate-800 rounded-xl w-14 h-16 sm:w-20 sm:h-24 flex items-center justify-center shadow-inner">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="text-2xl sm:text-4xl font-black text-emerald-500 font-mono"
          >
            {value.toString().padStart(2, '0')}
          </motion.span>
        </AnimatePresence>
        {/* Decorative glass reflection */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
      </div>
      <span className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-500 mt-2 font-bold">
        {label}
      </span>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl overflow-hidden relative"
    >
      {/* Background decoration */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full" />
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-500 mb-1">
            <Trophy className="w-5 h-5" />
            <span className="text-sm font-bold tracking-wider uppercase">Next Monthly Draw</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">The Fairway Prize Pool</h2>
          <p className="text-slate-400 text-sm mt-1">Entries close at midnight on the last day of the month.</p>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <TimeUnit value={timeLeft.days} label="Days" />
          <div className="text-slate-700 font-bold self-start mt-6 hidden sm:block">:</div>
          <TimeUnit value={timeLeft.hours} label="Hours" />
          <div className="text-slate-700 font-bold self-start mt-6 hidden sm:block">:</div>
          <TimeUnit value={timeLeft.minutes} label="Mins" />
          <div className="text-slate-700 font-bold self-start mt-6 hidden sm:block">:</div>
          <TimeUnit value={timeLeft.seconds} label="Secs" />
        </div>
      </div>
    </motion.div>
  );
};

export default DrawCountdown;