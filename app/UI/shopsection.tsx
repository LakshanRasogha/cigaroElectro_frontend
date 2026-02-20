'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from '../componenets/product_card';
import { Zap, Sparkles, Loader2, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';
import { motion } from 'framer-motion';

// --- Swiper Imports ---
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Variant {
  flavor: string;
  emoji: string;
  stock: number;
  availability: boolean;
}

interface Product {
  _id: string;
  key: string;
  name: string;
  tagline: string;
  basePrice: number;
  productImage: string[];
  variants: Variant[];
  category: string;
  sale?: string;
  [key: string]: any; 
}

const ShopSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API}/api/products/get`)
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : response.data.products || [];
        setProducts(data);
      })
      .catch((error) => console.error("Failed to fetch products", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-32 bg-[#050505] overflow-hidden relative" id="shop">
      
      {/* --- Video Background Layer (Colored & Muted) --- */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-40"
        >
          <source src="/vape3.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-12">
          <div className="max-w-2xl w-full">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="p-2.5 bg-[#D4AF37] rounded-xl shadow-lg shadow-[#D4AF37]/20">
                <Zap size={18} className="text-black fill-black" />
              </div>
              <span className="text-[#D4AF37] font-black text-[11px] tracking-[0.5em] uppercase">
                Hardware Drop 2026
              </span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-black leading-[0.85] text-white tracking-tighter uppercase"
            >
              The Electric <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F2D37D] to-[#AA771C]" style={{ fontFamily: "'Dancing Script', cursive" }}>
                Collection.
              </span>
            </motion.h2>
          </div>

          <div className="flex flex-col items-end gap-8">
            <Link 
              href="/collections" 
              className="hidden lg:flex items-center gap-3 px-10 py-5 bg-[#D4AF37] text-black rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-white transition-all shadow-2xl group"
            >
              Explore Full Catalog
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <div className="flex gap-4">
              <button className="swiper-prev-btn p-5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all active:scale-90 shadow-xl">
                <ChevronLeft size={24} />
              </button>
              <button className="swiper-next-btn p-5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all active:scale-90 shadow-xl">
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="animate-spin text-[#D4AF37] mb-6" size={48} />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Syncing Secure Catalog...</p>
          </div>
        ) : (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={40}
            slidesPerView={1}
            navigation={{
              nextEl: '.swiper-next-btn',
              prevEl: '.swiper-prev-btn',
            }}
            pagination={{ clickable: true }}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="pb-32 !overflow-visible custom-gold-swiper" 
          >
            {products.map((prod: Product, i: number) => {
              const { key: productKey, ...otherProps } = prod;

              return (
                <SwiperSlide key={prod._id || productKey} className="h-auto">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative h-full py-4"
                  > 
                    {/* Gold Aura Glow on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/20 to-transparent opacity-0 group-hover:opacity-100 blur-[80px] transition-opacity duration-700 -z-10" />
                    
                    <div className="h-full rounded-[3rem] bg-white/[0.04] backdrop-blur-3xl border border-white/5 overflow-hidden shadow-2xl transition-all duration-500 ease-out group-hover:border-[#D4AF37]/30 group-hover:-translate-y-4">
                      
                      {prod.sale && (
                        <div className="absolute top-8 right-8 z-20 px-4 py-2 rounded-full bg-[#D4AF37] backdrop-blur-xl border border-[#D4AF37]/50 shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                          <span className="text-[9px] font-black tracking-widest text-black flex items-center gap-2 uppercase">
                            <Sparkles size={12} /> {prod.sale}
                          </span>
                        </div>
                      )}
                      
                      <ProductCard 
                        productKey={productKey} 
                        index={i} 
                        {...otherProps} 
                      />
                    </div>
                  </motion.div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>

      {/* Decorative Gold Side Beam */}
      <div className="absolute left-0 bottom-1/4 w-[1px] h-32 bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent opacity-20" />
    </section>
  );
};

export default ShopSection;