"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Zap, Loader2, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/app/componenets/navbar';
const ProductDetailView = () => {
  const params = useParams();
  const productKey = params.id
  console.log(productKey); // Catches the 'key' passed from the product page

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeVariantIdx, setActiveVariantIdx] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/products/getOne/${productKey}`); // Adjust endpoint as needed
        const allProducts = response.data;
        
        // Find specific product by the 'key' field from your JSON
        const foundProduct = allProducts.find((p: any) => p.key === productKey);
        
        if (foundProduct) {
          setProduct(foundProduct);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [productKey]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
      <span className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Syncing Warehouse...</span>
    </div>
  );

  if (!product) return <div className="min-h-screen flex items-center justify-center">Product '{productKey}' not found.</div>;

  const currentVariant = product.variants?.[activeVariantIdx];
  const gallery = [...(product.productImage || []), ...(currentVariant?.variantImage || [])];

  return (
    <div className="bg-white min-h-screen pt-32 pb-12">
      <Navbar />
      
      <section className="max-w-7xl mx-auto px-6">
        {/* --- HERO SPLIT --- */}
        <div className="grid lg:grid-cols-2 gap-20 items-start mb-32">
          
          {/* Left: Dynamic Image Display */}
          <div className="relative sticky top-32">
            <AnimatePresence mode="wait">
              <motion.div 
                key={`${activeVariantIdx}`}
                initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-2xl relative"
              >
                <img 
                  src={gallery[0]} 
                  className="w-full h-full object-cover" 
                  alt={product.name} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
              </motion.div>
            </AnimatePresence>
            
            {/* Tagline Floating Badge */}
            <motion.div 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="absolute -bottom-6 -right-6 bg-white p-8 rounded-[2.5rem] shadow-2xl max-w-xs border border-slate-50 hidden md:block"
            >
                <p className="text-sm font-bold text-slate-900 leading-snug italic">"{product.tagline}"</p>
            </motion.div>
          </div>

          {/* Right: Info & Pricing */}
          <div className="space-y-12">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
                <Zap size={14} fill="currentColor" /> {product.category} Series
              </span>
              <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                {product.name}
              </h1>
              <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
                {product.description}
              </p>
            </div>

            <div className="p-10 rounded-[3rem] bg-slate-900 text-white shadow-2xl shadow-indigo-100 relative overflow-hidden group">
               <div className="relative z-10 flex justify-between items-center">
                  <div>
                    <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-1">Base Price</p>
                    <span className="text-5xl font-black tracking-tighter">Rs. {product.basePrice?.toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Delivery Fee</p>
                    <p className="font-bold text-xl">Rs. {product.deliveryFee}</p>
                  </div>
               </div>
               
               {/* Animated Background Glow */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full group-hover:bg-indigo-500/20 transition-colors duration-700" />
            </div>

            <motion.button 
              disabled={!currentVariant?.availability}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-sm flex items-center justify-center gap-4 transition-all shadow-2xl shadow-indigo-100 ${currentVariant?.availability ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
            >
              <ShoppingBag size={20} /> 
              {currentVariant?.availability ? 'Add to Collection' : 'Out of Stock'}
            </motion.button>
          </div>
        </div>

        {/* --- VARIANT CARDS SECTION --- */}
        <div className="space-y-12">
          <div className="flex items-end justify-between border-b border-slate-100 pb-8">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Edition Variants<span className="text-indigo-600">.</span></h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Select Flavor Profile</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {product.variants?.map((v: any, idx: number) => (
              <motion.div
                key={v.vKey}
                whileHover={{ y: -10 }}
                onClick={() => setActiveVariantIdx(idx)}
                className={`relative p-8 rounded-[2.5rem] border transition-all duration-500 cursor-pointer overflow-hidden group ${activeVariantIdx === idx ? 'bg-indigo-50 border-indigo-200 shadow-xl' : 'bg-white border-slate-100 hover:border-indigo-100 shadow-sm'}`}
              >
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="flex justify-between items-start mb-12">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-inner flex items-center justify-center text-4xl">
                      {v.emoji}
                    </div>
                    {v.availability ? (
                      <div className="flex items-center gap-1.5 text-emerald-500 font-black text-[9px] uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                        <CheckCircle2 size={12} /> Live Stock
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-rose-500 font-black text-[9px] uppercase tracking-widest bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100">
                        <XCircle size={12} /> Sold Out
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-indigo-500 font-mono text-[10px] font-black uppercase tracking-widest mb-2">Edition {idx + 1}</p>
                    <h3 className="text-3xl font-black text-slate-900 mb-4">{v.flavor}</h3>
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{v.stock} Units left</span>
                        <ChevronRight className={`transition-transform duration-500 ${activeVariantIdx === idx ? 'translate-x-2 text-indigo-600' : 'text-slate-300'}`} />
                    </div>
                  </div>
                </div>

                {/* Subtile background flavor text */}
                <div className="absolute -bottom-4 -right-4 text-7xl font-black text-slate-900/5 uppercase pointer-events-none group-hover:scale-110 transition-transform duration-700">
                    {v.flavor.split(' ')[0]}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetailView;