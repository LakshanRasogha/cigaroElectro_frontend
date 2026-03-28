"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  index?: number;
}

const ProductCard = ({
  productKey,
  name,
  tagline = "",
  basePrice,
  productImage = [],
  variants = [],
  category = "",
  index = 0,
}: ProductProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const router = useRouter();

  const brandName = name.split(" ")[0];
  const inStockVariants = variants.filter((v) => v.stock > 0 && v.availability);
  const isOutOfStock = inStockVariants.length === 0;
  const nameLength = name.trim().length;
  const normalizedCategory = category.trim().toLowerCase();
  const nameSizeClass =
    nameLength > 30
      ? "text-[11px] md:text-lg"
      : nameLength > 22
        ? "text-xs md:text-xl"
        : "text-sm md:text-2xl";
  const availabilityLabel =
    normalizedCategory === "t-shirts"
      ? "styles available"
      : normalizedCategory === "accessories"
        ? "Variants available"
        : "flavors available";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => router.push(`/collections/${productKey}`)}
      className='relative flex flex-col h-full group cursor-pointer'
    >
      <motion.div
        animate={{
          y: isHovered ? -10 : 0,
          borderColor: isHovered
            ? "rgba(212,175,55,0.4)"
            : "rgba(255,255,255,0.05)",
          backgroundColor: isHovered
            ? "rgba(255,255,255,0.03)"
            : "rgba(255,255,255,0.02)",
        }}
        transition={{ duration: 0.4, ease: "circOut" }}
        className={`
          relative h-[350px] md:h-[560px] flex flex-col overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem]
          backdrop-blur-3xl border shadow-xl
          ${isOutOfStock ? "opacity-60" : ""}
        `}
      >
        {/* --- Image Section --- */}
        <div className='relative h-44 md:h-100 shrink-0 overflow-hidden bg-zinc-900'>
          {/* Smooth Zoom Effect - NO Color Change */}
          <motion.img
            src={productImage[0] || "/placeholder.jpg"}
            alt={name}
            animate={{ scale: isHovered ? 1.08 : 1 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }} // Custom Bezier for premium feel
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
          <motion.button
            whileTap={{ scale: 0.8 }}
            whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.8)" }}
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className='absolute top-3 right-3 md:top-6 md:right-6 z-20 p-2.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10 transition-colors'
          >
            <Heart
              size={14}
              className={
                isLiked ? "fill-[#D4AF37] text-[#D4AF37]" : "text-white"
              }
            />
          </motion.button>

          {/* Gradient Overlay - Slightly stronger on hover */}
          <motion.div
            animate={{ opacity: isHovered ? 0.6 : 0.4 }}
            className='absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent'
          />
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

            <div className='flex items-center justify-between gap-2'>
              <span className='text-sm md:text-lg font-medium text-zinc-300 whitespace-nowrap'>
                Rs.{basePrice.toLocaleString()}
              </span>
              <span
                className={`inline-flex items-center gap-1 whitespace-nowrap rounded px-2 py-0.5 text-[9px] font-medium ${
                  isOutOfStock
                    ? "bg-rose-500/10 text-rose-300"
                    : "bg-[#D4AF37]/10 text-[#D4AF37]"
                }`}
              >
                <Sparkles size={8} />
                {isOutOfStock ? "Out of Stock" : "In Stock"}
              </span>
            </div>
          </div>

          {/* --- Desktop Interactive Area (The "Switch") --- */}
          {/* This area swaps the description for the button smoothly */}
          <div className='hidden md:block mt-6 h-[60px] relative'>
            <AnimatePresence mode='wait'>
              {!isHovered ? (
                // STATE 1: Default Tagline & Variants
                <motion.div
                  key='info'
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className='absolute inset-0'
                >
                  <p className='text-[11px] text-zinc-500 font-medium leading-relaxed line-clamp-2 mb-3'>
                    {tagline}
                  </p>
                  {/* Mini Variant Bubbles */}
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
                      {variants.length} {availabilityLabel}
                    </span>
                  </div>
                </motion.div>
              ) : (
                // STATE 2: The "View" Button
                <motion.div
                  key='action'
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className='absolute inset-0 flex items-center'
                >
                  <button className='w-full h-[50px] bg-[#D4AF37] hover:bg-[#c5a028] text-black font-bold uppercase tracking-[0.2em] text-[10px] rounded-xl flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all'>
                    View Collection <ArrowRight size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Bottom Bar (Always Visible) */}
          <div className='flex md:hidden items-center justify-between mt-4 pt-3 border-t border-white/5'>
            <span className='text-[10px] text-zinc-400'>
              {variants.length} {availabilityLabel}
            </span>
            <div className='p-2 bg-white/5 rounded-full'>
              <ArrowRight size={12} className='text-[#D4AF37]' />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductCard;
