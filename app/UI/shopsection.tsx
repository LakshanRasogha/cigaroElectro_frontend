'use client';

import React from 'react';
import ProductCard from '../componenets/product_card';

const products = [
  { name: "Gold Edition Pod X", price: "$129.00", old: "$150.00", img: "https://images.unsplash.com/photo-1620331311520-246422ff82f9?q=80&w=1000", sale: "SALE" },
  { name: "Carbon Elite 2.0", price: "$199.00", img: "https://images.unsplash.com/photo-1574333084133-5483712d704d?q=80&w=1000" },
  { name: "Midnight Vapor", price: "$65.00", old: "$85.00", img: "https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?q=80&w=1000", sale: "HOT" },
  { name: "Starter Kit Classic", price: "$45.00", img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000" }
];

const ShopSection = () => {
  return (
    <section className="py-32 bg-black overflow-hidden" id="shop">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div>
            <span className="text-[#D4AF37] font-black text-xs tracking-[0.4em] uppercase mb-4 block">
              New Arrivals
            </span>
            <h2 className="text-5xl md:text-6xl font-bold font-serif uppercase tracking-tight text-white">
              Latest <span className="text-[#D4AF37]">Selections</span>
            </h2>
            <div className="w-32 h-1 bg-[#D4AF37] mt-8"></div>
          </div>
          
          <button className="group text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-black flex items-center gap-4 hover:opacity-80 transition-all">
            View All Collection
            <span className="w-12 h-[1px] bg-[#D4AF37] group-hover:w-20 transition-all duration-500"></span>
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((prod, i) => (
            <ProductCard key={prod.name} index={i} {...prod} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopSection;