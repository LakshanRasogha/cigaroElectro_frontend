"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Loader2, ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { apiUrl } from "@/app/lib/api";
import type { Product } from "@/app/lib/types";

interface TrendingSectionProps {
  bestsellerKeys: Set<string>;
}

/** Lazily import the Swiper carousel — defers ~100 KB of Swiper JS past LCP */
const TrendingCarousel = dynamic(() => import("./TrendingCarousel"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center py-10">
      <Loader2 className="animate-spin text-[#D4AF37] w-8 h-8" />
    </div>
  ),
});

const TrendingSection = ({ bestsellerKeys }: TrendingSectionProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(apiUrl("/analytics/trending?limit=8&includeVariants=false"))
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Product[]) => {
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <section className='relative bg-[#050505] overflow-hidden py-8 md:py-12'>
      {/* Subtle accent glow */}
      <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent' />

      <div className='max-w-7xl mx-auto px-4 md:px-6'>
        {/* Header */}
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-10 md:mb-14 gap-6'>
          <div>
            <div className='flex items-center gap-3 mb-3'>
              <div className='p-1.5 bg-gradient-to-br from-orange-500/20 to-[#D4AF37]/20 rounded-lg border border-orange-500/20'>
                <Flame size={12} className='text-orange-400 fill-orange-400 md:w-[14px] md:h-[14px]' />
              </div>
              <span className='text-orange-400 font-black text-[9px] md:text-[11px] tracking-[0.4em] uppercase'>
                Trending Now
              </span>
            </div>
            <h2 className='text-2xl md:text-3xl font-black text-white tracking-tighter leading-none uppercase'>
              Most{" "}
              <span
                className='text-[#D4AF37] normal-case'
                style={{ fontFamily: "var(--font-cormorant-garamond), serif" }}
              >
                Viewed
              </span>
            </h2>
          </div>

          <div className='flex gap-2'>
            <button aria-label="Previous trending products" className='swiper-trending-prev p-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all active:scale-95'>
              <ChevronLeft size={18} />
            </button>
            <button aria-label="Next trending products" className='swiper-trending-next p-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all active:scale-95'>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className='flex flex-col items-center justify-center py-20'>
            <Loader2 className='animate-spin text-[#D4AF37] mb-4 w-10 h-10' />
            <p className='text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500'>
              Loading Trends...
            </p>
          </div>
        ) : (
          <TrendingCarousel products={products} bestsellerKeys={bestsellerKeys} />
        )}
      </div>

      <div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent' />
    </section>
  );
};

export default TrendingSection;
