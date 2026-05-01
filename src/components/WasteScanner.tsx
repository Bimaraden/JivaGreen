import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Upload, Zap, Trash2, TrendingUp, BarChart3, Info } from 'lucide-react';
import CameraCapture from './CameraCapture';

interface AnalysisResult {
  material: string;
  percentage: number;
  profitPotential: string;
  description: string;
  recommendation: string;
}

const WasteScanner: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const analyzeWaste = async () => {
    if (!image) return;

    setAnalyzing(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const base64Data = image.split(',')[1];

      const prompt = `Analisa gambar sampah ini. Identifikasi komposisi bahan baku (misalnya besi, kaca, plastik, kertas, dll) dan perkirakan persentasenya. 
      Perkirakan juga "potensi cuan" (profit potential) dalam Rupiah per kg berdasarkan harga pasar saat ini di Indonesia.
      PENTING: Seluruh hasil analisa (material, description, recommendation) HARUS menggunakan Bahasa Indonesia.
      Kembalikan hasil sebagai array JSON dari objek dengan field berikut: 
      material (string), percentage (number), profitPotential (string seperti "Rp 5.000/kg"), description (string), recommendation (string).
      Hanya kembalikan array JSON, tanpa teks lain.`;

      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [
          {
            parts: [
              { text: prompt },
              { inlineData: { mimeType: "image/jpeg", data: base64Data } }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });

      const text = response.text;
      if (text) {
        const parsedResults = JSON.parse(text);
        const FEE = 2000;
        const processedResults = parsedResults.map((res: any) => {
          const marketPrice = res.marketPrice || 0;
          const userPrice = Math.max(500, marketPrice - FEE);
          return {
            ...res,
            marketPrice: marketPrice,
            userPrice: userPrice,
            profitPotential: `Rp ${userPrice.toLocaleString('id-ID')}/kg`
          };
        });
        setResults(processedResults);
      }
    } catch (err: any) {
      console.error("Analysis error:", err);
      setError("Gagal menganalisa gambar. Pastikan gambar jelas dan coba lagi.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 md:space-y-12 animate-in fade-in duration-1000 px-4 md:px-0">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.2em]">
          Pemindai Sampah
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-dark tracking-tighter leading-tight md:leading-[0.8]">
          Pemindai Intelijen <br className="hidden md:block"/> <span className="text-primary italic">Eko.</span>
        </h1>
        <p className="text-dark/40 max-w-xl mx-auto text-xs md:text-sm font-medium leading-relaxed">
          Identifikasi material sampah dan estimasi nilai secara cepat dan akurat
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
        {/* Upload Section */}
        <div className="space-y-6 md:space-y-8">
          <div 
            className={`relative aspect-square rounded-[2.5rem] md:rounded-[3rem] border-2 border-primary/20 transition-all duration-700 flex flex-col items-center justify-center overflow-hidden group shadow-2xl ${image || isCameraOpen ? 'bg-black' : 'bg-white shadow-primary/5'}`}
          >
            {isCameraOpen ? (
              <CameraCapture 
                onCapture={(base64) => {
                  setImage(base64);
                  setResults(null);
                  setError(null);
                  setIsCameraOpen(false);
                }} 
                onCancel={() => setIsCameraOpen(false)} 
              />
            ) : image ? (
              <div className="relative w-full h-full">
                <img src={image} alt="Waste" className="w-full h-full object-cover opacity-80" />
                {analyzing && (
                  <motion.div 
                    initial={{ top: '0%' }}
                    animate={{ top: '100%' }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_20px_#4CAF50] z-20"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            ) : (
              <div className="text-center space-y-6 md:space-y-8 p-8 md:p-12 w-full max-w-sm">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-soft-white rounded-[1.5rem] md:rounded-[2rem] shadow-xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border border-black/5">
                  <Camera className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                </div>
                <div>
                  <p className="text-dark font-black text-lg md:text-xl tracking-tight mb-1 md:mb-2 uppercase">Belum ada media</p>
                  <p className="text-dark/30 text-[10px] md:text-xs font-medium uppercase tracking-widest leading-loose">Bidik atau unggah foto untuk memulai analisa</p>
                </div>
              </div>
            )}
            
            {/* Corner Accents */}
            <div className="absolute top-6 md:top-8 left-6 md:left-8 w-8 md:w-12 h-8 md:h-12 border-t-2 md:border-t-4 border-l-2 md:border-l-4 border-primary/40 pointer-events-none" />
            <div className="absolute top-6 md:top-8 right-6 md:right-8 w-8 md:w-12 h-8 md:h-12 border-t-2 md:border-t-4 border-r-2 md:border-r-4 border-primary/40 pointer-events-none" />
            <div className="absolute bottom-6 md:bottom-8 left-6 md:left-8 w-8 md:w-12 h-8 md:h-12 border-b-2 md:border-b-4 border-l-2 md:border-l-4 border-primary/40 pointer-events-none" />
            <div className="absolute bottom-6 md:bottom-8 right-6 md:right-8 w-8 md:w-12 h-8 md:h-12 border-b-2 md:border-b-4 border-r-2 md:border-r-4 border-primary/40 pointer-events-none" />
          </div>

          <div className="flex gap-3 md:gap-4">
            <button
              onClick={() => { setImage(null); setIsCameraOpen(true); }}
              className="flex-1 h-14 md:h-16 bg-white text-dark font-black rounded-2xl hover:bg-soft-white transition-all flex items-center justify-center gap-3 text-[10px] md:text-nowrap md:text-xs uppercase tracking-widest border border-black/5 shadow-sm active:scale-95"
            >
              <Camera className="w-4 h-4" /> <span className="hidden xs:inline">Kamera</span>
            </button>
            <label className="flex-1 h-14 md:h-16 bg-white text-dark font-black rounded-2xl hover:bg-soft-white transition-all cursor-pointer flex items-center justify-center gap-3 text-[10px] md:text-xs uppercase tracking-widest border border-black/5 shadow-sm active:scale-95">
              <Upload className="w-4 h-4" /> <span className="hidden xs:inline">Unggah</span>
              <input type="file" accept="image/*" className="hidden" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => { setImage(reader.result as string); setResults(null); setError(null); };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
          </div>

          <div className="flex gap-3 md:gap-4">
             <button
               onClick={() => { setImage(null); setResults(null); }}
               className="w-14 h-14 md:w-16 md:h-16 bg-white text-dark/30 rounded-2xl flex items-center justify-center hover:text-rose-500 transition-colors border border-black/5 shadow-sm active:scale-90"
             >
               <Trash2 className="w-5 h-5" />
             </button>
             <button
               onClick={analyzeWaste}
               disabled={!image || analyzing}
               className={`flex-1 h-14 md:h-16 rounded-2xl font-black transition-all flex items-center justify-center gap-3 text-[10px] md:text-xs uppercase tracking-widest shadow-2xl shadow-primary/20 ${!image || analyzing ? 'bg-primary/20 text-white cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-dark active:scale-[0.98]'}`}
             >
               {analyzing ? (
                 <div className="flex items-center gap-2">
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   Analisa...
                 </div>
               ) : (
                 <>
                   <Zap className="w-4 h-4 fill-white" />
                   Analisa Smart
                 </>
               )}
             </button>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 md:p-5 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-[10px] md:text-xs font-bold text-center">
              <i className="fas fa-exclamation-circle mr-2" /> {error}
            </motion.div>
          )}
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] border border-black/5 p-8 md:p-12 shadow-2xl shadow-primary/5 min-h-[400px] md:min-h-[500px]">
          <AnimatePresence mode="wait">
            {results ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 md:space-y-10">
                <div className="flex items-center justify-between pb-6 md:pb-8 border-b border-black/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-xl md:rounded-2xl flex items-center justify-center text-primary">
                      <BarChart3 className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-black text-dark tracking-tight">Laporan Analisa</h3>
                      <p className="text-[8px] md:text-[10px] font-bold text-dark/30 uppercase tracking-[0.2em] mt-0.5">Mesin Utama: Cloud AI v4.5</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  {results.map((res: any, idx) => (
                    <div key={idx} className="group space-y-4 md:space-y-6">
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5 md:mb-2">
                            <span className="w-2 h-2 rounded-full bg-primary" />
                            <p className="text-[9px] md:text-[10px] font-black text-dark/30 uppercase tracking-[0.2em]">{res.material}</p>
                          </div>
                          <p className="text-4xl md:text-5xl font-black text-dark tracking-tighter leading-none">{res.percentage}%</p>
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                           <div className="bg-primary/10 text-primary px-3 md:px-4 py-1.5 md:py-2 rounded-xl border border-primary/20">
                              <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest opacity-60">Estimasi Cuan</p>
                              <p className="text-base md:text-lg font-black">{res.profitPotential}</p>
                           </div>
                        </div>
                      </div>
                      
                      <div className="relative h-2 md:h-3 w-full bg-soft-white rounded-full overflow-hidden border border-black/5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${res.percentage}%` }}
                          transition={{ duration: 1.5, ease: "circOut", delay: idx * 0.2 }}
                          className="absolute inset-0 bg-gradient-to-r from-primary to-primary-light h-full rounded-full"
                        />
                      </div>

                      <div className="bg-soft-white p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-black/5">
                        <p className="text-xs font-medium text-dark/50 leading-relaxed italic">
                          <i className="fas fa-quote-left mr-2 text-primary opacity-30" />
                          {res.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-dark text-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] relative overflow-hidden group">
                  <TrendingUp className="absolute top-[-20%] right-[-10%] w-32 md:w-40 h-32 md:h-40 opacity-5 group-hover:rotate-12 transition-transform duration-700 hidden md:block" />
                  <div className="relative z-10 flex items-start gap-4">
                    <Info className="w-5 h-5 md:w-6 md:h-6 text-primary flex-shrink-0 mt-1" />
                    <div className="space-y-1.5 md:space-y-2">
                      <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-primary">Rekomendasi Strategis</p>
                      <p className="text-xs md:text-sm font-medium leading-relaxed opacity-80 italic">
                        {results[0]?.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 md:py-20 px-8 md:px-12 space-y-6 md:space-y-8 animate-in fade-in duration-1000">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-soft-white rounded-full flex items-center justify-center border border-black/5">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-full shadow-lg flex items-center justify-center border border-black/5">
                    <Info className="w-6 h-6 md:w-8 md:h-8 text-dark/10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-lg md:text-xl font-black text-dark tracking-tight">STATUS: SIAGA</p>
                  <p className="text-[10px] md:text-xs font-medium text-dark/30 max-w-[240px] mx-auto leading-relaxed uppercase tracking-widest">
                    AI siap mendeteksi material secara otomatis. Sediakan input visual.
                  </p>
                </div>
                
                {/* Decorative dots */}
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-dark/5" />
                  <div className="w-1.5 h-1.5 rounded-full bg-dark/5" />
                  <div className="w-1.5 h-1.5 rounded-full bg-dark/5" />
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default WasteScanner;
