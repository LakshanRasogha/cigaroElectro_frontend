"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Search,
  LayoutGrid,
  Sparkles,
  Package,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "../components/navbar";
import { apiUrl } from "@/app/lib/api";
import { staticAssets } from "@/app/lib/assets";
import { getListKey, getProductSlug } from "@/app/lib/entity_id";
import { trackProductClick } from "@/app/lib/analytics";
import { categoryLandingPages } from "@/app/lib/site";
import type { Product } from "@/app/lib/types";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [bestsellerKeys, setBestsellerKeys] = useState<Set<string>>(new Set());

  const categories = [
    "All",
    "Disposable",
    "Re-fill",
    "E-Liquid",
    "Accessories",
    "T-shirts",
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(apiUrl("/products/get"));
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.products || [];
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch inventory:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();

    // Fetch bestseller keys in parallel (non-critical)
    axios
      .get(apiUrl("/analytics/bestseller-keys?limit=20"))
      .then((res) => {
        const keys: string[] = Array.isArray(res.data) ? res.data : [];
        setBestsellerKeys(new Set(keys));
      })
      .catch(() => {});
  }, []);

  const filteredProducts = products.filter((product) => {
    const productCat = (product.category || "").toLowerCase().trim();
    const selectedCat = selectedCategory.toLowerCase().trim();
    const matchesSearch =
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      productCat.includes(searchQuery.toLowerCase()) ||
      product.tagline?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || productCat === selectedCat;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className='relative min-h-screen bg-[#030303] selection:bg-[#D4AF37]/30 overflow-x-hidden'>
      {/* Animated background */}
      <div className='fixed inset-0 z-0'>
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1a1a1a,_#000000)]' />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMTBhMjAgMjAgMCAwIDEgMjAgMjAgMjAgMjAgMCAwIDEtNDAgMCAyMCAyMCAwIDAgMSAyMC0yMHoiIGZpbGw9IiNENEFGMzciIGZpbGwtb3BhY2l0eT0iMC4wMyIvPjwvc3ZnPg==')] opacity-20" />

        {/* Animated gold orbs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className='absolute top-20 right-20 w-96 h-96 bg-[#D4AF37] rounded-full blur-[128px] opacity-10'
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className='absolute bottom-20 left-20 w-96 h-96 bg-[#D4AF37] rounded-full blur-[128px] opacity-10'
        />
      </div>

      <Navbar />

      {/* Background Image */}
      <div className='fixed inset-0 z-0 overflow-hidden pointer-events-none'>
        <img
          src={staticAssets.backgroundPattern}
          alt='Background Pattern'
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-b from-[#030303] via-transparent to-[#030303]' />
      </div>

      <div className='relative z-10 pt-16 sm:pt-20 md:pt-24 lg:pt-32 pb-12 sm:pb-16 px-3 sm:px-4 md:px-6 lg:px-8'>
        {/* Header Section */}
        <header className='max-w-7xl mx-auto mt-8 mb-6 sm:mb-8 md:mb-12'>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className='flex items-center gap-1.5 sm:gap-2 text-[#D4AF37] mb-3 sm:mb-4'
          >
            <div className='p-1 bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-lg border border-[#D4AF37]/30 backdrop-blur-md'>
              <Sparkles size={10} className='sm:hidden fill-current' />
              <Sparkles size={12} className='hidden sm:block fill-current' />
            </div>
            <span className='font-bold text-[6px] sm:text-[7px] md:text-[8px] lg:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.25em] text-[#D4AF37]/80'>
              Global Inventory Sync
            </span>
          </motion.div>

          <div className='flex flex-col lg:flex-row lg:items-end justify-between gap-3 sm:gap-4'>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='text-3xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white tracking-tighter leading-none'
            >
              <span className='relative inline-block'>
                <span
                  className='relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F2D37D] to-[#AA771C]'
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Collection
                </span>
                <motion.div
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className='absolute -inset-2 sm:-inset-3 bg-[#D4AF37] blur-xl sm:blur-2xl opacity-20 -z-10'
                />
              </span>
            </motion.h1>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className='w-full lg:w-72 xl:w-80'
            >
              <div className='relative group w-full'>
                <Search
                  className={`absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                    isSearchFocused ? "text-[#D4AF37]" : "text-zinc-600"
                  }`}
                  size={14}
                />
                <input
                  type='text'
                  placeholder='Search...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className='w-full bg-gradient-to-r from-white/[0.02] to-white/[0.05] backdrop-blur-3xl border border-white/10 py-2.5 sm:py-3 pl-8 pr-8 rounded-xl outline-none focus:border-[#D4AF37]/50 transition-all text-xs text-white placeholder:text-zinc-700 font-medium'
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className='absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-[#D4AF37] transition-colors text-xs'
                  >
                    ✕
                  </button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Category Pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className='relative mt-4 sm:mt-6'
          >
            <div className='absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#030303] to-transparent z-10 pointer-events-none md:hidden' />
            <div className='absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#030303] to-transparent z-10 pointer-events-none md:hidden' />

            <div className='flex flex-nowrap lg:flex-wrap gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-3 md:pb-0'>
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 sm:px-4 md:px-5 lg:px-6 py-1.5 sm:py-2 rounded-full text-[6px] sm:text-[7px] md:text-[8px] lg:text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-[0.15em] transition-all duration-500 backdrop-blur-md border whitespace-nowrap flex-shrink-0 ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-[#D4AF37] to-[#B49450] text-black border-[#D4AF37] shadow-[0_5px_15px_rgba(212,175,55,0.3)]"
                      : "bg-white/5 text-zinc-500 border-white/10 hover:border-[#D4AF37]/30 hover:text-white"
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className='mt-4 flex flex-wrap gap-2'
          >
            {categoryLandingPages.map((page) => (
              <Link
                key={page.slug}
                href={`/collections/category/${page.slug}`}
                className='rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-3 py-2 text-[7px] font-black uppercase tracking-[0.2em] text-[#D4AF37] transition-all hover:bg-[#D4AF37] hover:text-black'
              >
                {page.title}
              </Link>
            ))}
          </motion.div>

          {/* Results count */}
          {!loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='mt-3 sm:mt-4 text-[8px] sm:text-[9px] md:text-[10px] text-zinc-600 font-mono'
            >
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "ITEM" : "ITEMS"} FOUND
            </motion.div>
          )}
        </header>

        {/* Grid Section */}
        {loading ? (
          <div className='flex flex-col items-center justify-center py-16 sm:py-24 md:py-32'>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className='relative'
            >
              <div className='w-10 h-10 sm:w-12 sm:h-12 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin' />
            </motion.div>
            <p className='font-black text-[7px] sm:text-[8px] md:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-zinc-700 mt-4 sm:mt-6'>
              Accessing Mainframe...
            </p>
          </div>
        ) : (
          <motion.div
            layout
            className='max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-5'
          >
            <AnimatePresence mode='popLayout'>
              {filteredProducts.map((product, index) => (
                <MobileProductCard
                  key={getListKey(product, index)}
                  product={product}
                  index={index}
                  isBestSeller={bestsellerKeys.has(product.key)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='text-center py-16 sm:py-20 md:py-24'
          >
            <div className='inline-flex p-3 sm:p-4 rounded-full bg-gradient-to-br from-white/5 to-white/[0.02] mb-3 sm:mb-4 border border-white/10 backdrop-blur-md'>
              <LayoutGrid className='text-zinc-700' size={20} />
            </div>
            <p className='text-[#D4AF37]/60 text-sm sm:text-base md:text-lg font-light'>
              No hardware found matching these coordinates.
            </p>
          </motion.div>
        )}
      </div>
    </main>
  );
};

// ── Event-style Product Card ──────────────────────────────────────────────────
// Layout: large image on top (4:5) with overlay badges, dark content panel
// below with series label, bold product name, tagline, price + "Shop Now" CTA.
const MobileProductCard = ({
  product,
  index,
  isBestSeller = false,
}: {
  product: Product;
  index: number;
  isBestSeller?: boolean;
}) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const formattedPrice = new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(product.basePrice || 0);

  const series =
    product.key?.split("-")[0] || `${(index + 1).toString().padStart(2, "0")}`;

  return (
    <motion.div
      layout
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.4,
            delay: index * 0.05,
            ease: [0.33, 1, 0.68, 1],
          },
        },
      }}
      initial='hidden'
      animate='visible'
      exit={{ opacity: 0, scale: 0.9 }}
      whileTap={{ scale: 0.97 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => {
        trackProductClick(product.key);
        router.push(`/collections/${getProductSlug(product)}`);
      }}
      className='group relative flex flex-col rounded-xl sm:rounded-2xl overflow-hidden bg-[#0d0d0d] cursor-pointer border border-white/[0.08] transition-all duration-300 hover:border-[#D4AF37]/40 shadow-lg hover:shadow-[0_12px_32px_rgba(212,175,55,0.15)]'
    >
      {/* ── IMAGE BLOCK ── */}
      <div className='relative w-full aspect-[4/5] overflow-hidden bg-[#0a0a0a] flex-shrink-0'>
        {/* Skeleton loader */}
        {!imageLoaded && (
          <div className='absolute inset-0 flex items-center justify-center bg-[#0a0a0a]'>
            <div className='w-5 h-5 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin' />
          </div>
        )}

        <img
          src={product.productImage?.[0] || "https://via.placeholder.com/400x500"}
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 ${
            imageLoaded ? "opacity-100 group-hover:scale-105" : "opacity-0"
          }`}
        />

        {/* Bottom vignette — blends image into the dark content panel */}
        <div className='absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0d0d0d] to-transparent' />

        {/* ── TOP BADGES ── */}
        <div className='absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between z-10'>
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

          {/* Category — top right (gold pill, like the date badge in the reference) */}
          <div className='flex items-center justify-center bg-[#D4AF37] text-black rounded-md px-2 py-1 shadow-[0_2px_8px_rgba(212,175,55,0.4)]'>
            <span className='text-[7px] sm:text-[8px] font-black uppercase leading-none tracking-wide'>
              {product.category?.slice(0, 7) ?? "NEW"}
            </span>
          </div>
        </div>

        {/* Variants pill — bottom-right of image */}
        {(product.variants?.length ?? 0) > 1 && (
          <div className='absolute bottom-2.5 right-2.5 z-10 flex items-center gap-0.5 px-1.5 py-0.5 bg-black/80 backdrop-blur-sm rounded-full border border-[#D4AF37]/30'>
            <Package size={7} className='text-[#D4AF37]' />
            <span className='text-[5px] font-black text-[#D4AF37]'>
              {product.variants?.length ?? 0}{" "}
              {(product.category || "").toLowerCase().trim() === "t-shirts"
                ? "Designs"
                : "Vars"}
            </span>
          </div>
        )}
      </div>

      {/* ── CONTENT PANEL ── */}
      <div className='flex flex-col flex-1 p-2.5 sm:p-3 bg-[#0d0d0d]'>
        {/* Series — like "6:00 PM onwards" in the reference */}
        <p className='text-[#D4AF37] text-[5px] sm:text-[6px] font-black uppercase tracking-[0.15em] mb-1 opacity-70'>
          {series} onwards
        </p>

        {/* Product name — bold, uppercase */}
        <h3 className='text-[11px] sm:text-[13px] font-black text-white uppercase tracking-tight leading-tight line-clamp-2 group-hover:text-[#D4AF37] transition-colors duration-300 mb-1'>
          {product.name}
        </h3>

        {/* Tagline — like venue in the reference */}
        {product.tagline && (
          <p className='text-[6px] sm:text-[7px] text-zinc-500 line-clamp-1 font-medium tracking-wide mb-2'>
            {product.tagline}
          </p>
        )}

        {/* Divider */}
        <div className='h-px bg-white/5 mb-2' />

        {/* Price + Shop Now CTA */}
        <div className='flex items-center justify-between gap-1.5'>
          <div className='flex flex-col'>
            <span className='text-[5px] sm:text-[6px] text-zinc-600 uppercase tracking-wider font-medium'>
              Starting at
            </span>
            <span className='text-[8px] sm:text-[10px] font-black text-white'>
              {formattedPrice}
            </span>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            className='flex items-center gap-0.5 sm:gap-1 px-2 sm:px-2.5 py-1.5 bg-gradient-to-r from-[#D4AF37] to-[#B49450] text-black text-[6px] sm:text-[7px] font-black uppercase tracking-wider rounded-md shadow-[0_4px_12px_rgba(212,175,55,0.3)] hover:shadow-[0_4px_18px_rgba(212,175,55,0.5)] transition-shadow duration-300 whitespace-nowrap'
          >
            Shop Now
            <ArrowUpRight size={8} strokeWidth={3} />
          </motion.button>
        </div>
      </div>

      {/* Gold shimmer on hover */}
      <motion.div
        animate={{ x: isHovered ? "100%" : "-100%" }}
        transition={{ duration: 0.8 }}
        className='absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/5 to-transparent skew-x-12 pointer-events-none'
      />
    </motion.div>
  );
};

export default ProductsPage;
