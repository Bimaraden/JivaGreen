
import React from 'react';
import { motion } from 'motion/react';
import { Leaf, Globe, Zap, Recycle, BarChart3 } from 'lucide-react';

const About: React.FC = () => {
  const missionItems = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Literasi Digital",
      desc: "Menghubungkan jutaan pembaca dengan buku berkualitas melalui sistem marketplace sirkular."
    },
    {
      icon: <Recycle className="w-8 h-8" />,
      title: "Konservasi Alam",
      desc: "Menyelamatkan hutan dengan memaksimalkan penggunaan kertas melalui daur ulang dan toko buku bekas."
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Ekonomi Hijau",
      desc: "Memberikan nilai ekonomi pada setiap tumpukan kertas dan buku lama yang Anda miliki."
    }
  ];

  return (
    <div className="space-y-24 md:space-y-32 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 blur-[150px] rounded-full pointer-events-none -z-10 animate-pulse"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.3em]">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
            Siapa Jivagreen?
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-dark tracking-tighter italic leading-none">
            Memberi <span className="text-primary">Napas Baru</span> Untuk Setiap Lembar.
          </h1>
          <p className="text-lg md:text-xl text-dark/40 font-medium max-w-2xl mx-auto leading-relaxed">
            Jivagreen adalah platform inovatif yang mendigitalisasi pengelolaan limbah kertas dan sirkulasi buku bekas. Kami percaya pengetahuan tidak boleh berhenti di rak yang berdebu.
          </p>
        </motion.div>
      </section>

      {/* Mission Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-0">
        {missionItems.map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="bg-white p-10 md:p-14 rounded-[3rem] border border-black/5 shadow-sm hover:shadow-2xl hover:scale-[1.02] transition-all group"
          >
            <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:rotate-12 transition-transform">
              {item.icon}
            </div>
            <h3 className="text-2xl font-black text-dark mb-4 tracking-tight">{item.title}</h3>
            <p className="text-dark/40 font-medium leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Statistics / Impact Section */}
      <section className="bg-dark rounded-[4rem] p-8 md:p-20 overflow-hidden relative group border border-white/5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-[2px] bg-primary"></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Statistik Urgensi</span>
                </div>
                <h3 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-tight">
                  Sirkulasi <br />
                  <span className="text-white/40">Selamatkan Pohon.</span>
                </h3>
              </div>
              <p className="text-lg leading-relaxed text-white/50 font-medium">
                Satu buku yang Anda beli atau jual di Jivagreen berkontribusi pada penghematan ribuan liter air dan pelestarian pohon yang seharusnya ditebang untuk kertas baru.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/5 px-8 py-6 rounded-3xl border border-white/5">
                  <p className="text-3xl font-black text-white">15+</p>
                  <p className="text-[10px] font-bold uppercase text-white/30 tracking-widest mt-1">Liter Air / Lembar</p>
                </div>
                <div className="bg-white/5 px-8 py-6 rounded-3xl border border-white/5">
                  <p className="text-3xl font-black text-white">24</p>
                  <p className="text-[10px] font-bold uppercase text-white/30 tracking-widest mt-1">Pohon / Ton Kertas</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 p-8 md:p-12 rounded-[3.5rem] border border-white/5 backdrop-blur-3xl space-y-8">
              <div className="space-y-6">
                {[
                  { title: "Literasi Hijau", desc: "Meningkatkan akses bacaan tanpa menambah beban lingkungan.", icon: <Globe className="w-5 h-5 text-primary" /> },
                  { title: "Verifikasi Kualitas", desc: "Sistem kami memastikan setiap buku layak edar dan asli.", icon: <Zap className="w-5 h-5 text-primary" /> },
                  { title: "Zero Carbon", desc: "Mendorong perputaran ekonomi lokal untuk menekan emisi logistik.", icon: <Leaf className="w-5 h-5 text-primary" /> },
                  { title: "Fair Pricing", desc: "Algoritma harga transparan berdasarkan kondisi buku Anda.", icon: <BarChart3 className="w-5 h-5 text-primary" /> }
                ].map((v, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      {v.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-black text-lg tracking-tight">{v.title}</h4>
                      <p className="text-white/30 text-sm font-medium mt-1 leading-relaxed">{v.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
};

export default About;
