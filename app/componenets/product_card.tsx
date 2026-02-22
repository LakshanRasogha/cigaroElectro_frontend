'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Zap, ArrowRight } from 'lucide-react';
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

  const brandName = name.split(' ')[0];
  const inStockVariants = variants.filter(v => v.stock > 0 && v.availability);
  const isOutOfStock = inStockVariants.length === 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => router.push(`/collections/${productKey}`)}
      className="relative flex flex-col h-full group cursor-pointer"
    >
      <div className={`
        relative flex-grow flex flex-col overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] transition-all duration-500
        backdrop-blur-3xl bg-white/[0.02] border border-white/5
        ${isHovered ? 'md:border-[#D4AF37]/40 md:bg-white/[0.06]' : 'shadow-xl'}
        ${isOutOfStock ? 'opacity-40' : ''}
      `}>
        
        {/* --- Image Section: Minimized for Mobile --- */}
        <div className="relative h-44 md:h-68 shrink-0 overflow-hidden bg-zinc-900/50">
          <motion.img 
            src={productImage[0]} 
            alt={name}
            animate={{ scale: isHovered ? 1.08 : 1 }}
            transition={{ duration: 1.2 }}
            className="w-full h-full object-cover grayscale md:group-hover:grayscale-0 transition-all duration-1000"
          />
          
          {/* Status Badge */}
          <div className="absolute top-3 left-3 md:top-6 md:left-6 z-20 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/80 backdrop-blur-md rounded-full border border-[#D4AF37]/30 shadow-lg">
              <Zap size={8} className="text-[#D4AF37] fill-[#D4AF37]" />
              <span className="text-[7px] md:text-[8px] font-black tracking-[0.1em] md:tracking-[0.2em] uppercase text-[#D4AF37]">
                {category}
              </span>
            </div>
          </div>

          {/* Interaction: Like Button */}
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
            className="absolute top-3 right-3 md:top-6 md:right-6 z-20 p-2 md:p-3 bg-black/40 backdrop-blur-md rounded-lg md:rounded-2xl border border-white/5"
          >
            <Heart size={12} className={isLiked ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-white/60'} />
          </motion.button>

          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
        </div>

        {/* --- Content Section --- */}
        <div className="p-4 md:p-8 flex flex-col flex-grow">
          <div className="mb-2 md:mb-6">
            {/* Hidden on Mobile to save space */}
            <span className="hidden md:block text-[10px] text-[#D4AF37] font-black uppercase tracking-[0.4em] mb-2">
              {brandName} <span className="text-white/40">Elite</span>
            </span>
            
            <h3 className="text-sm md:text-2xl font-bold text-white tracking-tight md:tracking-tighter line-clamp-1 mb-1 uppercase">
              {name}
            </h3>

            <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-1">
               <span className="text-[14px] md:text-xl font-black text-white">
                  Rs.{basePrice.toLocaleString()}
                </span>
                <span className="text-[9px] md:text-xs text-[#D4AF37]/50 font-medium line-through">
                  {(basePrice * 1.1).toLocaleString()}
                </span>
            </div>
          </div>

          {/* Desktop Hover State - Extra Details */}
          <div className="hidden md:block flex-grow">
            <AnimatePresence mode="wait">
              {isHovered ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 pt-4 border-t border-white/5"
                >
                  <p className="text-[11px] text-zinc-400 font-medium line-clamp-2 leading-relaxed italic">{tagline}</p>
                  <div className="flex items-center justify-between">
                     <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{variants.length} Bespoke Flavors</span>
                     <div className="flex -space-x-2">
                        {variants.slice(0, 3).map((v, i) => (
                           <div key={i} className="w-6 h-6 rounded-full border-2 border-black bg-zinc-900 flex items-center justify-center text-[10px]">{v.emoji}</div>
                        ))}
                     </div>
                  </div>
                  <button className="w-full py-3 bg-[#D4AF37] rounded-xl text-black font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white transition-all">
                     View Manifest <ArrowRight size={12} />
                  </button>
                </motion.div>
              ) : (
                <div className="flex items-center gap-2 pt-4 border-t border-white/5 mt-auto">
                   <div className={`w-1 h-1 rounded-full ${isOutOfStock ? 'bg-zinc-700' : 'bg-[#D4AF37]'}`} />
                   <span className="text-[8px] font-black uppercase text-zinc-600 tracking-widest">
                     {isOutOfStock ? 'Deployment Depleted' : 'Secure Allocation Ready'}
                   </span>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Bottom Bar: Variants & Quick Add */}
          <div className="flex md:hidden items-center justify-between mt-auto pt-3 border-t border-white/5">
             <div className="flex -space-x-1.5 overflow-hidden">
                {variants.slice(0, 3).map((v, i) => (
                   <span key={i} className="text-[10px] bg-zinc-900 w-5 h-5 rounded-full flex items-center justify-center border border-black">{v.emoji}</span>
                ))}
                {variants.length > 3 && (
                  <span className="text-[7px] text-zinc-500 flex items-center ml-2">+{variants.length - 3}</span>
                )}
             </div>
             <button className="p-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-lg text-[#D4AF37] active:scale-90 transition-transform">
                <ShoppingBag size={14} />
             </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;