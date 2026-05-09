"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import type { Product } from "@/app/lib/types";

interface TrendingSectionProps {
  bestsellerKeys: Set<string>;
}

const TrendingSection = ({ bestsellerKeys }: TrendingSectionProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(apiUrl("/analytics/trending?limit=8"))
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setProducts(data);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <section className='relative bg-[#050505] overflow-hidden py-16 md:py-24'>
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
                className='text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F2D37D] to-[#AA771C] normal-case'
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
            spaceBetween={12}
            slidesPerView={2}
            navigation={{
              nextEl: ".swiper-trending-next",
              prevEl: ".swiper-trending-prev",
            }}
            breakpoints={{
              768: { slidesPerView: 3, spaceBetween: 20 },
              1024: { slidesPerView: 4, spaceBetween: 24 },
            }}
            className='pb-6 !overflow-visible'
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
    </section>
  );
};

/* ── Trending card ─────────────────────────────────────────────── */
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

  const handleClick = () => {
    trackProductClick(product.key);
    router.push(`/collections/${getProductSlug(product)}`);
  };

  return (
    <div
      onClick={handleClick}
      className='relative group cursor-pointer aspect-[3/4] rounded-2xl md:rounded-[2rem] overflow-hidden bg-[#0a0a0a] border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-300 shadow-md hover:shadow-[0_8px_24px_rgba(212,175,55,0.12)]'
    >
      {/* Rank number */}
      <div className='absolute top-3 left-3 z-20 w-7 h-7 rounded-full bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-center'>
        <span className='text-[9px] font-black text-[#D4AF37]'>#{rank}</span>
      </div>

      {/* Best Seller badge */}
      {isBestSeller && (
        <div className='absolute top-3 right-3 z-20 flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] shadow-[0_2px_10px_rgba(212,175,55,0.5)]'>
          <TrendingUp size={7} className='text-black' />
          <span className='text-[6px] font-black text-black uppercase tracking-wider'>Best Seller</span>
        </div>
      )}

      {/* Image */}
      <div className='absolute inset-0'>
        {!imgLoaded && (
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='w-5 h-5 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin' />
          </div>
        )}
        <img
          src={product.productImage?.[0] || "/placeholder.jpg"}
          alt={product.name}
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${imgLoaded ? "opacity-70 group-hover:opacity-50" : "opacity-0"}`}
        />
        <div className='absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/50 to-transparent' />
      </div>

      {/* Content */}
      <div className='absolute bottom-0 left-0 right-0 p-3 z-10'>
        <p className='text-[#D4AF37] text-[5px] font-black uppercase tracking-wider mb-0.5 opacity-70'>
          {product.category}
        </p>
        <h3 className='text-xs font-bold text-white mb-1 leading-tight line-clamp-1 group-hover:text-[#D4AF37] transition-colors'>
          {product.name}
        </h3>
        <div className='flex items-center justify-between'>
          <span className='text-[9px] font-black text-white/80'>
            Rs.{Number(product.basePrice).toLocaleString()}
          </span>
          <div className='flex items-center gap-1 text-[#D4AF37]/60'>
            <TrendingUp size={9} />
            <span className='text-[7px] font-bold'>{product.variants?.length ?? 0} variants</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingSection;
