
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onNavigate, currentPage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isAdmin = user?.role === UserRole.ADMIN;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ease-[0.16, 1, 0.3, 1] ${scrolled ? 'py-2 md:py-4' : 'py-4 md:py-8'}`}>
      <div className="max-w-[1440px] mx-auto px-4 md:px-6">
        <div className={`relative flex justify-between items-center px-4 md:px-6 py-3 md:py-4 rounded-[2rem] md:rounded-[2.5rem] transition-all duration-500 border ${scrolled ? 'bg-white/80 backdrop-blur-2xl border-black/5 shadow-2xl scale-[1.01] md:scale-[1.02]' : 'bg-white/40 md:bg-transparent border-black/5 md:border-transparent backdrop-blur-md md:backdrop-blur-none'}`}>
          {/* Logo Section */}
          <div 
            className="flex items-center gap-2 md:gap-3 cursor-pointer group" 
            onClick={() => handleNavigation('home')}
          >
            <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-2xl transition-all duration-500 relative overflow-hidden group-hover:rotate-[8deg] group-hover:scale-110">
               <img src="/logo.png" className="w-full h-full object-contain" alt="Jivagreen Logo" referrerPolicy="no-referrer" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-black text-dark tracking-tighter leading-none italic">
                Jiva<span className="text-primary italic">green.</span>
              </span>
              <span className="text-[6px] md:text-[7px] font-black text-dark/20 uppercase tracking-[0.4em] mt-0.5">Solusilogi</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center bg-dark/5 backdrop-blur-md rounded-[1.5rem] p-1.5 border border-black/5 gap-1">
            {[
              { id: 'home', label: 'Beranda', icon: 'home' },
              { id: 'scanner', label: 'Scanner Sampahmpah', icon: 'qrcode' },
              { id: 'about', label: 'Tentang', icon: 'info' },
              ...(user ? [
                { id: 'sell', label: 'Jual', icon: 'plus-circle' },
                { id: 'wallet', label: 'Dompet', icon: 'wallet' }
              ] : [])
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`relative px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 group ${currentPage === item.id ? 'bg-white text-primary shadow-sm' : 'text-dark/40 hover:text-dark'}`}
              >
                <i className={`fas fa-${item.icon} text-[11px] ${currentPage === item.id ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'} transition-opacity`}></i>
                {item.label}
                {currentPage === item.id && (
                  <motion.div layoutId="nav-active" className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </button>
            ))}
            
            {isAdmin && (
              <button 
                onClick={() => handleNavigation('admin')}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${currentPage === 'admin' ? 'bg-dark text-primary shadow-xl' : 'text-primary/60 hover:bg-primary/5'}`}
              >
                <i className="fas fa-crown"></i>
                Terminal
              </button>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="text-right hidden xl:block">
                  <p className="text-[11px] font-black text-dark tracking-tight leading-none mb-1">{user.name}</p>
                  <p className="text-[9px] text-primary font-black uppercase tracking-widest">
                    {isAdmin ? 'Infinity System' : `${user.points.toLocaleString('id-ID')} Eco Pts`}
                  </p>
                </div>
                <button 
                  className={`hidden lg:flex relative group p-1 rounded-2xl border-2 transition-all ${currentPage === 'profile' ? 'border-primary' : 'border-transparent hover:border-black/5'}`}
                  onClick={() => handleNavigation('profile')}
                >
                  <img 
                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=4CAF50&color=fff`} 
                    className="w-10 h-10 rounded-xl object-cover shadow-lg"
                    alt="Profile"
                  />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary border-2 border-white rounded-full"></div>
                </button>
                
                <button 
                  onClick={onLogout}
                  className="hidden lg:flex w-12 h-12 items-center justify-center rounded-2xl bg-soft-white text-dark/20 hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-black/5"
                >
                  <i className="fas fa-power-off text-sm"></i>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => handleNavigation('login')}
                className="hidden lg:block bg-dark text-primary px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all shadow-2xl shadow-black/10 active:scale-95"
              >
                Mulai Sekarang
              </button>
            )}

            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-[1rem] md:rounded-2xl bg-dark text-white hover:bg-primary transition-all shadow-xl"
            >
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars-staggered'} text-base md:text-lg`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="lg:hidden absolute top-[100%] left-4 right-4 z-[59] mt-2"
            >
              <div className="bg-white rounded-[2.5rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-black/5 space-y-3">
                <div className="flex flex-col gap-2">
                  {[
                    { id: 'home', label: 'Beranda', icon: 'home' },
                    { id: 'scanner', label: 'Scanner AI', icon: 'qrcode' },
                    { id: 'about', label: 'Tentang Jivagreen', icon: 'info' },
                    ...(user ? [
                      { id: 'sell', label: 'Jual Sampah', icon: 'plus-circle' },
                      { id: 'wallet', label: 'Dompet Digital', icon: 'wallet' },
                      { id: 'profile', label: 'Profil Hero', icon: 'user' }
                    ] : [])
                  ].map((item) => (
                    <button 
                      key={item.id}
                      onClick={() => handleNavigation(item.id)}
                      className={`w-full py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-between transition-all ${currentPage === item.id ? 'bg-dark text-primary shadow-lg' : 'bg-soft-white text-dark/70 hover:bg-black/5'}`}
                    >
                      <span className="flex items-center gap-3">
                        <i className={`fas fa-${item.icon} ${currentPage === item.id ? 'text-primary' : 'opacity-30'} text-xs`}></i>
                        {item.label}
                      </span>
                      {currentPage === item.id && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                    </button>
                  ))}
                  
                  {!user && (
                    <button 
                      onClick={() => handleNavigation('login')}
                      className="w-full py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] bg-primary text-white flex items-center justify-between shadow-xl shadow-primary/20 mt-2"
                    >
                      Gabung Komunitas
                      <i className="fas fa-arrow-right text-xs"></i>
                    </button>
                  )}
  
                  {user && isAdmin && (
                    <button 
                      onClick={() => handleNavigation('admin')}
                      className={`w-full py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-between shadow-lg mt-2 ${currentPage === 'admin' ? 'bg-dark text-primary' : 'bg-primary text-white'}`}
                    >
                      Pusat Kontrol
                      <i className="fas fa-crown text-xs"></i>
                    </button>
                  )}
  
                  {user && (
                    <button 
                      onClick={onLogout}
                      className="w-full py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 bg-rose-500/5 flex items-center justify-between hover:bg-rose-500 hover:text-white transition-all mt-4 border border-rose-500/10"
                    >
                      Keluar
                      <i className="fas fa-power-off text-xs"></i>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
