
import React, { useState } from 'react';
import { User, WithdrawalRequest } from '../types';

interface WalletProps {
  user: User;
  onWithdraw: (amount: number, method: string, acc: string) => void;
  onTopUp: (amount: number) => void;
  requests?: WithdrawalRequest[];
}

const Wallet: React.FC<WalletProps> = ({ user, onWithdraw, onTopUp, requests = [] }) => {
  const [activeTab, setActiveTab] = useState<'withdraw' | 'topup'>('topup');
  const [topupAmount, setTopupAmount] = useState<number>(100);
  const [paymentMethod, setPaymentMethod] = useState('QRIS');
  
  const [withdrawAmount, setWithdrawAmount] = useState<number>(20);
  const [withdrawMethod, setWithdrawMethod] = useState('GoPay');
  const [withdrawAccount, setWithdrawAccount] = useState('');

  const paymentMethods = [
    { 
      id: 'GoPay', 
      name: 'GoPay', 
      color: 'bg-white', 
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg'
    },
    { 
      id: 'Dana', 
      name: 'DANA', 
      color: 'bg-white', 
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_DANA.svg'
    },
    { 
      id: 'OVO', 
      name: 'OVO', 
      color: 'bg-white', 
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Logo_ovo_purple.svg'
    },
    { 
      id: 'ShopeePay', 
      name: 'ShopeePay', 
      color: 'bg-white', 
      logoUrl: 'https://vectorlogo4u.com/wp-content/uploads/2021/01/shopee-pay-logo-vector.svg'
    },
    { id: 'Bank', name: 'Bank Digital', color: 'bg-slate-800', icon: 'fa-university' }
  ];

  const topupPackages = [
    { points: 100, price: 10000, label: 'Starter', icon: 'fa-seedling' },
    { points: 500, price: 50000, label: 'Eco Saver', icon: 'fa-leaf' },
    { points: 1000, price: 100000, label: 'Green Hero', popular: true, icon: 'fa-tree' },
    { points: 5000, price: 500000, label: 'Earth Guardian', icon: 'fa-globe-americas' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Visual Balance Card - Figma Style */}
      <div className="relative bg-slate-900 rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-16 text-white overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 w-[40%] h-[100%] bg-emerald-500/10 blur-[120px] rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-[30%] h-[100%] bg-blue-500/5 blur-[100px] rounded-full -ml-20 -mb-20"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-10">
          <div className="space-y-3 md:space-y-4 w-full">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-[10px] md:text-xs">
                <i className="fas fa-wallet"></i>
              </div>
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">Total Eco-Balance</span>
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter break-words">
              {user.points.toLocaleString('id-ID')}
              <span className="text-xs md:text-2xl font-medium text-slate-500 ml-2 md:ml-4 uppercase tracking-widest">Pts</span>
            </h2>
            <div className="inline-flex items-center px-4 py-2 md:px-5 md:py-2.5 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-xl md:rounded-2xl text-[9px] md:text-[11px] font-black uppercase tracking-widest text-slate-300">
              Setara Rp {(user.points * 100).toLocaleString('id-ID')}
            </div>
          </div>
          
          <div className="flex bg-black/40 p-1 md:p-1.5 rounded-[1.2rem] md:rounded-[2rem] border border-white/5 backdrop-blur-xl w-full md:w-auto mt-4 md:mt-0">
             <button 
              onClick={() => setActiveTab('topup')}
              className={`flex-1 md:flex-none px-4 md:px-8 py-3 md:py-4 rounded-[1rem] md:rounded-[1.5rem] text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'topup' ? 'bg-emerald-600 text-white shadow-xl' : 'text-slate-400 hover:text-white'}`}
             >
               Top-up
             </button>
             <button 
              onClick={() => setActiveTab('withdraw')}
              className={`flex-1 md:flex-none px-4 md:px-8 py-3 md:py-4 rounded-[1rem] md:rounded-[1.5rem] text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'withdraw' ? 'bg-emerald-600 text-white shadow-xl' : 'text-slate-400 hover:text-white'}`}
             >
               Tarik
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          {activeTab === 'topup' ? (
            <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-16 shadow-2xl border border-slate-100 space-y-8 md:space-y-12">
              <header>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Isi Saldo <span className="text-emerald-500">Eco</span></h3>
                <p className="text-slate-400 text-xs md:text-sm mt-2 font-medium italic">Pilih paket poin untuk bertransaksi sampah secara ramah lingkungan.</p>
              </header>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                {topupPackages.map((pkg) => (
                  <div 
                    key={pkg.points}
                    onClick={() => setTopupAmount(pkg.points)}
                    className={`group relative p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border-2 cursor-pointer transition-all duration-500 flex flex-col justify-between h-48 md:h-56 ${topupAmount === pkg.points ? 'border-emerald-500 bg-emerald-50 shadow-2xl shadow-emerald-100 scale-[1.03]' : 'border-slate-100 hover:border-emerald-200 bg-white'}`}
                  >
                    {pkg.popular && (
                      <span className="absolute top-4 md:top-6 right-6 md:right-8 bg-emerald-600 text-white text-[8px] md:text-[9px] font-black uppercase px-2 md:px-3 py-1 md:py-1.5 rounded-full shadow-lg">Paling Laris</span>
                    )}
                    <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-2xl transition-all ${topupAmount === pkg.points ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600'}`}>
                      <i className={`fas ${pkg.icon}`}></i>
                    </div>
                    <div>
                      <p className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-1 ${topupAmount === pkg.points ? 'text-emerald-600' : 'text-slate-400'}`}>{pkg.label}</p>
                      <h4 className="text-2xl md:text-3xl font-black text-slate-900">{pkg.points} <span className="text-xs md:text-sm font-bold opacity-30">Pts</span></h4>
                      <p className="font-bold text-slate-500 mt-1 text-xs md:text-base">Rp {pkg.price.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-6 md:space-y-8 pt-6 md:pt-8 border-t border-slate-50">
                <div className="space-y-3 md:space-y-4">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4 md:ml-6">Metode Pembayaran</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    {['QRIS', 'GoPay', 'ShopeePay', 'BCA'].map(m => (
                      <button 
                        key={m}
                        onClick={() => setPaymentMethod(m)}
                        className={`py-4 md:py-5 rounded-[1.5rem] md:rounded-[1.8rem] text-[9px] md:text-[10px] font-black uppercase border-2 transition-all ${paymentMethod === m ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-50 text-slate-400 hover:bg-slate-50'}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900 rounded-[2rem] md:rounded-[2.8rem] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 shadow-2xl shadow-emerald-950/20">
                  <div className="text-center md:text-left">
                    <p className="text-[9px] md:text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Total yang harus dibayar</p>
                    <p className="text-3xl md:text-4xl font-black text-white tracking-tighter">Rp {(topupAmount * 100).toLocaleString('id-ID')}</p>
                  </div>
                  <button 
                    onClick={() => onTopUp(topupAmount)}
                    className="w-full md:w-auto px-10 md:px-16 py-5 md:py-6 bg-emerald-600 text-white rounded-[1.5rem] md:rounded-[2rem] font-black text-[10px] md:text-xs uppercase tracking-[0.2em] hover:bg-emerald-500 transition-all shadow-xl active:scale-95"
                  >
                    Proses Pembayaran
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-16 shadow-2xl border border-slate-100 space-y-8 md:space-y-12">
              <header>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Penarikan <span className="text-emerald-500">Tunai</span></h3>
                <p className="text-slate-400 text-xs md:text-sm mt-2 font-medium italic">Konversi hasil penjualan sampah Anda menjadi saldo uang elektronik.</p>
              </header>

              <div className="space-y-8 md:space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                   <div className="space-y-3 md:space-y-4">
                      <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 md:ml-6">Jumlah Poin</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          step="20"
                          min="20"
                          max={user.points}
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                          className="w-full px-8 md:px-10 py-5 md:py-6 bg-slate-50 border border-slate-100 rounded-[2rem] md:rounded-[2.2rem] font-black text-2xl md:text-3xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all"
                        />
                        <div className="absolute right-6 md:right-8 top-1/2 -translate-y-1/2 bg-white px-2 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl border border-slate-100 text-[8px] md:text-[9px] font-black text-emerald-600 uppercase">Min 20 Pts</div>
                      </div>
                      <p className="text-[9px] md:text-[10px] font-bold text-slate-400 ml-4 md:ml-6">Estimasi diterima: <span className="text-emerald-600">Rp {(withdrawAmount * 100).toLocaleString('id-ID')}</span></p>
                   </div>
                   
                   <div className="space-y-3 md:space-y-4">
                      <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 md:ml-6">Destinasi Penarikan</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 md:gap-3">
                        {paymentMethods.map(m => (
                          <button 
                            key={m.id}
                            onClick={() => setWithdrawMethod(m.id)}
                            className={`flex flex-col items-center justify-center p-3 md:p-4 rounded-[1.5rem] md:rounded-[2rem] border-2 transition-all gap-2 ${withdrawMethod === m.id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-50 bg-slate-50 hover:bg-slate-100'}`}
                          >
                            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl ${m.color} flex items-center justify-center text-[10px] md:text-xs shadow-sm overflow-hidden p-2`}>
                              {m.logoUrl ? (
                                <img src={m.logoUrl} alt={m.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                              ) : (
                                <i className={`fas ${m.icon} text-white`}></i>
                              )}
                            </div>
                            <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-tighter ${withdrawMethod === m.id ? 'text-emerald-600' : 'text-slate-400'}`}>{m.name}</span>
                          </button>
                        ))}
                      </div>
                   </div>
                </div>

                <div className="space-y-3 md:space-y-4">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 md:ml-6">Nomor Rekening / HP</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Contoh: 081234567890"
                    value={withdrawAccount}
                    onChange={(e) => setWithdrawAccount(e.target.value)}
                    className="w-full px-8 md:px-10 py-5 md:py-6 bg-slate-50 border border-slate-100 rounded-[2rem] md:rounded-[2.2rem] font-black outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all text-sm md:text-base"
                  />
                </div>

                <button 
                  onClick={() => onWithdraw(withdrawAmount, withdrawMethod, withdrawAccount)}
                  disabled={user.points < withdrawAmount || !withdrawAccount}
                  className="w-full py-6 md:py-8 bg-slate-900 text-white font-black rounded-[2rem] md:rounded-[2.5rem] hover:bg-emerald-600 transition-all shadow-2xl active:scale-95 disabled:opacity-30 uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs"
                >
                  Konfirmasi Penarikan
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6 md:space-y-8">
          <div className="bg-emerald-600 rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-10 text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 md:p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
               <i className="fas fa-shield-alt text-6xl md:text-8xl"></i>
             </div>
             <div className="relative z-10 space-y-4 md:space-y-6">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-xl rounded-xl md:rounded-[1.5rem] flex items-center justify-center text-xl md:text-2xl border border-white/20">
                  <i className="fas fa-leaf"></i>
                </div>
                <h4 className="text-xl md:text-2xl font-black leading-tight tracking-tight">Keamanan Eco-Wallet</h4>
                <p className="text-xs md:text-sm text-emerald-100 leading-relaxed font-medium opacity-80">
                  Semua transaksi poin dijamin oleh enkripsi Cloud Supabase. Dana penarikan diproses otomatis dalam 1-5 menit.
                </p>
                <div className="pt-4 md:pt-6 border-t border-white/10 flex items-center gap-3 md:gap-4">
                   <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                   <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Sistem Online 24/7</span>
                </div>
             </div>
          </div>
          
          <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-10 border border-slate-100 shadow-xl space-y-6 md:space-y-8">
             <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-center">Riwayat Penarikan</h4>
             <div className="space-y-3 md:space-y-4 max-h-[300px] md:max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {requests.length === 0 ? (
                  <p className="text-center text-slate-300 text-[9px] md:text-[10px] font-black uppercase tracking-widest italic py-6 md:py-8">Belum ada riwayat</p>
                ) : (
                  requests.map(req => (
                    <div key={req.id} className="p-4 md:p-5 rounded-2xl md:rounded-3xl bg-slate-50 border border-slate-100 space-y-2 md:space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{req.method}</p>
                          <p className="text-[11px] md:text-xs font-bold text-slate-900">Rp {req.amount.toLocaleString('id-ID')}</p>
                        </div>
                        <span className={`px-2 md:px-3 py-1 rounded-full text-[7px] md:text-[8px] font-black uppercase tracking-widest ${
                          req.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-600' : 
                          req.status === 'PENDING' ? 'bg-amber-100 text-amber-600' : 
                          'bg-rose-100 text-rose-600'
                        }`}>
                          {req.status === 'COMPLETED' ? 'SELESAI' : req.status === 'PENDING' ? 'MENUNGGU' : 'DITOLAK'}
                        </span>
                      </div>
                      <p className="text-[8px] md:text-[9px] text-slate-400 font-medium">{new Date(req.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                  ))
                )}
             </div>
          </div>
          
          <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-10 border border-slate-100 shadow-xl space-y-6 md:space-y-8">
             <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-center">Panduan Dompet</h4>
             <ul className="space-y-4 md:space-y-5">
               {[
                 { label: 'Konversi Poin', val: '1 Pts = Rp 100', icon: 'fa-exchange-alt' },
                 { label: 'Pajak Tarik', val: 'Bebas Biaya', icon: 'fa-percentage' },
                 { label: 'Status Server', val: 'Optimal', icon: 'fa-server' }
               ].map((item, i) => (
                 <li key={i} className="flex items-center justify-between pb-4 md:pb-5 border-b border-slate-50 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3 md:gap-4">
                       <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg md:rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 text-[9px] md:text-[10px]">
                         <i className={`fas ${item.icon}`}></i>
                       </div>
                       <span className="text-[11px] md:text-xs font-bold text-slate-500">{item.label}</span>
                    </div>
                    <span className="text-[11px] md:text-xs font-black text-slate-900">{item.val}</span>
                 </li>
               ))}
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
