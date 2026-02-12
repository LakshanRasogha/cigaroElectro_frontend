'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

interface ProductProps {
  name: string;
  price: string;
  old?: string;
  img: string;
  sale?: string;
  index: number;
}

const ProductCard = ({ name, price, old, img, sale, index }: ProductProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-zinc-900/10 border border-white/5 p-3 rounded-2xl hover:bg-zinc-900/40 hover:border-[#D4AF37]/30 transition-all duration-500"
    >
      {/* Badge */}
      {sale && (
        <div className="absolute top-6 left-6 z-20">
          <span className={`${
            sale === 'SALE' ? 'bg-[#D4AF37] text-black' : 'bg-white text-black'
          } text-[10px] font-black px-3 py-1 rounded-full tracking-tighter shadow-xl`}>
            {sale}
          </span>
        </div>
      )}

      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-zinc-800">
        <img 
          src={img} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out grayscale-[20%] group-hover:grayscale-0" 
        />
        
        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
           <button className="w-full py-4 bg-[#D4AF37] text-black translate-y-4 group-hover:translate-y-0 transition-transform duration-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg flex items-center justify-center gap-2">
            <ShoppingBag size={14} />
            Quick Add
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="p-6">
        <h3 className="font-bold text-lg mb-2 font-serif text-white group-hover:text-[#D4AF37] transition-colors">{name}</h3>
        <div className="flex items-center gap-3">
          <span className="text-[#D4AF37] font-black tracking-widest text-sm">{price}</span>
          {old && (
            <span className="text-gray-600 line-through text-xs font-light">{old}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;