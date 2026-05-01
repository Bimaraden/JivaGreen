
import React from 'react';
import { UserRole } from '../types';

interface FooterProps {
  onNavigate: (page: string) => void;
  isAdmin: boolean;
}

const Footer: React.FC<FooterProps> = ({ onNavigate, isAdmin }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark pt-20 pb-10 text-white relative overflow-hidden rounded-t-[3rem] md:rounded-t-[5rem]">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-[1440px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-6">
            <div 
              className="flex items-center gap-3 cursor-pointer group w-fit" 
              onClick={() => onNavigate('home')}
            >
              <div className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-lg group-hover:rotate-6 transition-transform duration-500 overflow-hidden">
                <img src="/logo.png" className="w-full h-full object-contain" alt="Jivagreen Logo" referrerPolicy="no-referrer" />
              </div>
              <span className="text-2xl font-black text-white tracking-tighter italic">
                Jiva<span className="text-primary italic">green.</span>
              </span>
            </div>
            <p className="text-white/40 text-sm font-medium leading-relaxed max-w-sm">
              Terminal ramah lingkungan untuk ekonomi sirkular. Membantu Anda mengubah nilai sampah menjadi berkah melalui teknologi mutakhir.
            </p>
            <div className="flex gap-4 pt-2">
              {['twitter', 'instagram', 'linkedin', 'github'].map((social) => (
                <a 
                  key={social} 
                  href="#" 
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/30 hover:bg-primary hover:text-white transition-all shadow-sm"
                >
                  <i className={`fab fa-${social}`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Platform</h4>
            <ul className="space-y-4">
              <li>
                <button onClick={() => onNavigate('home')} className="text-sm font-bold text-white/60 hover:text-primary transition-colors text-left uppercase tracking-wider">
                  Beranda
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('scanner')} className="text-sm font-bold text-white/60 hover:text-primary transition-colors text-left uppercase tracking-wider">
                  Scanner Sampah
                </button>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Pasar</h4>
            <ul className="space-y-4">
              <li>
                <button onClick={() => onNavigate('sell')} className="text-sm font-bold text-white/60 hover:text-primary transition-colors text-left uppercase tracking-wider">
                  Jual Sampah
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('marketplace')} className="text-sm font-bold text-white/60 hover:text-primary transition-colors text-left uppercase tracking-wider">
                  Marketplace
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('wallet')} className="text-sm font-bold text-white/60 hover:text-primary transition-colors text-left uppercase tracking-wider">
                  Dompet
                </button>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Akun</h4>
            <ul className="space-y-4">
              <li>
                <button onClick={() => onNavigate('profile')} className="text-sm font-bold text-white/60 hover:text-primary transition-colors text-left uppercase tracking-wider">
                  Profil Saya
                </button>
              </li>
              {isAdmin && (
                <li>
                  <button 
                    onClick={() => onNavigate('admin')}
                    className="text-sm font-black text-primary hover:text-white transition-all text-left uppercase tracking-widest"
                  >
                    Terminal Admin
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div className="lg:col-span-2 md:col-span-2 flex flex-col justify-end">
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
                  <i className="fas fa-paper-plane text-4xl text-white"></i>
               </div>
               <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Gabung Buletin</p>
               <input 
                type="email" 
                placeholder="email@anda.com" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-primary transition-all mb-3 placeholder:text-white/20"
               />
               <button className="w-full bg-primary text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary-dark transition-colors">
                  Berlangganan
               </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-center items-center gap-6">
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] text-center">
            &copy; {currentYear} JIVAGREEN. HAK CIPTA DILINDUNGI.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
