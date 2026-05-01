
import React from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

interface AdminChartsProps {
  userData: { name: string; users: number }[];
  salesData: { name: string; sales: number }[];
}

const AdminCharts: React.FC<AdminChartsProps> = ({ userData, salesData }) => {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="h-[300px]" />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* User Growth Chart */}
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-6 overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-800">Pertumbuhan Pengguna</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Pengguna Aktif (6 Bulan Terakhir)</p>
          </div>
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <i className="fas fa-chart-line"></i>
          </div>
        </div>
        
        <div className="h-[300px] w-full min-h-[300px] relative">
          <ResponsiveContainer width="99%" height="99%" key="users-chart">
            <AreaChart data={userData}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ fontWeight: 900, color: '#1e293b', marginBottom: '4px' }}
              />
              <Area 
                type="monotone" 
                dataKey="users" 
                stroke="#6366f1" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorUsers)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-6 overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-800">Aktivitas Penjualan</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Sampah Terjual (Minggu Ini)</p>
          </div>
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <i className="fas fa-shopping-bag"></i>
          </div>
        </div>

        <div className="h-[300px] w-full min-h-[300px] relative">
          <ResponsiveContainer width="99%" height="99%" key="sales-chart">
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} 
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ fontWeight: 900, color: '#1e293b', marginBottom: '4px' }}
              />
              <Bar 
                dataKey="sales" 
                fill="#10b981" 
                radius={[6, 6, 0, 0]} 
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminCharts;
