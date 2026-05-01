
import React, { useState } from 'react';
import { User } from '../types';
import { motion } from 'motion/react';
import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

interface ProfileProps {
  user: User;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [isResetting, setIsResetting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleResetPassword = async () => {
    setIsResetting(true);
    setMessage(null);
    try {
      if (user.email) {
        await sendPasswordResetEmail(auth, user.email);
        setMessage({
          type: 'success',
          text: `Secure instructions dispatched to ${user.email}`
        });
      } else {
        throw new Error("Target email not identified.");
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'System error. Please retry shortly.'
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-1000 pb-20 px-4 md:px-0">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="w-full text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
            Security Control
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-dark tracking-tighter leading-tight md:leading-[0.8]">
             Identitas <br className="hidden md:block"/> <span className="text-shimmer bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-700">Digital Anda.</span>
          </h2>
        </div>
      </header>

      <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] shadow-2xl border border-black/5 overflow-hidden">
        <div className="p-8 md:p-20 space-y-12 md:space-y-16">
          {/* Profile Header section */}
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 pb-12 md:pb-16 border-b border-black/5 text-center md:text-left">
            <div className="relative group">
              <div className="absolute inset-[-4px] bg-gradient-to-tr from-primary to-blue-500 rounded-[2.5rem] md:rounded-[3.5rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden border-[6px] md:border-[8px] border-soft-white shadow-2xl w-28 h-28 md:w-52 md:h-52">
                <img 
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=004d40&color=fff&size=256`} 
                  alt={user.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 md:-bottom-4 md:-right-4 bg-primary text-white w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center shadow-2xl border-2 md:border-4 border-white">
                 <i className="fas fa-check-circle text-base md:text-lg"></i>
              </div>
            </div>
            
            <div className="space-y-4">
               <div>
                 <h3 className="text-3xl md:text-5xl font-black text-dark tracking-tighter leading-none mb-1 md:mb-2">{user.name}</h3>
                 <p className="text-[10px] md:text-sm font-bold text-dark/30 tracking-widest uppercase">{user.email}</p>
               </div>
               
               <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-3">
                  <div className="px-5 md:px-6 py-1.5 md:py-2 bg-dark rounded-full text-primary text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-black/10">
                     {user.role}
                  </div>
                  <div className="px-5 md:px-6 py-1.5 md:py-2 bg-soft-white rounded-full text-dark/40 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] border border-black/5">
                     Member since {new Date(user.joinedAt).getFullYear()}
                  </div>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
            <div className="lg:col-span-5 space-y-8 md:space-y-10">
               <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-dark/20 uppercase tracking-[0.4em] px-2">Cyber Security</h4>
                  <div className="bg-dark rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 space-y-6 md:space-y-8 shadow-2xl border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                       <i className="fas fa-fingerprint text-7xl md:text-8xl text-white"></i>
                    </div>
                    
                    <div className="space-y-2 relative z-10">
                       <p className="text-white font-black text-lg md:text-xl tracking-tight">Vitals & Credentials</p>
                       <p className="text-white/40 text-[10px] md:text-[11px] leading-relaxed font-medium">
                         Pastikan akses akun Anda terenkripsi secara berkala untuk menjaga aset Eco-Balance tetap aman.
                       </p>
                    </div>

                    <button onClick={handleResetPassword} disabled={isResetting} className={`relative z-10 w-full h-14 md:h-16 rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 md:gap-4 ${isResetting ? 'bg-white/10 text-white/30 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-dark shadow-xl shadow-primary/20 active:scale-[0.98]'}`}>
                      {isResetting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Processing Relay...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-key-skeleton"></i>
                          Deploy Password Reset
                        </>
                      )}
                    </button>

                    {message && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-4 md:p-5 rounded-2xl text-[9px] md:text-[10px] font-black tracking-widest flex items-center gap-3 backdrop-blur-md border ${message.type === 'success' ? 'bg-primary/20 text-primary border-primary/20' : 'bg-rose-500/20 text-rose-500 border-rose-500/20'}`}>
                        <i className={`fas ${message.type === 'success' ? 'fa-shield-check' : 'fa-info-circle'}`}></i>
                        <span className="leading-relaxed">{message.text}</span>
                      </motion.div>
                    )}
                  </div>
               </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
                <h4 className="text-[10px] font-black text-dark/20 uppercase tracking-[0.4em] px-8">Ecological Contribution</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="bg-soft-white rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 border border-black/5 group hover:bg-primary/5 transition-all">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-sm mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                         <i className="fas fa-tree text-primary text-sm md:text-base"></i>
                      </div>
                      <p className="text-[9px] md:text-[10px] font-black text-dark/20 uppercase tracking-[0.2em] mb-1">Impact Factor</p>
                      <h5 className="text-4xl md:text-5xl font-black text-dark tracking-tighter leading-none">{user.ecoStats.treesGrown} <span className="text-[10px] md:text-xs font-bold text-dark/30 uppercase">Trees</span></h5>
                   </div>

                   <div className="bg-soft-white rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 border border-black/5 group hover:bg-blue-500/5 transition-all">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-sm mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                         <i className="fas fa-droplet text-blue-500 text-sm md:text-base"></i>
                      </div>
                      <p className="text-[9px] md:text-[10px] font-black text-dark/20 uppercase tracking-[0.2em] mb-1">Conservation</p>
                      <h5 className="text-4xl md:text-5xl font-black text-dark tracking-tighter leading-none">{user.ecoStats.waterSaved}<span className="text-[10px] md:text-xs font-bold text-dark/30 uppercase">Liters</span></h5>
                   </div>

                   <div className="bg-dark rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 col-span-1 md:col-span-2 group relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-[2s] hidden md:block">
                         <i className="fas fa-wind text-8xl text-white"></i>
                      </div>
                      <div className="relative z-10">
                        <p className="text-[9px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Atmospheric Repair</p>
                        <h5 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-none">{user.ecoStats.co2Saved}<span className="text-[10px] md:text-xs font-bold text-white/30 ml-2 uppercase">kg CO2 Neutralized</span></h5>
                      </div>
                   </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
