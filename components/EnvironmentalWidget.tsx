
import React, { useEffect, useState, useCallback } from 'react';
import { getEnvironmentalData } from '../services/weatherService';
import { EnvironmentalData } from '../types';

interface EnvironmentalWidgetProps {
  recycledCount: number;
}

const EnvironmentalWidget: React.FC<EnvironmentalWidgetProps> = ({ recycledCount }) => {
  const [data, setData] = useState<EnvironmentalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const DEFAULT_LAT = -6.2088;
  const DEFAULT_LON = 106.8456;

  const loadData = useCallback(async (lat: number, lon: number, isDefault = false) => {
    try {
      const envData = await getEnvironmentalData(lat, lon);
      if (isDefault) envData.location = "Jakarta (Default)";
      setData(envData);
      setLastUpdated(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
      setLoading(false);
    } catch (err) {
      setError("Sensor Offline");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 1. Langsung muat data default agar widget tidak kosong/hilang
    loadData(DEFAULT_LAT, DEFAULT_LON, true);

    // 2. Coba update ke lokasi asli secara background
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => loadData(pos.coords.latitude, pos.coords.longitude, false),
        () => console.log("Menggunakan lokasi default karena akses GPS ditolak.")
      );
    }
  }, [loadData]);

  const getAqiStatus = (aqi: number) => {
    if (aqi <= 50) return { label: 'Bagus', color: 'text-emerald-500', bg: 'bg-emerald-50', icon: 'fa-smile' };
    if (aqi <= 100) return { label: 'Sedang', color: 'text-amber-500', bg: 'bg-amber-50', icon: 'fa-meh' };
    return { label: 'Buruk', color: 'text-rose-500', bg: 'bg-rose-50', icon: 'fa-frown' };
  };

  if (loading && !data) return <div className="h-40 bg-white/50 animate-pulse rounded-[2.5rem] border border-slate-100"></div>;

  const aqiInfo = data ? getAqiStatus(data.aqi) : getAqiStatus(0);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-5 duration-700">
      <div className="flex items-center justify-between px-2">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          Lingkungan Real-time
        </span>
        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">Sync: {lastUpdated}</span>
      </div>

      <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-6 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
        <div className="space-y-4 md:space-y-5">
           <div className="flex items-center justify-between">
              <div>
                 <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Lokasi Stasiun</p>
                 <p className="font-black text-slate-800 flex items-center gap-2 text-xs md:text-sm">
                    <i className="fas fa-location-dot text-emerald-500"></i> 
                    {data?.location || "Mencari Lokasi..."}
                 </p>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-2 md:gap-3">
              <div className="bg-slate-50 p-3 md:p-4 rounded-[1.5rem] md:rounded-3xl border border-slate-100">
                 <p className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase mb-1">Suhu</p>
                 <p className="text-lg md:text-xl font-black text-slate-900">{data?.temp}°C</p>
              </div>
              <div className="bg-slate-50 p-3 md:p-4 rounded-[1.5rem] md:rounded-3xl border border-slate-100">
                 <p className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase mb-1">Lembap</p>
                 <p className="text-lg md:text-xl font-black text-slate-900">{data?.humidity}%</p>
              </div>
           </div>

           <div className={`p-3 md:p-4 rounded-[1.5rem] md:rounded-[2rem] border ${aqiInfo.bg} ${aqiInfo.color} border-current/10 flex items-center gap-3 md:gap-4`}>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-lg md:rounded-xl flex items-center justify-center shadow-md">
                 <i className={`fas ${aqiInfo.icon} text-base md:text-lg`}></i>
              </div>
              <div>
                 <p className="text-[7px] md:text-[8px] font-black uppercase tracking-widest opacity-60">Udara (AQI)</p>
                 <p className="text-base md:text-lg font-black">{data?.aqi} — {aqiInfo.label}</p>
              </div>
           </div>
        </div>
      </div>

      <div className="bg-emerald-600 rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-6 text-white shadow-xl shadow-emerald-900/20 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <i className="fas fa-recycle text-5xl md:text-6xl"></i>
         </div>
         <div className="relative z-10">
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-emerald-200 mb-1">Eco-Impact Marketplace</p>
            <h4 className="text-xl md:text-2xl font-black mb-2">{recycledCount} Sampah</h4>
            <p className="text-[10px] md:text-[11px] font-medium text-emerald-50 leading-relaxed">
              Telah berhasil didaur ulang melalui platform kami untuk mengurangi limbah global dan emisi karbon.
            </p>
         </div>
      </div>
      
      <div className="bg-[#002b24] p-3 md:p-4 rounded-[1.5rem] md:rounded-[2rem] border border-emerald-500/20">
         <p className="text-[8px] md:text-[9px] font-bold text-emerald-100/70 leading-relaxed uppercase tracking-wide">
           <i className="fas fa-info-circle mr-1 md:mr-2"></i>
           Titik koordinat digunakan untuk optimasi rute kurir penjemputan.
         </p>
      </div>
    </div>
  );
};

export default EnvironmentalWidget;
