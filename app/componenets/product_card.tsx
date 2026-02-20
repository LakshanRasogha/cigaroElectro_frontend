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
        relative flex-grow flex flex-col overflow-hidden rounded-[2.5rem] transition-all duration-500
        backdrop-blur-3xl bg-white/[0.02] border
        ${isHovered ? 'border-[#D4AF37]/40 bg-white/[0.06] shadow-[0_30px_60px_rgba(0,0,0,0.6)]' : 'border-white/5 shadow-xl'}
        ${isOutOfStock ? 'opacity-50' : ''}
      `}>
        
        {/* --- Image Section --- */}
        <div className="relative h-68 shrink-0 overflow-hidden bg-black/40">
          <motion.img 
            src={productImage[0]} 
            alt={name}
            animate={{ scale: isHovered ? 1.08 : 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
          />
          
          {/* Badge Overlays */}
          <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/80 backdrop-blur-md rounded-full border border-[#D4AF37]/30 shadow-lg">
              <Zap size={10} className="text-[#D4AF37] fill-[#D4AF37]" />
              <span className="text-[8px] font-black tracking-[0.2em] uppercase text-[#D4AF37]">{category}</span>
            </div>
            {isOutOfStock && (
              <div className="px-3 py-1.5 bg-zinc-900/90 backdrop-blur-md rounded-full text-zinc-400 border border-white/5 shadow-lg">
                <span className="text-[8px] font-black tracking-widest uppercase">Allocation Depleted</span>
              </div>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
            className="absolute top-6 right-6 z-20 p-3 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 hover:border-[#D4AF37]/50 transition-colors shadow-lg"
          >
            <Heart size={16} className={isLiked ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-zinc-500'} />
          </motion.button>

          {/* Luxury Fade Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
        </div>

        {/* --- Content Section --- */}
        <div className="p-8 flex flex-col flex-grow">
          <div className="mb-6">
            <span className="text-[10px] text-[#D4AF37] font-black uppercase tracking-[0.4em] mb-2 block">
              {brandName} <span className="text-white/40">Elite</span>
            </span>
            <h3 className="text-2xl font-bold text-white tracking-tighter mb-2 group-hover:text-[#D4AF37] transition-colors">
              {name}
            </h3>
            <div className="flex justify-between items-center mt-4">
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{puffDisplay}</p>
              <div className="flex flex-col items-end">
                <span className="text-xs text-[#D4AF37]/50 font-medium tracking-tighter line-through">
                  {(basePrice * 1.1).toLocaleString()}
                </span>
                <span className="text-xl font-black text-white tracking-tight">
                  Rs.{basePrice.toLocaleString()}
                </span>
              </div>
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
                  <div className="bg-[#D4AF37]/5 p-4 rounded-2xl border border-[#D4AF37]/10">
                    <p className="text-[11px] text-zinc-400 font-medium line-clamp-2 leading-relaxed">
                      {tagline}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                      {variants.length} Bespoke Editions
                    </span>
                    <div className="flex -space-x-2">
                      {variants.slice(0, 4).map((v, i) => (
                        <div 
                          key={i} 
                          title={v.flavor}
                          className="w-7 h-7 rounded-full border-2 border-black bg-zinc-900 shadow-xl flex items-center justify-center text-[10px] grayscale hover:grayscale-0 transition-all cursor-crosshair"
                        >
                          {v.emoji}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-3">
                    <button 
                      onClick={handleNavigate}
                      className="col-span-4 py-4 bg-[#D4AF37] rounded-xl text-black font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-white transition-all shadow-xl shadow-[#D4AF37]/10"
                    >
                      <Eye size={14} /> View Details
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); }}
                      className="col-span-1 py-4 bg-white/5 rounded-xl text-white flex items-center justify-center border border-white/10 hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/40 transition-all"
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
                    <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px] ${isOutOfStock ? 'bg-zinc-700' : 'bg-[#D4AF37] shadow-[#D4AF37]/50'}`} />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">
                      {isOutOfStock ? 'Depleted' : 'Available for Order'}
                    </span>
                  </div>
                  <ChevronRight size={14} className="text-zinc-700 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all" />
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