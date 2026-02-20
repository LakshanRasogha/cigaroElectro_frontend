"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Search, Zap, Loader2, LayoutGrid, Sparkles, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '../componenets/navbar';

const ProductsPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const categories = ["All", "Disposable", "Re-fill", "E-Liquid", "Accessories", "T-shirts"];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/products/get`);
        const data = Array.isArray(res.data) ? res.data : res.data.products || [];
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch inventory:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const productCat = (product.category || "").toLowerCase().trim();
    const selectedCat = selectedCategory.toLowerCase().trim();
    const matchesSearch = 
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      productCat.includes(searchQuery.toLowerCase()) ||
      product.tagline?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || productCat === selectedCat;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="relative min-h-screen bg-[#030303] selection:bg-[#D4AF37]/30 overflow-x-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1a1a1a,_#000000)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMTBhMjAgMjAgMCAwIDEgMjAgMjAgMjAgMjAgMCAwIDEtNDAgMCAyMCAyMCAwIDAgMSAyMC0yMHoiIGZpbGw9IiNENEFGMzciIGZpbGwtb3BhY2l0eT0iMC4wMyIvPjwvc3ZnPg==')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent" />
        
        {/* Animated gold orbs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          className="absolute top-20 right-20 w-96 h-96 bg-[#D4AF37] rounded-full blur-[128px] opacity-10"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-[#D4AF37] rounded-full blur-[128px] opacity-10"
        />
      </div>

      <Navbar />
      
      {/* Video Background - Optional, can be removed if you want pure dark/gold aesthetic */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-30">
        <video
          autoPlay loop muted playsInline
          className="w-full h-full object-cover"
        >
          <source src="/vape2.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-transparent to-[#030303]" />
      </div>

      <div className="relative z-10 pt-20 sm:pt-24 md:pt-32 pb-16 sm:pb-20 px-3 sm:px-6 lg:px-10">
        
        {/* --- HEADER SECTION --- */}
        <header className="max-w-7xl mx-auto mb-8 sm:mb-12 md:mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 sm:gap-3 text-[#D4AF37] mb-4 sm:mb-6"
          >
            <div className="p-1 sm:p-1.5 bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-lg border border-[#D4AF37]/30 backdrop-blur-md shadow-[0_0_15px_rgba(212,175,55,0.15)]">
              <Sparkles size={12} className="sm:hidden fill-current" />
              <Zap size={14} className="hidden sm:block fill-current" />
            </div>
            <span className="font-bold text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.3em] md:tracking-[0.4em] text-[#D4AF37]/80">
              Global Inventory Sync Active
            </span>
          </motion.div>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 md:gap-10">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-none"
            >
              <span className="block sm:inline">The</span>{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F2D37D] to-[#AA771C] italic" style={{ fontFamily: "'Dancing Script', cursive" }}>
                  Vault.
                </span>
                <motion.div 
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -inset-3 bg-[#D4AF37] blur-2xl opacity-20 -z-10"
                />
              </span>
            </motion.h1>

            {/* Filter Search - Mobile Optimized */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full lg:w-80"
            >
              <div className={`relative group w-full transition-all duration-300 ${isSearchFocused ? 'scale-[1.02]' : ''}`}>
                <Search className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${isSearchFocused ? 'text-[#D4AF37]' : 'text-zinc-600'}`} size={16} />
                <input 
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full bg-gradient-to-r from-white/[0.02] to-white/[0.05] backdrop-blur-3xl border border-white/10 py-3 sm:py-4 pl-9 sm:pl-12 pr-4 rounded-xl sm:rounded-2xl outline-none focus:border-[#D4AF37]/50 transition-all text-xs sm:text-sm text-white placeholder:text-zinc-700 font-medium shadow-[0_5px_20px_rgba(0,0,0,0.5)]"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-[#D4AF37] transition-colors text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Category Pills - Mobile Optimized Scroll */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative mt-6 sm:mt-8 md:mt-10"
          >
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#030303] to-transparent z-10 pointer-events-none md:hidden" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#030303] to-transparent z-10 pointer-events-none md:hidden" />
            
            <div className="flex flex-nowrap lg:flex-wrap gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-4 md:pb-0 px-1">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-full text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] transition-all duration-500 backdrop-blur-md border whitespace-nowrap flex-shrink-0 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#B49450] text-black border-[#D4AF37] shadow-[0_5px_20px_rgba(212,175,55,0.3)]'
                      : 'bg-white/5 text-zinc-500 border-white/10 hover:border-[#D4AF37]/30 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Results count - Mobile friendly */}
          {!loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 sm:mt-6 text-[10px] sm:text-xs text-zinc-600 font-mono"
            >
              {filteredProducts.length} {filteredProducts.length === 1 ? 'ITEM' : 'ITEMS'} FOUND
            </motion.div>
          )}
        </header>

        {/* --- GRID SECTION - Mobile Optimized Grid --- */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 sm:py-32 md:py-40">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="relative"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
            </motion.div>
            <p className="font-black text-[8px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.5em] text-zinc-700 mt-6 sm:mt-8">
              Accessing Mainframe...
            </p>
          </div>
        ) : (
          <motion.div 
            layout
            className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, index) => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                  index={index}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty State - Mobile Optimized */}
        {!loading && filteredProducts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-center py-24 sm:py-32 md:py-40"
          >
            <div className="inline-flex p-4 sm:p-6 rounded-full bg-gradient-to-br from-white/5 to-white/[0.02] mb-4 sm:mb-6 border border-white/10 backdrop-blur-md">
              <LayoutGrid className="text-zinc-700" size={24} />
            </div>
            <p className="text-[#D4AF37]/60 text-base sm:text-lg md:text-xl font-light tracking-tight">
              No hardware found matching these coordinates.
            </p>
          </motion.div>
        )}
      </div>
    </main>
  );
};

