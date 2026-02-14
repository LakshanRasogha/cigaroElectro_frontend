"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingBag, Star, Zap } from 'lucide-react';

const ProductDetailView = () => {
  const [activeImage, setActiveImage] = useState(0);

  // Mock Data for the Main Product
  const product = {
    name: "Carbon X-2 Elite",
    price: "125.00",
    rating: 4.9,
    description: "Experience the pinnacle of sub-ohm engineering. The Carbon X-2 features a localized heating matrix and 75W of precision-tuned power.",
    specs: ["75W Max Output", "3000mAh Battery", "OLED Display"],
    images: [
      "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=800",
      "https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=800",
    ]
  };

  // Mock Data for Recommendations
  const recommendations = [
    { name: "Neon Pod Pro", price: "45.00", img: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=400" },
    { name: "Pulse Liquid Gold", price: "22.00", img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=400" },
    { name: "Arctic Mist", price: "18.00", img: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=400" },
    { name: "Onyx Mod", price: "89.00", img: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=400" },
  ];

  return (
    <div className="bg-white min-h-screen pt-24 pb-12 overflow-x-hidden">
      
      {/* --- MAIN PRODUCT CARD SLIDER --- */}
      <section className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center mb-32">
        
        {/* Left: Interactive Image Slider */}
        <div className="relative group">
          <motion.div 
            key={activeImage}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-square rounded-[3rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-2xl relative z-10"
          >
            <img src={product.images[activeImage]} className="w-full h-full object-cover" alt="product" />
            
            {/* Neon Aura behind image */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-transparent pointer-events-none" />
          </motion.div>

          {/* Slider Controls */}
          <div className="flex gap-4 mt-6">
            {product.images.map((img, i) => (
              <button 
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-purple-600 scale-110 shadow-lg' : 'border-transparent opacity-50'}`}
              >
                <img src={img} className="w-full h-full object-cover" alt="thumb" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-purple-600 font-bold text-sm tracking-widest uppercase">
              <Zap size={16} fill="currentColor" /> Elite Release
            </div>
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter">{product.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex text-orange-400"><Star size={16} fill="currentColor" /> <Star size={16} fill="currentColor" /> <Star size={16} fill="currentColor" /> <Star size={16} fill="currentColor" /> <Star size={16} fill="currentColor" /></div>
              <span className="text-slate-400 font-bold text-sm">{product.rating} Rating</span>
            </div>
          </div>

          <p className="text-xl text-slate-500 leading-relaxed font-medium">
            {product.description}
          </p>

          <div className="flex flex-wrap gap-3">
            {product.specs.map(spec => (
              <span key={spec} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-xs font-black text-slate-600 uppercase tracking-widest">
                {spec}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-8 pt-6 border-t border-slate-100">
            <span className="text-4xl font-black text-slate-900">${product.price}</span>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-200 flex items-center justify-center gap-3 hover:bg-purple-600 transition-colors"
            >
              <ShoppingBag size={20} /> Add to Collection
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* --- RECOMMENDED SLIDER --- */}
      <section className="bg-slate-50/50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Recommended for You</h2>
              <p className="text-slate-500 font-medium">Based on your taste in the Electric Collection</p>
            </div>
            <div className="flex gap-2">
              <button className="p-4 rounded-full border border-slate-200 hover:bg-white hover:shadow-lg transition-all"><ChevronLeft /></button>
              <button className="p-4 rounded-full border border-slate-200 hover:bg-white hover:shadow-lg transition-all"><ChevronRight /></button>
            </div>
          </div>

          {/* Draggable Slider Row */}
          <motion.div 
            drag="x"
            dragConstraints={{ right: 0, left: -400 }}
            className="flex gap-8 cursor-grab active:cursor-grabbing"
          >
            {recommendations.map((item, idx) => (
              <motion.div 
                key={idx}
                className="min-w-[300px] group"
              >
                <div className="h-[350px] rounded-[2rem] overflow-hidden bg-white border border-slate-100 mb-4 shadow-sm group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-500 relative">
                  <img src={item.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={item.name} />
                  <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlusIcon size={20} className="text-purple-600" />
                  </div>
                </div>
                <h4 className="font-black text-slate-900 uppercase tracking-tight">{item.name}</h4>
                <p className="text-purple-600 font-black text-sm">${item.price}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

const PlusIcon = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export default ProductDetailView;