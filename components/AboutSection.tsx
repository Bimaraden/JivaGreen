
import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section className="bg-[#003d33] rounded-[2.5rem] md:rounded-[4rem] p-6 sm:p-10 md:p-16 lg:p-20 text-white overflow-hidden relative border border-emerald-500/10 shadow-2xl">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-emerald-500/5 blur-[80px] md:blur-[100px] rounded-full -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-emerald-500/5 blur-[80px] md:blur-[100px] rounded-full -ml-20 -mb-20"></div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
        {/* Left Content */}
        <div className="space-y-8 md:space-y-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-tight">
            Apa itu <span className="text-emerald-400 brand-font">JivaGreen</span>?
          </h2>

          <div className="space-y-6 md:space-y-8 max-w-xl">
            <p className="text-sm sm:text-base md:text-lg lg:text-xl font-medium leading-relaxed text-emerald-50/90">
              <span className="font-black text-white">JivaGreen</span> adalah platform Marketplace Daur Ulang Kertas & Buku berbasis digital. Kami membantu Anda mengubah kertas dan buku bekas menjadi nilai ekonomi nyata sekaligus berkontribusi pada kelestarian lingkungan. Dengan sistem marketplace dua arah, kami menghubungkan individu, UMKM pengepul, dan pabrik daur ulang dalam satu ekosistem yang terintegrasi. Cukup unggah kertas atau buku bekas Anda, kami estimasikan harganya secara otomatis, dan tim kami siap menjemput langsung dari lokasi Anda. Setiap transaksi menghasilkan poin reward yang bisa ditukar diskon atau donasi pohon — karena di JivaGreen, berbuat baik untuk bumi juga menguntungkan Anda.
            </p>

            <p className="text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed text-emerald-100/70">
              Dengan teknologi Deep Learning, kami menganalisa setiap sampah yang Anda unggah untuk menentukan kadar bahan baku dan nilai ekonomisnya. Kami menghubungkan Anda dengan jaringan pengepul dan industri daur ulang secara instan.
            </p>
          </div>

          <div className="flex items-center sm:items-start gap-4 sm:gap-6 pt-4 md:pt-6">
            <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-emerald-900/50 rounded-xl sm:rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-lg">
              <i className="fas fa-recycle text-xl sm:text-2xl"></i>
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-black text-white mb-1">Recycle</h4>
              <p className="text-emerald-100/60 text-xs sm:text-sm font-medium">Mengubah limbah menjadi bahan baku baru.</p>
            </div>
          </div>
        </div>

        {/* Right Card */}
        <div className="bg-[#004d40]/40 backdrop-blur-xl rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 md:p-10 border border-emerald-500/10 shadow-2xl w-full">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <i className="fas fa-globe text-emerald-400 text-lg md:text-xl"></i>
            <h3 className="text-xl md:text-2xl font-black tracking-tight">Krisis Sampah Plastik</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400/80">Plastik di Laut</span>
                <span className="text-[10px] md:text-xs font-black text-emerald-400">80%</span>
              </div>
              <div className="h-2 bg-emerald-900/50 rounded-full overflow-hidden border border-emerald-500/10">
                <div className="h-full bg-emerald-400 rounded-full w-[80%] shadow-[0_0_15px_#10b981]"></div>
              </div>
            </div>

            <p className="text-xs sm:text-sm md:text-base leading-relaxed text-emerald-100/70 font-medium">
              Sekitar 80% sampah di lautan adalah plastik. Dengan memilah dan menjual sampah plastik Anda melalui <span className="brand-font">JivaGreen</span>, Anda membantu mencegah polusi laut.
            </p>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2 md:pt-4">
              <div className="bg-emerald-950/40 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-emerald-500/10 text-center">
                <p className="text-2xl sm:text-3xl font-black text-white mb-1">8jt</p>
                <p className="text-[7px] sm:text-[8px] font-black text-emerald-400 uppercase tracking-widest">Ton Plastik/Tahun</p>
              </div>
              <div className="bg-emerald-950/40 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-emerald-500/10 text-center">
                <p className="text-2xl sm:text-3xl font-black text-white mb-1">450</p>
                <p className="text-[7px] sm:text-[8px] font-black text-emerald-400 uppercase tracking-widest">Tahun Terurai</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Supported By / Sponsors Section */}
      <div className="mt-16 md:mt-24 pt-10 md:pt-16 border-t border-emerald-500/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          <div className="text-center md:text-left">
            <h4 className="text-lg md:text-xl font-black text-white mb-2">Didukung Oleh</h4>
            <p className="text-emerald-100/40 text-[10px] md:text-xs font-medium uppercase tracking-widest">Mitra Strategis & Sponsor Utama</p>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-6 md:gap-12 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            {/* Sponsor 1 */}
            <div className="flex items-center gap-3 group/spon">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-900/50 rounded-xl flex items-center justify-center border border-emerald-500/20 group-hover/spon:border-emerald-400/50 transition-all">
                <i className="fas fa-university text-emerald-400"></i>
              </div>
              <div className="hidden sm:block">
                <p className="text-[10px] font-black text-white/80 leading-none">MINISTRY OF</p>
                <p className="text-[11px] font-black text-emerald-400 tracking-tighter">ENVIRONMENT</p>
              </div>
            </div>

            {/* Sponsor 2 */}
            <div className="flex items-center gap-3 group/spon">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-900/50 rounded-xl flex items-center justify-center border border-emerald-500/20 group-hover/spon:border-emerald-400/50 transition-all">
                <i className="fas fa-leaf text-emerald-400"></i>
              </div>
              <div className="hidden sm:block">
                <p className="text-[10px] font-black text-white/80 leading-none">GREEN</p>
                <p className="text-[11px] font-black text-emerald-400 tracking-tighter">FOUNDATION</p>
              </div>
            </div>

            {/* Sponsor 3 */}
            <div className="flex items-center gap-3 group/spon">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-900/50 rounded-xl flex items-center justify-center border border-emerald-500/20 group-hover/spon:border-emerald-400/50 transition-all">
                <i className="fas fa-bolt text-emerald-400"></i>
              </div>
              <div className="hidden sm:block">
                <p className="text-[10px] font-black text-white/80 leading-none">ENERGY</p>
                <p className="text-[11px] font-black text-emerald-400 tracking-tighter">RENEWABLE</p>
              </div>
            </div>

            {/* Add Sponsor Placeholder */}
            <div className="w-24 h-10 md:w-32 md:h-12 border-2 border-dashed border-emerald-500/10 rounded-xl flex items-center justify-center group/add cursor-pointer hover:border-emerald-400/30 transition-all">
              <span className="text-[8px] font-black text-emerald-500/20 group-hover/add:text-emerald-400 uppercase tracking-widest">Your Logo</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
