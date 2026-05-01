import React, { useState } from 'react';
import { Waste, User } from '../src/types'; 

interface CheckoutModalProps {
  waste: Waste;
  user: User;
  onConfirm: (address: string) => void;
  onClose: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ waste, user, onConfirm, onClose }) => {
  const [address, setAddress] = useState('');
  const wastePoints = Math.floor(waste.price / 100);
  const shippingPoints = 100; // Flat courier cost: 100 Pts / Rp 10.000
  const totalPoints = wastePoints + shippingPoints;
  const canAfford = user.points >= totalPoints;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6 animate-in fade-in duration-500">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-xl rounded-t-[2.5rem] md:rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden animate-in slide-in-from-bottom-20 duration-700 max-h-[90vh] overflow-y-auto">
        <header className="bg-emerald-600 px-6 py-8 md:px-10 md:py-10 text-white relative">
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 md:top-8 md:right-8 w-10 h-10 md:w-12 md:h-12 bg-white/15 hover:bg-white/25 rounded-xl md:rounded-2xl flex items-center justify-center transition-all active:scale-90"
          >
            <i className="fas fa-times"></i>
          </button>
          <div className="flex items-center gap-3 md:gap-4 mb-2">
             <div className="px-2 py-1 md:px-3 bg-white/20 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest border border-white/20">
               Pesanan Aman
             </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">Konfirmasi Pesanan</h2>
          <p className="text-emerald-100/70 text-[10px] md:text-xs font-medium mt-1">Selesaikan pembelian menggunakan Eco-Points Anda.</p>
        </header>

        <div className="p-6 md:p-14 space-y-8 md:space-y-10">
          {/* Detailed Summary Card */}
          <div className="flex gap-4 md:gap-8 p-4 md:p-6 bg-slate-50 rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-inner">
            <div className="relative group shrink-0">
               <img src={waste.imageUrl} className="w-20 h-28 md:w-24 md:h-32 object-cover rounded-xl md:rounded-[1.5rem] shadow-xl transition-transform group-hover:rotate-3" alt={waste.title} />
               <div className="absolute -bottom-2 -right-2 w-6 h-6 md:w-8 md:h-8 bg-emerald-600 rounded-lg md:rounded-xl flex items-center justify-center text-white text-[8px] md:text-[10px] shadow-lg border-2 border-white">
                 <i className="fas fa-check"></i>
               </div>
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="text-lg md:text-xl font-black text-slate-800 leading-tight mb-1 md:mb-2">{waste.title}</h3>
              <p className="text-xs md:text-sm text-slate-400 font-medium mb-2">{waste.material}</p>
              {waste.composition && waste.composition.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3 md:mb-4">
                  {waste.composition.map((c, i) => (
                    <span key={i} className="text-[7px] md:text-[8px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-100 font-bold">
                      {c.material} {c.percentage}%
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2 md:gap-3">
                 <span className="text-emerald-600 font-black text-base md:text-lg">{wastePoints} Pts</span>
                 <span className="text-slate-200">|</span>
                 <span className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">Rp {waste.price.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          {/* Pricing Calculation Table */}
          <div className="space-y-4 px-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Harga Sampah</span>
              <span className="font-black text-slate-800">{wastePoints} Pts</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Biaya Kurir</span>
                <div className="px-2 py-0.5 bg-slate-100 rounded text-[8px] font-black text-slate-500">FLAT</div>
              </div>
              <span className="font-black text-slate-800">{shippingPoints} Pts</span>
            </div>
            <div className="h-px bg-slate-100 my-4"></div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-1">Total Pembayaran</p>
                <p className="text-xs md:text-sm text-slate-400 font-medium italic">Termasuk PPN & Biaya Karbon</p>
              </div>
              <div className="text-right">
                <span className="text-3xl md:text-4xl font-black text-emerald-600 tracking-tighter">{totalPoints} Pts</span>
              </div>
            </div>
          </div>

          {/* Delivery Address Form */}
          <div className="space-y-3 md:space-y-4">
            <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4 md:ml-6">Alamat Tujuan Pengiriman</label>
            <textarea 
              required
              placeholder="Masukkan alamat lengkap tujuan pengiriman (Jalan, No Rumah, Kelurahan, Kota)..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-5 md:p-8 bg-slate-50 border border-slate-100 rounded-2xl md:rounded-[2.5rem] outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all min-h-[100px] md:min-h-[120px] text-xs md:text-sm font-semibold text-slate-700"
            />
          </div>

          {/* Insufficient Points Alert */}
          {!canAfford && (
            <div className="p-4 md:p-6 bg-rose-50 rounded-2xl md:rounded-[2rem] flex items-center gap-4 md:gap-5 border border-rose-100 animate-pulse">
               <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl flex items-center justify-center text-rose-600 shadow-md shrink-0">
                 <i className="fas fa-exclamation-triangle"></i>
               </div>
               <div>
                 <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-rose-400">Saldo Tidak Mencukupi</p>
                 <p className="text-xs md:text-sm font-bold text-rose-600">Anda butuh {(totalPoints - user.points)} Pts tambahan.</p>
               </div>
            </div>
          )}

          {/* Final Action Button */}
          <button 
            onClick={() => address && canAfford && onConfirm(address)}
            disabled={!canAfford || !address}
            className="w-full py-5 md:py-7 bg-slate-900 text-white font-black rounded-2xl md:rounded-[2.5rem] hover:bg-emerald-600 transition-all shadow-xl md:shadow-2xl active:scale-95 disabled:opacity-20 disabled:grayscale uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-[11px]"
          >
            {canAfford ? 'KONFIRMASI PEMBAYARAN' : 'PENGISIAN SALDO DIPERLUKAN'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
