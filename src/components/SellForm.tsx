
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { motion, AnimatePresence } from 'motion/react';
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
      const validationResult = await validateWasteImage(base64);
      setValidation(validationResult);

      if (!validationResult.isValid) {
        setIsAnalyzing(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const imageData = base64.split(',')[1];
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
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
    <div className="max-w-7xl mx-auto space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-1000 pb-20 px-4 md:px-0">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="w-full text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
            Sistem Listing
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-dark tracking-tighter leading-tight md:leading-[0.8]">
             Jual Sampah <br className="hidden md:block"/> <span className="text-primary italic">Jadi Berkah.</span>
          </h2>
        </div>
        <p className="text-dark/30 text-[10px] md:text-xs font-bold uppercase tracking-widest leading-loose max-w-[240px] mx-auto md:mx-0 text-center md:text-right">
          Sistem deteksi otomatis untuk transparansi harga yang lebih baik.
        </p>
      </header>

      <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] shadow-2xl border border-black/5 overflow-hidden flex flex-col lg:flex-row min-h-0 lg:min-h-[700px]">
        {/* Left Visual Section */}
        <div className="lg:w-1/2 bg-dark p-8 md:p-12 flex flex-col items-center justify-center relative overflow-hidden min-h-[400px] md:min-h-[600px]">
          {/* Abstract Grid background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #4CAF50 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          
          <div className="relative w-full max-w-sm">
            {!formData.image && !isCameraOpen ? (
              <div className="w-full aspect-square md:aspect-[4/5] border-2 border-dashed border-primary/20 rounded-[2.5rem] md:rounded-[3rem] flex flex-col items-center justify-center p-8 md:p-12 text-center gap-6 md:gap-8 group hover:border-primary/40 transition-all">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-soft-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform border border-black/5">
                  <i className="fas fa-camera-retro text-2xl md:text-4xl text-primary"></i>
                </div>
                <div>
                  <h3 className="text-white font-black text-xl md:text-2xl tracking-tight mb-2 md:mb-4">Wawasan Visual</h3>
                  <p className="text-white/40 text-xs md:text-sm font-medium leading-relaxed">
                    Sediakan media visual sampah untuk diverifikasi oleh sistem Jivagreen.
                  </p>
                </div>
                
                <div className="flex flex-col gap-3 w-full">
                  <button onClick={() => setIsCameraOpen(true)} className="w-full h-14 md:h-16 bg-primary hover:bg-primary-dark text-white rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20">
                    <i className="fas fa-camera text-sm"></i> Ambil Foto
                  </button>
                  
                  <label className="w-full h-14 md:h-16 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-3 border border-white/10">
                    <i className="fas fa-file-export text-sm"></i> Dari Galeri
                    <input type="file" accept="image/*" className="hidden" 
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
              <div className="w-full aspect-square md:aspect-[4/5] rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl border border-white/10">
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
              <div className="relative">
                <div className="relative rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl aspect-square md:aspect-[4/5] border border-white/10 group">
                  <img src={formData.image} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[3s]" />
                  
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                      <motion.div initial={{ top: '0%' }} animate={{ top: '100%' }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="absolute left-0 w-full h-1 bg-primary shadow-[0_0_20px_#4CAF50] z-20" />
                      <div className="bg-black/40 backdrop-blur-md text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-white/20">Mengidentifikasi Aset...</div>
                    </div>
                  )}

                  {validation && !validation.isValid && !isAnalyzing && (
                    <div className="absolute inset-0 bg-rose-500/80 backdrop-blur-xl flex items-center justify-center p-8 md:p-12 text-center">
                      <div className="space-y-6">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto shadow-2xl rotate-12">
                           <i className="fas fa-shield-virus text-rose-500 text-2xl md:text-3xl"></i>
                        </div>
                        <div>
                          <p className="text-white font-black text-lg md:text-xl tracking-tight mb-1 md:mb-2 uppercase">Keamanan Ditolak</p>
                          <p className="text-white/60 text-[10px] md:text-xs font-medium leading-relaxed">
                            {validation.reason || "Sistem keamanan mendeteksi media tidak valid."}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 pointer-events-none border-[8px] md:border-[12px] border-white/5 rounded-[2.5rem] md:rounded-[3.5rem]" />
                </div>
                <button onClick={() => { setFormData(prev => ({ ...prev, image: '' })); setIsCameraOpen(true); }} className="w-full mt-6 md:mt-8 h-12 md:h-14 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] border border-white/10 transition-all flex items-center justify-center gap-3">
                   <i className="fas fa-redo-alt"></i> Ambil Ulang
                </button>
              </div>
            )}
          </div>
          
          <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 md:gap-4 bg-white/5 px-4 md:px-6 py-2 md:py-3 rounded-full border border-white/10 backdrop-blur-md whitespace-nowrap">
             <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary animate-pulse"></div>
             <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white/40">Secure Neural Gateway v4.5</span>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="lg:w-1/2 p-6 md:p-20 space-y-10 md:space-y-12 bg-white">
          <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10">
            {/* Location Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                 <label className="text-[10px] font-black text-dark/30 uppercase tracking-widest">Penjemputan</label>
                  {isGettingLocation && <span className="text-[8px] md:text-[9px] font-bold text-primary animate-pulse">Mengambil GPS...</span>}
              </div>
              <div className={`group transition-all duration-500 rounded-[2rem] md:rounded-[2.5rem] border-2 shadow-sm ${locationStatus === 'success' ? 'bg-primary/5 border-primary/20' : 'bg-soft-white border-black/5'}`}>
                <div className="p-6 md:p-8 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${locationStatus === 'success' ? 'bg-primary text-white scale-110 shadow-lg' : 'bg-dark/10 text-dark/20'}`}>
                      <i className={`fas ${locationStatus === 'success' ? 'fa-location-dot' : 'fa-location-arrow'}`}></i>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm font-black text-dark tracking-tight">{locationStatus === 'success' ? 'Koordinat Terdeteksi' : 'Butuh Input Manual'}</p>
                      <p className="text-[9px] md:text-[10px] font-medium text-dark/30">{locationStatus === 'success' ? `${formData.latitude?.toFixed(4)}, ${formData.longitude?.toFixed(4)}` : 'Sediakan alamat lengkap dibawah'}</p>
                    </div>
                  </div>
                  
                  {locationStatus !== 'success' && (
                    <textarea required placeholder="Nama Jalan, Blok, No Rumah, Kelurahan, Kota..." value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-5 md:p-6 bg-white border border-black/5 rounded-2xl md:rounded-3xl outline-none text-xs md:text-sm font-medium min-h-[100px] md:min-h-[120px] focus:border-primary/30 transition-all placeholder:text-dark/20" />
                  )}
                </div>
              </div>
            </div>

            {/* Waste Info Section */}
            <div className="space-y-6 md:space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-dark/30 uppercase tracking-widest px-4">Informasi Material</label>
                <input type="text" required placeholder="Judul/Jenis Sampah" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full h-14 md:h-16 px-6 md:px-8 bg-soft-white border border-black/5 rounded-2xl md:rounded-3xl font-black outline-none text-dark focus:bg-white focus:border-primary/20 transition-all placeholder:text-dark/10 tracking-tight text-sm md:text-base" />
              </div>
              
              {formData.composition.length > 0 && (
                <div className="p-6 md:p-8 bg-soft-white rounded-[2rem] md:rounded-[2.5rem] border border-black/5 space-y-4 md:space-y-6">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] md:text-[11px] font-black text-dark uppercase tracking-widest">Kadar Material</p>
                    <i className="fas fa-microchip text-primary text-sm md:text-base"></i>
                  </div>
                  <div className="space-y-4">
                    {formData.composition.map((c, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between text-[10px] md:text-xs font-bold px-1">
                          <span className="text-dark/40">{c.material}</span>
                          <span className="text-primary">{c.percentage}%</span>
                        </div>
                        <div className="h-1.5 md:h-2 w-full bg-dark/5 rounded-full overflow-hidden">
                           <motion.div initial={{ width: 0 }} animate={{ width: `${c.percentage}%` }} transition={{ duration: 1, delay: i * 0.1 }} className="h-full bg-primary" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="h-16 md:h-20 px-6 md:px-8 bg-dark text-primary rounded-2xl md:rounded-3xl font-black text-[10px] md:text-xs uppercase tracking-widest flex items-center justify-center text-center shadow-xl shadow-black/10 border border-white/5">
                    <i className="fas fa-certificate mr-3"></i> {formData.condition}
                 </div>
                 <div className="relative h-16 md:h-20">
                    <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full h-full px-6 md:px-8 bg-soft-white border border-black/5 rounded-2xl md:rounded-3xl font-black text-xl md:text-2xl outline-none text-dark focus:bg-white focus:border-primary/20 transition-all tracking-tighter" />
                    <div className="absolute right-6 md:right-8 top-1/2 -translate-y-1/2 text-right pointer-events-none">
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest">Rp/kg</p>
                      {aiPriceSuggested && <p className="text-[7px] md:text-[8px] text-dark/20 font-bold leading-none mt-1 italic">Harga Pasar</p>}
                    </div>
                 </div>
              </div>
            </div>

            <button type="submit" disabled={isAnalyzing} className={`group w-full h-16 md:h-20 bg-primary text-white font-black rounded-2xl md:rounded-3xl transition-all uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-[11px] shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 relative overflow-hidden ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-dark hover:scale-[1.01] active:scale-[0.98]'}`}>
               <span className="relative z-10">Kirim Penawaran</span>
               <i className="fas fa-arrow-right relative z-10 group-hover:translate-x-2 transition-transform"></i>
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          </form>
          
          <div className="text-center">
             <p className="text-[9px] md:text-[10px] font-bold text-dark/20 uppercase tracking-[0.2em] inline-flex items-center justify-center gap-2">
                <i className="fas fa-lock text-primary"></i>
                Data dienkripsi oleh Smart Contract Jivagreen
             </p>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `@keyframes scan { 0% { top: 0; } 100% { top: 100%; } } .animate-laser { animation: scan 2s infinite linear; }`}} />
    </div>
  );
};

export default SellForm;
