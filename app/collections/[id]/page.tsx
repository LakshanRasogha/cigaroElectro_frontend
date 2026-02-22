"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Zap, Sparkles, Shield, Truck, Heart,
  Share2, Droplet, Gauge, Thermometer, ChevronRight, XCircle, Check,
  Star, Clock, Award
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/app/componenets/navbar';
import VariantCard from '@/app/componenets/variant_card';

const ProductDetailView = () => {
  const params = useParams();
  const router = useRouter();
  const productKey = params.id;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeVariantIdx, setActiveVariantIdx] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/products/getOne/${productKey}`);
        const data = response.data;
        
        if (Array.isArray(data)) {
          const found = data.find((p: any) => p.key === productKey || p._id === productKey);
          setProduct(found || null);
        } else {
          setProduct(data);
        }
      } catch (error) {
        console.error("Error fetching inventory data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (productKey) fetchData();
  }, [productKey]);

  useEffect(() => {
    setSelectedImage(0);
  }, [activeVariantIdx]);

  const handleAddToCart = (variant: any) => {
    const cartItem = {
      cartId: `${product.key}-${variant.vKey}`,
      key: product.key, 
      vKey: variant.vKey,
      productId: product._id,
      name: product.name,
      flavor: variant.flavor,
      emoji: variant.emoji,
      price: product.basePrice,
      delivery: product.deliveryFee,
      image: variant.variantImage?.[0] || product.productImage?.[0],
      quantity: 1,
    };

    const existingCart = JSON.parse(localStorage.getItem('bag') || '[]');
    const itemIndex = existingCart.findIndex((item: any) => item.cartId === cartItem.cartId);
    
    if (itemIndex > -1) {
      existingCart[itemIndex].quantity += 1;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem('bag', JSON.stringify(existingCart));
    window.dispatchEvent(new Event('cartUpdated'));

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#030303] gap-6">
      {/* Animated background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_#1a1a1a,_#000000)]" />
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="relative"
      >
        <div className="w-16 h-16 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
      </motion.div>
      <span className="font-black text-[8px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.4em] text-zinc-700">
        Synchronizing Terminal...
      </span>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#030303] text-center px-4 sm:px-6">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_#1a1a1a,_#000000)]" />
      <div className="relative z-10">
        <XCircle className="text-[#D4AF37]/50 mb-4 sm:mb-6" size={48} />
        <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 sm:mb-6 tracking-tighter">Hardware Not Located</h2>
        <button 
          onClick={() => router.back()} 
          className="px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-[#D4AF37] to-[#B49450] text-black rounded-xl sm:rounded-2xl font-black uppercase text-[8px] sm:text-[10px] tracking-widest hover:shadow-[0_10px_30px_rgba(212,175,55,0.3)] transition-all duration-300"
        >
          Return to Catalog
        </button>
      </div>
    </div>
  );

  const currentVariant = product.variants?.[activeVariantIdx];
  const gallery = [...(product.productImage || []), ...(currentVariant?.variantImage || [])];

  return (
    <main className="bg-[#030303] min-h-screen selection:bg-[#D4AF37]/30 overflow-x-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1a1a1a,_#000000)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMTBhMjAgMjAgMCAwIDEgMjAgMjAgMjAgMjAgMCAwIDEtNDAgMCAyMCAyMCAwIDAgMSAyMC0yMHoiIGZpbGw9IiNENEFGMzciIGZpbGwtb3BhY2l0eT0iMC4wMyIvPjwvc3ZnPg==')] opacity-20" />
        
        {/* Animated gold orbs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 right-20 w-96 h-96 bg-[#D4AF37] rounded-full blur-[128px] opacity-10"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-[#D4AF37] rounded-full blur-[128px] opacity-10"
        />
      </div>

      <Navbar />
      
      {/* --- NOTIFICATION TOAST - Gold themed --- */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-[110] w-full max-w-[90%] sm:max-w-md px-3 sm:px-6"
          >
            <div className="bg-gradient-to-br from-zinc-900 to-black backdrop-blur-2xl text-white p-3 sm:p-5 rounded-2xl sm:rounded-[2rem] shadow-2xl flex items-center justify-between border border-[#D4AF37]/30">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#D4AF37] to-[#B49450] rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
                  <Check size={16} className="text-black" />
                </div>
                <div>
                  <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">Inventory Assigned</p>
                  <p className="text-xs sm:text-sm font-bold truncate max-w-[120px] sm:max-w-[180px]">{currentVariant?.flavor}</p>
                </div>
              </div>
              <button 
                onClick={() => router.push('/cart')}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#D4AF37] to-[#B49450] text-black rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 hover:shadow-[0_5px_20px_rgba(212,175,55,0.3)]"
              >
                View Bag
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-10">
        <section className="max-w-7xl mx-auto">
          {/* Breadcrumbs - Mobile optimized */}
          <div className="flex items-center gap-1 sm:gap-3 text-zinc-600 mb-6 sm:mb-8 md:mb-12 overflow-x-auto pb-2 no-scrollbar">
            <button onClick={() => router.push('/collections')} className="hover:text-[#D4AF37] transition-colors text-[8px] sm:text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Catalog</button>
            <ChevronRight size={10} className="sm:hidden" />
            <ChevronRight size={14} className="hidden sm:block" />
            <span className="text-[#D4AF37] font-black uppercase tracking-widest text-[8px] sm:text-[10px] whitespace-nowrap">{product.category}</span>
            <ChevronRight size={10} className="sm:hidden" />
            <ChevronRight size={14} className="hidden sm:block" />
            <span className="text-white font-bold text-[8px] sm:text-[10px] uppercase tracking-widest truncate max-w-[100px] sm:max-w-[150px]">{product.name}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-start mb-20 sm:mb-30 lg:mb-40">
            
            {/* Left: Gallery - Mobile optimized */}
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              <div className="relative sticky top-24 sm:top-28 lg:top-32">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={selectedImage + activeVariantIdx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="aspect-[4/5] rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] lg:rounded-[3.5rem] overflow-hidden bg-white/[0.02] border border-white/10 shadow-2xl relative group"
                  >
                    <img 
                      src={gallery[selectedImage] || product.productImage?.[0]} 
                      className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" 
                      alt={product.name} 
                    />
                    <div className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 flex flex-col gap-2 sm:gap-3 md:gap-4">
                      <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsWishlisted(!isWishlisted)} 
                        className="p-2 sm:p-3 md:p-4 bg-black/60 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/10 hover:bg-[#D4AF37]/20 transition-colors"
                      >
                        <Heart size={16} className={`sm:hidden ${isWishlisted ? "fill-[#D4AF37] text-[#D4AF37]" : "text-white/70"}`} />
                        <Heart size={20} className={`hidden sm:block ${isWishlisted ? "fill-[#D4AF37] text-[#D4AF37]" : "text-white/70"}`} />
                      </motion.button>
                      <motion.button 
                        whileTap={{ scale: 0.9 }}
                        className="p-2 sm:p-3 md:p-4 bg-black/60 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/10 hover:bg-[#D4AF37]/20 transition-colors"
                      >
                        <Share2 size={16} className="sm:hidden text-white/70" />
                        <Share2 size={20} className="hidden sm:block text-white/70" />
                      </motion.button>
                    </div>

                    {/* Gold accent on hover */}
                    <motion.div 
                      animate={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 border-2 border-[#D4AF37]/30 rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] lg:rounded-[3.5rem] pointer-events-none"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Thumbnails - Mobile optimized scroll */}
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#030303] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#030303] to-transparent z-10 pointer-events-none" />
                
                <div className="flex gap-2 sm:gap-3 md:gap-4 overflow-x-auto pb-4 no-scrollbar px-2">
                  {gallery.map((img: string, idx: number) => (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`min-w-[70px] sm:min-w-[90px] md:min-w-[110px] h-[70px] sm:h-[90px] md:h-[110px] rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden border-2 transition-all duration-500 flex-shrink-0 ${
                        selectedImage === idx 
                          ? 'border-[#D4AF37] scale-95 shadow-[0_0_20px_rgba(212,175,55,0.3)]' 
                          : 'border-transparent opacity-40 hover:opacity-100'
                      }`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt="thumbnail" />
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Controls - Mobile optimized */}
            <div className="space-y-6 sm:space-y-8 lg:space-y-12">
              <div className="space-y-4 sm:space-y-5 lg:space-y-6">
                <motion.span 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.4em] inline-flex items-center gap-1 sm:gap-2 md:gap-3 border border-[#D4AF37]/20 shadow-inner"
                >
                  <Zap size={10} className="sm:hidden fill-current" />
                  <Zap size={12} className="hidden sm:block md:hidden fill-current" />
                  <Zap size={14} className="hidden md:block fill-current" />
                  <span className="hidden sm:inline">{product.category} Series Drop</span>
                  <span className="sm:hidden">{product.category}</span>
                </motion.span>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white tracking-tighter leading-[0.9] sm:leading-[0.85]">
                  {product.name}
                </h1>
                
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-zinc-400 font-light italic leading-relaxed">
                  "{product.tagline}"
                </p>
                
                <p className="text-xs sm:text-sm md:text-base text-zinc-500 leading-relaxed max-w-xl font-light">
                  {product.description}
                </p>
              </div>

              {/* Specs - Mobile optimized grid */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 py-6 sm:py-8 lg:py-10 border-y border-white/5">
                {[
                  { icon: Droplet, label: "Pure Flavor" },
                  { icon: Gauge, label: "High Efficiency" },
                  { icon: Thermometer, label: "Temp Control" }
                ].map((spec, i) => (
                  <div key={i} className="text-center group">
                    <spec.icon className="mx-auto text-[#D4AF37] mb-1 sm:mb-2 md:mb-3 group-hover:scale-110 transition-transform" size={18} />
                    <p className="text-[7px] sm:text-[8px] md:text-[9px] font-black uppercase tracking-widest text-zinc-600">{spec.label}</p>
                  </div>
                ))}
              </div>

              {/* Pricing - Mobile optimized */}
              <div className="p-4 sm:p-6 md:p-8 lg:p-12 rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] lg:rounded-[3.5rem] bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-3xl border border-white/10 shadow-2xl relative overflow-hidden group/price">
                <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                  <div>
                    <p className="text-[#D4AF37] text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.5em] mb-1 sm:mb-2 md:mb-3">
                      Unit Valuation
                    </p>
                    <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white tracking-tighter">
                      Rs. {product.basePrice?.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-zinc-600 text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-1 sm:mb-2">
                      Priority Delivery
                    </p>
                    <p className="font-black text-lg sm:text-xl md:text-2xl text-white">
                      Rs. {product.deliveryFee?.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-40 sm:w-60 md:w-80 h-40 sm:h-60 md:h-80 bg-[#D4AF37]/5 blur-[60px] sm:blur-[80px] md:blur-[100px] rounded-full group-hover/price:bg-[#D4AF37]/10 transition-colors duration-1000" />
              </div>

              {/* Features */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 lg:gap-10 pt-2 sm:pt-4">
                <div className="flex items-center gap-2 sm:gap-3 text-zinc-500">
                  <Truck size={16} className="sm:hidden text-[#D4AF37]" />
                  <Truck size={18} className="hidden sm:block md:hidden text-[#D4AF37]" />
                  <Truck size={20} className="hidden md:block text-[#D4AF37]" />
                  <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-widest">Global Express</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-zinc-500">
                  <Shield size={16} className="sm:hidden text-[#D4AF37]" />
                  <Shield size={18} className="hidden sm:block md:hidden text-[#D4AF37]" />
                  <Shield size={20} className="hidden md:block text-[#D4AF37]" />
                  <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-widest">Encrypted Checkout</span>
                </div>
              </div>
            </div>
          </div>

          {/* Variants Section - Mobile optimized */}
          <div className="space-y-8 sm:space-y-12 lg:space-y-16">
            <div className="border-b border-white/5 pb-6 sm:pb-8 lg:pb-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tighter uppercase">
                Available Editions
                <span className="text-[#D4AF37]">.</span>
              </h2>
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-zinc-500">
                <Sparkles size={14} className="sm:hidden text-[#D4AF37]" />
                <Sparkles size={16} className="hidden sm:block md:hidden text-[#D4AF37]" />
                <Sparkles size={18} className="hidden md:block text-[#D4AF37]" />
                <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                  {product.variants?.length} Active Profiles
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 xl:gap-10">
              {product.variants?.map((v: any, idx: number) => (
                <VariantCard 
                  key={v.vKey || idx} 
                  variant={v} 
                  index={idx} 
                  isActive={activeVariantIdx === idx}
                  onSelect={() => {
                    setActiveVariantIdx(idx);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProductDetailView;