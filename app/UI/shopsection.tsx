'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from '../componenets/product_card';
import { ArrowRight, Zap, Sparkles, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

// --- Swiper Imports ---
{/*  */}
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
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Failed to fetch products", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-32 bg-white overflow-hidden relative" id="shop">
      {/* Background elements omitted for brevity - keep your existing ones here */}
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-600 rounded-xl">
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
          </div>

          {/* Slider Navigation Controls */}
          <div className="flex gap-4 mb-2">
            <button className="swiper-prev-btn p-4 rounded-full border border-zinc-200 hover:bg-zinc-900 hover:text-white transition-all">
              <ChevronLeft size={20} />
            </button>
            <button className="swiper-next-btn p-4 rounded-full border border-zinc-200 hover:bg-zinc-900 hover:text-white transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

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
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="pb-20 !overflow-visible" // Allow cards to "pop" out of the container when hovering
          >
            {products.map((prod: any, i: number) => (
              <SwiperSlide key={prod._id || i} className="h-auto">
                <div className="group relative h-full py-4"> {/* Added py-4 to make room for the lift animation */}
                  <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-500 -z-10" />
                  
                  <div className="h-full rounded-[2.5rem] bg-white border border-slate-100 overflow-hidden shadow-sm group-hover:shadow-2xl group-hover:shadow-indigo-100/50 group-hover:-translate-y-3 transition-all duration-500 ease-out">
                    {prod.sale && (
                      <div className="absolute top-6 right-6 z-20 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-100">
                        <span className="text-[10px] font-black tracking-widest text-indigo-600 flex items-center gap-1">
                          <Sparkles size={10} /> {prod.sale}
                        </span>
                      </div>
                    )}
                    <ProductCard index={i} {...prod} />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default ShopSection;