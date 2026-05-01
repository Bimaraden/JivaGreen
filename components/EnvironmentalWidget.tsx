
import React, { useEffect, useState, useCallback } from 'react';
import { getEnvironmentalData } from '../services/weatherService';
import { EnvironmentalData } from '../src/types';
import { motion } from 'motion/react';

interface EnvironmentalWidgetProps {
  recycledCount: number;
}

const EnvironmentalWidget: React.FC<EnvironmentalWidgetProps> = ({ recycledCount }) => {
  const [data, setData] = useState<EnvironmentalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const DEFAULT_LAT = -6.2088;
  const DEFAULT_LON = 106.8456;

  const loadData = useCallback(async (lat: number, lon: number, isDefault = false) => {
    try {
      const envData = await getEnvironmentalData(lat, lon);
      if (isDefault) envData.location = "Jakarta";
      setData(envData);
      setLastUpdated(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(DEFAULT_LAT, DEFAULT_LON, true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => loadData(pos.coords.latitude, pos.coords.longitude, false),
        () => console.log("Using default location.")
      );
    }
  }, [loadData]);

  const getAqiStatus = (aqi: number) => {
    if (aqi <= 50) return { label: 'Excellent', color: 'text-emerald-500', bg: 'bg-emerald-50', icon: 'fa-smile', desc: 'Udara sangat bersih' };
    if (aqi <= 100) return { label: 'Moderate', color: 'text-amber-500', bg: 'bg-amber-50', icon: 'fa-meh', desc: 'Kualitas udara sedang' };
    return { label: 'Polluted', color: 'text-rose-500', bg: 'bg-rose-50', icon: 'fa-frown', desc: 'Udara kurang sehat' };
  };

  if (loading && !data) return <div className="h-64 bg-white/50 animate-pulse rounded-[2.5rem] border border-black/5"></div>;

  const aqiInfo = data ? getAqiStatus(data.aqi) : getAqiStatus(0);

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="flex items-center justify-between px-2">
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-black/5 rounded-full text-dark/40 text-[9px] font-black uppercase tracking-[0.2em] shadow-sm"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
          </span>
          Live Data
        </motion.div>
        <span className="text-[9px] font-black text-dark/10 uppercase tracking-widest font-['Poppins',sans-serif]">Update: {lastUpdated}</span>
      </div>

      {/* Main Glass Widget */}
      <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-black/5 border border-black/5 relative overflow-hidden group">
        <div className="relative z-10 space-y-8">
           <div>
              <p className="text-[9px] font-black text-dark/20 uppercase tracking-[0.2em] mb-2 font-['Poppins',sans-serif]">Observing From</p>
              <p className="font-black text-dark flex items-center gap-2 text-base font-['Montserrat',sans-serif] tracking-tight">
                <i className="fas fa-location-arrow text-primary text-xs"></i> 
                {data?.location || "Detecting..."}
              </p>
           </div>

           <div className="grid grid-cols-2 gap-5">
              <div className="bg-soft-white p-6 rounded-[2rem] border border-black/5 flex flex-col gap-1">
                 <p className="text-[8px] font-black text-dark/20 uppercase tracking-widest font-['Poppins',sans-serif]">Temperature</p>
                 <div className="flex items-end gap-1">
                    <span className="text-4xl font-black text-dark leading-none font-['Montserrat',sans-serif] tracking-tighter">{data?.temp}</span>
                    <span className="text-xs font-bold text-primary mb-1 inline-block">°C</span>
                 </div>
              </div>
              <div className="bg-soft-white p-6 rounded-[2rem] border border-black/5 flex flex-col gap-1">
                 <p className="text-[8px] font-black text-dark/20 uppercase tracking-widest font-['Poppins',sans-serif]">Humidity</p>
                 <div className="flex items-end gap-1">
                    <span className="text-4xl font-black text-dark leading-none font-['Montserrat',sans-serif] tracking-tighter">{data?.humidity}</span>
                    <span className="text-xs font-bold text-primary mb-1 inline-block">%</span>
                 </div>
              </div>
           </div>

           <div className={`p-8 rounded-[2.5rem] border ${aqiInfo.bg} ${aqiInfo.color} border-current/5 flex items-center gap-6 transition-all group-hover:scale-[1.02]`}>
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl shadow-black/5">
                 <i className={`fas ${aqiInfo.icon} text-2xl`}></i>
              </div>
              <div>
                 <p className="text-[8px] font-black uppercase tracking-[0.3em] opacity-30 font-['Poppins',sans-serif]">AQI Index</p>
                 <p className="text-xl font-black leading-none mt-1 font-['Montserrat',sans-serif] tracking-tight">{data?.aqi} — {aqiInfo.label}</p>
                 <p className="text-[10px] font-medium mt-2 opacity-60 font-['Poppins',sans-serif]">{aqiInfo.desc}</p>
              </div>
           </div>
        </div>
      </div>

      {/* Impact Card */}
      <div className="bg-dark rounded-[3.5rem] p-10 text-white shadow-2xl shadow-dark/10 relative overflow-hidden group">
         <div className="absolute top-[-20%] right-[-10%] opacity-5 group-hover:rotate-12 transition-transform duration-1000">
            <i className="fas fa-leaf text-[12rem]"></i>
         </div>
         
         <div className="relative z-10">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 mb-6 font-['Poppins',sans-serif]">Global Community Impact</p>
            <div className="flex items-baseline gap-2 mb-4">
              <h4 className="text-6xl font-black tracking-tighter font-['Montserrat',sans-serif]">{recycledCount}</h4>
              <span className="text-sm font-black text-primary uppercase tracking-tighter">Units</span>
            </div>
            <p className="text-sm font-medium text-white/50 leading-relaxed max-w-[220px] font-['Poppins',sans-serif]">
              Sampah yang telah <span className="text-white font-black underline decoration-primary decoration-4">masuk sistem</span> daur ulang Jivagreen.
            </p>
         </div>
      </div>
    </div>
  );
};

export default EnvironmentalWidget;
