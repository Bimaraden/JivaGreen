
import React, { useEffect, useState } from 'react';

const SplashScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onFinish, 500); // Tunggu animasi fade out selesai
    }, 1200);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#004d40] transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="relative">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-emerald-400/20 blur-[60px] rounded-full animate-pulse"></div>
        
        {/* Logo Container */}
        <div className="relative w-48 h-48 md:w-64 md:h-64 animate-logo-in">
          <img 
            src="https://images.squarespace-cdn.com/content/v1/5e94819777d6127c569d1560/1601332733971-S6C7I7I6B2Q2K2H6S6S6/Logo+Icon.png" // Placeholder URL to simulate the uploaded logo
            alt="WasteFlow Logo" 
            className="w-full h-full object-contain rounded-[3rem] shadow-2xl border-4 border-white/10"
            onError={(e) => {
              // Fallback if image fails - showing the sprout concept via icon
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) parent.innerHTML = '<div class="w-full h-full bg-emerald-800 rounded-[3rem] flex items-center justify-center text-emerald-400 border-4 border-white/10 shadow-2xl"><i class="fas fa-leaf text-7xl"></i></div>';
            }}
          />
        </div>
      </div>

      <div className="mt-12 text-center animate-fade-up">
        <h1 className="text-4xl font-black text-white tracking-tighter mb-2">WasteFlow</h1>
        <div className="flex items-center justify-center gap-3">
          <div className="h-1 w-12 bg-emerald-400 rounded-full"></div>
          <p className="text-emerald-200 text-[10px] font-black uppercase tracking-[0.4em]">Eco Marketplace</p>
          <div className="h-1 w-12 bg-emerald-400 rounded-full"></div>
        </div>
      </div>

      <div className="absolute bottom-12 flex flex-col items-center gap-3">
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-400 animate-loading-bar"></div>
        </div>
        <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Memulai Ekosistem...</p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes logo-in {
          0% { transform: scale(0.5); opacity: 0; filter: blur(10px); }
          100% { transform: scale(1); opacity: 1; filter: blur(0); }
        }
        @keyframes fade-up {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes loading-bar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-logo-in { animation: logo-in 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-fade-up { animation: fade-up 1s ease-out 0.5s forwards; opacity: 0; }
        .animate-loading-bar { animation: loading-bar 1.2s linear forwards; }
      `}} />
    </div>
  );
};

export default SplashScreen;
