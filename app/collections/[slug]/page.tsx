"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Zap,
  Heart,
  ChevronLeft,
  ChevronRight,
  XCircle,
  Check,
  Package,
  Truck,
  ShieldCheck,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "@/app/components/navbar";
import { apiUrl } from "@/app/lib/api";
import { getEntityId } from "@/app/lib/entity_id";
import { trackCartAdd } from "@/app/lib/analytics";
import type { CartItem, Product, ProductVariant } from "@/app/lib/types";

const ProductDetailView = () => {
  const params = useParams();
  const router = useRouter();
  const productSlug = params.slug;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeVariantIdx, setActiveVariantIdx] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          apiUrl(`/products/getOne/${encodeURIComponent(String(productSlug))}`),
        );
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    if (productSlug) fetchData();
  }, [productSlug]);

  useEffect(() => {
    setSelectedImage(0);
  }, [activeVariantIdx]);

  const handleAddToCart = (variant: ProductVariant) => {
    if (!product) return;

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

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading)
    return (
      <div className='min-h-screen flex flex-col items-center justify-center bg-[#030303] gap-6'>
        <div className='fixed inset-0 bg-[radial-gradient(ellipse_at_top,_#1a1a1a,_#000000)]' />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className='relative'
        >
          <div className='w-16 h-16 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin' />
        </motion.div>
        <span className='font-black text-[10px] uppercase tracking-[0.4em] text-zinc-700'>
          Loading Product...
        </span>
      </div>
    );

  if (!product)
    return (
      <div className='min-h-screen flex flex-col items-center justify-center bg-[#030303] text-center px-6'>
        <div className='fixed inset-0 bg-[radial-gradient(ellipse_at_top,_#1a1a1a,_#000000)]' />
        <div className='relative z-10'>
          <XCircle className='text-[#D4AF37]/50 mb-6' size={48} />
          <h2 className='text-4xl font-black text-white mb-6 tracking-tighter'>
            Product Not Found
          </h2>
          <button
            onClick={() => router.back()}
            className='px-10 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B49450] text-black rounded-2xl font-black uppercase text-[10px] tracking-widest'
          >
            Return to Catalog
          </button>
        </div>
      </div>
    );

  const currentVariant = product.variants?.[activeVariantIdx];
  const gallery = [
    ...(product.productImage || []),
    ...(currentVariant?.variantImage || []),
  ];

  return (
    <main className='bg-[#030303] min-h-screen selection:bg-[#D4AF37]/30 overflow-x-hidden'>
      <div className='fixed inset-0 z-0'>
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1a1a1a,_#000000)]' />
      </div>

      <Navbar />

      {/* ── Added-to-cart toast ───────────────────────────────────────────── */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -80 }}
            className='fixed top-24 left-1/2 -translate-x-1/2 z-[110] w-full max-w-sm px-4'
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

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className='relative z-10 pt-20 pb-32'>

        {/* ── 1. Full-width image gallery ─────────────────────────────────── */}
        <div className='relative bg-black'>
          {/* Main image */}
          <AnimatePresence mode='wait'>
            <motion.div
              key={selectedImage + "-" + activeVariantIdx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className='relative w-full aspect-square max-h-[480px] overflow-hidden'
            >
              <img
                src={gallery[selectedImage] || product.productImage?.[0]}
                className='w-full h-full object-cover'
                alt={product.name}
              />
              {/* Gradient fade at bottom */}
              <div className='absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#030303] to-transparent' />

              {/* Image counter */}
              {gallery.length > 1 && (
                <div className='absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-[9px] font-black px-3 py-1.5 rounded-full'>
                  {selectedImage + 1}/{gallery.length}
                </div>
              )}

              {/* Wishlist */}
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className='absolute top-4 right-4 w-10 h-10 bg-black/60 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10'
              >
                <Heart
                  size={18}
                  className={
                    isWishlisted
                      ? "fill-[#D4AF37] text-[#D4AF37]"
                      : "text-white/70"
                  }
                />
              </button>

              {/* Back button */}
              <button
                onClick={() => router.back()}
                className='absolute top-4 left-4 w-10 h-10 bg-black/60 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10'
              >
                <ChevronLeft size={20} className='text-white' />
              </button>
            </motion.div>
          </AnimatePresence>

          {/* Thumbnail strip */}
          {gallery.length > 1 && (
            <div
              ref={galleryRef}
              className='flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar'
            >
              {gallery.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === idx
                      ? "border-[#D4AF37]"
                      : "border-transparent opacity-40"
                  }`}
                >
                  <img
                    src={img}
                    className='w-full h-full object-cover'
                    alt='thumb'
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── 2. Price block ──────────────────────────────────────────────── */}
        <div className='px-4 pt-4 pb-2'>
          <div className='flex items-baseline gap-3'>
            <span className='text-3xl font-black text-[#D4AF37]'>
              Rs. {Number(product.basePrice).toLocaleString()}
            </span>
            <span className='text-sm text-zinc-500 font-medium'>+ shipping</span>
          </div>
          {product.deliveryFee !== undefined && (
            <p className='text-[11px] text-zinc-500 mt-1 flex items-center gap-1.5'>
              <Truck size={11} className='text-zinc-600' />
              Delivery fee: Rs. {Number(product.deliveryFee).toLocaleString()}
            </p>
          )}
        </div>

        {/* ── 3. Product name + tagline ───────────────────────────────────── */}
        <div className='px-4 pb-4 border-b border-white/5'>
          <span className='inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.4em] text-[#D4AF37] mb-2'>
            <Zap size={10} className='fill-current' />
            {product.category}
          </span>
          <h1 className='text-2xl font-black text-white tracking-tight leading-tight'>
            {product.name}
          </h1>
          {product.tagline && (
            <p className='text-sm text-zinc-500 italic mt-1'>
              &quot;{product.tagline}&quot;
            </p>
          )}
        </div>

        {/* ── 4. Variant (flavor) selector ────────────────────────────────── */}
        <div className='px-4 py-5 border-b border-white/5'>
          <div className='flex items-center justify-between mb-3'>
            <p className='text-[10px] font-black uppercase tracking-widest text-zinc-400'>
              Flavor
            </p>
            <span className='text-[10px] text-[#D4AF37] font-black'>
              {currentVariant?.flavor} {currentVariant?.emoji}
            </span>
          </div>
          <div className='flex gap-2.5 overflow-x-auto no-scrollbar pb-1'>
            {product.variants?.map((variant: ProductVariant, idx: number) => (
              <button
                key={variant.vKey || idx}
                onClick={() => {
                  setActiveVariantIdx(idx);
                  setSelectedImage(0);
                }}
                className={`relative shrink-0 w-14 h-14 rounded-2xl overflow-hidden border-2 transition-all ${
                  activeVariantIdx === idx
                    ? "border-[#D4AF37] scale-105 shadow-lg shadow-[#D4AF37]/20"
                    : "border-white/10 opacity-60"
                }`}
              >
                <img
                  src={variant.variantImage?.[0] || product.productImage?.[0]}
                  className='w-full h-full object-cover'
                  alt={variant.flavor}
                />
                {activeVariantIdx === idx && (
                  <div className='absolute inset-0 ring-1 ring-inset ring-[#D4AF37]/40 rounded-2xl' />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── 5. Delivery & stock info ─────────────────────────────────────── */}
        <div className='px-4 py-4 border-b border-white/5 space-y-3'>
          <div className='flex items-center gap-3 text-sm'>
            <Truck size={16} className='text-[#D4AF37] shrink-0' />
            <div>
              <p className='text-white font-bold text-[12px]'>
                Island-wide delivery
              </p>
              <p className='text-zinc-500 text-[10px]'>
                Rs. {Number(product.deliveryFee).toLocaleString()} · 2–5 business days
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

        {/* ── 6. All flavors grid ─────────────────────────────────────────── */}
        <div className='px-4 py-6 border-b border-white/5'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400'>
              All Editions
            </h2>
            <span className='text-[10px] text-zinc-600 font-bold'>
              {product.variants?.length} variants
            </span>
          </div>
          <div className='grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4'>
            {product.variants?.map((variant: ProductVariant, idx: number) => (
              <FlavorCard
                key={variant.vKey || idx}
                variant={variant}
                isActive={activeVariantIdx === idx}
                onSelect={() => {
                  setActiveVariantIdx(idx);
                  setSelectedImage(0);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>

        {/* ── 7. Description ──────────────────────────────────────────────── */}
        {product.description && (
          <div className='px-4 py-6'>
            <h2 className='text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-3'>
              Product Details
            </h2>
            <p className='text-zinc-400 text-sm leading-relaxed'>
              {product.description}
            </p>
          </div>
        )}
      </div>

      {/* ── Sticky bottom "Add to Cart" bar ─────────────────────────────── */}
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

// ── Compact flavor card for the grid ─────────────────────────────────────────
const FlavorCard = ({
  variant,
  isActive,
  onSelect,
  onAddToCart,
}: {
  variant: ProductVariant;
  isActive: boolean;
  onSelect: () => void;
  onAddToCart: (variant: ProductVariant) => void;
}) => {
  const [added, setAdded] = useState(false);

  return (
    <div
      onClick={onSelect}
      className={`relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-300 ${
        isActive
          ? "border-[#D4AF37] shadow-lg shadow-[#D4AF37]/10"
          : "border-white/5"
      }`}
    >
      {/* Image */}
      <div className='aspect-square relative'>
        <img
          src={variant.variantImage?.[0] || "/placeholder.jpg"}
          className='w-full h-full object-cover'
          alt={variant.flavor}
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent' />

        {/* Emoji badge */}
        <div className='absolute top-2 left-2 w-7 h-7 bg-black/50 backdrop-blur-md rounded-lg flex items-center justify-center text-base'>
          {variant.emoji}
        </div>

        {/* Stock badge */}
        {variant.stock <= 0 && (
          <div className='absolute inset-0 bg-black/60 flex items-center justify-center'>
            <span className='text-[9px] font-black uppercase tracking-widest text-white/60'>
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info + button */}
      <div className='p-3 space-y-2 bg-zinc-900/80'>
        <p className='text-[10px] font-black text-white uppercase tracking-wide truncate'>
          {variant.flavor}
        </p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (variant.stock <= 0) return;
            onAddToCart(variant);
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
          }}
          disabled={variant.stock <= 0}
          className={`w-full py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all ${
            added
              ? "bg-emerald-500 text-white"
              : variant.stock > 0
              ? "bg-[#D4AF37] text-black"
              : "bg-white/5 text-zinc-600 cursor-not-allowed"
          }`}
        >
          {added ? "Added ✓" : variant.stock > 0 ? "Add" : "N/A"}
        </button>
      </div>
    </div>
  );
};

export default ProductDetailView;
