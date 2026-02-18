'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Heart, ShoppingBag, ChevronRight, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Variant {
  flavor: string;
  emoji: string;
  stock: number;
  availability: boolean;
}

interface ProductProps {
  productKey: string;
  name: string;
  tagline: string;
  basePrice: number;
  productImage: string[];
  variants: Variant[];
  category: string;
  index?: number;
}

const ProductCard = ({ 
  productKey, 
  name, 
  tagline, 
  basePrice, 
  productImage, 
  variants = [], 
  category,
  index = 0 
}: ProductProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const router = useRouter();

  const puffDisplay = name.split(' ').filter(word => word.includes(',') || !isNaN(parseInt(word))).join(' ');
  const brandName = name.split(' ')[0];

  const inStockVariants = variants.filter(v => v.stock > 0 && v.availability);
  const isOutOfStock = inStockVariants.length === 0;

  const handleNavigate = () => {
    router.push(`/collections/${productKey}`);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleNavigate}
      className="relative flex flex-col h-full min-h-[460px] group cursor-pointer"
    >
      <div className={`
        relative flex-grow flex flex-col overflow-hidden rounded-[3rem] transition-all duration-500
        backdrop-blur-2xl bg-white/[0.03] border
        ${isHovered ? 'border-white/20 bg-white/[0.08] shadow-[0_30px_60px_rgba(0,0,0,0.4)]' : 'border-white/10 shadow-xl'}
        ${isOutOfStock ? 'opacity-60' : ''}
      `}>
        
        {/* --- Image Section --- */}
        <div className="relative h-64 shrink-0 overflow-hidden bg-zinc-900/50">
          <motion.img 
            src={productImage[0]} 
            alt={name}
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full object-cover"
          />
          
          {/* Badge Overlays */}
          <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10 shadow-lg">
              <Zap size={10} className="text-indigo-400 fill-indigo-400" />
              <span className="text-[8px] font-black tracking-[0.2em] uppercase text-zinc-100">{category}</span>
            </div>
            {isOutOfStock && (
              <div className="px-3 py-1.5 bg-rose-500/80 backdrop-blur-md rounded-full text-white border border-rose-400/50 shadow-lg">
                <span className="text-[8px] font-black tracking-widest uppercase">Sold Out</span>
              </div>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
            className="absolute top-6 right-6 z-20 p-3 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition-colors shadow-lg"
          >
            <Heart size={16} className={isLiked ? 'fill-rose-500 text-rose-500' : 'text-zinc-400'} />
          </motion.button>

          {/* Bottom Fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
        </div>

        {/* --- Content Section --- */}
        <div className="p-8 flex flex-col flex-grow">
          <div className="mb-6">
            <span className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.3em] mb-2 block">
              {brandName} Elite
            </span>
            <h3 className="text-2xl font-bold text-white tracking-tighter mb-2">
              {name}
            </h3>
            <div className="flex justify-between items-center mt-4">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{puffDisplay}</p>
              <span className="text-xl font-black text-white tracking-tight">
                Rs.{basePrice.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex-grow flex flex-col justify-end">
            <AnimatePresence mode="wait">
              {isHovered ? (
                <motion.div
                  key="hover"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="space-y-6"
                >
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-[11px] text-zinc-400 font-medium line-clamp-2 leading-relaxed italic">
                      "{tagline}"
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                      {variants.length} Artisanal Flavors
                    </span>
                    <div className="flex -space-x-2">
                      {variants.slice(0, 4).map((v, i) => (
                        <div 
                          key={i} 
                          title={v.flavor}
                          className="w-7 h-7 rounded-full border-2 border-zinc-950 bg-zinc-800 shadow-xl flex items-center justify-center text-[10px]"
                        >
                          {v.emoji}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-3">
                    <button 
                      onClick={handleNavigate}
                      className="col-span-4 py-4 bg-white rounded-2xl text-black font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-indigo-500 hover:text-white transition-all shadow-xl shadow-white/5"
                    >
                      <Eye size={14} /> Quick View
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); }}
                      className="col-span-1 py-4 bg-white/5 rounded-2xl text-white flex items-center justify-center border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
                    >
                      <ShoppingBag size={14} />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="static"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-between pt-6 border-t border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full shadow-[0_0_8px] ${isOutOfStock ? 'bg-rose-500 shadow-rose-500/50' : 'bg-emerald-500 shadow-emerald-500/50'}`} />
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                      {isOutOfStock ? 'Depleted' : 'In Stock'}
                    </span>
                  </div>
                  <ChevronRight size={14} className="text-zinc-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;