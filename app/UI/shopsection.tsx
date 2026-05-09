"use client";

import React, { useMemo } from "react";
import ProductCard from "../components/product_card";
import {
  Zap,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { getListKey } from "@/app/lib/entity_id";
import type { Product } from "@/app/lib/types";

// --- Swiper Imports ---
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface ShopSectionProps {
  products: Product[];
  loading: boolean;
  bestsellerKeys?: Set<string>;
}

const ShopSection = ({ products, loading, bestsellerKeys = new Set() }: ShopSectionProps) => {
  const visibleProducts = useMemo(() => products.slice(0, 7), [products]);

  return (
    <section
      className='pt-10 pb-20 md:pt-16 md:pb-32 bg-[#050505] overflow-hidden relative -mt-16 md:-mt-24'
      id='shop'
    >
      {/* Background Overlay */}
      <div className='absolute inset-0 z-0'>
        <div className='absolute inset-0 bg-[#050505]/60 md:bg-transparent md:bg-gradient-to-b md:from-[#050505] md:via-transparent md:to-[#050505]' />
      </div>

      <div className='max-w-7xl mx-auto px-4 md:px-6 relative z-10'>
        {/* Header Section */}
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-10 md:mb-16 gap-6'>
          <div className='max-w-2xl'>
            <div className='flex items-center gap-3 mb-3'>
              <div className='p-1.5 bg-[#D4AF37] rounded-lg shadow-lg shadow-[#D4AF37]/20'>
                <Zap
                  size={12}
                  className='text-black fill-black md:w-[14px] md:h-[14px]'
                />
              </div>
              <span className='text-[#D4AF37] font-black text-[9px] md:text-[11px] tracking-[0.4em] uppercase'>
                Hardware Drop 2026
              </span>
            </div>

            <h2 className='text-2xl md:text-3xl font-black text-white tracking-tighter leading-none uppercase'>
              Vape and Electric{" "}
              <span
                className='text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F2D37D] to-[#AA771C] normal-case'
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Collection
              </span>
            </h2>
          </div>

          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 w-full md:w-auto'>
            <Link
              href='/collections'
              className='flex items-center gap-3 px-8 py-4 bg-[#D4AF37] text-black rounded-xl font-black text-[10px] md:text-[11px] uppercase tracking-widest hover:bg-white transition-all shadow-xl group'
            >
              Full Catalog
              <ArrowRight
                size={14}
                className='group-hover:translate-x-1 transition-transform'
              />
            </Link>

            <div className='flex gap-2'>
              <button className='swiper-prev-btn p-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all active:scale-95'>
                <ChevronLeft size={18} />
              </button>
              <button className='swiper-next-btn p-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all active:scale-95'>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className='flex flex-col items-center justify-center py-20'>
            <Loader2 className='animate-spin text-[#D4AF37] mb-4 w-10 h-10' />
            <p className='text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500'>
              Syncing Catalog...
            </p>
          </div>
        ) : (
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={15}
            slidesPerView={2} // Strictly 2 cards on smallest mobile
            navigation={{
              nextEl: ".swiper-next-btn",
              prevEl: ".swiper-prev-btn",
            }}
            breakpoints={{
              // Tablet
              768: {
                slidesPerView: 3,
                spaceBetween: 25,
              },
              // Desktop
              1024: {
                slidesPerView: 4,
                spaceBetween: 30,
                slidesPerGroup: 4, // Navigates by full pages of 4
              },
            }}
            className='pb-10 custom-gold-swiper !overflow-visible'
          >
            {visibleProducts.map((prod, i) => {
              // Destructure 'key' to avoid React 19 spread error
              const { key: productKey, ...otherProps } = prod;

              return (
                <SwiperSlide
                  key={getListKey(prod, productKey || i)}
                  className='h-auto'
                >
                  <div className='relative h-full py-2'>
                    <div className='h-full rounded-[2rem] md:rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 overflow-hidden'>
                      {prod.sale && (
                        <div className='absolute top-3 right-3 md:top-4 md:right-4 z-20 px-2.5 py-1 rounded-full bg-[#D4AF37] shadow-lg'>
                          <span className='text-[7px] md:text-[8px] font-black text-black uppercase'>
                            {prod.sale}
                          </span>
                        </div>
                      )}

                      <ProductCard
                        productKey={productKey}
                        slug={prod.slug}
                        {...otherProps}
                        tagline={otherProps.tagline || ""}
                        isBestSeller={bestsellerKeys.has(productKey || "")}
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
