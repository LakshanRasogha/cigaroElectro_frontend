"use client";

import React, { useState } from "react";
import { Heart, Zap, ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ProductVariant } from "@/app/lib/types";

interface ProductProps {
  productKey: string;
  name: string;
  tagline?: string;
  basePrice: number;
  productImage?: string[];
  variants?: ProductVariant[];
  category?: string;
}

const ProductCard = ({
  productKey,
  name,
  tagline = "",
  basePrice,
  productImage = [],
  variants = [],
  category = "",
}: ProductProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const router = useRouter();

  const brandName = name.split(" ")[0];
  const inStockVariants = variants.filter((v) => v.stock > 0 && v.availability);
  const isOutOfStock = inStockVariants.length === 0;
  const nameLength = name.trim().length;
  const nameSizeClass =
    nameLength > 30
      ? "text-[11px] md:text-lg"
      : nameLength > 22
        ? "text-xs md:text-xl"
        : "text-sm md:text-2xl";

  return (
    <div
      onClick={() => router.push(`/collections/${productKey}`)}
      className='relative flex flex-col h-full cursor-pointer'
    >
      <div
        className={`
          relative h-[350px] md:h-[590px] flex flex-col overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem]
          border border-white/5 shadow-xl bg-white/[0.02]
          ${isOutOfStock ? "opacity-60" : ""}
        `}
      >
        {/* --- Image Section --- */}
        <div className='relative h-44 md:h-84 shrink-0 overflow-hidden bg-zinc-900'>
          <img
            src={productImage[0] || "/placeholder.jpg"}
            alt={name}
            loading='lazy'
            decoding='async'
            className='w-full h-full object-cover'
          />

          {/* Status Badge */}
          <div className='absolute top-3 left-3 md:top-6 md:left-6 z-20 flex flex-col gap-1.5'>
            <div className='flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10'>
              <Zap size={10} className='text-[#D4AF37] fill-[#D4AF37]' />
              <span className='text-[8px] font-bold tracking-[0.15em] uppercase text-white'>
                {category}
              </span>
            </div>
          </div>

          {/* Like Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className='absolute top-3 right-3 md:top-6 md:right-6 z-20 p-2.5 bg-black/60 rounded-full border border-white/10'
          >
            <Heart
              size={14}
              className={
                isLiked ? "fill-[#D4AF37] text-[#D4AF37]" : "text-white"
              }
            />
          </button>

          <div className='absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-45' />
        </div>

        {/* --- Content Section --- */}
        <div className='p-5 md:p-8 flex flex-col flex-grow relative'>
          {/* Top Info */}
          <div className='mb-auto z-10'>
            <span className='hidden md:block text-[9px] text-[#D4AF37] font-black uppercase tracking-[0.3em] mb-2'>
              {brandName}
            </span>

            <h3
              className={`${nameSizeClass} font-bold text-white tracking-tight mb-2 uppercase leading-none whitespace-nowrap overflow-hidden text-ellipsis`}
              title={name}
            >
              {name}
            </h3>

            <div className='flex items-baseline gap-3'>
              <span className='text-sm md:text-lg font-medium text-zinc-300'>
                Rs.{basePrice.toLocaleString()}
              </span>
              {!isOutOfStock && (
                <span className='inline-flex items-center gap-1 text-[9px] text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded text-xs'>
                  <Sparkles size={8} /> In Stock
                </span>
              )}
            </div>
          </div>

          <div className='hidden md:block mt-6'>
            <p className='text-[11px] text-zinc-500 font-medium leading-relaxed line-clamp-2 mb-3 min-h-[34px]'>
              {tagline}
            </p>
            <div className='flex items-center justify-between gap-3'>
              <div className='flex items-center gap-2'>
                <div className='flex -space-x-2'>
                  {variants.slice(0, 3).map((v, i) => (
                    <div
                      key={i}
                      className='w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[8px]'
                    >
                      {v.emoji}
                    </div>
                  ))}
                </div>
                <span className='text-[9px] text-zinc-600 font-bold uppercase tracking-widest'>
                  {variants.length} variants
                </span>
              </div>
              <div className='flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]'>
                View Collection <ArrowRight size={14} />
              </div>
            </div>
          </div>

          {/* Mobile Bottom Bar (Always Visible) */}
          <div className='flex md:hidden items-center justify-between mt-4 pt-3 border-t border-white/5'>
            <span className='text-[10px] text-zinc-400'>
              {variants.length} Variants Available
            </span>
            <div className='p-2 bg-white/5 rounded-full'>
              <ArrowRight size={12} className='text-[#D4AF37]' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
