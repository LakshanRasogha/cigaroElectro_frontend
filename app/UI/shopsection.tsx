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
    <section className="py-20 md:py-32 bg-[#050505] overflow-hidden relative" id="shop">
      
      {/* --- Video Background Layer --- */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-30 md:opacity-40"
        >
          <source src="/vape3.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[#050505]/60 md:bg-transparent md:bg-gradient-to-b md:from-[#050505] md:via-transparent md:to-[#050505]" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-end mb-12 md:mb-20 gap-8 md:gap-12">
          <div className="max-w-2xl w-full">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6"
            >
              <div className="p-2 bg-[#D4AF37] rounded-lg md:rounded-xl shadow-lg shadow-[#D4AF37]/20">
                <Zap size={14} className="text-black fill-black md:w-[18px] md:h-[18px]" />
              </div>
              <span className="text-[#D4AF37] font-black text-[9px] md:text-[11px] tracking-[0.3em] md:tracking-[0.5em] uppercase">
                Hardware Drop 2026
              </span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-8xl font-black leading-tight text-white tracking-tighter uppercase"
            >
              The Electric <br className="hidden md:block"/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F2D37D] to-[#AA771C]" style={{ fontFamily: "'Dancing Script', cursive" }}>
                Collection.
              </span>
            </motion.h2>
          </div>

          <div className="flex flex-row-reverse lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-4 md:gap-8 w-full lg:w-auto">
            <Link 
              href="/collections" 
              className="flex items-center gap-2 md:gap-3 px-6 md:px-10 py-3 md:py-5 bg-[#D4AF37] text-black rounded-xl md:rounded-2xl font-bold text-[9px] md:text-[11px] uppercase tracking-[0.1em] md:tracking-[0.2em] hover:bg-white transition-all shadow-2xl group whitespace-nowrap"
            >
              Full Catalog
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform md:w-[16px] md:h-[16px]" />
            </Link>
            
            <div className="flex gap-2 md:gap-4">
              <button className="swiper-prev-btn p-3 md:p-5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all active:scale-90 shadow-xl">
                <ChevronLeft size={20} className="md:w-[24px] md:h-[24px]" />
              </button>
              <button className="swiper-next-btn p-3 md:p-5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all active:scale-90 shadow-xl">
                <ChevronRight size={20} className="md:w-[24px] md:h-[24px]" />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 md:py-32">
            {/* FIXED: Replaced md:size namespace with responsive Tailwind classes */}
            <Loader2 className="animate-spin text-[#D4AF37] mb-4 md:mb-6 w-8 h-8 md:w-12 md:h-12" />
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-zinc-500 text-center">Syncing Secure Catalog...</p>
          </div>
        ) : (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={15} 
            slidesPerView={2} // Ensures 2 cards on mobile
            navigation={{
              nextEl: '.swiper-next-btn',
              prevEl: '.swiper-prev-btn',
            }}
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{
              // Tablet
              768: { 
                slidesPerView: 3,
                spaceBetween: 25 
              },
              // Desktop
              1024: { 
                slidesPerView: 4, 
                spaceBetween: 30 
              },
              1440: { 
                slidesPerView: 4, 
                spaceBetween: 40 
              },
            }}
            className="pb-20 md:pb-32 !overflow-visible custom-gold-swiper" 
          >
            {products.map((prod: Product, i: number) => {
              const { key: productKey, ...otherProps } = prod;

              return (
                <SwiperSlide key={prod._id || productKey} className="h-auto">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="group relative h-full py-2 md:py-4"
                  > 
                    <div className="h-full rounded-[2rem] md:rounded-[3rem] bg-white/[0.04] backdrop-blur-3xl border border-white/5 overflow-hidden shadow-2xl transition-all duration-500 ease-out group-hover:border-[#D4AF37]/30 group-hover:md:-translate-y-4">
                      
                      {prod.sale && (
                        <div className="absolute top-4 right-4 md:top-8 md:right-8 z-20 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-[#D4AF37] backdrop-blur-xl border border-[#D4AF37]/50">
                          <span className="text-[7px] md:text-[9px] font-black tracking-widest text-black flex items-center gap-1 md:gap-2 uppercase">
                            <Sparkles size={10} className="md:w-[12px] md:h-[12px]" /> {prod.sale}
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

      {/* Decorative Gold side beam */}
      <div className="absolute left-0 bottom-1/4 w-[1px] h-32 bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent opacity-10 md:opacity-20" />
    </section>
  );
};

export default ShopSection;