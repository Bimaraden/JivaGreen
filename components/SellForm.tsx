
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { validateWasteImage, ValidationResult } from '../services/visionService';
import CameraCapture from './CameraCapture';

interface SellFormProps {
  onSell: (data: any) => void;
}

const SellForm: React.FC<SellFormProps> = ({ onSell }) => {
  const [formData, setFormData] = useState({
    title: '', material: 'Campuran', price: 0, condition: 'Menunggu Foto...', description: '', image: '',
    address: '',
    latitude: null as number | null,
    longitude: null as number | null,
    composition: [] as any[]
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [aiPriceSuggested, setAiPriceSuggested] = useState(false);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = () => {
    setIsGettingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData(prev => ({ ...prev, latitude: pos.coords.latitude, longitude: pos.coords.longitude }));
          setLocationStatus('success');
          setIsGettingLocation(false);
        },
        () => {
          setLocationStatus('error');
          setIsGettingLocation(false);
        },
        { timeout: 5000 }
      );
    } else {
      setLocationStatus('error');
      setIsGettingLocation(false);
    }
  };

  const analyzeWithAI = async (base64: string) => {
    setIsAnalyzing(true);
    setAiPriceSuggested(false);
    setValidation(null);
    try {
      // 1. Validate if it's a real waste photo
      const validationResult = await validateWasteImage(base64);
      setValidation(validationResult);

      if (!validationResult.isValid) {
        setIsAnalyzing(false);
        return;
      }

      // 2. Proceed with waste details extraction
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not defined. Please set it in your environment variables.");
      }
      const ai = new GoogleGenAI({ apiKey });
      const imageData = base64.split(',')[1];
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{
          parts: [
            { inlineData: { mimeType: "image/jpeg", data: imageData } },
            { text: "Identifikasi jenis sampah ini. Berikan estimasi harga jual per kg di Indonesia (dalam angka). Berikan juga persentase kadar bahan baku. PENTING: Seluruh teks (title, material, condition, composition.material) HARUS dalam Bahasa Indonesia. Berikan JSON: {title, material, suggestedPrice, condition, composition: [{material, percentage}]}." }
          ]
        }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              material: { type: Type.STRING },
              suggestedPrice: { type: Type.NUMBER },
              condition: { type: Type.STRING },
              composition: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    material: { type: Type.STRING },
                    percentage: { type: Type.NUMBER }
                  }
                }
              }
            }
          }
        }
      });
      
      const res = JSON.parse(response.text || '{}');

      setFormData(prev => ({ 
        ...prev, 
        title: res.title || 'Sampah Campuran',
        material: res.material || 'Campuran',
        price: res.suggestedPrice || 2000,
        condition: res.condition || 'Siap Daur Ulang',
        composition: res.composition || []
      }));
      setAiPriceSuggested(true);
    } catch (e) {
      console.error("AI Analysis failed", e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAnalyzing) return;
    if (!formData.image) { alert("Harap ambil foto sampah."); return; }
    if (validation && !validation.isValid) {
      alert(`Maaf, foto tidak valid: ${validation.reason || 'Bukan foto sampah asli.'}`);
      return;
    }
    if (locationStatus !== 'success' && !formData.address) { alert("GPS tidak aktif. Harap isi Alamat Lengkap."); return; }
    onSell(formData);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 md:space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20 px-4">
      <div className="flex justify-between items-end">
         <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">Jual Sampah <span className="text-emerald-500">AI</span></h2>
         <div className="hidden md:block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Waste Scanner v4.0</div>
      </div>

      <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col lg:flex-row min-h-[500px] md:min-h-[600px]">
        <div className="lg:w-1/2 bg-slate-950 p-6 md:p-8 flex flex-col items-center justify-center relative">
          {!formData.image && !isCameraOpen ? (
            <div className="w-full aspect-[3/4] max-w-sm border-2 border-dashed border-emerald-500/30 rounded-[2rem] md:rounded-[3rem] flex flex-col items-center justify-center p-6 md:p-10 text-center gap-4 md:gap-6">
              <i className="fas fa-image text-4xl md:text-5xl text-emerald-400 mb-2"></i>
              <h3 className="text-white font-black text-lg md:text-xl">Pilih Foto Sampah</h3>
              
              <div className="flex flex-col gap-3 md:gap-4 w-full mt-2 md:mt-4">
                <button onClick={() => setIsCameraOpen(true)} className="w-full py-3 md:py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3">
                  <i className="fas fa-camera"></i> Buka Kamera
                </button>
                
                <label className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-3">
                  <i className="fas fa-upload"></i> Upload File
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const base64 = reader.result as string;
                          setFormData(prev => ({ ...prev, image: base64 }));
                          analyzeWithAI(base64);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          ) : isCameraOpen ? (
            <div className="w-full aspect-[3/4] max-w-sm">
              <CameraCapture 
                onCapture={(base64) => {
                  setFormData(prev => ({ ...prev, image: base64 }));
                  setIsCameraOpen(false);
                  analyzeWithAI(base64);
                }} 
                onCancel={() => setIsCameraOpen(false)} 
              />
            </div>
          ) : (
            <div className="relative w-full max-w-sm">
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl aspect-[3/4]">
                <img src={formData.image} className="w-full h-full object-cover" />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-sm flex items-center justify-center">
                    <div className="absolute top-0 left-0 w-full h-1 bg-emerald-400 animate-laser shadow-[0_0_20px_#10b981]"></div>
                    <div className="bg-black/60 text-emerald-400 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Menganalisa Material...</div>
                  </div>
                )}
                {validation && !validation.isValid && !isAnalyzing && (
                  <div className="absolute inset-0 bg-rose-500/40 backdrop-blur-md flex items-center justify-center p-8 text-center">
                    <div className="space-y-4">
                      <i className="fas fa-exclamation-triangle text-white text-4xl"></i>
                      <p className="text-white font-black text-xs uppercase tracking-widest leading-relaxed">
                        {validation.reason || "Foto terdeteksi palsu atau bukan sampah asli."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <button onClick={() => { setFormData(prev => ({ ...prev, image: '' })); setIsCameraOpen(true); }} className="w-full mt-6 py-3 bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">Foto Ulang</button>
            </div>
          )}
        </div>

        <div className="lg:w-1/2 p-6 md:p-16 space-y-6 md:space-y-8 bg-white">
          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
            <div className="space-y-3 md:space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 md:ml-4">Lokasi Penjemputan</label>
              <div className={`p-4 md:p-6 rounded-2xl md:rounded-3xl border ${locationStatus === 'success' ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-100'}`}>
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest">{locationStatus === 'success' ? 'GPS Aktif' : 'GPS Tidak Ditemukan'}</span>
                </div>
                {locationStatus !== 'success' && (
                  <textarea required placeholder="Masukkan alamat lengkap penjemputan..." value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-3 md:p-4 bg-white border border-rose-200 rounded-xl md:rounded-2xl outline-none text-xs md:text-sm min-h-[80px]" />
                )}
              </div>
            </div>

            <div className="space-y-3 md:space-y-4">
              <input type="text" required placeholder="Jenis Sampah (misal: Botol Plastik)" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-5 py-4 md:px-8 md:py-5 bg-slate-50 border border-slate-100 rounded-2xl md:rounded-[2rem] font-bold outline-none text-sm md:text-base" />
              
              {formData.composition.length > 0 && (
                <div className="p-5 md:p-6 bg-emerald-50 rounded-2xl md:rounded-3xl border border-emerald-100 space-y-3 md:space-y-4">
                  <p className="text-xs md:text-sm font-black text-emerald-600 uppercase tracking-widest">Kadar Bahan Baku (AI)</p>
                  <div className="space-y-2 md:space-y-3">
                    {formData.composition.map((c, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm md:text-base font-bold text-slate-700">{c.material}</span>
                        <span className="text-sm md:text-base font-black text-emerald-700">{c.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="w-full px-4 py-4 md:px-6 md:py-5 bg-slate-900 text-emerald-400 rounded-2xl md:rounded-[2rem] font-black text-[9px] md:text-[10px] uppercase flex items-center justify-center text-center leading-tight">
                  {formData.condition}
                </div>
                <div className="relative">
                  <input 
                    type="number" 
                    required 
                    value={formData.price} 
                    onChange={e => setFormData({...formData, price: Number(e.target.value)})} 
                    className={`w-full px-4 py-4 md:px-6 md:py-5 rounded-2xl md:rounded-[2rem] font-black text-base md:text-lg outline-none border-slate-100 bg-slate-50`} 
                  />
                  <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 flex flex-col items-end">
                    <span className="text-[8px] font-black text-emerald-600 uppercase">Rp/kg</span>
                    {aiPriceSuggested && (
                      <span className="text-[6px] text-slate-400 font-bold">Fee Rp 2.000 terpotong</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <button type="submit" className="w-full py-4 md:py-6 bg-[#004d40] text-white font-black rounded-2xl md:rounded-[2.5rem] hover:bg-emerald-600 transition-all uppercase tracking-[0.2em] text-[10px] md:text-xs shadow-xl shadow-emerald-900/20">
              Kirim Sampah untuk Ditinjau
            </button>
          </form>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `@keyframes laser { 0% { top: 0; } 50% { top: 100%; } 100% { top: 0; } } .animate-laser { position: absolute; animation: laser 2.5s infinite linear; }`}} />
    </div>
  );
};

export default SellForm;
