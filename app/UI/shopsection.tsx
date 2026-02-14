'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from '../componenets/product_card';
import { ArrowRight, Zap, Sparkles, Loader2 } from 'lucide-react';
import axios from 'axios';

const ShopSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // FIXED: Corrected the URL (localhost:3000) and added dependency array
    axios.get("http://localhost:3001/api/products/get")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch products", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []); // <--- CRITICAL: Empty array ensures this only runs ONCE when the section loads

  return (
    <section className="py-32 bg-white overflow-hidden relative" id="shop">
      {/* --- Aesthetic Background Elements --- */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-50/40 to-transparent -z-0" />
      
      <div className="absolute top-20 -left-10 text-[12vw] font-black text-slate-50 select-none pointer-events-none -z-10 uppercase tracking-tighter opacity-70">
        Electric
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
                <Zap size={16} className="text-white fill-white" />
              </div>
              <span className="text-indigo-600 font-black text-[11px] tracking-[0.5em] uppercase">
                Hardware Drop 2024
              </span>
            </div>
            
            <h2 className="text-6xl md:text-8xl font-bold font-serif leading-[0.85] text-zinc-900 tracking-tighter">
              The Electric <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-cyan-500 italic">
                Collection.
              </span>
            </h2>
            
            <div className="w-24 h-2 bg-gradient-to-r from-indigo-600 to-cyan-400 mt-10 rounded-full shadow-[0_4px_12px_rgba(79,70,229,0.3)]"></div>
          </div>
          
          <div className="flex flex-col items-end gap-6">
            <p className="text-right text-zinc-400 font-medium text-sm max-w-xs mb-2">
              Explore the latest in sub-ohm precision and artisanal flavor engineering.
            </p>
            <button className="group relative px-10 py-5 bg-zinc-900 rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-zinc-200">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10 text-[11px] uppercase tracking-[0.3em] text-white font-black flex items-center gap-4">
                View All Selections
                <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </button>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Syncing Catalog...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((prod: any, i: number) => (
              <div key={prod._id || i} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-500 -z-10" />
                
                <div className="h-full rounded-[2.5rem] bg-white border border-slate-100 overflow-hidden shadow-sm group-hover:shadow-2xl group-hover:shadow-indigo-100/50 group-hover:-translate-y-3 transition-all duration-500 ease-out">
                  {prod.sale && (
                    <div className="absolute top-6 right-6 z-20 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-100 shadow-sm">
                      <span className="text-[10px] font-black tracking-widest text-indigo-600 flex items-center gap-1">
                        <Sparkles size={10} /> {prod.sale}
                      </span>
                    </div>
                  )}
                  <ProductCard index={i} {...prod} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Decorative Bottom Graphic */}
      <div className="absolute -bottom-10 right-0 w-64 h-64 bg-cyan-100/20 blur-[100px] rounded-full -z-10" />
    </section>
  );
};

export default ShopSection;