"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Zap,
  Heart,
  ChevronLeft,
  ChevronRight,
  Check,
  Package,
  Truck,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/navbar";
import { apiUrl } from "@/app/lib/api";
import { getEntityId } from "@/app/lib/entity_id";
import { trackCartAdd } from "@/app/lib/analytics";
import { useWishlist } from "@/app/lib/wishlist";
import type { CartItem, Product, ProductVariant } from "@/app/lib/types";
import { optimizeCloudinaryUrl, buildResponsiveSrcSet } from "@/app/lib/assets";

type ProductDetailViewProps = {
  slug: string;
  initialProduct?: Product | null;
  fallbackTitle?: string;
};

const ProductDetailView = ({
  slug,
  initialProduct = null,
  fallbackTitle,
}: ProductDetailViewProps) => {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(initialProduct);
  const [isLoading, setIsLoading] = useState(!initialProduct);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    if (initialProduct) {
      return;
    }

    let cancelled = false;

    fetch(
      apiUrl(
        `/products/getOne/${encodeURIComponent(slug)}?includeVariants=true`,
      ),
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled) {
          if (data) setProduct(data);
          else setLoadFailed(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoadFailed(true);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [initialProduct, slug]);

  if (isLoading) {
    return (
      <div className='min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4 px-6 text-center'>
        <div className='max-w-xl'>
          <p className='text-[10px] font-black uppercase tracking-[0.35em] text-zinc-500'>
            Product Details
          </p>
          <h1 className='mt-4 text-3xl md:text-4xl font-black tracking-tight text-white'>
            {fallbackTitle || "Loading Product Details"}
          </h1>
        </div>
        <Loader2 className='h-8 w-8 animate-spin text-[#D4AF37]' />
      </div>
    );
  }

  if (!product || loadFailed) {
    return (
      <div className='min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4 px-6 text-center'>
        <p className='text-sm uppercase tracking-[0.3em] text-zinc-500'>
          Product unavailable
        </p>
        <h1 className='text-3xl md:text-4xl font-black tracking-tight text-white'>
          {fallbackTitle || "Product Details"}
        </h1>
        <button
          onClick={() => router.push("/collections")}
          className='rounded-full border border-white/10 px-6 py-3 text-[11px] font-black uppercase tracking-[0.3em] text-white hover:border-[#D4AF37]/40'
        >
          Back to collections
        </button>
      </div>
    );
  }
  const [activeVariantIdx, setActiveVariantIdx] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const { toggle: toggleWishlist, isWishlisted } = useWishlist();
  const [showToast, setShowToast] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const baseGalleryImages = Array.isArray(product.productImage)
    ? product.productImage
    : [];
  const currentVariant = product.variants?.[activeVariantIdx];
  const variantGalleryImages = Array.isArray(currentVariant?.variantImage)
    ? currentVariant.variantImage
    : [];
  const gallery = [...baseGalleryImages, ...variantGalleryImages];
  const currentImage =
    gallery[selectedImage] || variantGalleryImages[0] || baseGalleryImages[0];
  const isTshirt = (product.category || "").toLowerCase().trim() === "t-shirts";
  const variantLabel = isTshirt ? "Design" : "Flavor";

  const getVariantPreviewIndex = (variant: ProductVariant) => {
    const variantImages = Array.isArray(variant.variantImage)
      ? variant.variantImage
      : [];
    return variantImages.length > 0 ? baseGalleryImages.length : 0;
  };

  const handleVariantSelect = (variant: ProductVariant, idx: number) => {
    setActiveVariantIdx(idx);
    setSelectedImage(getVariantPreviewIndex(variant));
  };

  const goToPrev = useCallback(() => {
    setSelectedImage((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  }, [gallery.length]);

  const goToNext = useCallback(() => {
    setSelectedImage((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  }, [gallery.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? goToNext() : goToPrev();
    }
    touchStartX.current = null;
  };

  const handleAddToCart = (variant: ProductVariant) => {
    const cartItem: CartItem = {
      cartId: `${product.key}-${variant.vKey}`,
      key: product.key,
      vKey: variant.vKey,
      productId: getEntityId(product),
      name: product.name,
      flavor: variant.flavor,
      emoji: variant.emoji,
      price: product.basePrice,
      delivery: product.deliveryFee,
      image: variant.variantImage?.[0] || product.productImage?.[0],
      quantity: 1,
    };

    const existingCart = JSON.parse(
      localStorage.getItem("bag") || "[]",
    ) as CartItem[];
    const itemIndex = existingCart.findIndex(
      (item: CartItem) => item.cartId === cartItem.cartId,
    );

    if (itemIndex > -1) {
      existingCart[itemIndex].quantity += 1;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem("bag", JSON.stringify(existingCart));
    window.dispatchEvent(new Event("cartUpdated"));
    trackCartAdd(product.key);

    setIsAdded(true);
    setShowToast(true);
    setTimeout(() => {
      setIsAdded(false);
      setShowToast(false);
    }, 2500);
  };

  return (
    <main className='bg-[#030303] min-h-screen selection:bg-[#D4AF37]/30 overflow-x-hidden'>
      <div className='fixed inset-0 z-0'>
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1a1a1a,_#000000)]' />
      </div>

      <Navbar />

      {/* Reserved toast slot prevents CLS when cart confirmation appears */}
      <div
        aria-live="polite"
        className='fixed top-24 left-1/2 -translate-x-1/2 z-[110] w-full max-w-sm px-4 min-h-[72px] pointer-events-none'
      >
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: -80 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -80 }}
              className='pointer-events-auto'
            >
              <div className='bg-zinc-900 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-[#D4AF37]/30'>
                <div className='w-9 h-9 bg-[#D4AF37] rounded-xl flex items-center justify-center shrink-0'>
                  <Check size={16} className='text-black' />
                </div>
                <div className='flex-1'>
                  <p className='text-[10px] font-black uppercase tracking-widest text-[#D4AF37]'>
                    Added to Cart
                  </p>
                  <p className='text-sm font-bold truncate'>
                    {currentVariant?.flavor}
                  </p>
                </div>
                <button
                  onClick={() => router.push("/cart")}
                  className='text-[9px] font-black uppercase tracking-widest text-[#D4AF37] border border-[#D4AF37]/30 px-3 py-1.5 rounded-lg shrink-0'
                >
                  View Cart
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className='relative z-10 pt-20 pb-32'>
        <div className='mx-auto max-w-7xl px-4 lg:px-6'>
          <div className='lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-12'>
            <div className='relative overflow-hidden rounded-[2rem] border border-white/10 bg-black lg:self-start'>
              <AnimatePresence mode='wait'>
                <motion.div
                  key={selectedImage + "-" + activeVariantIdx}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className='relative aspect-square overflow-hidden'
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <img
                    src={currentImage ? optimizeCloudinaryUrl(currentImage, "f_auto,q_auto:good,w_800") : "/placeholder.jpg"}
                    srcSet={
                      currentImage
                        ? buildResponsiveSrcSet(currentImage, [400, 600, 800, 1200])
                        : undefined
                    }
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className='w-full h-full object-cover'
                    alt={product.name}
                    width={800}
                    height={800}
                    fetchPriority="high"
                    decoding="async"
                    crossOrigin="anonymous"
                  />
                  <div className='absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#030303] to-transparent' />

                  {/* Slide arrows */}
                  {gallery.length > 1 && (
                    <>
                      <button
                        onClick={goToPrev}
                        className='hidden sm:flex absolute left-14 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/60 backdrop-blur-xl rounded-full items-center justify-center border border-white/10 hover:border-[#D4AF37]/50 transition-all active:scale-90 z-10'
                      >
                        <ChevronLeft size={18} className='text-white' />
                      </button>
                      <button
                        onClick={goToNext}
                        className='hidden sm:flex absolute right-14 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/60 backdrop-blur-xl rounded-full items-center justify-center border border-white/10 hover:border-[#D4AF37]/50 transition-all active:scale-90 z-10'
                      >
                        <ChevronRight size={18} className='text-white' />
                      </button>
                    </>
                  )}

                  {/* Dot indicators */}
                  {gallery.length > 1 && (
                    <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10'>
                      {gallery.map((_: string, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImage(idx)}
                          className={`rounded-full transition-all duration-300 ${
                            selectedImage === idx
                              ? "w-5 h-1.5 bg-[#D4AF37]"
                              : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => toggleWishlist(product.key)}
                    className='absolute top-4 right-4 w-10 h-10 bg-black/60 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10 transition-transform active:scale-90'
                  >
                    <Heart
                      size={18}
                      className={
                        isWishlisted(product.key)
                          ? "fill-[#D4AF37] text-[#D4AF37]"
                          : "text-white/70"
                      }
                    />
                  </button>

                  <button
                    onClick={() => router.back()}
                    className='absolute top-4 left-4 w-10 h-10 bg-black/60 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10'
                  >
                    <ChevronLeft size={20} className='text-white' />
                  </button>
                </motion.div>
              </AnimatePresence>

              {/* Variant image selector — below gallery */}
              {product.variants && product.variants.length > 0 && (
                <div className='px-4 pb-4 pt-3 border-t border-white/5'>
                  <p className='text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2'>
                    {variantLabel} — <span className='text-[#D4AF37]'>{currentVariant?.flavor} {currentVariant?.emoji}</span>
                  </p>
                  <div className='flex gap-2 overflow-x-auto no-scrollbar pb-1'>
                    {product.variants.map((variant: ProductVariant, idx: number) => {
                      const thumbImage = variant.variantImage?.[0] || product.productImage?.[0];
                      return (
                        <button
                          key={variant.vKey || idx}
                          onClick={() => handleVariantSelect(variant, idx)}
                          title={variant.flavor}
                          className={`relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                            activeVariantIdx === idx
                              ? "border-[#D4AF37] scale-105 shadow-lg shadow-[#D4AF37]/20"
                              : "border-white/10 opacity-50 hover:opacity-80"
                          }`}
                        >
                          <img
                            src={
                              thumbImage
                                ? optimizeCloudinaryUrl(thumbImage, "f_auto,q_auto:good,w_120,h_120,c_fill")
                                : "/placeholder.jpg"
                            }
                            className='w-full h-full object-cover'
                            alt={variant.flavor}
                            crossOrigin="anonymous"
                          />
                        {activeVariantIdx === idx && (
                          <div className='absolute inset-0 ring-1 ring-inset ring-[#D4AF37]/40 rounded-xl' />
                        )}
                        <div className='absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center pb-0.5'>
                          <span className='text-[6px] font-black text-white/80 uppercase truncate px-1'>{variant.flavor}</span>
                        </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className='mt-6 lg:mt-0 rounded-[2rem] border border-white/10 bg-[#0a0a0a]/80 overflow-hidden'>
              <div className='px-4 pt-5 pb-3 sm:px-6'>
                <div className='flex items-baseline gap-3'>
                  <span className='text-3xl font-black text-[#D4AF37]'>
                    Rs. {Number(product.basePrice).toLocaleString()}
                  </span>
                  <span className='text-sm text-zinc-500 font-medium'>
                    + shipping
                  </span>
                </div>
                {product.deliveryFee !== undefined && (
                  <p className='text-[11px] text-zinc-500 mt-1 flex items-center gap-1.5'>
                    <Truck size={11} className='text-zinc-600' />
                    Delivery fee: Rs. {Number(product.deliveryFee).toLocaleString()}
                  </p>
                )}
              </div>

              <div className='px-4 pb-4 border-b border-white/5 sm:px-6'>
                <span className='inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.4em] text-[#D4AF37] mb-2'>
                  <Zap size={10} className='fill-current' />
                  {product.category}
                </span>
                <h1 className='text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight'>
                  {product.name}
                </h1>
                {product.tagline && (
                  <p className='text-sm text-zinc-500 italic mt-1'>
                    &quot;{product.tagline}&quot;
                  </p>
                )}
              </div>

              <div className='px-4 py-4 border-b border-white/5 space-y-3 sm:px-6'>
                <div className='flex items-center gap-3 text-sm'>
                  <Truck size={16} className='text-[#D4AF37] shrink-0' />
                  <div>
                    <p className='text-white font-bold text-[12px]'>
                      Island-wide delivery
                    </p>
                    <p className='text-zinc-500 text-[10px]'>
                      Rs. {Number(product.deliveryFee).toLocaleString()} · 2-5 business days
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-3 text-sm'>
                  <ShieldCheck size={16} className='text-[#D4AF37] shrink-0' />
                  <div>
                    <p className='text-white font-bold text-[12px]'>
                      Authentic product
                    </p>
                    <p className='text-zinc-500 text-[10px]'>
                      100% genuine · secure ordering
                    </p>
                  </div>
                </div>
                {currentVariant && (
                  <div className='flex items-center gap-3 text-sm'>
                    <Package size={16} className='text-[#D4AF37] shrink-0' />
                    <div>
                      <p className='text-white font-bold text-[12px]'>
                        {currentVariant.stock > 0
                          ? `${currentVariant.stock} units in stock`
                          : "Out of stock"}
                      </p>
                      <p className='text-zinc-500 text-[10px]'>
                        {currentVariant.nicotine || "Premium formulation"}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {product.description && (
                <div className='px-4 py-4 sm:px-6'>
                  <h2 className='text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-2'>
                    Product Details
                  </h2>
                  <p
                    className={`text-zinc-400 text-sm leading-relaxed ${
                      descExpanded ? "" : "truncate"
                    }`}
                  >
                    {product.description}
                  </p>
                  <button
                    onClick={() => setDescExpanded((prev) => !prev)}
                    className='mt-1 text-[#D4AF37] text-[11px] font-black uppercase tracking-widest hover:underline'
                  >
                    {descExpanded ? "less" : "more.."}
                  </button>
                </div>
              )}
            </div>
          </div>


        </div>
      </div>

      <div className='fixed bottom-0 left-0 right-0 z-[100] px-4 py-4 bg-[#030303]/95 backdrop-blur-xl border-t border-white/5'>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => currentVariant && handleAddToCart(currentVariant)}
          disabled={!currentVariant || currentVariant.stock <= 0}
          className={`w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all duration-300 ${
            isAdded
              ? "bg-emerald-500 text-white"
              : currentVariant && currentVariant.stock > 0
                ? "bg-[#D4AF37] text-black hover:bg-[#c9a432]"
                : "bg-white/10 text-zinc-600 cursor-not-allowed"
          }`}
        >
          {isAdded ? (
            <>
              <Check size={16} />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingBag size={16} />
              {currentVariant && currentVariant.stock > 0
                ? "Add to Cart"
                : "Out of Stock"}
            </>
          )}
        </motion.button>
      </div>
    </main>
  );
};

export default ProductDetailView;
