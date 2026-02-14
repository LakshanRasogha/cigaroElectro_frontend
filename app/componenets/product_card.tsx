'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Sparkles, Heart, ShoppingBag, ChevronRight } from 'lucide-react';

const ProductCard = ({ 
  brand = "VOZOL VISTA",
  puffs = "20,000",
  description = "Smooth • Long-lasting • Premium taste",
  price = 8900,
  delivery = 400,
  isPopular = false,
  isNew = false,
  image = "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?q=80&w=2070&auto=format&fit=crop",
  variants = [],
  onClick,
  index = 0 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const flavorCount = variants.length || 12;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      // Added h-full and a wrapper to maintain grid consistency
      className="relative group h-full flex flex-col"
    >
      <div className="relative flex-grow overflow-hidden rounded-[2rem] bg-white border border-slate-100 transition-all duration-500 shadow-sm group-hover:shadow-[0_20px_50px_rgba(99,102,241,0.12)] flex flex-col">
        
        {/* --- Image Section --- */}
        <div className="relative h-52 shrink-0 overflow-hidden bg-slate-50">
          <motion.img 
            src={image} 
            alt={brand}
            animate={{ scale: isHovered ? 1.05 : 1 }}
            className="w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5">
            {isPopular && (
              <div className="px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-lg border border-indigo-100 shadow-sm">
                <span className="text-[8px] font-black tracking-widest text-indigo-600 uppercase">Best</span>
              </div>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
            className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur-md rounded-xl border border-slate-200"
          >
            <Heart size={14} className={isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'} />
          </motion.button>
        </div>

        {/* --- Content Section --- */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-[9px] text-indigo-500 font-black uppercase tracking-widest">{brand}</span>
              <h3 className="text-xl font-black text-zinc-900 leading-tight">{puffs} Puffs</h3>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-zinc-900">Rs. {price.toLocaleString()}</span>
              <span className="text-[9px] text-slate-400 block uppercase font-bold">Base Price</span>
            </div>
          </div>

          {/* This container pushes the buttons to the bottom regardless of expansion */}
          <div className="flex-grow">
            <AnimatePresence initial={false}>
              {isHovered && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "circOut" }}
                  className="overflow-hidden"
                >
                  <p className="text-[11px] text-slate-500 mb-4 line-clamp-1">{description}</p>
                  
                  {/* Variant Quick View */}
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl mb-4 border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Available Flavors</span>
                    <div className="flex -space-x-2">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-indigo-200" />
                      ))}
                      <div className="w-5 h-5 rounded-full border-2 border-white bg-zinc-800 flex items-center justify-center">
                        <span className="text-[7px] text-white font-bold">+{flavorCount - 4}</span>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="grid grid-cols-5 gap-2 pb-2">
                    <button 
                      onClick={onClick}
                      className="col-span-4 py-3 bg-zinc-900 rounded-xl text-white font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-600 transition-colors"
                    >
                      <Eye size={12} /> View Variants
                    </button>
                    <button className="col-span-1 py-3 bg-indigo-50 rounded-xl text-indigo-600 flex items-center justify-center border border-indigo-100">
                      <ShoppingBag size={12} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Static Footer (Explore Options) always stays at the very bottom */}
          {!isHovered && (
            <div className="mt-auto pt-2">
              <motion.div 
                layoutId="indicator"
                className="flex items-center gap-1 text-[9px] font-bold text-indigo-500 uppercase tracking-widest"
              >
                <span>Explore Options</span>
                <ChevronRight size={10} />
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;