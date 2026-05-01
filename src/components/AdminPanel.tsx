import React, { useState } from 'react';
import { Waste, WasteStatus, User, WithdrawalRequest } from '../types';
import AdminCharts from './AdminCharts';

interface AdminPanelProps {
  wastes: Waste[];
  users: User[];
  withdrawalRequests: WithdrawalRequest[];
  onConfirmPickup: (wasteId: string) => void;
  onDeleteUser: (userId: string) => void;
  onToggleBlockUser: (userId: string) => void;
  onDeleteWaste: (wasteId: string) => void;
  onRecycleWaste: (wasteId: string) => void;
  onApproveWaste: (wasteId: string, action: 'catalog' | 'recycle') => void;
  onConfirmWithdraw: (requestId: string) => void;
  onResetPoints?: () => void; // Fitur baru untuk membersihkan data aneh
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  wastes, users, withdrawalRequests, onConfirmPickup, onDeleteUser, onToggleBlockUser, onDeleteWaste, onRecycleWaste, onApproveWaste, onConfirmWithdraw, onResetPoints 
}) => {
  const [activeTab, setActiveTab] = useState<'logistic' | 'users' | 'catalog' | 'withdrawals' | 'approvals'>('logistic');
  
  const pendingPickup = wastes.filter(b => b.status === WasteStatus.PENDING_PICKUP);
  const pendingApproval = wastes.filter(b => b.status === WasteStatus.PENDING_APPROVAL);
  const catalogWastes = wastes.filter(b => b.status === WasteStatus.AVAILABLE);
  const pendingWithdrawals = withdrawalRequests.filter(r => r.status === 'PENDING');

  const totalEcoPoints = users.reduce((acc, curr) => {
    const p = Math.floor(Number(curr.points) || 0);
    return acc + p;
  }, 0);

  const stats = [
    { label: 'Logistik Tertunda', value: pendingPickup.length, icon: 'fa-truck-fast', color: 'bg-primary' },
    { label: 'Warga Aktif', value: users.length, icon: 'fa-users-viewfinder', color: 'bg-dark' },
    { label: 'Poin Beredar', value: totalEcoPoints.toLocaleString('id-ID'), icon: 'fa-coins', color: 'bg-emerald-600' },
    { label: 'Total Didaur Ulang', value: wastes.filter(b => b.status === WasteStatus.RECYCLED).length, icon: 'fa-recycle', color: 'bg-blue-600' }
  ];

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const now = new Date();
  const userData = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const monthName = months[d.getMonth()];
    const count = users.filter(u => {
      const joinDate = new Date(u.joinedAt);
      return joinDate <= new Date(d.getFullYear(), d.getMonth() + 1, 0);
    }).length;
    return { name: monthName, users: count };
  });

  const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const salesData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayName = days[d.getDay()];
    const count = wastes.filter(b => {
      const createdDate = new Date(b.createdAt);
      return b.status === WasteStatus.SOLD && 
             createdDate.toDateString() === d.toDateString();
    }).length;
    return { name: dayName, sales: count };
  });

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-20">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.2em]">
            Terminal Eksekutif Admin
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-dark tracking-tighter leading-none">Pusat <br/> <span className="text-primary italic">Komando.</span></h1>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          {activeTab === 'users' && onResetPoints && (
            <button 
              onClick={() => {
                if(window.confirm("Hapus angka poin yang tidak logis dan reset semua ke standar (10 Pts)?")) {
                  onResetPoints();
                }
              }}
              className="h-14 px-6 bg-rose-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-xl shadow-rose-500/20 whitespace-nowrap"
            >
              <i className="fas fa-broom mr-2"></i> Reset Pts
            </button>
          )}
          <div className="flex overflow-x-auto bg-soft-white p-2 rounded-[2rem] border border-black/5 h-fit no-scrollbar w-full shadow-inner lg:max-w-2xl">
             <div className="flex min-w-max gap-1">
             {[
               { id: 'logistic', label: 'Logistik' },
               { id: 'users', label: 'Pengguna' },
               { id: 'catalog', label: 'Katalog' },
               { id: 'approvals', label: 'Persetujuan', badge: pendingApproval.length },
               { id: 'withdrawals', label: 'Penarikan', badge: pendingWithdrawals.length }
             ].map(tab => (
               <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id ? 'bg-dark text-white shadow-xl' : 'text-dark/30 hover:text-dark hover:bg-black/5'}`}
               >
                 {tab.label}
                 {tab.badge ? <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black ${activeTab === tab.id ? 'bg-primary text-white' : 'bg-rose-500 text-white'}`}>{tab.badge}</span> : null}
               </button>
             ))}
            </div>
          </div>
        </div>
      </header>
 
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className={`bg-white p-10 rounded-[3rem] border border-black/5 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.08)] group hover:scale-[1.02] hover:shadow-2xl hover:border-primary/10 transition-all cursor-default`}>
            <div className={`w-14 h-14 ${s.color} text-white rounded-[1.5rem] flex items-center justify-center mb-6 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.2)] group-hover:rotate-12 group-hover:scale-110 transition-all`}>
              <i className={`fas ${s.icon} text-xl`}></i>
            </div>
            <p className="text-[10px] font-black text-dark/20 uppercase tracking-[0.3em] mb-1">{s.label}</p>
            <p className={`text-4xl font-black text-dark tracking-tighter group-hover:text-primary transition-colors`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 md:p-12 rounded-[4rem] border border-black/5 shadow-2xl">
        <AdminCharts userData={userData} salesData={salesData} />
      </div>

      <div className="bg-white rounded-[4rem] border border-black/5 shadow-2xl overflow-hidden">
        <div className="p-10 md:p-16 border-b border-black/5 flex items-center justify-between">
          <h2 className="text-2xl font-black text-dark tracking-tighter">
            {activeTab === 'logistic' && "Antrean Penjemputan"}
            {activeTab === 'users' && "Daftar Pengguna"}
            {activeTab === 'catalog' && "Katalog Sampah Aktif"}
            {activeTab === 'approvals' && "Antrean Persetujuan"}
            {activeTab === 'withdrawals' && "Permintaan Penarikan"}
          </h2>
          <div className="w-12 h-12 bg-soft-white rounded-2xl flex items-center justify-center border border-black/5">
             <i className="fas fa-ellipsis-v text-dark/20"></i>
          </div>
        </div>
        
        <div className="overflow-x-auto lg:overflow-visible">
          {activeTab === 'logistic' && (
            <>
              {/* Desktop View */}
              <table className="hidden lg:table w-full text-left">
                <thead className="bg-soft-white/50">
                  <tr>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-dark/30">Detail Aset</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-dark/30">Geolokasi</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-dark/30 text-right">Protokol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {pendingPickup.map(waste => (
                    <tr key={waste.id} className="hover:bg-soft-white/20 transition-all group">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-16 rounded-2xl overflow-hidden shadow-lg border border-black/5">
                             <img src={waste.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          <div>
                            <p className="font-black text-dark text-lg leading-none mb-2 tracking-tight">{waste.title}</p>
                            <div className="flex items-center gap-3">
                              <p className="text-[10px] font-bold text-dark/30 uppercase tracking-widest">{waste.sellerName}</p>
                              {waste.isRecycle && (
                                <span className="px-3 py-1 bg-primary/10 text-primary text-[8px] font-black uppercase rounded-full tracking-widest border border-primary/20">Mode Daur Ulang</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                         {waste.latitude ? (
                          <a href={`https://www.google.com/maps?q=${waste.latitude},${waste.longitude}`} target="_blank" className="inline-flex items-center px-4 py-2 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary/10 transition-all border border-primary/10">
                             <i className="fas fa-map-location-dot mr-2"></i> Maps Link
                          </a>
                         ) : <span className="text-xs font-medium text-dark/40 italic">{(waste as any).address}</span>}
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex items-center justify-end gap-3 text-right">
                          <button onClick={() => onConfirmPickup(waste.id)} className="h-12 px-6 bg-dark text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-xl shadow-black/10">Konfirmasi Jemput</button>
                          <button onClick={() => { if(window.confirm(`Hapus antrean sampah "${waste.title}"?`)) onDeleteWaste(waste.id); }} className="w-12 h-12 rounded-2xl bg-soft-white text-dark/20 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center border border-black/5"><i className="fas fa-trash-can"></i></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile View */}
              <div className="lg:hidden p-6 space-y-6">
                {pendingPickup.map(waste => (
                  <div key={waste.id} className="bg-soft-white/50 p-6 rounded-3xl border border-black/5 space-y-6">
                    <div className="flex gap-4">
                      <img src={waste.imageUrl} className="w-20 h-24 rounded-xl object-cover shadow-lg" />
                      <div className="flex-1">
                        <p className="font-black text-dark tracking-tight leading-tight mb-1">{waste.title}</p>
                        <p className="text-[10px] font-bold text-dark/30 uppercase tracking-widest mb-2">{waste.sellerName}</p>
                        {waste.isRecycle && (
                          <span className="px-2 py-1 bg-primary/10 text-primary text-[8px] font-black uppercase rounded-full tracking-widest border border-primary/20">Recycle</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                       <button onClick={() => onConfirmPickup(waste.id)} className="w-full h-12 bg-dark text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">Konfirmasi Jemput</button>
                       <div className="flex gap-2">
                         {waste.latitude && (
                           <a href={`https://www.google.com/maps?q=${waste.latitude},${waste.longitude}`} target="_blank" className="flex-1 h-12 bg-white text-primary border border-primary/10 rounded-xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest gap-2">
                             <i className="fas fa-map-marker-alt"></i> Maps
                           </a>
                         )}
                         <button onClick={() => { if(window.confirm(`Hapus antrean sampah "${waste.title}"?`)) onDeleteWaste(waste.id); }} className="w-12 h-12 bg-white text-rose-500 border border-rose-500/10 rounded-xl flex items-center justify-center"><i className="fas fa-trash-can"></i></button>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'users' && (
            <>
              {/* Desktop View */}
              <table className="hidden lg:table w-full text-left">
                <thead className="bg-soft-white/50">
                  <tr>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-dark/30">Identitas Pengguna</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-dark/30">Status</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-dark/30">Saldo Eko</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-dark/30 text-right">Manajemen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {users.map(u => (
                    <tr key={u.id} className={`hover:bg-soft-white/20 transition-all ${u.isBlocked ? 'bg-rose-50/50' : ''}`}>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-14 rounded-2xl bg-soft-white flex items-center justify-center font-black text-dark/20 text-xl border border-black/5 shadow-inner">
                            {u.name ? u.name.charAt(0) : '?'}
                          </div>
                          <div>
                            <p className="font-black text-dark text-lg leading-none mb-1 tracking-tight">{u.name || 'Anonymous citizen'}</p>
                            <p className="text-[10px] font-bold text-dark/30 uppercase tracking-widest">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                         <div className="flex items-center gap-4">
                           <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap shadow-sm border ${u.role === 'ADMIN' ? 'bg-dark text-primary border-white/10' : 'bg-primary/10 text-primary border-primary/20'}`}>{u.role}</span>
                           {u.isBlocked ? (
                             <span className="text-rose-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><i className="fas fa-ban"></i> Diblokir</span>
                           ) : (
                             <span className="text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><i className="fas fa-check-circle"></i> Aktif</span>
                           )}
                         </div>
                      </td>
                      <td className="px-10 py-8">
                        <p className="font-black text-primary text-xl leading-none tracking-tight">{(Math.floor(Number(u.points) || 0)).toLocaleString('id-ID')} <span className="text-[10px] text-dark/20 uppercase font-black">Pts</span></p>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button onClick={() => onToggleBlockUser(u.id)} className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm transition-all border ${u.isBlocked ? 'bg-primary/20 text-primary border-primary/20 hover:bg-primary hover:text-white' : 'bg-rose-500/20 text-rose-500 border-rose-500/20 hover:bg-rose-500 hover:text-white'}`}><i className={`fas ${u.isBlocked ? 'fa-unlock-keyhole' : 'fa-user-slash'}`}></i></button>
                          <button onClick={() => { if(window.confirm(`Hapus akun ${u.name}?`)) onDeleteUser(u.id); }} className="w-12 h-12 border border-black/5 rounded-2xl bg-soft-white text-dark/20 hover:bg-rose-500 hover:text-white flex items-center justify-center text-sm transition-all"><i className="fas fa-trash-can"></i></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile View */}
              <div className="lg:hidden p-6 space-y-6">
                {users.map(u => (
                  <div key={u.id} className={`p-6 rounded-3xl border ${u.isBlocked ? 'bg-rose-50 border-rose-100' : 'bg-soft-white/50 border-black/5'} space-y-6`}>
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center font-black text-dark/30 border border-black/5">
                          {u.name ? u.name.charAt(0) : '?'}
                       </div>
                       <div className="flex-1">
                          <p className="font-black text-dark tracking-tight">{u.name || 'Anonymous'}</p>
                          <p className="text-[10px] font-bold text-dark/20 uppercase tracking-widest">{u.email}</p>
                       </div>
                    </div>
                    <div className="flex justify-between items-end">
                       <div className="space-y-2">
                          <p className="text-lg font-black text-primary">{(Math.floor(Number(u.points) || 0)).toLocaleString('id-ID')} <span className="text-[8px] uppercase">Pts</span></p>
                          <span className="inline-block px-3 py-1 bg-white rounded-full text-[8px] font-black uppercase tracking-widest border border-black/5">{u.role}</span>
                       </div>
                       <div className="flex gap-2">
                          <button onClick={() => onToggleBlockUser(u.id)} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${u.isBlocked ? 'bg-primary text-white shadow-lg' : 'bg-rose-100 text-rose-500'}`}><i className={`fas ${u.isBlocked ? 'fa-unlock-keyhole' : 'fa-user-slash'}`}></i></button>
                          <button onClick={() => { if(window.confirm(`Hapus akun ${u.name}?`)) onDeleteUser(u.id); }} className="w-10 h-10 rounded-xl bg-white text-dark/20 border border-black/5 flex items-center justify-center"><i className="fas fa-trash-can"></i></button>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'catalog' && (
            <>
              {/* Desktop View */}
              <table className="hidden lg:table w-full text-left">
                <thead className="bg-soft-white/50">
                  <tr>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-dark/30">Identitas Listing</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-dark/30">Valuasi</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-dark/30 text-right">Siklus Hidup</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {catalogWastes.map(waste => (
                    <tr key={waste.id} className="hover:bg-soft-white/20 transition-all group">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-20 rounded-2xl overflow-hidden shadow-lg border border-black/5">
                             <img src={waste.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                          </div>
                          <div>
                            <p className="font-black text-dark text-xl leading-none mb-2 tracking-tight">{waste.title}</p>
                            <div className="flex items-center gap-2">
                               <span className="px-3 py-1 bg-soft-white rounded-full text-[9px] font-black uppercase tracking-widest text-dark/40 border border-black/5">{waste.material}</span>
                               <span className="text-[10px] font-bold text-dark/20 uppercase tracking-widest">by {waste.sellerName}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <p className="text-2xl font-black text-primary tracking-tighter leading-none">Rp {waste.price.toLocaleString('id-ID')}</p>
                        <p className="text-[9px] font-black text-dark/20 uppercase tracking-[0.2em] mt-1">Per Kilogram</p>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button onClick={() => { if(window.confirm(`Ambil alih "${waste.title}" untuk didaur ulang?`)) onRecycleWaste(waste.id); }} className="h-12 px-8 bg-dark text-primary rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all shadow-xl shadow-black/10">Mulai Daur Ulang</button>
                          <button onClick={() => { if(window.confirm(`Hapus "${waste.title}" dari katalog?`)) onDeleteWaste(waste.id); }} className="w-12 h-12 bg-soft-white text-dark/20 border border-black/5 rounded-2xl hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center"><i className="fas fa-trash-can"></i></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile View */}
              <div className="lg:hidden p-6 space-y-6">
                {catalogWastes.map(waste => (
                  <div key={waste.id} className="bg-soft-white/50 p-6 rounded-3xl border border-black/5 space-y-6">
                    <div className="flex gap-4">
                      <img src={waste.imageUrl} className="w-20 h-24 rounded-xl object-cover shadow-lg" />
                      <div className="flex-1">
                        <p className="font-black text-dark tracking-tight leading-tight mb-1">{waste.title}</p>
                        <span className="inline-block px-2 py-0.5 bg-white rounded-lg text-[8px] font-black uppercase tracking-widest text-dark/30 border border-black/5 mb-2">{waste.material}</span>
                        <p className="text-lg font-black text-primary">Rp {waste.price.toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <button onClick={() => { if(window.confirm(`Ambil alih "${waste.title}" untuk didaur ulang?`)) onRecycleWaste(waste.id); }} className="flex-1 h-12 bg-dark text-primary rounded-xl text-[10px] font-black uppercase tracking-widest">Daur Ulang Sekarang</button>
                       <button onClick={() => { if(window.confirm(`Hapus "${waste.title}" dari katalog?`)) onDeleteWaste(waste.id); }} className="w-12 h-12 bg-white text-rose-500 border border-rose-500/10 rounded-xl flex items-center justify-center"><i className="fas fa-trash-can"></i></button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'approvals' && (
            <>
              {/* Desktop View */}
              <table className="hidden lg:table w-full text-left">
                <thead className="bg-soft-white/50">
                  <tr>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-dark/30">Butuh Verifikasi</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-dark/30">Klasifikasi</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-dark/30 text-right">Keputusan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {pendingApproval.map(waste => (
                    <tr key={waste.id} className="hover:bg-soft-white/20 transition-all group">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-20 rounded-2xl overflow-hidden shadow-2xl border border-black/5">
                             <img src={waste.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                          </div>
                          <div>
                            <p className="font-black text-dark text-xl leading-none mb-2 tracking-tight">{waste.title}</p>
                            <p className="text-[10px] font-bold text-dark/30 uppercase tracking-widest">{waste.sellerName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="space-y-2">
                          <span className="inline-block px-4 py-1.5 bg-dark text-primary rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10">{waste.material}</span>
                          <p className="text-[9px] font-black text-dark/20 uppercase tracking-widest px-1">{waste.condition}</p>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button onClick={() => onApproveWaste(waste.id, 'catalog')} className="h-12 px-6 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.05] transition-all">Publikasi</button>
                          <button onClick={() => onApproveWaste(waste.id, 'recycle')} className="h-12 px-6 bg-dark text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-black/20 hover:scale-[1.05] transition-all">Daur Ulang Langsung</button>
                          <button onClick={() => onDeleteWaste(waste.id)} className="w-12 h-12 bg-soft-white text-dark/20 rounded-2xl border border-black/5 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center shadow-inner"><i className="fas fa-xmark"></i></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile View */}
              <div className="lg:hidden p-6 space-y-6">
                {pendingApproval.map(waste => (
                  <div key={waste.id} className="bg-soft-white/50 p-6 rounded-3xl border border-black/5 space-y-6">
                    <div className="flex gap-4">
                      <img src={waste.imageUrl} className="w-20 h-28 rounded-xl object-cover shadow-lg" />
                      <div className="flex-1">
                        <p className="font-black text-dark tracking-tight leading-tight mb-2">{waste.title}</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-0.5 bg-dark text-primary rounded-lg text-[8px] font-black uppercase tracking-widest">{waste.material}</span>
                          <span className="px-2 py-0.5 bg-white text-dark/30 rounded-lg text-[8px] font-black uppercase tracking-widest border border-black/5">{waste.condition}</span>
                        </div>
                        <p className="text-[10px] font-bold text-dark/20 uppercase tracking-widest mt-4">by {waste.sellerName}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                       <div className="grid grid-cols-2 gap-2">
                          <button onClick={() => onApproveWaste(waste.id, 'catalog')} className="h-12 bg-primary text-white rounded-xl text-[9px] font-black uppercase tracking-widest">Publish</button>
                          <button onClick={() => onApproveWaste(waste.id, 'recycle')} className="h-12 bg-dark text-white rounded-xl text-[9px] font-black uppercase tracking-widest">Recycle</button>
                       </div>
                       <button onClick={() => onDeleteWaste(waste.id)} className="w-full h-12 bg-white text-rose-500 border border-rose-500/10 rounded-xl text-[9px] font-black uppercase tracking-widest">Reject Entry</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'withdrawals' && (
            <>
              {/* Desktop View */}
              <table className="hidden lg:table w-full text-left">
                <thead className="bg-soft-white/50">
                  <tr>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-dark/30">Sumber Pengguna</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-dark/30">Titik Tujuan</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-dark/30">Valuasi</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-dark/30 text-right">Protokol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {pendingWithdrawals.map(req => (
                    <tr key={req.id} className="hover:bg-soft-white/20 transition-all group">
                      <td className="px-10 py-8">
                        <p className="font-black text-dark text-lg leading-none mb-1 tracking-tight">{req.userName}</p>
                        <p className="text-[10px] font-bold text-dark/20 uppercase tracking-widest">{req.userId}</p>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex flex-col gap-2">
                          <span className="inline-block w-fit px-3 py-1 bg-dark text-primary rounded-lg text-[9px] font-black uppercase tracking-widest">{req.method}</span>
                          <span className="font-mono text-sm text-dark font-bold tracking-widest">{req.accountNumber}</span>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <p className="text-2xl font-black text-primary tracking-tighter leading-none mb-1">Rp {req.amount.toLocaleString('id-ID')}</p>
                        <p className="text-[10px] font-black text-dark/20 uppercase tracking-widest">{req.points} Poin Diterapkan</p>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <button onClick={() => { if(window.confirm(`Konfirmasi transfer ke ${req.userName}?`)) onConfirmWithdraw(req.id); }} className="h-14 px-10 bg-dark text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary transition-all shadow-2xl shadow-black/10">Eksekusi Transfer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile View */}
              <div className="lg:hidden p-6 space-y-6">
                {pendingWithdrawals.map(req => (
                  <div key={req.id} className="bg-soft-white/50 p-6 rounded-3xl border border-black/5 space-y-6">
                    <div className="flex justify-between items-start">
                       <div>
                          <p className="font-black text-dark tracking-tight">{req.userName}</p>
                          <p className="text-[10px] font-bold text-dark/20 uppercase tracking-widest">{req.userId}</p>
                       </div>
                       <span className="px-2 py-1 bg-dark text-primary rounded-lg text-[8px] font-black uppercase tracking-widest">{req.method}</span>
                    </div>
                    <div className="p-4 bg-white rounded-2xl border border-black/5 flex flex-col items-center">
                       <p className="text-[10px] font-black text-dark/20 uppercase tracking-widest mb-1">Total Valuasi</p>
                       <p className="text-3xl font-black text-primary tracking-tighter leading-none mb-1">Rp {req.amount.toLocaleString('id-ID')}</p>
                       <p className="text-[10px] font-black text-dark/20 uppercase tracking-widest">{req.points} Pts</p>
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-dark/20 uppercase tracking-[0.2em] mb-2 px-2">Akun Tujuan</p>
                       <div className="bg-soft-white px-6 py-3 rounded-xl font-mono text-sm text-dark font-black tracking-widest border border-black/5 text-center">
                          {req.accountNumber}
                       </div>
                    </div>
                    <button onClick={() => { if(window.confirm(`Konfirmasi transfer ke ${req.userName}?`)) onConfirmWithdraw(req.id); }} className="w-full h-16 bg-dark text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Eksekusi Transfer</button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
