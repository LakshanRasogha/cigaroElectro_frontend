"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp, Loader2, ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import axios from "axios";
import { useRouter } from "next/navigation";
import { apiUrl } from "@/app/lib/api";
import { getListKey, getProductSlug } from "@/app/lib/entity_id";
import { trackProductClick } from "@/app/lib/analytics";
import { getProductVariantCount } from "@/app/lib/products";
import type { Product } from "@/app/lib/types";

interface TrendingSectionProps {
  bestsellerKeys: Set<string>;
}

const TrendingSection = ({ bestsellerKeys }: TrendingSectionProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(apiUrl("/analytics/trending?limit=8&includeVariants=false"))
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setProducts(data);
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
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Viewed
              </span>
            </h2>
          </div>

          <div className='flex gap-2'>
            <button className='swiper-trending-prev p-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all active:scale-95'>
              <ChevronLeft size={18} />
            </button>
            <button className='swiper-trending-next p-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all active:scale-95'>
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
          <Swiper
            modules={[Navigation]}
            spaceBetween={8}
            slidesPerView={2}
            navigation={{
              nextEl: ".swiper-trending-next",
              prevEl: ".swiper-trending-prev",
            }}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 12 },
              768: { slidesPerView: 3, spaceBetween: 16 },
              1024: { slidesPerView: 4, spaceBetween: 20 },
            }}
            className='!overflow-visible [&::-webkit-scrollbar]:hidden [scrollbar-width:none]'
          >
            {products.map((prod, i) => (
              <SwiperSlide key={getListKey(prod, i)} className='h-auto'>
                <TrendingCard
                  product={prod}
                  rank={i + 1}
                  isBestSeller={bestsellerKeys.has(prod.key)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      <div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent' />

      <style>{`
        .swiper { scrollbar-width: none; -ms-overflow-style: none; }
        .swiper::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
};

/* ── Trending card — event-style layout ────────────────────────── */
const TrendingCard = ({
  product,
  rank,
  isBestSeller,
}: {
  product: Product;
  rank: number;
  isBestSeller: boolean;
}) => {
  const router = useRouter();
  const [imgLoaded, setImgLoaded] = useState(false);

  const formattedPrice = new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(product.basePrice || 0);
  const variantCount = getProductVariantCount(product);

  const handleClick = () => {
    trackProductClick(product.key);
    router.push(`/collections/${getProductSlug(product)}`);
  };

  return (
    <div
      onClick={handleClick}
      className='group relative flex flex-col rounded-xl sm:rounded-2xl overflow-hidden bg-[#0d0d0d] cursor-pointer border border-white/[0.08] transition-all duration-300 hover:border-[#D4AF37]/40 shadow-lg hover:shadow-[0_12px_32px_rgba(212,175,55,0.15)]'
    >
      {/* ── IMAGE BLOCK ── */}
      <div className='relative w-full aspect-[4/5] overflow-hidden bg-[#0a0a0a] flex-shrink-0'>
        {/* Skeleton */}
        {!imgLoaded && (
          <div className='absolute inset-0 flex items-center justify-center bg-[#0a0a0a]'>
            <div className='w-5 h-5 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin' />
          </div>
        )}

        <img
          src={product.productImage?.[0] || "/placeholder.jpg"}
          alt={product.name}
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 ${
            imgLoaded ? "opacity-100 group-hover:scale-105" : "opacity-0"
          }`}
        />

        {/* Bottom vignette */}
        <div className='absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0d0d0d] to-transparent' />

        {/* ── TOP BADGES ── */}
        <div className='absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between z-10'>
          {/* Best Seller / rank badge — top left */}
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-[6px] sm:text-[7px] font-black uppercase tracking-wider ${
              isBestSeller
                ? "bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black shadow-[0_2px_8px_rgba(212,175,55,0.5)]"
                : "bg-black/70 backdrop-blur-sm text-[#D4AF37] border border-[#D4AF37]/40"
            }`}
          >
            {isBestSeller ? "🔥 Best Seller" : `+ Featured`}
          </div>

          {/* Rank pill — top right (gold, like date badge in reference) */}
          <div className='flex items-center justify-center bg-[#D4AF37] text-black rounded-md px-2 py-1 shadow-[0_2px_8px_rgba(212,175,55,0.4)]'>
            <span className='text-[7px] sm:text-[8px] font-black uppercase leading-none tracking-wide'>
              #{rank}
            </span>
          </div>
        </div>
      </div>

      {/* ── CONTENT PANEL ── */}
      <div className='flex flex-col flex-1 p-2.5 sm:p-3 bg-[#0d0d0d]'>
        {/* Category label */}
        <p className='text-[#D4AF37] text-[5px] sm:text-[6px] font-black uppercase tracking-[0.15em] mb-1 opacity-70'>
          {product.category}
        </p>

        {/* Product name */}
        <h3 className='text-[11px] sm:text-[13px] font-black text-white uppercase tracking-tight leading-tight line-clamp-2 group-hover:text-[#D4AF37] transition-colors duration-300 mb-1'>
          {product.name}
        </h3>

        {/* Variants count */}
        {variantCount > 0 && (
          <p className='text-[6px] sm:text-[7px] text-zinc-500 line-clamp-1 font-medium tracking-wide mb-2'>
            {variantCount} variant{variantCount !== 1 ? "s" : ""} available
          </p>
        )}

        {/* Divider */}
        <div className='h-px bg-white/5 mb-2' />

        {/* Price + CTA */}
        <div className='flex items-center justify-between gap-1.5'>
          <div className='flex flex-col'>
            <span className='text-[5px] sm:text-[6px] text-zinc-600 uppercase tracking-wider font-medium'>
              Starting at
            </span>
            <span className='text-[8px] sm:text-[10px] font-black text-white'>
              {formattedPrice}
            </span>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); handleClick(); }}
            className='flex items-center gap-0.5 sm:gap-1 px-2 sm:px-2.5 py-1.5 bg-gradient-to-r from-[#D4AF37] to-[#B49450] text-black text-[6px] sm:text-[7px] font-black uppercase tracking-wider rounded-md shadow-[0_4px_12px_rgba(212,175,55,0.3)] hover:shadow-[0_4px_18px_rgba(212,175,55,0.5)] transition-shadow duration-300 whitespace-nowrap active:scale-95'
          >
            Shop Now
            <TrendingUp size={8} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrendingSection;
