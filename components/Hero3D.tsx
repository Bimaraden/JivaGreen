
import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Leaf, BookOpen, Star } from 'lucide-react';

const Hero3D: React.FC<{ onAction: () => void }> = ({ onAction }) => {
  // Generate random positions for leaves - optimized count
  const leaves = useMemo(() => Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    delay: Math.random() * 10,
    duration: 15 + Math.random() * 15,
    x: Math.random() * 120 - 10,
    y: Math.random() * 100,
    size: 15 + Math.random() * 15,
    rotate: Math.random() * 360,
    sway: 15 + Math.random() * 30,
  })), []);

  // Restore stars - optimized count
  const stars = useMemo(() => Array.from({ length: 25 }).map((_, i) => ({
    id: i,
    delay: Math.random() * 5,
    duration: 2 + Math.random() * 4,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 4 + Math.random() * 8,
    isFilled: Math.random() > 0.5,
  })), []);

  return (
    <div className="relative overflow-hidden bg-[#0a192f] rounded-[2.5rem] md:rounded-[4rem] min-h-[500px] md:min-h-[650px] flex items-center p-6 md:p-16 border border-white/5 shadow-2xl">
      {/* Background Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[70%] h-[70%] bg-emerald-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[70%] h-[70%] bg-teal-600/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Floating Stars (Restored & Optimized) */}
      {stars.map((star) => (
        <motion.div
          key={`star-${star.id}`}
          className="absolute pointer-events-none z-0"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1, 0.8, 1, 0],
            opacity: [0, 0.6, 0.3, 0.6, 0],
          }}
          transition={{ 
            duration: star.duration, 
            repeat: Infinity, 
            delay: star.delay,
            ease: "easeInOut" 
          }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-400 blur-[3px] rounded-full opacity-30 scale-125"></div>
            <Star 
              size={star.size} 
              fill={star.isFilled ? "#fbbf24" : "none"} 
              stroke="#fbbf24" 
              strokeWidth={1.5}
              className="relative z-10 opacity-60"
            />
          </div>
        </motion.div>
      ))}

      {/* Floating Leaves (Optimized) */}
      {leaves.map((leaf) => (
        <motion.div
          key={`leaf-${leaf.id}`}
          className="absolute pointer-events-none z-0"
          initial={{ 
            x: `${leaf.x}%`, 
            y: '-10%', 
            rotate: leaf.rotate,
            opacity: 0 
          }}
          animate={{ 
            y: '110%', 
            rotate: leaf.rotate + 720,
            opacity: [0, 0.6, 0.6, 0],
            x: [`${leaf.x}%`, `${leaf.x + leaf.sway}%`, `${leaf.x - leaf.sway}%`, `${leaf.x}%`]
          }}
          transition={{ 
            duration: leaf.duration, 
            repeat: Infinity, 
            delay: leaf.delay,
            ease: "linear" 
          }}
        >
          <svg width={leaf.size} height={leaf.size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 22C2 22 10 20 14 12C18 4 22 2 22 2C22 2 20 6 12 10C4 14 2 22 2 22Z" fill="#10b981" fillOpacity="0.5" />
            <path d="M2 22C2 22 6 18 12 10" stroke="#065f46" strokeWidth="0.5" strokeLinecap="round" />
          </svg>
        </motion.div>
      ))}

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center w-full">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left max-w-xl mx-auto md:mx-0"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            ECO-FRIENDLY MARKETPLACE
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-4 md:mb-6 leading-[1.1] tracking-tighter">
            Ubah Sampah Jadi <br/>
            <span className="text-emerald-400">Cuan & Hijau.</span>
          </h1>
          <p className="text-slate-400 text-xs md:text-sm lg:text-lg mb-6 md:mb-8 leading-relaxed max-w-md mx-auto md:mx-0">
            Platform jual beli sampah dan daur ulang berbasis AI. Analisa kadar bahan baku secara instan dan dapatkan keuntungan maksimal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onAction}
              className="group relative overflow-hidden px-8 py-4 md:px-10 md:py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl md:rounded-2xl font-black text-sm md:text-lg transition-all active:scale-95 shadow-xl shadow-emerald-900/40"
            >
              <span className="relative z-10">MULAI SEKARANG</span>
              <motion.div 
                className="absolute inset-0 bg-white/20"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.5 }}
              />
            </button>
          </div>

          {/* Sponsor/Partner Logos */}
          <div className="mt-12 pt-8 border-t border-white/5">
            <p className="text-[9px] font-black text-emerald-500/40 uppercase tracking-[0.3em] mb-4">Official Partners & Sponsors</p>
            <div className="flex flex-wrap gap-6 md:gap-10 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <Leaf size={14} className="text-emerald-400" />
                </div>
                <span className="text-[10px] font-black text-white/50 tracking-tighter">ECO-TRUST</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <i className="fas fa-globe-asia text-[14px] text-emerald-400"></i>
                </div>
                <span className="text-[10px] font-black text-white/50 tracking-tighter">GREEN-WORLD</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <i className="fas fa-recycle text-[14px] text-emerald-400"></i>
                </div>
                <span className="text-[10px] font-black text-white/50 tracking-tighter">RECYCLE-PRO</span>
              </div>
              <div className="flex items-center gap-2 border-2 border-dashed border-white/10 rounded-xl px-4 py-1 group/add cursor-pointer hover:border-emerald-500/50 transition-all">
                <span className="text-[8px] font-black text-white/20 group-hover/add:text-emerald-400 tracking-widest uppercase">Your Logo</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="relative flex justify-center items-center h-[300px] md:h-[450px]">
          {/* Enhanced 3D Book Animation */}
          <motion.div 
            className="relative preserve-3d"
            animate={{ 
              rotateY: [-10, 10, -10],
              rotateX: [15, 25, 15],
              y: [0, -20, 0]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            style={{ perspective: 1000 }}
          >
            {/* Book Cover Back */}
            <div className="absolute w-48 h-64 md:w-64 md:h-80 bg-emerald-900 rounded-r-lg shadow-2xl transform translate-z-[-10px]"></div>
            
            {/* Pages */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-48 h-64 md:w-64 md:h-80 bg-[#fdfaf0] border-l border-slate-200 shadow-sm origin-left"
                style={{ 
                  zIndex: 10 - i,
                  transform: `translateZ(${-i * 2}px)` 
                }}
                animate={{ 
                  rotateY: [0, -160, 0] 
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  delay: i * 0.2,
                  ease: "easeInOut" 
                }}
              >
                <div className="p-6 space-y-4">
                  <div className="h-3 bg-slate-200 w-full rounded-full"></div>
                  <div className="h-3 bg-slate-100 w-4/5 rounded-full"></div>
                  <div className="h-3 bg-slate-200 w-full rounded-full"></div>
                  <div className="h-3 bg-slate-100 w-3/4 rounded-full"></div>
                  <div className="mt-8 flex justify-center">
                    <Leaf className="text-emerald-500/20" size={48} />
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Book Cover Front */}
            <motion.div 
              className="absolute w-48 h-64 md:w-64 md:h-80 bg-emerald-700 rounded-r-lg shadow-2xl origin-left border-l-8 border-emerald-900"
              animate={{ 
                rotateY: [0, -165, 0] 
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm border border-white/20">
                  <BookOpen size={40} className="text-white" />
                </div>
                <h3 className="text-white font-black text-xs md:text-sm uppercase tracking-widest">Eco Journal</h3>
                <div className="mt-4 w-12 h-1 bg-emerald-400 rounded-full"></div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .preserve-3d { transform-style: preserve-3d; }
      `}} />
    </div>
  );
};

export default Hero3D;
