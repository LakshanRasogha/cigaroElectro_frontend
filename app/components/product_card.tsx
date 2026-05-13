"use client";

import React, { useState } from "react";
import { Heart, ArrowUpRight, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import { getProductSlug } from "@/app/lib/entity_id";
import { trackProductClick } from "@/app/lib/analytics";
import { useWishlist } from "@/app/lib/wishlist";
import type { ProductVariant } from "@/app/lib/types";

interface ProductProps {
  productKey: string;
  slug?: string | null;
  name: string;
  tagline?: string;
  basePrice: number;
  productImage?: string[];
  variants?: ProductVariant[];
  category?: string;
  /** Show the 🔥 Best Seller badge when this product is in the top cart-added list */
  isBestSeller?: boolean;
}

const ProductCard = ({
  productKey,
  slug,
  name,
  tagline = "",
  basePrice,
  productImage = [],
  variants = [],
  category = "",
  isBestSeller = false,
}: ProductProps) => {
  const { toggle, isWishlisted } = useWishlist();
  const router = useRouter();
  const productSlug = getProductSlug({ slug, key: productKey });
  const [imgLoaded, setImgLoaded] = useState(false);

  const inStockVariants = variants.filter((v) => v.stock > 0 && v.availability);
  const isOutOfStock = inStockVariants.length === 0;

  const formattedPrice = new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(basePrice || 0);

  const handleClick = () => {
    trackProductClick(productKey);
    router.push(`/collections/${productSlug}`);
  };

  return (
    <div
      onClick={handleClick}
      style={{ WebkitTapHighlightColor: "transparent" }}
      className={`group relative flex flex-col rounded-xl sm:rounded-2xl overflow-hidden bg-[#0d0d0d] cursor-pointer border border-white/[0.08] transition-all duration-300 hover:border-[#D4AF37]/40 shadow-lg hover:shadow-[0_12px_32px_rgba(212,175,55,0.15)] touch-manipulation ${
        isOutOfStock ? "opacity-60" : ""
      }`}
    >
      {/* ── IMAGE BLOCK ── */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#0a0a0a] flex-shrink-0">
        {/* Skeleton */}
        {!imgLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]">
            <div className="w-5 h-5 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
          </div>
        )}

        <img
          src={productImage[0] || "/placeholder.jpg"}
          alt={name}
          loading="lazy"
          decoding="async"
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 ${
            imgLoaded ? "opacity-100 group-hover:scale-105" : "opacity-0"
          }`}
        />

        {/* Vignette — blends into dark content panel */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0d0d0d] to-transparent" />

        {/* ── TOP BADGES ── */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between z-10">
          {/* Featured / Best Seller — top left */}
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-[6px] sm:text-[7px] font-black uppercase tracking-wider ${
              isBestSeller
                ? "bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black shadow-[0_2px_8px_rgba(212,175,55,0.5)]"
                : "bg-black/70 backdrop-blur-sm text-[#D4AF37] border border-[#D4AF37]/40"
            }`}
          >
            {isBestSeller ? "🔥 Best Seller" : "+ Featured"}
          </div>

          {/* Category — top right (gold pill) */}
          <div className="flex items-center gap-1.5">
            {/* Wishlist heart */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggle(productKey);
              }}
              className="p-2 bg-black/70 backdrop-blur-sm rounded-md border border-white/10 transition-transform active:scale-90 touch-manipulation min-w-[32px] min-h-[32px] flex items-center justify-center"
            >
              <Heart
                size={11}
                className={
                  isWishlisted(productKey) ? "fill-[#D4AF37] text-[#D4AF37]" : "text-white"
                }
              />
            </button>

            <div className="flex items-center justify-center bg-[#D4AF37] text-black rounded-md px-2 py-1 shadow-[0_2px_8px_rgba(212,175,55,0.4)]">
              <span className="text-[7px] sm:text-[8px] font-black uppercase leading-none tracking-wide">
                {category?.slice(0, 7) || "NEW"}
              </span>
            </div>
          </div>
        </div>

        {/* Variants pill — bottom-right of image */}
        {variants.length > 1 && (
          <div className="absolute bottom-2.5 right-2.5 z-10 flex items-center gap-0.5 px-1.5 py-0.5 bg-black/80 backdrop-blur-sm rounded-full border border-[#D4AF37]/30">
            <Package size={7} className="text-[#D4AF37]" />
            <span className="text-[5px] font-black text-[#D4AF37]">
              {variants.length}{" "}
              {(category || "").toLowerCase().trim() === "t-shirts" ? "Designs" : "Vars"}
            </span>
          </div>
        )}

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
            <span className="px-3 py-1 bg-black/80 border border-white/20 rounded-full text-[8px] font-black text-zinc-400 uppercase tracking-widest">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* ── CONTENT PANEL ── */}
      <div className="flex flex-col flex-1 p-2.5 sm:p-3 bg-[#0d0d0d]">
        {/* Series / brand label */}
        <p className="text-[#D4AF37] text-[5px] sm:text-[6px] font-black uppercase tracking-[0.15em] mb-1 opacity-70">
          {name.split(" ")[0]} onwards
        </p>

        {/* Product name */}
        <h3 className="text-[12px] sm:text-[13px] font-black text-white uppercase tracking-tight leading-tight line-clamp-2 group-hover:text-[#D4AF37] transition-colors duration-300 mb-1">
          {name}
        </h3>

        {/* Tagline */}
        {tagline && (
          <p className="text-[6px] sm:text-[7px] text-zinc-500 line-clamp-1 font-medium tracking-wide mb-2">
            {tagline}
          </p>
        )}

        {/* Divider */}
        <div className="h-px bg-white/5 mb-2" />

        {/* Price + Shop Now CTA */}
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex flex-col">
            <span className="text-[5px] sm:text-[6px] text-zinc-600 uppercase tracking-wider font-medium">
              Starting at
            </span>
            <span className="text-[9px] sm:text-[11px] font-black text-white">
              {formattedPrice}
            </span>
          </div>

          <button
            className="flex items-center gap-1 px-3 py-2 min-h-[34px] bg-gradient-to-r from-[#D4AF37] to-[#B49450] text-black text-[7px] sm:text-[8px] font-black uppercase tracking-wider rounded-md shadow-[0_4px_12px_rgba(212,175,55,0.3)] active:scale-95 touch-manipulation whitespace-nowrap"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            Shop Now
            <ArrowUpRight size={9} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
