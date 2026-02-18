"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Search, Zap, Loader2, SlidersHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '../componenets/navbar';

const ProductsPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Disposable", "Re-fill", "E-Liquid", "Accessories", "T-shirts"];

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/products/get`);
      const data = Array.isArray(res.data) ? res.data : res.data.products || [];
      
      // Check your category strings in the console!
      console.log("Categories in DB:", [...new Set(data.map(p => p.category))]);
      
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
  // 1. Normalize the Category strings
  const productCat = (product.category || "").toLowerCase().trim();
  const selectedCat = selectedCategory.toLowerCase().trim();

  // 2. Search Logic
  const matchesSearch = 
    product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    productCat.includes(searchQuery.toLowerCase());

  // 3. Category Logic
  const matchesCategory = selectedCategory === "All" || productCat === selectedCat;

  return matchesSearch && matchesCategory;
});

  return (
    <main className="relative min-h-screen bg-[#020617] selection:bg-indigo-500/30 overflow-x-hidden">
      <Navbar />
      
      {/* --- VIDEO BACKGROUND LAYER --- */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-30"
        >
          <source src="/vape2.mp4" type="video/mp4" />
        </video>
        {/* Cinematic Vignette & Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-transparent to-[#020617] opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_100%)] opacity-70" />
      </div>

      <div className="relative z-10 pt-32 pb-20 px-6 lg:px-10">
        {/* --- HEADER SECTION --- */}
        <header className="max-w-7xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-indigo-400 mb-6"
          >
            <div className="p-1.5 bg-indigo-500/10 rounded-lg border border-indigo-500/20 backdrop-blur-md">
              <Zap size={14} className="fill-current" />
            </div>
            <span className="font-bold text-[10px] uppercase tracking-[0.4em]">
              Global Inventory Sync Active
            </span>
          </motion.div>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none"
            >
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 italic">Vault.</span>
            </motion.h1>

            {/* Filter Controls */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col md:flex-row gap-4 items-center"
            >
              <div className="relative group w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input 
                  type="text"
                  placeholder="Search series..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 backdrop-blur-xl border border-white/10 py-4 pl-12 pr-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all text-sm text-white placeholder:text-zinc-600"
                />
              </div>
            </motion.div>
          </div>

          {/* Category Pills */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-3 mt-10 border-t border-white/5 pt-10"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 backdrop-blur-md ${
                 
                  selectedCategory === category
                    ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                    : 'bg-white/5 text-zinc-500 border border-white/5 hover:border-white/20 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </header>

        {/* --- GRID SECTION --- */}
        {/* --- GRID SECTION --- */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="animate-spin text-indigo-500 mb-6" size={48} />
            <p className="font-black text-[10px] uppercase tracking-[0.5em] text-zinc-600">Querying Mainframe...</p>
          </div>
        ) : (
          <motion.div 
            layout
            className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <AnimatePresence mode="popLayout"> {/* popLayout is essential for grids */}
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product._id} // Ensure this is a unique ID from your DB
                  product={product} 
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-40">
            <div className="inline-flex p-6 rounded-full bg-white/5 mb-6 border border-white/10 backdrop-blur-md">
              <SlidersHorizontal className="text-zinc-700" size={32} />
            </div>
            <p className="text-zinc-500 text-xl font-light tracking-tight italic">No hardware found matching these coordinates.</p>
          </motion.div>
        )}
      </div>
    </main>
  );
};

const ProductCard = ({ product }: { product: any }) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const formattedPrice = new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    maximumFractionDigits: 0
  }).format(product.basePrice || 0);

  return (
    <motion.div
      layout
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => router.push(`/collections/${product.key}`)} 
      className="group relative h-[560px] rounded-[3rem] overflow-hidden bg-zinc-950/50 backdrop-blur-sm cursor-pointer border border-white/5 transition-all duration-500"
    >
      {/* Image Layer */}
      <div className="absolute inset-0">
        <motion.img 
          src={product.productImage?.[0] || 'https://via.placeholder.com/800x1000'}
          alt={product.name} 
          animate={{ scale: isHovered ? 1.1 : 1.05, opacity: isHovered ? 0.6 : 0.3 }}
          transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
          className="w-full h-full object-cover grayscale transition-all duration-700"
        />
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-90" />
      
      {/* Interactive Border Glow */}
      <div className={`absolute inset-0 border-2 transition-colors duration-500 rounded-[3rem] ${isHovered ? 'border-indigo-500/40 shadow-[inset_0_0_40px_rgba(99,102,241,0.2)]' : 'border-transparent'}`} />

      {/* Header Badges */}
      <div className="absolute top-8 left-8 right-8 flex items-center justify-between z-10">
        <span className="px-5 py-2 bg-white/5 backdrop-blur-xl text-white rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-white/10">
          {product.category}
        </span>
        <div className="bg-white px-5 py-2 rounded-full shadow-2xl group-hover:scale-110 transition-transform duration-500">
          <span className="text-xs font-black text-black tracking-tight">{formattedPrice}</span>
        </div>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-10 z-10 text-white">
        <motion.div
            animate={{ y: isHovered ? -10 : 0 }}
            transition={{ duration: 0.4 }}
        >
            <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] mb-3">Series_{product.key.split('-')[0]}</p>
            <h3 className="text-4xl font-bold mb-4 tracking-tighter leading-none group-hover:text-indigo-300 transition-colors">
            {product.name}
            </h3>
            
            <p className="text-zinc-500 text-sm mb-8 line-clamp-2 font-light leading-relaxed max-w-[90%] transition-colors group-hover:text-zinc-300">
            {product.tagline}
            </p>
        </motion.div>

        <div className={`flex items-center justify-between transition-all duration-700 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-8 bg-indigo-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              {product.variants?.length || 0} Editions Available
            </span>
          </div>
          <div className="p-4 bg-white text-black rounded-2xl shadow-2xl">
              <ArrowUpRight size={20} strokeWidth={3} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductsPage;