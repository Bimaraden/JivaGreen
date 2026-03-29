
import React from 'react';
import { Waste, WasteStatus, User } from '../types';

interface WasteListProps {
  wastes: Waste[];
  onBuy?: (waste: Waste) => void;
  currentUser: User | null;
}

const WasteList: React.FC<WasteListProps> = ({ wastes, onBuy, currentUser }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
      {wastes.map((waste) => {
        const isOwner = currentUser?.id === waste.sellerId;
        const isAvailable = waste.status === WasteStatus.AVAILABLE;

        return (
          <div key={waste.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all group relative flex flex-col">
            <div className="relative aspect-[3/4] overflow-hidden">
              <img 
                src={waste.imageUrl} 
                alt={waste.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[8px] md:text-[10px] font-black text-slate-800 uppercase shadow-sm border border-slate-100">
                 {waste.condition}
              </div>
            </div>
            <div className="p-3 md:p-5 flex-grow flex flex-col">
              <h3 className="font-bold text-slate-800 text-sm md:text-base line-clamp-1 mb-1">{waste.title}</h3>
              <div className="mt-1 flex flex-wrap gap-1.5 mb-3">
                <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-md text-[9px] md:text-[10px] font-bold uppercase">
                  {waste.material}
                </span>
                {waste.composition && waste.composition.length > 0 && (
                  <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[9px] md:text-[10px] font-bold uppercase">
                    Dianalisa AI
                  </span>
                )}
              </div>
              <div className="mt-auto flex justify-between items-center gap-2">
                <div>
                  <p className="text-sm md:text-lg font-black text-emerald-600">
                    Rp {waste.price.toLocaleString('id-ID')}
                  </p>
                  <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">
                    {Math.floor(waste.price / 100)} Pts
                  </p>
                </div>
                
                {onBuy && isAvailable && !isOwner && (
                  <button 
                    onClick={() => onBuy(waste)}
                    className="bg-slate-900 text-white w-8 h-8 md:w-10 md:h-10 rounded-xl hover:bg-emerald-600 transition-colors flex items-center justify-center shadow-lg active:scale-90"
                    title="Beli Sampah"
                  >
                    <i className="fas fa-shopping-cart text-xs md:text-sm"></i>
                  </button>
                )}

                {isOwner && isAvailable && (
                  <div className="bg-slate-100 text-slate-400 w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center" title="Sampah Anda">
                    <i className="fas fa-user-check text-xs"></i>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WasteList;
