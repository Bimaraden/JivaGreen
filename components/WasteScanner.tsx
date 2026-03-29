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
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not defined. Please set it in your environment variables.");
      }
      const ai = new GoogleGenAI({ apiKey });
      const base64Data = image.split(',')[1];

      const prompt = `Analisa gambar sampah ini. Identifikasi komposisi bahan baku (misalnya besi, kaca, plastik, kertas, dll) dan perkirakan persentasenya. 
      Perkirakan juga "potensi cuan" (profit potential) dalam Rupiah per kg berdasarkan harga pasar saat ini di Indonesia.
      PENTING: Seluruh hasil analisa (material, description, recommendation) HARUS menggunakan Bahasa Indonesia.
      Kembalikan hasil sebagai array JSON dari objek dengan field berikut: 
      material (string), percentage (number), profitPotential (string seperti "Rp 5.000/kg"), description (string), recommendation (string).
      Hanya kembalikan array JSON, tanpa teks lain.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
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
        // Apply Developer Fee: Rp 2.000/kg
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
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 md:space-y-8 animate-in fade-in duration-700">
      <div className="text-center space-y-3 md:space-y-4">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">
          AI <span className="text-emerald-600">Waste Scanner</span>
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto text-xs md:text-sm font-medium px-2">
          Gunakan teknologi Deep Learning untuk menganalisa kadar bahan baku sampah Anda dan temukan potensi cuan maksimal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <div 
            className={`relative aspect-square rounded-[2.5rem] border-4 border-dashed transition-all duration-500 flex flex-col items-center justify-center overflow-hidden group ${image || isCameraOpen ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}
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
              <img src={image} alt="Waste" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center space-y-4 md:space-y-6 p-6 md:p-8 w-full max-w-xs">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl md:rounded-3xl shadow-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500">
                  <Camera className="w-8 h-8 md:w-10 md:h-10 text-emerald-600" />
                </div>
                <div>
                  <p className="text-slate-900 font-bold text-base md:text-lg">Pilih Foto Sampah</p>
                </div>
                
                <div className="flex flex-col gap-3 w-full">
                  <button onClick={() => setIsCameraOpen(true)} className="w-full py-3 md:py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                    <Camera className="w-4 h-4" /> Buka Kamera
                  </button>
                  
                  <label className="w-full py-3 md:py-4 bg-white border-2 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 text-slate-600 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4" /> Upload File
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setImage(reader.result as string);
                            setResults(null);
                            setError(null);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 md:gap-4">
            <button
              onClick={() => setImage(null)}
              className="flex-1 py-3 md:py-4 bg-slate-100 text-slate-600 font-black rounded-xl md:rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2 text-[10px] md:text-xs uppercase tracking-widest"
            >
              <Trash2 className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={analyzeWaste}
              disabled={!image || analyzing}
              className={`flex-[2] py-3 md:py-4 font-black rounded-xl md:rounded-2xl transition-all flex items-center justify-center gap-2 text-[10px] md:text-xs uppercase tracking-widest shadow-xl ${!image || analyzing ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-500 active:scale-95'}`}
            >
              {analyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Menganalisa...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Scan Sekarang
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold text-center animate-in slide-in-from-top-2">
              {error}
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {results ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <BarChart3 className="text-emerald-600" />
                      Hasil Analisa
                    </h3>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                      Diverifikasi AI
                    </span>
                  </div>

                  <div className="space-y-4">
                    {results.map((res: any, idx) => (
                      <div key={idx} className="p-5 md:p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 md:space-y-5">
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-xs md:text-sm font-black text-slate-400 uppercase tracking-widest">{res.material}</p>
                            <p className="text-3xl md:text-4xl font-black text-slate-900">{res.percentage}%</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-400 line-through">Pasar: Rp {res.marketPrice?.toLocaleString('id-ID')}</p>
                            <p className="text-xs md:text-sm font-black text-emerald-600 uppercase tracking-widest">Harga Bersih</p>
                            <p className="text-xl md:text-2xl font-black text-emerald-700">{res.profitPotential}</p>
                          </div>
                        </div>
                        <div className="w-full bg-slate-200 h-2.5 md:h-3 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${res.percentage}%` }}
                            transition={{ duration: 1, delay: idx * 0.2 }}
                            className="bg-emerald-500 h-full"
                          />
                        </div>
                        <p className="text-sm md:text-base text-slate-600 leading-relaxed italic">
                          "{res.description}"
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="p-5 md:p-6 bg-amber-50 border border-amber-100 rounded-2xl space-y-3 md:space-y-4">
                    <div className="flex items-center gap-2 text-amber-700 font-black text-xs md:text-sm uppercase tracking-widest">
                      <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
                      Rekomendasi
                    </div>
                    <p className="text-sm md:text-base text-amber-800 font-medium leading-relaxed">
                      {results[0]?.recommendation}
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 space-y-4">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                  <Info className="w-8 h-8 text-slate-300" />
                </div>
                <div>
                  <p className="text-slate-400 font-bold">Belum Ada Analisa</p>
                  <p className="text-slate-300 text-xs mt-1">Upload foto sampah untuk melihat kadar bahan baku dan potensi keuntungannya.</p>
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
