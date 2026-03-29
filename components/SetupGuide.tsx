
import React from 'react';

const SetupGuide: React.FC = () => {
  const sqlSchema = `
-- 1. RESET TABEL (Pastikan backup data jika perlu)
DROP TABLE IF EXISTS public.books CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. BUAT TABEL PROFIL
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  role TEXT DEFAULT 'USER',
  points INTEGER DEFAULT 10,  -- DIUBAH MENJADI 10
  avatar_url TEXT,
  trees_grown INTEGER DEFAULT 0,
  co2_saved FLOAT DEFAULT 0,
  water_saved FLOAT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. BUAT TABEL BUKU
CREATE TABLE public.books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  price INTEGER NOT NULL,
  condition TEXT,
  description TEXT,
  image_url TEXT,
  address TEXT,
  latitude FLOAT8,
  longitude FLOAT8,
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  seller_name TEXT,
  status TEXT DEFAULT 'AVAILABLE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. MATIKAN KEAMANAN (RLS) AGAR BISA DIAKSES APPS
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.books DISABLE ROW LEVEL SECURITY;
  `.trim();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8 animate-in slide-in-from-bottom-10 duration-700">
      <div className="bg-rose-600 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 text-9xl">
          <i className="fas fa-database"></i>
        </div>
        <h2 className="text-3xl font-black mb-4 uppercase tracking-widest">⚠️ Sinkronisasi Cloud Wajib</h2>
        <p className="text-sm opacity-90 leading-relaxed mb-6">
          Aplikasi tidak bisa menyimpan data buku karena struktur database Anda di Supabase masih versi lama. 
          <b> Tombol "Publikasi" akan terus mengarahkan ke halaman ini sampai Anda menjalankan kode SQL di bawah ini.</b>
        </p>
        
        <div className="flex flex-col gap-4">
           <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl">
              <span className="w-8 h-8 rounded-full bg-white text-rose-600 flex items-center justify-center font-black">1</span>
              <p className="text-xs font-bold">Buka Dashboard Supabase Anda (SQL Editor)</p>
           </div>
           <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl">
              <span className="w-8 h-8 rounded-full bg-white text-rose-600 flex items-center justify-center font-black">2</span>
              <p className="text-xs font-bold">Klik tombol "Salin Kode" di bawah ini</p>
           </div>
           <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl">
              <span className="w-8 h-8 rounded-full bg-white text-rose-600 flex items-center justify-center font-black">3</span>
              <p className="text-xs font-bold">Tempel (Paste) kodenya dan klik "RUN"</p>
           </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white border border-white/5 shadow-inner">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-emerald-400 flex items-center gap-3">
             <i className="fas fa-code"></i>
             SQL Schema v2.8 (Point Update)
          </h3>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(sqlSchema);
              alert("SQL Berhasil Disalin! Segera jalankan di Supabase.");
            }}
            className="bg-emerald-600 px-6 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-emerald-500 transition-all shadow-lg active:scale-95"
          >
            Salin Kode
          </button>
        </div>
        <pre className="bg-black/40 p-6 rounded-2xl overflow-x-auto text-[10px] font-mono border border-white/10 leading-loose text-emerald-300 h-64">
          {sqlSchema}
        </pre>
      </div>

      <div className="text-center">
         <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Setelah Running SQL, Segera Refresh Browser Anda</p>
      </div>
    </div>
  );
};

export default SetupGuide;
