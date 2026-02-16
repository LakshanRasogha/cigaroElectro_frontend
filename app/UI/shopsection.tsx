'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from '../componenets/product_card';
import { Zap, Sparkles, Loader2, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link'; // Import Link for redirection

// --- Swiper Imports ---
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ShopSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:3001/api/products/get")
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : response.data.products || [];
        setProducts(data);
      })
      .catch((error) => console.error("Failed to fetch products", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-32 bg-white overflow-hidden relative" id="shop">
      {/* Background Ambient Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-50/50 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-50/50 blur-[120px] rounded-full translate-y-1/3 -translate-x-1/4 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-12">
          <div className="max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
                  <Zap size={16} className="text-white fill-white" />
                </div>
                <span className="text-indigo-600 font-black text-[11px] tracking-[0.5em] uppercase">
                  Hardware Drop 2026
                </span>
              </div>

              {/* Mobile View All Button (visible only on small screens) */}
              <Link 
                href="/collections" 
                className="lg:hidden flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest group"
              >
                View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <h2 className="text-6xl md:text-8xl font-bold font-serif leading-[0.85] text-zinc-900 tracking-tighter">
              The Electric <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-cyan-500 italic">
                Collection.
              </span>
            </h2>
          </div>

          {/* Desktop Controls & View All Button */}
          <div className="flex flex-col items-end gap-6">
            <Link 
              href="/collections" 
              className="hidden lg:flex items-center gap-3 px-8 py-4 bg-zinc-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl shadow-zinc-200 hover:shadow-indigo-200 group"
            >
              Explore Full Catalog
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <div className="flex gap-4">
              <button className="swiper-prev-btn p-4 rounded-full border border-zinc-200 hover:bg-zinc-900 hover:text-white transition-all active:scale-90 shadow-sm bg-white">
                <ChevronLeft size={20} />
              </button>
              <button className="swiper-next-btn p-4 rounded-full border border-zinc-200 hover:bg-zinc-900 hover:text-white transition-all active:scale-90 shadow-sm bg-white">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
//df
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Syncing Catalog...</p>
          </div>
        ) : (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              nextEl: '.swiper-next-btn',
              prevEl: '.swiper-prev-btn',
            }}
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="pb-24 !overflow-visible" 
          >
            {products.map((prod: any, i: number) => {
              const { key: productKey, ...otherProps } = prod;

              return (
                <SwiperSlide key={prod._id || i} className="h-auto">
                  <div className="group relative h-full py-4"> 
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-500 -z-10" />
                    
                    <div className="h-full rounded-[2.5rem] bg-white border border-slate-100 overflow-hidden shadow-sm group-hover:shadow-2xl group-hover:shadow-indigo-100/50 group-hover:-translate-y-3 transition-all duration-500 ease-out">
                      {prod.sale && (
                        <div className="absolute top-6 right-6 z-20 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-100">
                          <span className="text-[10px] font-black tracking-widest text-indigo-600 flex items-center gap-1">
                            <Sparkles size={10} /> {prod.sale}
                          </span>
                        </div>
                      )}
                      <ProductCard 
                        key={prod._id || productKey} 
                        index={i} 
                        productKey={productKey} 
                        {...otherProps} 
                      />
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default ShopSection;