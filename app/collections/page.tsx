"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Search, Zap, Loader2, LayoutGrid, Sparkles, ChevronRight, Package } from 'lucide-react';
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
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1a1a1a,_#000000)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMTBhMjAgMjAgMCAwIDEgMjAgMjAgMjAgMjAgMCAwIDEtNDAgMCAyMCAyMCAwIDAgMSAyMC0yMHoiIGZpbGw9IiNENEFGMzciIGZpbGwtb3BhY2l0eT0iMC4wMyIvPjwvc3ZnPg==')] opacity-20" />
        
        {/* Animated gold orbs */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 right-20 w-96 h-96 bg-[#D4AF37] rounded-full blur-[128px] opacity-10"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-[#D4AF37] rounded-full blur-[128px] opacity-10"
        />
      </div>

      <Navbar />
      
      {/* Video Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-20 sm:opacity-30">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover">
          <source src="/vape2.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-transparent to-[#030303]" />
      </div>

      <div className="relative z-10 pt-16 sm:pt-20 md:pt-24 lg:pt-32 pb-12 sm:pb-16 px-3 sm:px-4 md:px-6 lg:px-8">
        
        {/* Header Section */}
        <header className="max-w-7xl mx-auto mt-8 mb-6 sm:mb-8 md:mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1.5 sm:gap-2 text-[#D4AF37] mb-3 sm:mb-4"
          >
            <div className="p-1 bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-lg border border-[#D4AF37]/30 backdrop-blur-md">
              <Sparkles size={10} className="sm:hidden fill-current" />
              <Sparkles size={12} className="hidden sm:block fill-current" />
            </div>
            <span className="font-bold text-[6px] sm:text-[7px] md:text-[8px] lg:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.25em] text-[#D4AF37]/80">
              Global Inventory Sync
            </span>
          </motion.div>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 sm:gap-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-black text-white tracking-tighter leading-none"
            >
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F2D37D] to-[#AA771C] italic" style={{ fontFamily: "'Dancing Script', cursive" }}>
                  Collection
                </span>
                <motion.div 
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -inset-2 sm:-inset-3 bg-[#D4AF37] blur-xl sm:blur-2xl opacity-20 -z-10"
                />
              </span>
            </motion.h1>

            {/* Search - Mobile Optimized */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full lg:w-72 xl:w-80"
            >
              <div className="relative group w-full">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-300 ${isSearchFocused ? 'text-[#D4AF37]' : 'text-zinc-600'}`} size={14} />
                <input 
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full bg-gradient-to-r from-white/[0.02] to-white/[0.05] backdrop-blur-3xl border border-white/10 py-2.5 sm:py-3 pl-8 pr-8 rounded-xl outline-none focus:border-[#D4AF37]/50 transition-all text-xs text-white placeholder:text-zinc-700 font-medium"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-[#D4AF37] transition-colors text-xs"
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
            className="relative mt-4 sm:mt-6"
          >
            <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#030303] to-transparent z-10 pointer-events-none md:hidden" />
            <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#030303] to-transparent z-10 pointer-events-none md:hidden" />
            
            <div className="flex flex-nowrap lg:flex-wrap gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-3 md:pb-0">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 sm:px-4 md:px-5 lg:px-6 py-1.5 sm:py-2 rounded-full text-[6px] sm:text-[7px] md:text-[8px] lg:text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-[0.15em] transition-all duration-500 backdrop-blur-md border whitespace-nowrap flex-shrink-0 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#B49450] text-black border-[#D4AF37] shadow-[0_5px_15px_rgba(212,175,55,0.3)]'
                      : 'bg-white/5 text-zinc-500 border-white/10 hover:border-[#D4AF37]/30 hover:text-white'
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Results count */}
          {!loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 sm:mt-4 text-[8px] sm:text-[9px] md:text-[10px] text-zinc-600 font-mono"
            >
              {filteredProducts.length} {filteredProducts.length === 1 ? 'ITEM' : 'ITEMS'} FOUND
            </motion.div>
          )}
        </header>

        {/* Grid Section - 2 columns on mobile */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-24 md:py-32">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="relative"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
            </motion.div>
            <p className="font-black text-[7px] sm:text-[8px] md:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-zinc-700 mt-4 sm:mt-6">
              Accessing Mainframe...
            </p>
          </div>
        ) : (
          <motion.div 
            layout
            className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-5"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, index) => (
                <MobileProductCard 
                  key={product._id} 
                  product={product} 
                  index={index}
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
            className="text-center py-16 sm:py-20 md:py-24"
          >
            <div className="inline-flex p-3 sm:p-4 rounded-full bg-gradient-to-br from-white/5 to-white/[0.02] mb-3 sm:mb-4 border border-white/10 backdrop-blur-md">
              <LayoutGrid className="text-zinc-700" size={20} />
            </div>
            <p className="text-[#D4AF37]/60 text-sm sm:text-base md:text-lg font-light">
              No hardware found matching these coordinates.
            </p>
          </motion.div>
        )}
      </div>
    </main>
  );
};

// Mobile-Optimized Product Card - Compact 2-column design
const MobileProductCard = ({ product, index }: { product: any; index: number }) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const formattedPrice = new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  }).format(product.basePrice || 0);

  const series = product.key?.split('-')[0] || `0${(index + 1).toString().padStart(2, '0')}`;

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
            ease: [0.33, 1, 0.68, 1]
          }
        }
      }}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, scale: 0.9 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => router.push(`/collections/${product.key}`)} 
      className="group relative aspect-[3/4] rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden bg-gradient-to-b from-[#0a0a0a] to-[#050505] cursor-pointer border border-white/5 transition-all duration-300 hover:border-[#D4AF37]/30 shadow-md hover:shadow-[0_10px_20px_rgba(212,175,55,0.1)]"
    >
      {/* Background Image */}
      <div className="absolute inset-0 bg-[#0a0a0a]">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
          </div>
        )}
        <img 
          src={product.productImage?.[0] || 'https://via.placeholder.com/400x600'}
          alt={product.name} 
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-500 ${
            imageLoaded ? 'opacity-60 group-hover:opacity-40' : 'opacity-0'
          }`}
        />
      </div>

      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#D4AF37]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Category Badge - Mobile optimized */}
      <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10">
        <span className="px-2 py-0.5 bg-black/80 backdrop-blur-sm text-[#D4AF37] rounded-full text-[6px] font-black uppercase tracking-wider border border-[#D4AF37]/30">
          {product.category?.slice(0, 8)}
        </span>
        {product.variants?.length > 1 && (
          <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-[#D4AF37]/10 backdrop-blur-sm rounded-full border border-[#D4AF37]/30">
            <Package size={8} className="text-[#D4AF37]" />
            <span className="text-[5px] font-black text-[#D4AF37]">
              {product.variants.length}
            </span>
          </div>
        )}
      </div>

      {/* Content - Compact for mobile */}
      <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 z-10">
        {/* Series */}
        <p className="text-[#D4AF37] text-[5px] sm:text-[6px] font-black uppercase tracking-wider mb-0.5 opacity-70">
          Series_{series}
        </p>
        
        {/* Product Name */}
        <h3 className="text-xs sm:text-sm font-bold text-white mb-1 leading-tight line-clamp-1 group-hover:text-[#D4AF37] transition-colors">
          {product.name}
        </h3>
        
        {/* Tagline - Only show if space permits */}
        {product.tagline && (
          <p className="text-[6px] sm:text-[7px] text-zinc-500 mb-1 line-clamp-1 font-light">
            {product.tagline}
          </p>
        )}
        
        {/* Price and Action */}
        <div className="flex items-center justify-between mt-1">
          <span className="text-[8px] sm:text-[9px] font-black text-white bg-black/30 px-1.5 py-0.5 rounded-sm">
            {formattedPrice}
          </span>
          
          <motion.div 
            whileTap={{ scale: 0.9 }}
            className="p-1 bg-gradient-to-br from-[#D4AF37] to-[#B49450] rounded-md text-black"
          >
            <ArrowUpRight size={10} strokeWidth={3} />
          </motion.div>
        </div>
      </div>

      {/* Hover shimmer - Simplified for mobile */}
      <motion.div
        animate={{ x: isHovered ? '100%' : '-100%' }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/5 to-transparent skew-x-12 pointer-events-none"
      />
    </motion.div>
  );
};

export default ProductsPage;