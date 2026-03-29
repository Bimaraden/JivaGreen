
import React, { useState } from 'react';
import { User } from '../types';
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
          text: `Instruksi pengaturan ulang kata sandi telah dikirim ke ${user.email}`
        });
      } else {
        throw new Error("Email tidak ditemukan.");
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Gagal mengirim instruksi. Silakan coba lagi nanti.'
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20 px-4">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">Pengaturan <span className="text-emerald-500">Akun</span></h2>
          <p className="text-slate-400 text-[10px] md:text-xs font-medium mt-1 uppercase tracking-widest">Kelola profil dan keamanan Anda</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden mt-6 md:mt-0">
        <div className="p-6 md:p-12 space-y-8 md:space-y-12">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 pb-8 md:pb-12 border-b border-slate-50">
            <div className="relative group">
              <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
              <img 
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=004d40&color=fff&size=256`} 
                alt={user.name}
                className="w-24 h-24 md:w-40 md:h-40 rounded-[2rem] md:rounded-[2.5rem] border-4 border-white shadow-2xl relative z-10 object-cover"
              />
            </div>
            <div className="text-center md:text-left space-y-2">
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{user.name}</h3>
              <p className="text-xs md:text-sm text-slate-500 font-medium">{user.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-3 pt-2">
                <span className="px-3 py-1 md:px-4 md:py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                  {user.role}
                </span>
                <span className="px-3 py-1 md:px-4 md:py-1.5 bg-slate-50 text-slate-600 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-slate-100">
                  Bergabung {new Date(user.joinedAt).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          {/* Settings Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                <i className="fas fa-shield-alt text-emerald-500"></i>
                Keamanan
              </h4>
              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 space-y-4">
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-700">Kata Sandi</p>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Kami menyarankan Anda untuk mengganti kata sandi secara berkala untuk menjaga keamanan akun Anda.
                  </p>
                </div>
                
                <button 
                  onClick={handleResetPassword}
                  disabled={isResetting}
                  className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
                    isResetting 
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                    : 'bg-white text-slate-900 border border-slate-200 hover:border-emerald-500 hover:text-emerald-600 shadow-sm active:scale-95'
                  }`}
                >
                  {isResetting ? (
                    <>
                      <i className="fas fa-circle-notch animate-spin"></i>
                      Memproses...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-key"></i>
                      Reset Kata Sandi
                    </>
                  )}
                </button>

                {message && (
                  <div className={`p-4 rounded-xl text-[10px] font-bold animate-in fade-in slide-in-from-top-2 ${
                    message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                  }`}>
                    <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2`}></i>
                    {message.text}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4 md:space-y-6">
              <h4 className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 md:gap-3">
                <i className="fas fa-leaf text-emerald-500"></i>
                Statistik Eco
              </h4>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="bg-emerald-50/50 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-emerald-100/50 text-center">
                  <p className="text-[7px] md:text-[8px] font-black text-emerald-600 uppercase tracking-widest mb-1 md:mb-2">Pohon Ditanam</p>
                  <p className="text-2xl md:text-3xl font-black text-emerald-700">{user.ecoStats.treesGrown}</p>
                </div>
                <div className="bg-blue-50/50 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-blue-100/50 text-center">
                  <p className="text-[7px] md:text-[8px] font-black text-blue-600 uppercase tracking-widest mb-1 md:mb-2">Air Dihemat</p>
                  <p className="text-2xl md:text-3xl font-black text-blue-700">{user.ecoStats.waterSaved}L</p>
                </div>
                <div className="bg-amber-50/50 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-amber-100/50 text-center col-span-2">
                  <p className="text-[7px] md:text-[8px] font-black text-amber-600 uppercase tracking-widest mb-1 md:mb-2">CO2 Terhindar</p>
                  <p className="text-2xl md:text-3xl font-black text-amber-700">{user.ecoStats.co2Saved}kg</p>
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
