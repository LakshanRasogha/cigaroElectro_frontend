"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Search, Zap, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '../componenets/navbar';

/**
 * --- MAIN PAGE: ProductsPage ---
 */
const ProductsPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Disposable", "Hardware", "Liquid"];

  // Fetch Live Inventory from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Updated to port 3001 to match your local environment setup
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

  // Filtering Logic based on Search and Category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <>
      <Navbar />
      <div className="bg-[#fcfcfc] min-h-screen pt-32 pb-20 px-6 lg:px-10 font-sans">
        
        {/* Header Section */}
        <header className="max-w-7xl mx-auto mb-12 text-slate-900">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-indigo-600 mb-4"
          >
            <Zap size={14} className="fill-current" />
            <span className="font-mono text-[10px] font-black uppercase tracking-widest">
              Live Warehouse Sync Active
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-8"
          >
            All Selections<span className="text-indigo-600">.</span>
          </motion.h1>

          {/* Filter Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"
          >
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                    selectedCategory === category
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                      : 'bg-white text-slate-400 border border-slate-200 hover:border-indigo-400 hover:text-indigo-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
              <input 
                type="text"
                placeholder="Search series..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 py-3.5 pl-12 pr-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all text-sm font-medium"
              />
            </div>
          </motion.div>
        </header>

        {/* Product Grid */}
        {loading ? (
          <div className="max-w-7xl mx-auto flex flex-col items-center justify-center py-40 text-slate-300">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.3em]">Querying database...</p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-40">
            <p className="text-slate-400 text-lg font-medium italic tracking-tight">The vault is currently empty for this selection.</p>
          </motion.div>
        )}
      </div>
    </>
  );
};

/**
 * --- SUB-COMPONENT: ProductCard ---
 */
const ProductCard = ({ product }: { product: any }) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  // Formatting Currency to LKR based on JSON basePrice
  const formattedPrice = new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    maximumFractionDigits: 0
  }).format(product.basePrice || 0);

  return (
    <motion.div
      layout
      variants={{
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1 }
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      // UPDATED: Navigates using product.key to match Dynamic Route [id]
      onClick={() => router.push(`/collections/${product.key}`)} 
      className="group relative h-[520px] rounded-[2.8rem] overflow-hidden bg-white cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100"
    >
      {/* Background Image Mapping using productImage array */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.img 
          src={product.productImage?.[0] || 'https://via.placeholder.com/800x1000'}
          alt={product.name} 
          animate={{ scale: isHovered ? 1.12 : 1.05 }}
          transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
        />
      </div>

      {/* High-Contrast Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-700" />

      {/* Floating Price and Category Badges */}
      <div className="absolute top-8 left-8 right-8 flex items-start justify-between z-10">
        <span className="px-5 py-2 bg-indigo-600/90 backdrop-blur-md text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl border border-white/10">
          {product.category}
        </span>
        <div className="bg-white px-5 py-2 rounded-full border border-slate-200 shadow-2xl group-hover:scale-110 transition-transform duration-500">
          <span className="text-xs font-black text-slate-900 tracking-tight">{formattedPrice}</span>
        </div>
      </div>

      {/* Bottom Content Interaction */}
      <div className="absolute bottom-0 left-0 right-0 p-10 z-10 translate-y-6 group-hover:translate-y-0 transition-transform duration-700 ease-out text-white">
        <motion.h3 className="text-3xl font-bold mb-3 tracking-tighter leading-[0.95]">
          {product.name}
        </motion.h3>
        
        <p className="text-white/60 text-sm mb-8 line-clamp-2 font-medium tracking-tight">
          {product.tagline}
        </p>

        <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100">
          <div className="flex items-center gap-3">
            <div className="h-[1px] w-10 bg-indigo-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
              {product.variants?.length || 0} Edition Series
            </span>
          </div>
          <motion.div 
            whileHover={{ rotate: 45 }}
            className="p-4 bg-white text-slate-900 rounded-2xl shadow-2xl transition-transform"
          >
             <ArrowUpRight size={22} strokeWidth={2.5} />
          </motion.div>
        </div>
      </div>

      {/* Aesthetic Border Glow */}
      <div className="absolute inset-0 border-[1px] border-white/5 rounded-[2.8rem] pointer-events-none group-hover:border-indigo-500/30 transition-colors" />
    </motion.div>
  );
};

export default ProductsPage;