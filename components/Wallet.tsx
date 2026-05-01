
import React, { useState } from 'react';
import { User, WithdrawalRequest } from '../src/types';

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
    { id: 'GoPay', name: 'GoPay', color: 'bg-white', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg' },
    { id: 'Dana', name: 'DANA', color: 'bg-white', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_DANA.svg' },
    { id: 'OVO', name: 'OVO', color: 'bg-white', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Logo_ovo_purple.svg' },
    { id: 'ShopeePay', name: 'ShopeePay', color: 'bg-white', logoUrl: 'https://vectorlogo4u.com/wp-content/uploads/2021/01/shopee-pay-logo-vector.svg' },
    { id: 'Bank', name: 'Bank Digital', color: 'bg-dark', icon: 'fa-university' }
  ];

  const topupPackages = [
    { points: 100, price: 10000, label: 'Starter', icon: 'fa-seedling', desc: 'Cocok untuk transaksi kecil pertama.' },
    { points: 500, price: 50000, label: 'Eco Saver', icon: 'fa-leaf', desc: 'Simpan lebih banyak untuk bumi.' },
    { points: 1000, price: 100000, label: 'Green Hero', popular: true, icon: 'fa-tree', desc: 'Pilihan favorit para aktivis lingkungan.' },
    { points: 5000, price: 500000, label: 'Earth Guardian', icon: 'fa-globe-americas', desc: 'Dampak maksimal skala industri.' }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20 px-4 md:px-0">
      {/* Visual Balance Card */}
      <div className="relative bg-dark rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-20 text-white overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[120%] bg-primary/20 blur-[120px] rounded-full hidden md:block" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[120%] bg-blue-500/10 blur-[120px] rounded-full hidden md:block" />
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
          <div className="space-y-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-primary text-sm backdrop-blur-md">
                <i className="fas fa-wallet"></i>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Portofolio Saldo Eko</span>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none">
                {user.points.toLocaleString('id-ID')}
                <span className="text-lg md:text-xl font-bold text-white/30 ml-2 md:ml-4 uppercase tracking-[0.2em]">Pts</span>
              </h2>
              <div className="inline-flex items-center px-6 py-2 bg-primary/20 backdrop-blur-xl border border-primary/30 rounded-full text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                ≈ Rp {(user.points * 100).toLocaleString('id-ID')} IDR
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 p-1.5 md:p-2 rounded-[2rem] border border-white/10 backdrop-blur-2xl flex max-w-sm mx-auto md:mx-0 w-full">
             <button onClick={() => setActiveTab('topup')} className={`flex-1 py-4 md:py-6 rounded-[1.5rem] md:rounded-[2rem] text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'topup' ? 'bg-primary text-white shadow-xl px-4' : 'text-white/40'}`}>
               Isi Saldo
             </button>
             <button onClick={() => setActiveTab('withdraw')} className={`flex-1 py-4 md:py-6 rounded-[1.5rem] md:rounded-[2rem] text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'withdraw' ? 'bg-primary text-white shadow-xl px-4' : 'text-white/40'}`}>
               Tarik Saldo
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        <div className="lg:col-span-8">
          {activeTab === 'topup' ? (
            <div className="bg-white rounded-[3rem] md:rounded-[4rem] p-8 md:p-20 shadow-2xl border border-black/5 space-y-12 md:space-y-16">
              <header className="space-y-4 text-center md:text-left">
                <div className="w-16 h-1 bg-primary rounded-full mx-auto md:mx-0"></div>
                <h3 className="text-2xl md:text-3xl font-black text-dark tracking-tighter">Injeksi <span className="text-primary">Saldo Poin</span></h3>
                <p className="text-dark/40 text-sm font-medium leading-relaxed max-w-md mx-auto md:mx-0">Konversi Rupiah Anda menjadi Eco-Points untuk mendukung sirkulasi ekonomi daur ulang.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {topupPackages.map((pkg) => (
                  <div 
                    key={pkg.points}
                    onClick={() => setTopupAmount(pkg.points)}
                    className={`group relative p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border transition-all duration-500 flex flex-col justify-between h-64 md:h-72 cursor-pointer ${topupAmount === pkg.points ? 'border-primary bg-primary text-white shadow-[0_30px_60px_-15px_rgba(76,175,80,0.4)] scale-[1.02]' : 'border-black/5 bg-white shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:bg-soft-white hover:border-primary/30 hover:shadow-xl'}`}
                  >
                    {pkg.popular && (
                      <span className={`absolute top-6 right-6 md:top-8 md:right-8 text-[8px] font-black uppercase px-3 py-1.5 rounded-full shadow-lg ${topupAmount === pkg.points ? 'bg-white text-primary' : 'bg-primary text-white'}`}>Pilihan Terbaik</span>
                    )}
                    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-[1.5rem] md:rounded-[1.8rem] flex items-center justify-center text-2xl md:text-3xl transition-all ${topupAmount === pkg.points ? 'bg-white text-primary shadow-xl' : 'bg-white text-primary/40 group-hover:scale-110 shadow-sm'}`}>
                      <i className={`fas ${pkg.icon}`}></i>
                    </div>
                    <div>
                      <p className={`text-[9px] font-black uppercase tracking-[0.2em] mb-1 ${topupAmount === pkg.points ? 'text-white/60' : 'text-dark/20'}`}>{pkg.label}</p>
                      <h4 className="text-3xl md:text-4xl font-black tracking-tighter leading-none mb-2 md:mb-4">{pkg.points} <span className="text-[10px] font-bold opacity-30">Pts</span></h4>
                      <p className={`text-xs md:text-sm font-bold ${topupAmount === pkg.points ? 'text-white' : 'text-dark/60'}`}>IDR {pkg.price.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-8 pt-8 md:pt-12 border-t border-black/5">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-dark/30 uppercase tracking-[0.2em] px-4">Gerbang Sistem</label>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {['QRIS', 'GoPay', 'ShopeePay', 'Bank'].map(m => (
                      <button key={m} onClick={() => setPaymentMethod(m)} className={`h-14 md:h-16 rounded-xl md:rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${paymentMethod === m ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'border-black/5 text-dark/30 hover:bg-soft-white'}`}>{m}</button>
                    ))}
                  </div>
                </div>

                <div className="bg-dark rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-10 shadow-2xl">
                   <div className="text-center md:text-left">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Total Tagihan</p>
                    <p className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none">Rp {(topupAmount * 100).toLocaleString('id-ID')}</p>
                  </div>
                  <button onClick={() => onTopUp(topupAmount)} className="w-full md:w-auto h-16 md:h-20 px-10 md:px-12 bg-primary text-white rounded-2xl md:rounded-3xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] hover:bg-primary-dark transition-all shadow-2xl shadow-primary/30 active:scale-[0.98]">Konfirmasi Bayar</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[3rem] md:rounded-[4rem] p-8 md:p-20 shadow-2xl border border-black/5 space-y-12 md:space-y-16">
              <header className="space-y-4 text-center md:text-left">
                <div className="w-16 h-1 bg-primary rounded-full mx-auto md:mx-0"></div>
                <h3 className="text-2xl md:text-3xl font-black text-dark tracking-tighter">Pencairan <span className="text-primary">Insentif</span></h3>
                <p className="text-dark/40 text-sm font-medium leading-relaxed max-w-md mx-auto md:mx-0">Klaim kontribusi Anda untuk bumi menjadi saldo nyata yang dapat digunakan segera.</p>
              </header>

              <div className="space-y-10 md:space-y-12">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-dark/30 uppercase tracking-[0.2em] px-4">Nominal Poin</label>
                      <div className="relative h-20 md:h-24">
                        <input type="number" step="20" min="20" max={user.points} value={withdrawAmount} onChange={(e) => setWithdrawAmount(Number(e.target.value))} className="w-full h-full px-8 md:px-12 bg-soft-white border border-black/5 rounded-2xl md:rounded-[2.5rem] font-black text-3xl md:text-4xl outline-none focus:bg-white focus:border-primary/20 transition-all tracking-tighter" />
                         <div className="absolute right-6 md:right-8 top-1/2 -translate-y-1/2 text-right">
                          <p className="text-[8px] font-black text-primary uppercase">Min 20</p>
                          <p className="text-[8px] font-bold text-dark/20 uppercase tracking-widest mt-0.5">Tersedia: {user.points}</p>
                        </div>
                      </div>
                      <p className="text-[10px] font-bold text-dark/30 px-4 italic">Estimasi terima: <span className="text-primary font-black">Rp {(withdrawAmount * 100).toLocaleString('id-ID')}</span></p>
                   </div>
                   
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-dark/30 uppercase tracking-[0.2em] px-4">Gerbang Dompet</label>
                      <div className="grid grid-cols-3 gap-2 md:gap-3">
                        {paymentMethods.map(m => (
                          <button key={m.id} onClick={() => setWithdrawMethod(m.id)} className={`h-16 md:h-20 flex flex-col items-center justify-center rounded-xl md:rounded-2xl border transition-all ${withdrawMethod === m.id ? 'border-primary bg-primary/5 shadow-md' : 'border-black/5 hover:bg-soft-white'}`}>
                            <div className="h-6 md:h-8 w-10 md:w-12 flex items-center justify-center p-1 mb-1">
                              {m.logoUrl ? <img src={m.logoUrl} className="h-full w-full object-contain filter grayscale group-hover:grayscale-0 opacity-40" referrerPolicy="no-referrer" /> : <i className={`fas ${m.icon} text-dark/20 text-xs`}></i>}
                            </div>
                            <span className={`text-[7px] font-black uppercase tracking-tighter ${withdrawMethod === m.id ? 'text-primary' : 'text-dark/20'}`}>{m.name}</span>
                          </button>
                        ))}
                      </div>
                   </div>
                 </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-dark/30 uppercase tracking-[0.2em] px-4">Gerbang Kredensial</label>
                    <input type="text" required placeholder="ID Dompet / Telepon / No Rekening" value={withdrawAccount} onChange={(e) => setWithdrawAccount(e.target.value)} className="w-full h-16 md:h-20 px-8 md:px-10 bg-soft-white border border-black/5 rounded-2xl md:rounded-3xl font-black outline-none focus:bg-white focus:border-primary/40 transition-all text-xs md:text-sm tracking-widest placeholder:text-dark/10" />
                  </div>

                 <button onClick={() => onWithdraw(withdrawAmount, withdrawMethod, withdrawAccount)} disabled={user.points < withdrawAmount || !withdrawAccount} className="w-full h-20 md:h-24 bg-dark text-white font-black rounded-2xl md:rounded-[2.5rem] hover:bg-primary transition-all shadow-2xl active:scale-[0.98] disabled:opacity-20 uppercase tracking-[0.3em] text-[10px] md:text-xs">Aktivasi Penarikan</button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6 md:space-y-8">
          <div className="bg-primary rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute top-[-20%] right-[-10%] opacity-10 group-hover:rotate-12 transition-transform duration-700 hidden md:block">
               <i className="fas fa-shield-check text-[12rem]"></i>
             </div>
             <div className="relative z-10 space-y-6 md:space-y-8">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-xl rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-2xl border border-white/20">
                  <i className="fas fa-lock"></i>
                </div>
                <div className="space-y-3">
                  <h4 className="text-xl md:text-2xl font-black tracking-tight leading-tight">Security Protocol 442</h4>
                  <p className="text-xs md:text-sm text-white/70 leading-relaxed font-medium">Semua aset digital dienkripsi secara end-to-end. Penarikan diproses real-time oleh engine Jivagreen.</p>
                </div>
                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                   <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Status: Safe Layer</span>
                   <div className="flex gap-1">
                     <div className="w-1 h-1 rounded-full bg-white/40"></div>
                     <div className="w-1 h-1 rounded-full bg-white/40"></div>
                     <div className="w-1 h-1 rounded-full bg-white"></div>
                   </div>
                </div>
             </div>
          </div>
          
          <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-10 border border-black/5 shadow-xl space-y-8">
             <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-dark/20 text-center">Log Transaksi</h4>
             <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {requests.length === 0 ? (
                  <div className="text-center py-16 space-y-3 opacity-20">
                    <i className="fas fa-history text-3xl"></i>
                    <p className="text-[9px] font-black uppercase tracking-widest">No activity log</p>
                  </div>
                ) : (
                  requests.map(req => (
                    <div key={req.id} className="p-5 rounded-2xl bg-soft-white border border-black/5 hover:border-primary/20 transition-all flex justify-between items-center group">
                      <div className="space-y-1">
                        <p className="text-[8px] font-black text-dark/30 uppercase tracking-widest">{req.method}</p>
                        <p className="text-xs font-black text-dark leading-none">Rp {req.amount.toLocaleString('id-ID')}</p>
                        <p className="text-[8px] text-dark/20 font-bold uppercase mt-1">{new Date(req.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
                      </div>
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        req.status === 'COMPLETED' ? 'bg-primary shadow-[0_0_10px_rgba(76,175,80,0.5)]' : 
                        req.status === 'PENDING' ? 'bg-amber-400' : 
                        'bg-rose-500'
                      } group-hover:scale-125 transition-transform`} />
                    </div>
                  ))
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
