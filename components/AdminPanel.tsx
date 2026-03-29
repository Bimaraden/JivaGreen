
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

  // Penjumlahan yang murni numerik
  const totalEcoPoints = users.reduce((acc, curr) => {
    const p = Math.floor(Number(curr.points) || 0);
    return acc + p;
  }, 0);

  const stats = [
    { label: 'Menunggu Jemput', value: pendingPickup.length, icon: 'fa-truck', color: 'bg-amber-500' },
    { label: 'Total Pengguna', value: users.length, icon: 'fa-users', color: 'bg-indigo-500' },
    { label: 'Total Poin Eco', value: totalEcoPoints.toLocaleString('id-ID'), icon: 'fa-leaf', color: 'bg-emerald-600' },
    { label: 'Didaur Ulang', value: wastes.filter(b => b.status === WasteStatus.RECYCLED).length, icon: 'fa-recycle', color: 'bg-rose-500' }
  ];

  // Calculate User Growth Data (Last 6 months)
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

  // Calculate Sales Data (Last 7 days)
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
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="max-w-full overflow-hidden">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight truncate">Kontrol <span className="text-emerald-600">Admin</span></h1>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <p className="text-slate-500 text-xs md:text-sm">Manajemen logistik dan data pengguna platform.</p>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 rounded-full border border-slate-200">
               <div className={`w-1.5 h-1.5 rounded-full ${withdrawalRequests.length > 0 ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
               <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">
                 DB: {withdrawalRequests.length > 0 ? 'Terhubung' : 'Perlu Setup'}
               </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          {activeTab === 'users' && onResetPoints && (
            <button 
              onClick={() => {
                if(window.confirm("Hapus angka poin yang tidak logis dan reset semua ke standar (10 Pts)?")) {
                  onResetPoints();
                }
              }}
              className="px-4 py-2.5 bg-rose-50 text-rose-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-rose-100 hover:bg-rose-100 transition-all whitespace-nowrap"
            >
              <i className="fas fa-broom mr-2"></i> Bersihkan Poin
            </button>
          )}
          <div className="flex overflow-x-auto bg-slate-100 p-1 rounded-2xl border border-slate-200 h-fit no-scrollbar w-full max-w-full">
             <div className="flex min-w-max">
             <button 
              onClick={() => setActiveTab('logistic')}
              className={`px-4 md:px-5 py-2 md:py-2.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'logistic' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
             >
               Logistik
             </button>
             <button 
              onClick={() => setActiveTab('users')}
              className={`px-4 md:px-5 py-2 md:py-2.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'users' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
             >
               Pengguna
             </button>
             <button 
              onClick={() => setActiveTab('catalog')}
              className={`px-4 md:px-5 py-2 md:py-2.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'catalog' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
             >
               Katalog
             </button>
             <button 
              onClick={() => setActiveTab('approvals')}
              className={`px-4 md:px-5 py-2 md:py-2.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center ${activeTab === 'approvals' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
             >
               Persetujuan {pendingApproval.length > 0 && <span className="ml-1.5 bg-rose-500 text-white px-1.5 py-0.5 rounded-full text-[7px]">{pendingApproval.length}</span>}
             </button>
             <button 
              onClick={() => setActiveTab('withdrawals')}
              className={`px-4 md:px-5 py-2 md:py-2.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center ${activeTab === 'withdrawals' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
             >
               Penarikan {pendingWithdrawals.length > 0 && <span className="ml-1.5 bg-rose-500 text-white px-1.5 py-0.5 rounded-full text-[7px]">{pendingWithdrawals.length}</span>}
             </button>
           </div>
          </div>
        </div>
      </header>
 
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-xl">
            <div className={`w-10 h-10 md:w-12 md:h-12 ${s.color} text-white rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6`}>
              <i className={`fas ${s.icon}`}></i>
            </div>
            <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
            <p className="text-2xl md:text-3xl font-black text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>

      <AdminCharts userData={userData} salesData={salesData} />

      {activeTab === 'logistic' && (
        <section className="bg-white rounded-[2rem] md:rounded-[3.5rem] border border-slate-100 shadow-2xl overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-50">
            <h2 className="text-lg md:text-xl font-black text-slate-800">Antrean Penjemputan</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Sampah & Penjual</th>
                  <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Lokasi</th>
                  <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {pendingPickup.map(waste => (
                  <tr key={waste.id}>
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <div className="flex items-center gap-3 md:gap-4">
                        <img src={waste.imageUrl} className="w-8 h-12 md:w-10 md:h-14 object-cover rounded-lg" />
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{waste.title}</p>
                          <div className="flex items-center gap-2">
                            <p className="text-[10px] md:text-xs text-slate-400">Oleh: {waste.sellerName}</p>
                            {waste.isRecycle && (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 text-[8px] font-black uppercase rounded-full">Daur Ulang</span>
                            )}
                          </div>
                          {waste.composition && waste.composition.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {waste.composition.map((c, i) => (
                                <span key={i} className="text-[7px] bg-emerald-50 text-emerald-600 px-1 rounded border border-emerald-100 font-bold">
                                  {c.material} {c.percentage}%
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6">
                       {waste.latitude ? (
                        <a href={`https://www.google.com/maps?q=${waste.latitude},${waste.longitude}`} target="_blank" className="text-emerald-600 font-bold text-[10px] md:text-xs hover:underline whitespace-nowrap"><i className="fas fa-map-marker-alt mr-2"></i>Lihat Maps</a>
                       ) : <span className="text-[10px] md:text-[11px] text-slate-500 italic">{(waste as any).address}</span>}
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => onConfirmPickup(waste.id)} 
                          className="bg-slate-900 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase hover:bg-emerald-600 transition-all whitespace-nowrap"
                        >
                          Konfirmasi Pickup
                        </button>
                        <button 
                          onClick={() => {
                            if(window.confirm(`Hapus antrean sampah "${waste.title}"?`)) {
                              onDeleteWaste(waste.id);
                            }
                          }}
                          className="w-9 h-9 md:w-11 md:h-11 rounded-xl md:rounded-2xl bg-slate-50 text-slate-400 hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center"
                          title="Hapus Antrean"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pendingPickup.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-8 py-12 text-center text-slate-300 text-[10px] font-black uppercase tracking-widest italic">Antrean Kosong</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === 'users' && (
        <section className="bg-white rounded-[2rem] md:rounded-[3.5rem] border border-slate-100 shadow-2xl overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-50">
            <h2 className="text-lg md:text-xl font-black text-slate-800">Daftar Pengguna</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Nama & Email</th>
                  <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Role</th>
                  <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Poin Eco</th>
                  <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map(u => (
                  <tr key={u.id} className={u.isBlocked ? 'bg-rose-50/30' : ''}>
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs">
                          {u.name ? u.name.charAt(0) : '?'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{u.name || 'Pengguna Tanpa Nama'}</p>
                          <p className="text-[9px] md:text-[10px] text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <span className={`px-2 md:px-3 py-1 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest ${u.role === 'ADMIN' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <p className="font-black text-emerald-600 text-sm">{(Math.floor(Number(u.points) || 0)).toLocaleString('id-ID')} Pts</p>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      {u.isBlocked ? (
                        <span className="text-rose-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                          <i className="fas fa-ban"></i> Terblokir
                        </span>
                      ) : (
                        <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                          <i className="fas fa-check-circle"></i> Aktif
                        </span>
                      )}
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => onToggleBlockUser(u.id)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] transition-all ${u.isBlocked ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'}`}
                          title={u.isBlocked ? 'Buka Blokir' : 'Blokir Akun'}
                        >
                          <i className={`fas ${u.isBlocked ? 'fa-unlock' : 'fa-user-slash'}`}></i>
                        </button>
                        <button 
                          onClick={() => {
                            if(window.confirm(`Hapus akun ${u.name}? Tindakan ini tidak dapat dibatalkan.`)) {
                              onDeleteUser(u.id);
                            }
                          }}
                          className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 hover:bg-rose-600 hover:text-white flex items-center justify-center text-[10px] transition-all"
                          title="Hapus Akun"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === 'catalog' && (
        <section className="bg-white rounded-[2rem] md:rounded-[3.5rem] border border-slate-100 shadow-2xl overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-50">
            <h2 className="text-lg md:text-xl font-black text-slate-800">Katalog Sampah Aktif</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Sampah</th>
                  <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Penjual</th>
                  <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Harga</th>
                  <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {catalogWastes.map(waste => (
                  <tr key={waste.id}>
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <div className="flex items-center gap-3 md:gap-4">
                        <img src={waste.imageUrl} className="w-8 h-12 md:w-10 md:h-14 object-cover rounded-lg" />
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{waste.title}</p>
                          <p className="text-[10px] text-slate-400">{waste.material}</p>
                          {waste.composition && waste.composition.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {waste.composition.map((c, i) => (
                                <span key={i} className="text-[7px] bg-emerald-50 text-emerald-600 px-1 rounded border border-emerald-100 font-bold">
                                  {c.material} {c.percentage}%
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6 text-sm text-slate-600 font-medium">
                      {waste.sellerName}
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6 text-sm font-black text-emerald-600">
                      Rp {waste.price.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            console.log("Recycle button clicked for waste:", waste.id);
                            if(window.confirm(`Ambil alih "${waste.title}" untuk didaur ulang?`)) {
                              onRecycleWaste(waste.id);
                            }
                          }}
                          className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all text-[9px] font-black uppercase"
                          title="Daur Ulang"
                        >
                          <i className="fas fa-recycle mr-1"></i> Daur Ulang
                        </button>
                        <button 
                          onClick={() => {
                            console.log("Delete button clicked for waste:", waste.id);
                            if(window.confirm(`Hapus "${waste.title}" dari katalog?`)) {
                              onDeleteWaste(waste.id);
                            }
                          }}
                          className="w-9 h-9 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center"
                          title="Hapus Sampah"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {catalogWastes.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-8 py-12 text-center text-slate-300 text-[10px] font-black uppercase tracking-widest italic">Katalog Kosong</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === 'approvals' && (
        <section className="bg-white rounded-[2rem] md:rounded-[3.5rem] border border-slate-100 shadow-2xl overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-50">
            <h2 className="text-lg md:text-xl font-black text-slate-800">Persetujuan Sampah Baru</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Sampah</th>
                  <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Penjual</th>
                  <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Kondisi</th>
                  <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {pendingApproval.map(waste => (
                  <tr key={waste.id}>
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <div className="flex items-center gap-3 md:gap-4">
                        <img src={waste.imageUrl} className="w-12 h-16 object-cover rounded-lg" />
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{waste.title}</p>
                          <p className="text-[10px] text-slate-400">{waste.material}</p>
                          {waste.composition && waste.composition.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {waste.composition.map((c, i) => (
                                <span key={i} className="text-[7px] bg-emerald-50 text-emerald-600 px-1 rounded border border-emerald-100 font-bold">
                                  {c.material} {c.percentage}%
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6 text-sm text-slate-600">
                      {waste.sellerName}
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{waste.condition}</span>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => onApproveWaste(waste.id, 'catalog')}
                          className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all"
                        >
                          Publikasi
                        </button>
                        <button 
                          onClick={() => onApproveWaste(waste.id, 'recycle')}
                          className="px-4 py-2 bg-amber-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all"
                        >
                          Daur Ulang
                        </button>
                        <button 
                          onClick={() => onDeleteWaste(waste.id)}
                          className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pendingApproval.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-8 py-12 text-center text-slate-300 text-[10px] font-black uppercase tracking-widest italic">Tidak ada antrean persetujuan</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === 'withdrawals' && (
        <section className="bg-white rounded-[2rem] md:rounded-[3.5rem] border border-slate-100 shadow-2xl overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-50">
            <h2 className="text-lg md:text-xl font-black text-slate-800">Permintaan Penarikan Saldo</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Pengguna</th>
                  <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Metode & Rekening</th>
                  <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Jumlah</th>
                  <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Waktu</th>
                  <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {pendingWithdrawals.map(req => (
                  <tr key={req.id}>
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <p className="font-bold text-slate-800 text-sm">{req.userName}</p>
                      <p className="text-[10px] text-slate-400">{req.userId}</p>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <span className="px-2 py-1 bg-slate-100 rounded text-[9px] font-black text-slate-600 uppercase mr-2">{req.method}</span>
                      <span className="font-mono text-sm text-slate-700">{req.accountNumber}</span>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <p className="font-black text-emerald-600 text-sm">Rp {req.amount.toLocaleString('id-ID')}</p>
                      <p className="text-[10px] text-slate-400">{req.points} Pts</p>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6 text-xs text-slate-500">
                      {new Date(req.date).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <button 
                        onClick={() => {
                          if(window.confirm(`Konfirmasi transfer ke ${req.userName} sebesar Rp ${req.amount.toLocaleString('id-ID')}?`)) {
                            onConfirmWithdraw(req.id);
                          }
                        }}
                        className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all"
                      >
                        Konfirmasi Transfer
                      </button>
                    </td>
                  </tr>
                ))}
                {pendingWithdrawals.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-8 py-12 text-center text-slate-300 text-[10px] font-black uppercase tracking-widest italic">Tidak ada permintaan penarikan</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

export default AdminPanel;
