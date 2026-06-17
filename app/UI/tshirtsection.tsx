"use client";

import React, { useMemo } from "react";
import ProductCard from "../components/product_card";
import { Loader2, ChevronLeft, ChevronRight, Shirt } from "lucide-react";
import { staticAssets, buildResponsiveSrcSet } from "@/app/lib/assets";
import { getListKey } from "@/app/lib/entity_id";
import type { Product } from "@/app/lib/types";

// --- Swiper Imports ---
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface TshirtSectionProps {
  products: Product[];
  loading: boolean;
  bestsellerKeys?: Set<string>;
}

const TshirtSection = ({ products, loading, bestsellerKeys = new Set() }: TshirtSectionProps) => {
  const visibleProducts = useMemo(() => products.slice(0, 5), [products]);

  // If no t-shirts are found and not loading, we can return null
  if (!loading && visibleProducts.length === 0) return null;

  return (
    <section className='relative bg-[#050505] overflow-hidden' id='merch'>
      {/* --- 1. Background Image Section --- */}
      <div className='absolute top-0 left-0 right-0 h-[180px] md:h-[360px] z-0 overflow-hidden'>
        <img
          src={staticAssets.poster}
          srcSet={buildResponsiveSrcSet(staticAssets.poster, [400, 600, 900], "f_auto,q_auto:eco")}
          sizes="100vw"
          alt="Limited edition apparel collection banner"
          width={1200}
          height={360}
          loading="lazy"
          decoding="async"
          crossOrigin="anonymous"
          className='absolute inset-0 w-full h-full object-cover object-center'
        />
        {/* Gradient Overlay to fade into black at the bottom */}
        <div className='absolute inset-0 bg-gradient-to-b from-[#050505]/20 via-[#050505]/50 to-[#050505]' />
      </div>

      {/* --- 2. Main Content --- */}
      {/* Added pt-[70px] for mobile specific padding */}
      <div className='relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-10 pb-4 lg:pt-16'>
        {/* Header Section */}
        <div className='flex flex-col md:flex-row justify-between items-end md:items-center mb-6 md:mb-10 gap-4'>
          <div className='max-w-2xl'>
            <div className='flex items-center gap-3 mb-3'>
              <div className='p-1.5 bg-white/10 rounded-lg shadow-lg border border-white/10 backdrop-blur-md'>
                <Shirt
                  size={16}
                  className='text-white md:w-[14px] md:h-[14px]'
                />
              </div>
              <span
                className='text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F2D37D] to-[#AA771C] normal-case'
                style={{ fontFamily: "var(--font-cormorant-garamond), serif" }}
              >
                Limited Edition
              </span>
            </div>
          </div>

          <div className='flex flex-col sm:flex-row items-end sm:items-center gap-4 md:gap-6 w-full md:w-auto'>
            <div className='flex gap-2'>
              <button aria-label="Previous apparel slide" className='swiper-prev-btn-tshirt p-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white hover:bg-white hover:text-black transition-all active:scale-95'>
                <ChevronLeft size={18} />
              </button>
              <button aria-label="Next apparel slide" className='swiper-next-btn-tshirt p-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white hover:bg-white hover:text-black transition-all active:scale-95'>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className='flex flex-col items-center justify-center py-20'>
            <Loader2 className='animate-spin text-zinc-500 mb-4 w-10 h-10' />
            <p className='text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500'>
              Loading Apparel...
            </p>
          </div>
        ) : (
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={15}
            slidesPerView={2}
            navigation={{
              nextEl: ".swiper-next-btn-tshirt",
              prevEl: ".swiper-prev-btn-tshirt",
            }}
            breakpoints={{
              768: {
                slidesPerView: 3,
                spaceBetween: 25,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 30,
                slidesPerGroup: 1,
              },
            }}
            className='pb-10 custom-tshirt-swiper !overflow-visible'
          >
            {visibleProducts.map((prod, i) => {
              const { key: productKey, ...otherProps } = prod;

              return (
                <SwiperSlide
                  key={getListKey(prod, productKey || i)}
                  className='h-auto'
                >
                  <ProductCard
                    productKey={productKey}
                    slug={prod.slug}
                    {...otherProps}
                    tagline={otherProps.tagline || "Premium Cotton Blend"}
                    variantCount={prod.variantCount}
                    hasStock={prod.hasStock}
                    category='T-shirts'
                    isBestSeller={bestsellerKeys.has(productKey || "")}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default TshirtSection;
