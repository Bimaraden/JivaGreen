import React from 'react';
import { motion } from 'motion/react';

const FooterAnimation: React.FC = () => {
  return (
    <div className="w-full bg-white pt-20 pb-10 px-4 overflow-hidden border-t border-slate-100">
      <div className="max-w-6xl mx-auto relative h-[350px] flex items-end justify-center">
        
        {/* Sky Elements */}
        <div className="absolute top-0 inset-x-0 h-full pointer-events-none">
          {/* Clouds */}
          <motion.div 
            animate={{ x: [-15, 15, -15] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-[8%] top-12"
          >
            <svg width="140" height="50" viewBox="0 0 140 50" fill="none">
              <path d="M20 40C20 30 30 25 45 25C50 10 75 10 85 25C105 20 130 25 130 40" fill="#B3E5FC" fillOpacity="0.4" />
              <path d="M20 40C20 30 30 25 45 25C50 10 75 10 85 25C105 20 130 25 130 40" stroke="#0288D1" strokeWidth="2" strokeLinecap="round" />
              <path d="M15 45H135" stroke="#0288D1" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </motion.div>

          <motion.div 
            animate={{ x: [15, -15, 15] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-[12%] top-20"
          >
            <svg width="110" height="40" viewBox="0 0 110 40" fill="none">
              <path d="M15 30C15 20 25 15 35 15C40 5 60 5 70 15C85 10 105 15 105 30" fill="#B3E5FC" fillOpacity="0.4" />
              <path d="M15 30C15 20 25 15 35 15C40 5 60 5 70 15C85 10 105 15 105 30" stroke="#0288D1" strokeWidth="2" strokeLinecap="round" />
              <path d="M10 35H105" stroke="#0288D1" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </motion.div>

          {/* Birds */}
          <motion.div 
            animate={{ x: [-20, 20, -20], y: [0, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-[30%] top-16"
          >
            <svg width="40" height="20" viewBox="0 0 40 20" fill="none" stroke="#2D3436" strokeWidth="2">
              <path d="M5 15C10 10 15 10 20 15C25 10 30 10 35 15" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>

          {/* Sparkles (4-pointed stars) */}
          <motion.div 
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute left-[42%] top-24"
          >
            <svg width="45" height="45" viewBox="0 0 45 45" fill="none" stroke="#2D3436" strokeWidth="2">
              <path d="M22.5 5L26 19L40 22.5L26 26L22.5 40L19 26L5 22.5L19 19L22.5 5Z" />
            </svg>
          </motion.div>
          <motion.div 
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 4, repeat: Infinity, delay: 2 }}
            className="absolute left-[46%] top-32"
          >
            <svg width="35" height="35" viewBox="0 0 45 45" fill="none" stroke="#2D3436" strokeWidth="2">
              <path d="M22.5 5L26 19L40 22.5L26 26L22.5 40L19 26L5 22.5L19 19L22.5 5Z" />
            </svg>
          </motion.div>
        </div>

        {/* Large Recycle Symbol (3D Folded Mobius Style) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          >
            <svg width="160" height="160" viewBox="0 0 100 100" fill="none">
              <g transform="translate(50, 50)">
                {/* Define one segment of the Mobius loop */}
                <g id="mobius-segment">
                  {/* Main front face of the arrow tail */}
                  <path 
                    d="M-12,-38 L18,-38 L28,-22 L-2,-22 Z" 
                    fill="#32CD32" 
                  />
                  {/* The "fold" or underside that creates 3D depth */}
                  <path 
                    d="M-12,-38 L-22,-22 L-2,-22 Z" 
                    fill="#228B22" 
                  />
                  {/* The arrow head front face */}
                  <path 
                    d="M18,-38 L38,-38 L28,-22 Z" 
                    fill="#32CD32" 
                  />
                  {/* Subtle shadow for depth */}
                  <path 
                    d="M-2,-22 L28,-22 L28,-20 L-2,-20 Z" 
                    fill="#1B5E20" 
                    opacity="0.2"
                  />
                </g>
                {/* Rotate the segment twice to complete the loop */}
                <g transform="rotate(120)">
                  <use href="#mobius-segment" />
                </g>
                <g transform="rotate(240)">
                  <use href="#mobius-segment" />
                </g>
              </g>
            </svg>
          </motion.div>
        </div>

        {/* Ground & Platform */}
        <div className="absolute bottom-0 inset-x-0 h-1 bg-[#4A4A4A]"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-6 bg-[#E0E0E0] border-t-2 border-x-2 border-[#4A4A4A] rounded-t-lg"></div>

        {/* Main Scene Elements */}
        <div className="relative w-full flex items-end justify-between px-10 pb-1">
          
          {/* Left Side: Large Bottles */}
          <div className="flex items-end gap-4">
            {/* Large Bottles */}
            <div className="flex items-end -space-x-4 opacity-40">
              <svg width="60" height="120" viewBox="0 0 60 120" fill="none" stroke="#4A4A4A" strokeWidth="2">
                <path d="M10 110H50V40C50 30 40 25 40 15V5H20V15C20 25 10 30 10 40V110Z" fill="#F5F5F5" />
                <path d="M15 80H45M15 90H45M15 100H45" strokeOpacity="0.3" />
              </svg>
              <svg width="40" height="100" viewBox="0 0 40 100" fill="none" stroke="#4A4A4A" strokeWidth="2">
                <path d="M5 90H35V30C35 20 25 15 25 10V2H15V10C15 20 5 25 5 30V90Z" fill="#F5F5F5" />
              </svg>
            </div>
          </div>

          {/* Center: The Bins */}
          <div className="flex items-end gap-2 md:gap-4 mb-1">
            {/* Blue Bin - Glass */}
            <div className="relative group">
              <div className="absolute -top-12 left-0 w-full flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-sky-500 text-white text-[8px] px-2 py-1 rounded">GLASS</div>
              </div>
              <svg width="60" height="110" viewBox="0 0 60 110" fill="none" stroke="#4A4A4A" strokeWidth="2">
                <path d="M5 105H55V25H5V105Z" fill="#B3E5FC" />
                <path d="M5 25L10 5H50L55 25" fill="#B3E5FC" />
                <path d="M25 50V80C25 85 35 85 35 80V50C35 45 25 45 25 50Z" strokeWidth="1.5" />
                <path d="M10 105V110M50 105V110" strokeWidth="4" />
              </svg>
            </div>

            {/* Red Bin - Paper */}
            <div className="relative group">
              <svg width="60" height="110" viewBox="0 0 60 110" fill="none" stroke="#4A4A4A" strokeWidth="2">
                <path d="M5 105H55V25H5V105Z" fill="#FFCDD2" />
                <path d="M5 25H55V15H5V25Z" fill="#FFCDD2" />
                <rect x="20" y="50" width="20" height="25" rx="2" strokeWidth="1.5" />
                <path d="M23 55H37M23 60H37M23 65H37M23 70H37" strokeWidth="1" />
                <path d="M10 105V110M50 105V110" strokeWidth="4" />
              </svg>
            </div>

            {/* Yellow Bin - Plastic */}
            <div className="relative group">
              <svg width="60" height="110" viewBox="0 0 60 110" fill="none" stroke="#4A4A4A" strokeWidth="2">
                <path d="M5 105H55V25H5V105Z" fill="#FFF9C4" />
                <path d="M5 25H55V15H5V25Z" fill="#FFF9C4" />
                <path d="M30 50V80" strokeWidth="4" strokeLinecap="round" />
                <circle cx="30" cy="65" r="8" strokeWidth="1.5" />
                <path d="M10 105V110M50 105V110" strokeWidth="4" />
              </svg>
            </div>

            {/* Green Bin - Organic */}
            <div className="relative group">
              <motion.div 
                animate={{ rotate: [-2, 2, -2] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <svg width="70" height="120" viewBox="0 0 70 120" fill="none" stroke="#4A4A4A" strokeWidth="2">
                  <path d="M5 115H65V35H5V115Z" fill="#C8E6C9" />
                  <path d="M5 35L0 15H70L65 35" fill="#C8E6C9" />
                  <path d="M20 70C20 60 35 55 50 70C35 85 20 80 20 70Z" fill="#81C784" strokeWidth="1.5" />
                  <path d="M20 70L50 70" strokeWidth="1" />
                  <path d="M15 115V120M55 115V120" strokeWidth="4" />
                </svg>
              </motion.div>
            </div>
          </div>

          {/* Right Side: Smoke */}
          <div className="flex items-end gap-4">
            {/* Smoke/Bush on right */}
            <div className="opacity-20">
              <svg width="100" height="150" viewBox="0 0 100 150" fill="none" stroke="#4A4A4A" strokeWidth="2">
                <circle cx="50" cy="120" r="30" fill="#E0E0E0" />
                <circle cx="30" cy="100" r="25" fill="#E0E0E0" />
                <circle cx="70" cy="90" r="35" fill="#E0E0E0" />
                <circle cx="50" cy="60" r="20" fill="#E0E0E0" />
              </svg>
            </div>
          </div>

        </div>
      </div>
      
      {/* Sponsor/Partner Section */}
      <div className="mt-12 flex flex-col items-center gap-4">
        <p className="text-[9px] font-black text-emerald-800/40 uppercase tracking-[0.4em]">Official Partners</p>
        <div className="flex items-center gap-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          <div className="w-10 h-10 bg-white/50 rounded-xl flex items-center justify-center border border-emerald-100 shadow-sm">
            <i className="fas fa-seedling text-emerald-600"></i>
          </div>
          <div className="w-10 h-10 bg-white/50 rounded-xl flex items-center justify-center border border-emerald-100 shadow-sm">
            <i className="fas fa-solar-panel text-emerald-600"></i>
          </div>
          <div className="w-24 h-10 border-2 border-dashed border-emerald-200 rounded-xl flex items-center justify-center group/add cursor-pointer hover:border-emerald-400 transition-all">
            <span className="text-[8px] font-black text-emerald-300 group-hover/add:text-emerald-500 uppercase tracking-widest">Your Logo</span>
          </div>
        </div>
        
        <div className="mt-4 inline-flex items-center gap-3 px-6 py-2 bg-emerald-50 rounded-full border border-emerald-100">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <p className="text-emerald-800 text-[10px] font-black uppercase tracking-[0.3em]">
            BookFlow Eco: Menuju Masa Depan Tanpa Sampah
          </p>
        </div>
      </div>
    </div>
  );
};

export default FooterAnimation;
