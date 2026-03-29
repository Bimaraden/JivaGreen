import React, { useRef, useState, useEffect, useCallback } from 'react';

interface CameraCaptureProps {
  onCapture: (base64Image: string) => void;
  onCancel: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      setError(`Kamera tidak dapat diakses (${err.name || 'Unknown Error'}). Pastikan izin kamera diberikan di browser Anda.`);
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const base64 = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(base64);
      }
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-black rounded-[3rem] overflow-hidden">
      {error ? (
        <div className="p-6 text-center text-white">
          <i className="fas fa-exclamation-triangle text-rose-500 text-4xl mb-4"></i>
          <p className="text-sm font-bold mb-2">{error}</p>
          <p className="text-xs text-slate-400 mb-6">
            Jika Anda menggunakan PC/Laptop atau mengalami masalah izin, coba buka aplikasi ini di tab baru.
          </p>
          <div className="flex flex-col items-center gap-4">
            <div className="flex justify-center gap-4">
              <button onClick={onCancel} className="px-6 py-3 bg-slate-800 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-700">
                Kembali
              </button>
              <a href={window.location.href} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-emerald-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-500">
                Buka di Tab Baru
              </a>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800 w-full">
              <p className="text-[10px] text-slate-500 mb-3 uppercase tracking-widest">Alternatif (Gunakan Kamera Sistem):</p>
              <label className="px-6 py-3 bg-white/10 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/20 cursor-pointer inline-flex items-center gap-2">
                <i className="fas fa-camera"></i> Buka Kamera Sistem
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment" 
                  className="hidden" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => onCapture(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>
          </div>
        </div>
      ) : (
        <>
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-6">
            <button onClick={onCancel} className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all">
              <i className="fas fa-times"></i>
            </button>
            <button onClick={handleCapture} className="w-16 h-16 bg-white rounded-full border-4 border-slate-300 flex items-center justify-center hover:scale-105 transition-transform shadow-xl">
              <div className="w-12 h-12 bg-emerald-500 rounded-full"></div>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CameraCapture;
