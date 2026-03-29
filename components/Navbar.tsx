
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import logoImg from './asset/logo.png';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onNavigate, currentPage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAdmin = user?.role === UserRole.ADMIN;

  const handleNavigation = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-[60] bg-[#002b24]/90 backdrop-blur-md border-b border-emerald-800/30 px-4 py-4 shadow-2xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <div 
          className="flex items-center gap-3 md:gap-4 cursor-pointer group" 
          onClick={() => handleNavigation('home')}
        >
          <div className="w-10 h-10 md:w-12 md:h-12 overflow-hidden rounded-[1rem] md:rounded-[1.2rem] shadow-lg shadow-emerald-950/50 group-hover:rotate-6 transition-all duration-500 border border-emerald-500/30 bg-emerald-900 flex items-center justify-center p-1.5 md:p-2">
            <img 
              src={logoImg} 
              alt="Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg md:text-xl font-black text-white tracking-tighter leading-none brand-font">
              JivaGreen
            </span>
            <span className="text-[7px] md:text-[8px] font-black text-emerald-400 uppercase tracking-[0.3em] mt-1 brand-font">Eco Ecosystem</span>
          </div>
        </div>

        {/* Desktop Menu (Hidden on Mobile/Tablet) */}
        <div className="hidden lg:flex items-center bg-black/20 rounded-2xl p-1 border border-white/5">
          <button 
            onClick={() => handleNavigation('home')}
            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentPage === 'home' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            Beranda
          </button>
          
          <button 
            onClick={() => handleNavigation('scanner')}
            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentPage === 'scanner' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            Scan (AI)
          </button>
          
          {user && (
            <>
              <button 
                onClick={() => handleNavigation('sell')}
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentPage === 'sell' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                Jual
              </button>
              <button 
                onClick={() => handleNavigation('wallet')}
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentPage === 'wallet' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                Dompet
              </button>
            </>
          )}

          {isAdmin && (
            <button 
              onClick={() => handleNavigation('admin')}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${currentPage === 'admin' ? 'bg-amber-500 text-white shadow-lg' : 'text-amber-400 hover:bg-amber-500/10'}`}
            >
              <i className="fas fa-crown"></i>
              Admin
            </button>
          )}

          {/* Sponsor Placeholder */}
          <div className="px-4 py-1 ml-2 border-l border-white/10 flex items-center gap-3">
            <span className="text-[7px] font-black text-emerald-500/50 uppercase tracking-widest vertical-text">Sponsor</span>
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-help" title="Your Logo Here">
              <i className="fas fa-handshake text-[10px] text-emerald-400"></i>
            </div>
          </div>
        </div>

        {/* Right Section: Profile & Mobile Toggle */}
        <div className="flex items-center gap-2 md:gap-4">
          {user ? (
            <div className="flex items-center gap-2 md:gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-white">{user.name}</p>
                <div className="flex items-center justify-end gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                  <p className="text-[9px] text-emerald-400 font-black uppercase tracking-tighter">
                    {isAdmin ? 'Infinite' : `${user.points} Pts`}
                  </p>
                </div>
              </div>
              <div 
                className="relative cursor-pointer group"
                onClick={() => handleNavigation('profile')}
              >
                <img 
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=004d40&color=fff`} 
                  className={`w-9 h-9 md:w-11 md:h-11 rounded-xl md:rounded-2xl border-2 shadow-xl group-hover:scale-110 transition-transform ${currentPage === 'profile' ? 'border-emerald-400' : isAdmin ? 'border-amber-400' : 'border-emerald-500/20'}`}
                  alt="Profile"
                />
              </div>
              
              {/* Desktop Logout (Hidden on Mobile/Tablet Dropdown) */}
              <button 
                onClick={onLogout}
                className="hidden lg:flex w-10 h-10 items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:bg-rose-500 hover:text-white transition-all shadow-inner"
              >
                <i className="fas fa-power-off text-xs"></i>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => handleNavigation('login')}
              className="hidden lg:block bg-emerald-600 text-white px-6 md:px-8 py-2 md:py-3 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-950/50 active:scale-95 border border-emerald-400/30"
            >
              Mulai Jual
            </button>
          )}

          {/* Mobile/Tablet Menu Toggle Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white hover:bg-white/10 transition-all"
            aria-label="Toggle menu"
          >
            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-lg`}></i>
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Menu Dropdown */}
      <div className={`lg:hidden absolute top-full left-0 w-full overflow-hidden transition-all duration-500 ease-in-out ${isMobileMenuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
        <div className="bg-[#002b24] border-b border-emerald-800/50 p-6 space-y-4 shadow-2xl">
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => handleNavigation('scanner')}
              className={`w-full py-4 px-6 rounded-2xl text-left text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-between ${currentPage === 'scanner' ? 'bg-emerald-600 text-white' : 'text-emerald-100 bg-white/5'}`}
            >
              Scan Sampah (AI)
              <i className="fas fa-qrcode opacity-50"></i>
            </button>
            
            <button 
              onClick={() => handleNavigation('home')}
              className={`w-full py-4 px-6 rounded-2xl text-left text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-between ${currentPage === 'home' ? 'bg-emerald-600 text-white' : 'text-emerald-100 bg-white/5'}`}
            >
              Beranda
              <i className="fas fa-home opacity-50"></i>
            </button>
            
            {!user && (
              <button 
                onClick={() => handleNavigation('login')}
                className="w-full py-4 px-6 rounded-2xl text-left text-[11px] font-black uppercase tracking-[0.2em] bg-emerald-500 text-white flex items-center justify-between"
              >
                Masuk / Daftar
                <i className="fas fa-sign-in-alt"></i>
              </button>
            )}

            {user && (
              <>
                  <button 
                    onClick={() => handleNavigation('sell')}
                    className={`w-full py-4 px-6 rounded-2xl text-left text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-between ${currentPage === 'sell' ? 'bg-emerald-600 text-white' : 'text-emerald-100 bg-white/5'}`}
                  >
                    Jual Sampah
                    <i className="fas fa-plus-circle opacity-50"></i>
                  </button>
                <button 
                  onClick={() => handleNavigation('wallet')}
                  className={`w-full py-4 px-6 rounded-2xl text-left text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-between ${currentPage === 'wallet' ? 'bg-emerald-600 text-white' : 'text-emerald-100 bg-white/5'}`}
                >
                  Dompet ({user.points} Pts)
                  <i className="fas fa-wallet opacity-50"></i>
                </button>

                <button 
                  onClick={() => handleNavigation('profile')}
                  className={`w-full py-4 px-6 rounded-2xl text-left text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-between ${currentPage === 'profile' ? 'bg-emerald-600 text-white' : 'text-emerald-100 bg-white/5'}`}
                >
                  Pengaturan Akun
                  <i className="fas fa-cog opacity-50"></i>
                </button>
                
                {isAdmin && (
                  <button 
                    onClick={() => handleNavigation('admin')}
                    className={`w-full py-4 px-6 rounded-2xl text-left text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-between ${currentPage === 'admin' ? 'bg-amber-500 text-white' : 'text-amber-400 bg-amber-500/10 border border-amber-500/20'}`}
                  >
                    Dashboard Admin
                    <i className="fas fa-crown"></i>
                  </button>
                )}

                <div className="pt-4 border-t border-white/5">
                  <button 
                    onClick={onLogout}
                    className="w-full py-4 px-6 rounded-2xl text-left text-[11px] font-black uppercase tracking-[0.2em] text-rose-400 bg-rose-400/10 flex items-center justify-between"
                  >
                    Keluar Sesi
                    <i className="fas fa-power-off"></i>
                  </button>
                </div>
              </>
            )}
          </div>
          
          <div className="text-center pt-2">
            <p className="text-[8px] font-black text-emerald-800 uppercase tracking-widest brand-font">JivaGreen AI v4.0</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
