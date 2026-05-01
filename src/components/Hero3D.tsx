
import React from 'react';
import { motion } from 'motion/react';

const Hero3D: React.FC<{ onAction: () => void }> = ({ onAction }) => {
  return (
    <section id="hero" className="min-h-[60vh] md:min-h-[80vh] w-full bg-soft-white flex flex-col items-center justify-center py-[60px] md:py-[100px] px-6">
      <div className="max-w-[1100px] w-full mx-auto flex flex-col items-center text-center">
        
        {/* BADGE PILL */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-black/5 rounded-[999px] mb-6 shadow-sm"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 21v-5h5" />
          </svg>
          <span className="text-[11px] font-black text-dark/70 tracking-[0.12em] uppercase font-['Poppins',sans-serif]">
            ECO REVOLUTION
          </span>
        </motion.div>

        {/* HEADLINE H1 */}
        <div className="mb-5 flex flex-col items-center gap-2">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="font-['Montserrat',sans-serif] font-black text-dark leading-[1.05] text-[clamp(42px,7vw,80px)] tracking-tighter"
          >
            Ubah Sampah Jadi
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="flex flex-col w-full"
          >
            <span className="font-['Montserrat',sans-serif] font-black italic text-primary text-[clamp(42px,7vw,80px)] leading-[1.05] tracking-tighter">
              Nilai Berharga 🌍
            </span>
            <div className="h-[4px] bg-primary rounded-[2px] w-full mt-1 max-w-[80%] mx-auto" />
          </motion.div>
        </div>

        {/* TOMBOL */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-center gap-4 w-full md:w-auto mb-8"
        >
          <button 
            onClick={onAction}
            className="w-full md:w-auto font-['Poppins',sans-serif] font-black text-[14px] uppercase tracking-widest bg-primary text-white px-10 py-5 rounded-2xl inline-flex items-center justify-center gap-3 transition-all duration-300 hover:bg-primary-dark hover:scale-[1.05] shadow-xl shadow-primary/20 active:scale-95"
          >
            Pindai Sampah
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7V5a2 2 0 0 1 2-2h2" />
              <path d="M17 3h2a2 2 0 0 1 2 2v2" />
              <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
              <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
            </svg>
          </button>
          
          <button 
            className="w-full md:w-auto font-['Poppins',sans-serif] font-black text-[14px] uppercase tracking-widest text-dark/70 bg-white border border-black/5 px-10 py-5 rounded-2xl inline-flex items-center justify-center gap-2 transition-all duration-300 hover:bg-soft-white hover:border-black/10 active:scale-95 shadow-sm"
          >
            Mulai Jual →
          </button>
        </motion.div>

        {/* SCROLL INDICATOR */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.7 }}
          className="text-dark/20 text-[10px] font-black tracking-[0.3em] font-['Poppins',sans-serif] uppercase mt-12"
        >
          SCROLL TO EXPLORE
        </motion.div>

      </div>
    </section>
  );
};

export default Hero3D;
