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
  productKey: string; // Renamed from 'key' to avoid React conflict
  name: string;
  tagline: string;
  basePrice: number;
  productImage: string[];
  variants: Variant[];
  category: string;
  index?: number;
}

const ProductCard = ({ 
  productKey, // Passed explicitly from the parent
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

  // Extract total puffs from name
  const puffDisplay = name.split(' ').filter(word => word.includes(',') || !isNaN(parseInt(word))).join(' ');
  const brandName = name.split(' ')[0];

  const inStockVariants = variants.filter(v => v.stock > 0 && v.availability);
  const isOutOfStock = inStockVariants.length === 0;

  // Navigation handler
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
      className="relative flex flex-col h-full min-h-[420px] group cursor-pointer"
    >
      <div className={`
        relative flex-grow flex flex-col overflow-hidden rounded-[2.5rem] bg-white border transition-all duration-500
        ${isHovered ? 'border-indigo-200 shadow-[0_30px_60px_rgba(99,102,241,0.12)]' : 'border-slate-100 shadow-sm'}
        ${isOutOfStock ? 'opacity-80' : ''}
      `}>
        
        {/* --- Image Section --- */}
        <div className="relative h-60 shrink-0 overflow-hidden bg-slate-50">
          <motion.img 
            src={productImage[0]} 
            alt={name}
            animate={{ scale: isHovered ? 1.08 : 1 }}
            transition={{ duration: 0.6 }}
            className="w-full h-full object-cover"
          />
          
          <div className="absolute top-5 left-5 z-20 flex flex-col gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full border border-slate-100 shadow-sm">
              <Zap size={10} className="text-indigo-600 fill-indigo-600" />
              <span className="text-[8px] font-black tracking-widest uppercase text-slate-700">{category}</span>
            </div>
            {isOutOfStock && (
              <div className="px-3 py-1 bg-rose-500 rounded-full text-white">
                <span className="text-[8px] font-black tracking-widest uppercase">Sold Out</span>
              </div>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
            className="absolute top-5 right-5 z-20 p-2.5 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-100 shadow-sm"
          >
            <Heart size={14} className={isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'} />
          </motion.button>

          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-40" />
        </div>

        {/* --- Content Section --- */}
        <div className="p-6 flex flex-col flex-grow">
          <div className="mb-4">
            <span className="text-[9px] text-indigo-500 font-black uppercase tracking-[0.2em] mb-1 block">
              {brandName} Series
            </span>
            <h3 className="text-xl font-black text-zinc-900 tracking-tighter mb-1">
              {name}
            </h3>
            <div className="flex justify-between items-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{puffDisplay}</p>
              <span className="text-lg font-black text-zinc-900 tracking-tight">
                Rs.{basePrice.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex-grow flex flex-col justify-end">
            <AnimatePresence mode="wait">
              {isHovered ? (
                <motion.div
                  key="hover"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="space-y-4"
                >
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <p className="text-[10px] text-slate-500 font-medium line-clamp-2 leading-relaxed italic">
                      "{tagline}"
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      {variants.length} Flavors
                    </span>
                    <div className="flex -space-x-1.5">
                      {variants.slice(0, 4).map((v, i) => (
                        <div 
                          key={i} 
                          title={v.flavor}
                          className="w-6 h-6 rounded-full border-2 border-white bg-white shadow-sm flex items-center justify-center text-[10px]"
                        >
                          {v.emoji}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    {/* Updated to use dynamic routing */}
                    <button 
                      onClick={handleNavigate}
                      className="col-span-4 py-4 bg-zinc-900 rounded-2xl text-white font-black text-[9px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all"
                    >
                      <Eye size={14} /> Quick View
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); /* Add cart logic */ }}
                      className="col-span-1 py-4 bg-indigo-50 rounded-2xl text-indigo-600 flex items-center justify-center border border-indigo-100 hover:bg-indigo-100 transition-colors"
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
                  className="flex items-center justify-between pt-4 border-t border-slate-50"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isOutOfStock ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                      {isOutOfStock ? 'Out of Stock' : 'Ready to Ship'}
                    </span>
                  </div>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
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