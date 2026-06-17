"use client";

import React from "react";
import { Heart, ArrowUpRight, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import { getProductSlug } from "@/app/lib/entity_id";
import { trackProductClick } from "@/app/lib/analytics";
import { getProductHasStock, getProductVariantCount } from "@/app/lib/products";
import { useWishlist } from "@/app/lib/wishlist";
import type { Product, ProductVariant } from "@/app/lib/types";
import { optimizeCloudinaryUrl, buildResponsiveSrcSet } from "@/app/lib/assets";

interface ProductProps {
  productKey: string;
  slug?: string | null;
  name: string | null;
  tagline?: string | null;
  basePrice: number;
  productImage?: string[] | null;
  variants?: ProductVariant[] | null;
  variantCount?: number | null;
  category?: string | null;
  hasStock?: boolean;
  /** Show the 🔥 Best Seller badge when this product is in the top cart-added list */
  isBestSeller?: boolean;
  disableImageEffects?: boolean;
  /** When true, removes lazy-loading so this card's image is prioritised for LCP */
  priority?: boolean;
}

const ProductCard = ({
  productKey,
  slug,
  name,
  tagline = "",
  basePrice,
  productImage = [],
  variants = [],
  variantCount,
  category = "",
  hasStock,
  isBestSeller = false,
  disableImageEffects = false,
  priority = false,
}: ProductProps) => {
  const { toggle, isWishlisted } = useWishlist();
  const router = useRouter();
  const productSlug = getProductSlug({ slug, key: productKey });
  const safeName = typeof name === "string" && name.trim() ? name : "Product";
  const safeTagline = typeof tagline === "string" ? tagline : "";
  const safeCategory = typeof category === "string" ? category : "";
  const safeProductImages = Array.isArray(productImage) ? productImage : [];
  const safeVariants = Array.isArray(variants) ? variants : [];
  const productSummary: Product = {
    key: productKey,
    name: safeName,
    basePrice,
    category: safeCategory,
    productImage: safeProductImages,
    variants: safeVariants,
    variantCount: typeof variantCount === "number" ? variantCount : undefined,
    hasStock,
  };
  const resolvedVariantCount = getProductVariantCount(productSummary);
  const isOutOfStock = !getProductHasStock(productSummary);

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
        {!disableImageEffects && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]">
            <div className="w-5 h-5 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
          </div>
        )}

        <img
          src={safeProductImages[0] ? optimizeCloudinaryUrl(safeProductImages[0], "f_auto,q_auto:good,w_500") : "/placeholder.jpg"}
          srcSet={
            safeProductImages[0]
              ? buildResponsiveSrcSet(safeProductImages[0], [300, 500, 700])
              : undefined
          }
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          alt={safeName}
          width={400}
          height={500}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding={priority ? "sync" : "async"}
          crossOrigin="anonymous"
          className={`w-full h-full object-cover ${
            disableImageEffects
              ? ""
              : "transition-all duration-700 group-hover:scale-105"
          }`}
        />

        {/* Vignette — blends into dark content panel */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0d0d0d] to-transparent" />

        {/* ── TOP BADGES ── */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
          {/* Featured / Best Seller — top left */}
          <div
            className={`flex items-center gap-1 px-2 py-1 h-[22px] rounded-md text-[6px] sm:text-[7px] font-black uppercase tracking-wider ${
              isBestSeller
                ? "bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black shadow-[0_2px_8px_rgba(212,175,55,0.5)]"
                : "bg-black/70 backdrop-blur-sm text-[#D4AF37] border border-[#D4AF37]/40"
            }`}
          >
            {isBestSeller ? "🔥 Best Seller" : "+ Featured"}
          </div>

          {/* Category pill — top right */}
          <div className="flex items-center justify-center h-[22px] bg-[#D4AF37] text-black rounded-md px-2 shadow-[0_2px_8px_rgba(212,175,55,0.4)]">
            <span className="text-[7px] sm:text-[8px] font-black uppercase leading-none tracking-wide">
              {safeCategory || "NEW"}
            </span>
          </div>
        </div>

        {/* Variants pill — bottom-right of image */}
        {resolvedVariantCount > 1 && (
          <div className="absolute bottom-2.5 right-2.5 z-10 flex items-center gap-0.5 px-1.5 py-0.5 bg-black/80 backdrop-blur-sm rounded-full border border-[#D4AF37]/30">
            <Package size={7} className="text-[#D4AF37]" />
            <span className="text-[5px] font-black text-[#D4AF37]">
              {resolvedVariantCount}{" "}
              {safeCategory.toLowerCase().trim() === "t-shirts"
                ? "Designs"
                : "Vars"}
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
          {safeName.split(" ")[0]} onwards
        </p>

        {/* Product name */}
        <h3 className="text-[12px] sm:text-[13px] font-black text-white uppercase tracking-tight leading-tight line-clamp-2 group-hover:text-[#D4AF37] transition-colors duration-300 mb-1">
          {safeName}
        </h3>

        {/* Tagline */}
        {safeTagline && (
          <p className="text-[6px] sm:text-[7px] text-zinc-400 line-clamp-1 font-medium tracking-wide mb-2">
            {safeTagline}
          </p>
        )}

        {/* Divider */}
        <div className="h-px bg-white/5 mb-2" />

        {/* Price + Wishlist + Shop Now CTA */}
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex flex-col">
            <span className="text-[5px] sm:text-[6px] text-zinc-400 uppercase tracking-wider font-medium">
              Starting at
            </span>
            <span className="text-[9px] sm:text-[11px] font-black text-white">
              {formattedPrice}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Wishlist heart — above Shop Now */}
            <button
              aria-label={isWishlisted(productKey) ? "Remove from wishlist" : "Add to wishlist"}
              onClick={(e) => {
                e.stopPropagation();
                toggle(productKey);
              }}
              className="p-2 bg-white/[0.06] backdrop-blur-sm rounded-md border border-white/10 transition-all active:scale-90 touch-manipulation min-w-[34px] min-h-[34px] flex items-center justify-center hover:border-[#D4AF37]/40"
            >
              <Heart
                size={11}
                className={
                  isWishlisted(productKey) ? "fill-[#D4AF37] text-[#D4AF37]" : "text-white"
                }
              />
            </button>

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
    </div>
  );
};

export default ProductCard;