const ProductCard = ({ product, index }: { product: any; index: number }) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const formattedPrice = new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  }).format(product.basePrice || 0);

  // Extract series from key or generate one
  const series = product.key?.split('-')[0] || `0${(index + 1).toString().padStart(2, '0')}`;

  return (
    <motion.div
      layout
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 0.6,
            delay: index * 0.1,
            ease: [0.33, 1, 0.68, 1]
          }
        }
      }}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => router.push(`/collections/${product.key}`)} 
      className="group relative h-[450px] sm:h-[500px] md:h-[550px] lg:h-[580px] rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] overflow-hidden bg-gradient-to-b from-[#0a0a0a] to-[#050505] backdrop-blur-md cursor-pointer border border-white/5 transition-all duration-700 hover:border-[#D4AF37]/30 shadow-[0_10px_30px_rgba(0,0,0,0.8)] hover:shadow-[0_20px_40px_rgba(212,175,55,0.15)]"
    >
      {/* Background Image with Loading State */}
      <div className="absolute inset-0 bg-[#0a0a0a]">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
          </div>
        )}
        <motion.img 
          src={product.productImage?.[0] || 'https://via.placeholder.com/800x1000'}
          alt={product.name} 
          animate={{ 
            scale: isHovered ? 1.08 : 1,
            opacity: imageLoaded ? (isHovered ? 0.7 : 0.5) : 0
          }}
          onLoad={() => setImageLoaded(true)}
          transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
          className="w-full h-full object-cover grayscale-[50%] group-hover:grayscale-0 transition-all duration-1000"
        />
      </div>

      {/* Cinematic Overlays - More pronounced gold tint */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#D4AF37]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* Gold border accent on hover */}
      <motion.div 
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute inset-0 border-2 border-[#D4AF37]/20 rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] pointer-events-none"
      />

      {/* Header Info - Mobile optimized */}
      <div className="absolute top-3 sm:top-4 md:top-6 left-3 sm:left-4 md:left-6 right-3 sm:right-4 md:right-6 flex items-center justify-between z-10">
        <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-black/80 backdrop-blur-xl text-[#D4AF37] rounded-full text-[7px] sm:text-[8px] md:text-[9px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em] border border-[#D4AF37]/30 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
          {product.category}
        </span>
        <div className="bg-gradient-to-r from-[#D4AF37] to-[#B49450] px-3 sm:px-4 md:px-5 py-1 sm:py-1.5 md:py-2 rounded-full shadow-[0_5px_15px_rgba(212,175,55,0.3)] group-hover:shadow-[0_8px_25px_rgba(212,175,55,0.5)] transition-all duration-500">
          <span className="text-[9px] sm:text-[10px] md:text-xs font-black text-black tracking-tight">
            {formattedPrice}
          </span>
        </div>
      </div>

      {/* Content Container - Mobile optimized spacing */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 lg:p-10 z-10 text-white">
        <motion.div
          animate={{ y: isHovered ? -10 : 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-2 mb-2 sm:mb-3 md:mb-4">
            <p className="text-[#D4AF37] text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em] lg:tracking-[0.5em] opacity-70 group-hover:opacity-100 transition-opacity">
              Series_{series}
            </p>
            {product.variants?.length > 1 && (
              <span className="text-[6px] sm:text-[7px] md:text-[8px] px-2 py-0.5 bg-[#D4AF37]/20 rounded-full text-[#D4AF37] border border-[#D4AF37]/30">
                {product.variants.length} VARIANTS
              </span>
            )}
          </div>
          
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 md:mb-3 lg:mb-4 tracking-tighter leading-none group-hover:text-[#D4AF37] transition-colors duration-500 uppercase">
            {product.name}
          </h3>
          
          {product.tagline && (
            <p className="text-zinc-500 text-[10px] sm:text-xs md:text-sm mb-3 sm:mb-4 md:mb-6 lg:mb-8 line-clamp-2 font-light leading-relaxed max-w-[90%] transition-colors group-hover:text-zinc-300">
              {product.tagline}
            </p>
          )}
        </motion.div>

        {/* Action Bar - Mobile optimized */}
        <motion.div 
          animate={{ 
            opacity: isHovered ? 1 : 0.7,
            y: isHovered ? 0 : 5
          }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <div className="h-[1px] w-6 sm:w-8 md:w-10 lg:w-12 bg-gradient-to-r from-[#D4AF37] to-transparent" />
            <span className="text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.25em] lg:tracking-[0.3em] text-zinc-500">
              View Details
            </span>
          </div>
          <motion.div 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 sm:p-2.5 md:p-3 lg:p-4 bg-gradient-to-br from-[#D4AF37] to-[#B49450] text-black rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <ChevronRight size={14} className="sm:hidden" strokeWidth={3} />
            <ArrowUpRight size={16} className="hidden sm:block md:hidden" strokeWidth={3} />
            <ArrowUpRight size={18} className="hidden md:block lg:hidden" strokeWidth={3} />
            <ArrowUpRight size={20} className="hidden lg:block" strokeWidth={3} />
          </motion.div>
        </motion.div>
      </div>

      {/* Gold shimmer effect on hover */}
      <motion.div
        animate={{ x: isHovered ? '100%' : '-100%' }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/10 to-transparent skew-x-12 pointer-events-none"
      />
    </motion.div>
  );
};

export default ProductsPage;