
import React from 'react';
import { Waste, WasteStatus, User } from '../src/types';
import { motion } from 'motion/react';

interface WasteListProps {
  wastes: Waste[];
  onBuy?: (waste: Waste) => void;
  currentUser: User | null;
}

const WasteList: React.FC<WasteListProps> = ({ wastes, onBuy, currentUser }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
      {wastes.map((waste, idx) => {
        const isOwner = currentUser?.id === waste.sellerId;
        const isAvailable = waste.status === WasteStatus.AVAILABLE;

        return (
          <motion.div 
            key={waste.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="group flex flex-col"
          >
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-black/5 bg-soft-white mb-6">
              <img 
                src={waste.imageUrl} 
                alt={waste.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
              
              {/* Status Badge */}
              <div className="absolute top-5 left-5">
                 <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black text-dark uppercase tracking-widest shadow-xl border border-white/20">
                   {waste.condition}
                 </span>
              </div>

              {waste.composition && waste.composition.length > 0 && (
                <div className="absolute bottom-5 left-5 right-5 blur-none group-hover:translate-y-0 translate-y-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
                   <div className="bg-primary/95 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/20 shadow-2xl flex items-center justify-center gap-3">
                      <i className="fas fa-microchip text-[12px] text-white"></i>
                      <span className="text-[9px] font-black text-white uppercase tracking-[0.2em] font-['Poppins',sans-serif]">AI Verified Composition</span>
                   </div>
                </div>
              )}
            </div>

            <div className="px-3">
              <div className="mb-4">
                <p className="text-[9px] font-black text-dark/20 uppercase tracking-[0.4em] mb-2 font-['Poppins',sans-serif]">{waste.material}</p>
                <h3 className="font-black text-dark text-xl leading-[1.1] line-clamp-2 tracking-tighter font-['Montserrat',sans-serif]">{waste.title}</h3>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-primary tracking-tighter font-['Montserrat',sans-serif]">Rp {waste.price.toLocaleString('id-ID')}</span>
                  <p className="text-[10px] font-black text-dark/10 uppercase tracking-[0.1em] font-['Poppins',sans-serif]">{Math.floor(waste.price / 100)} Eco Credits</p>
                </div>

                {onBuy && isAvailable && !isOwner && (
                  <button 
                    onClick={() => onBuy(waste)}
                    className="w-14 h-14 bg-dark text-white rounded-3xl hover:bg-primary transition-all shadow-xl shadow-black/5 flex items-center justify-center active:scale-90"
                  >
                    <i className="fas fa-shopping-cart text-sm"></i>
                  </button>
                )}

                {isOwner && isAvailable && (
                  <div className="w-14 h-14 bg-soft-white text-dark/20 rounded-3xl border border-black/5 flex items-center justify-center" title="Your Listing">
                    <i className="fas fa-user-circle text-lg"></i>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default WasteList;
