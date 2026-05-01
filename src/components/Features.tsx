import React from 'react';
import { motion } from 'motion/react';

const Features: React.FC = () => {
  const features = [
    {
      title: "Scanner Sampah",
      description: "Analisa material sampah secara instan dengan teknologi terbaru.",
      icon: "fas fa-qrcode",
      color: "bg-emerald-500",
      size: "col-span-12 md:col-span-8"
    },
    {
      title: "Eco Wallet",
      description: "Kumpulkan poin dari setiap sampah yang didaur ulang.",
      icon: "fas fa-wallet",
      color: "bg-primary",
      size: "col-span-12 md:col-span-4"
    },
    {
      title: "Logistik Terjadwal",
      description: "Penjemputan sampah otomatis berdasarkan lokasi GPS Anda.",
      icon: "fas fa-truck",
      color: "bg-dark",
      size: "col-span-12 md:col-span-4"
    },
    {
      title: "Recycle Marketplace",
      description: "Beli dan jual barang hasil daur ulang berkualitas tinggi dari komunitas.",
      icon: "fas fa-shopping-bag",
      color: "bg-primary-light",
      size: "col-span-12 md:col-span-8"
    }
  ];

  return (
    <section id="features" className="py-24">
      <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-8">
        <div className="max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2 bg-white/80 border border-black/5 rounded-full text-dark/60 text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-sm"
          >
            <span className="text-primary text-xs">⚡</span>
            Ekosistem Kami
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-black text-dark tracking-tighter leading-[1.1] md:leading-[1] font-['Montserrat',sans-serif]"
          >
            Solusi Cerdas Untuk <br/> <span className="text-primary italic">Bumi Yang Baik.</span>
          </motion.h2>
        </div>
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-dark/40 text-sm md:text-lg font-medium max-w-sm lg:text-right leading-relaxed font-['Poppins',sans-serif]"
        >
          Kami menggabungkan teknologi dengan keberlanjutan untuk menciptakan dampak lingkungan yang nyata di sekitar Anda.
        </motion.p>
      </div>

      <div className="grid grid-cols-12 gap-6 md:gap-10">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -10 }}
            className={`${feature.size} group relative overflow-hidden bg-white rounded-[3.5rem] p-10 md:p-14 border border-black/5 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] transition-all duration-500`}
          >
            <div className="relative z-10 flex flex-col h-full justify-between gap-12">
              <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center text-white text-2xl shadow-xl shadow-current/30 group-hover:scale-110 transition-transform duration-500`}>
                <i className={feature.icon}></i>
              </div>
              <div>
                <h3 className="text-3xl md:text-4xl font-black text-dark mb-4 tracking-tight font-['Montserrat',sans-serif] leading-tight group-hover:text-primary transition-colors duration-500">{feature.title}</h3>
                <p className="text-dark/50 text-sm md:text-lg font-medium leading-relaxed max-w-xs font-['Poppins',sans-serif]">{feature.description}</p>
              </div>
            </div>
            
            {/* Abstract Decorative Element */}
            <div className={`absolute top-[-20%] right-[-10%] w-[60%] h-[80%] ${feature.color === 'bg-primary' ? 'bg-primary/5 group-hover:bg-primary/10' : feature.color === 'bg-emerald-500' ? 'bg-emerald-500/5 group-hover:bg-emerald-500/10' : 'bg-dark/5 group-hover:bg-dark/10'} blur-[120px] rounded-full transition-all duration-700 pointer-events-none`}></div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;
