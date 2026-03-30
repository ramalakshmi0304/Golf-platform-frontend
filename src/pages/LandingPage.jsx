import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Trophy, Target, Heart, ArrowRight, ChevronDown, CheckCircle2 } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-emerald-500/30">
      
      {/* --- Navbar --- */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto border-b border-slate-900/50">
        <div className="flex items-center gap-2 font-bold text-2xl text-white">
          <div className="bg-emerald-500 p-1.5 rounded-lg">
            <Target className="text-slate-950 w-6 h-6" />
          </div>
          <span>Fairway<span className="text-emerald-500">Fund</span></span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
          <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
          <a href="#charities" className="hover:text-white transition-colors">Our Charities</a>
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-full text-sm font-semibold transition-all"
        >
          Member Login
        </button>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative pt-20 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-emerald-500/10 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
              The 2026 Season is Live
            </span>
          </motion.div>
          
          <motion.h1 
            {...fadeIn} 
            className="text-5xl md:text-7xl font-extrabold text-white mb-8 leading-[1.1]"
          >
            Play Your Best. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Give Your Best.
            </span>
          </motion.h1>

          <motion.p 
            {...fadeIn} 
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            The world's first automated Rolling Five charity league. Track your Stableford scores, support local causes, and win monthly prize pools.
          </motion.p>

          <motion.div {...fadeIn} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-emerald-900/20 transition-all hover:scale-105"
            >
              Start Your Rolling Five <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 font-bold rounded-2xl transition-all">
              View Prize Pools
            </button>
          </motion.div>
        </div>
      </section>

      {/* --- Features Grid --- */}
      <section id="how-it-works" className="py-24 px-6 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { 
                icon: <Target className="w-8 h-8 text-emerald-500" />, 
                title: "Rolling Five Logic", 
                desc: "Your handicap stays sharp with our automated system that only counts your last five valid scores." 
              },
              { 
                icon: <Heart className="w-8 h-8 text-pink-500" />, 
                title: "Charity Split", 
                desc: "10% of every entry goes directly to your chosen charity. Impact made with every swing." 
              },
              { 
                icon: <Trophy className="w-8 h-8 text-amber-500" />, 
                title: "Monthly Draws", 
                desc: "We match player scores against monthly winning numbers. High accuracy, instant rewards." 
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-slate-900 border border-slate-800 rounded-3xl hover:border-emerald-500/30 transition-all group"
              >
                <div className="mb-6 p-3 bg-slate-950 w-fit rounded-2xl group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Simple Footer --- */}
      <footer className="py-12 px-6 border-t border-slate-900 text-center text-slate-500 text-sm">
        <p>© 2026 FairwayFund Platform. Built for the modern golfer.</p>
      </footer>
    </div>
  );
};

export default LandingPage;