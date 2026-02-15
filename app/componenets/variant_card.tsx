"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, CheckCircle2, XCircle, Check } from 'lucide-react';

interface VariantCardProps {
  variant: any;
  index: number;
  isActive: boolean;
  onSelect: () => void;
  onAddToCart: (variant: any) => void;
}

const VariantCard = ({ variant, index, isActive, onSelect, onAddToCart }: VariantCardProps) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents triggering onSelect when clicking the button
    
    // Safety check for stock and availability
    if (variant.availability && variant.stock > 0) {
      onAddToCart(variant);
      
      // Feedback Animation Logic
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  return (
    <>
    <motion.div
      whileHover={{ y: -10 }}
      onClick={onSelect}
      className={`relative p-8 rounded-[2.5rem] border transition-all duration-500 cursor-pointer overflow-hidden group 
        ${isActive 
          ? 'bg-indigo-50 border-indigo-200 shadow-xl' 
          : 'bg-white border-slate-100 hover:border-indigo-100 shadow-sm'}`}
    >
      <div className="relative z-10 flex flex-col h-full justify-between">
        {/* Header: Emoji & Status Badge */}
        <div className="flex justify-between items-start mb-10">
          <div className={`w-16 h-16 rounded-2xl shadow-inner flex items-center justify-center text-4xl transition-transform duration-500 group-hover:scale-110 
            ${isActive ? 'bg-white' : 'bg-slate-50'}`}>
            {variant.emoji}
          </div>
          
          {variant.availability && variant.stock > 0 ? (
            <div className="flex items-center gap-1.5 text-emerald-500 font-black text-[9px] uppercase tracking-widest bg-emerald-50/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-emerald-100">
              <CheckCircle2 size={12} /> Live Stock
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-rose-500 font-black text-[9px] uppercase tracking-widest bg-rose-50/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-rose-100">
              <XCircle size={12} /> Sold Out
            </div>
          )}
        </div>

        {/* Content: Flavor Info */}
        <div className="mb-8">
          <p className="text-indigo-500 font-mono text-[10px] font-black uppercase tracking-widest mb-2">
            Edition {index + 1}
          </p>
          <h3 className="text-3xl font-black text-slate-900 mb-2 leading-tight">
            {variant.flavor}
          </h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {variant.stock} Units remaining
          </p>
        </div>

        {/* Action: Add to Cart Button */}
        <motion.button
          disabled={!variant.availability || variant.stock <= 0 || isAdded}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddClick}
          className={`w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 transition-all duration-300
            ${isAdded 
              ? 'bg-emerald-500 text-white' 
              : variant.availability && variant.stock > 0
                ? 'bg-slate-900 text-white hover:bg-indigo-600 shadow-lg shadow-slate-200 hover:shadow-indigo-200' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
        >
          {isAdded ? (
            <>
              <Check size={16} strokeWidth={3} />
              Added To Bag
            </>
          ) : (
            <>
              <ShoppingBag size={16} />
              {variant.availability && variant.stock > 0 ? 'Add To Bag' : 'Out of Stock'}
            </>
          )}
        </motion.button>
      </div>

      {/* Decorative Flavor Watermark */}
      <div className="absolute -bottom-4 -right-4 text-7xl font-black text-slate-900/5 uppercase pointer-events-none group-hover:scale-110 transition-transform duration-700 select-none">
        {variant.flavor?.split(' ')[0]}
      </div>

      {/* Active Glow Effect */}
      {isActive && (
        <motion.div 
          layoutId="activeGlow"
          className="absolute inset-0 border-2 border-indigo-400/30 rounded-[2.5rem] pointer-events-none" 
        />
      )}
    </motion.div>
    </>
  );
};

export default VariantCard;