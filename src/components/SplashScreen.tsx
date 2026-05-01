
import React, { useEffect, useState } from 'react';

const SplashScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onFinish, 800);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white transition-all duration-700 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0 scale-105 pointer-events-none'}`}>
      <div className="relative group">
        {/* Soft Glow */}
        <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full animate-pulse transition-all duration-1000"></div>
        
        {/* Animated Sprout/Logo Concept */}
        <div className="relative w-40 h-40 md:w-48 md:h-48 flex items-center justify-center animate-logo-pop">
          <img src="/logo.png" className="w-full h-full object-contain drop-shadow-2xl" alt="Jivagreen Logo" referrerPolicy="no-referrer" />
        </div>
      </div>

      <div className="mt-10 text-center flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-black text-dark tracking-tighter mb-1 animate-title-fade italic">
          Jiva<span className="text-primary italic">green.</span>
        </h1>
        <p className="text-dark/40 text-[10px] font-bold uppercase tracking-[0.5em] animate-fade-in delay-700">
          Sustainable Living
        </p>
      </div>

      <div className="absolute bottom-16 flex flex-col items-center gap-4">
        <div className="w-12 h-1 bg-soft-white rounded-full overflow-hidden">
          <div className="h-full bg-primary animate-loading-bar-minimal"></div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes logo-pop {
          0% { transform: scale(0); opacity: 0; filter: blur(20px); }
          60% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; filter: blur(0); }
        }
        @keyframes title-fade {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes sway {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(15deg); }
        }
        @keyframes loading-bar-minimal {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-logo-pop { animation: logo-pop 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-title-fade { animation: title-fade 1s ease-out 0.4s forwards; opacity: 0; }
        .animate-sway { animation: sway 3s ease-in-out infinite; }
        .animate-loading-bar-minimal { animation: loading-bar-minimal 1.5s ease-in-out infinite; }
      `}} />
    </div>
  );
};

export default SplashScreen;
