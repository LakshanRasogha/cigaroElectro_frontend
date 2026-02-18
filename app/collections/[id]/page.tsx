"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Zap, Sparkles, Shield, Truck, Star, Heart,
  Share2, Droplet, Gauge, Thermometer, ChevronRight, XCircle, Check
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] gap-6">
      <div className="w-16 h-16 border-4 border-indigo-900 border-t-indigo-500 rounded-full animate-spin" />
      <span className="font-black text-[10px] uppercase tracking-[0.4em] text-zinc-500">Synchronizing Terminal...</span>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] text-center px-6">
      <XCircle className="text-rose-500 mb-6" size={64} />
      <h2 className="text-4xl font-black text-white mb-6 tracking-tighter">Hardware Not Located</h2>
      <button onClick={() => router.back()} className="px-10 py-4 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest">Return to Catalog</button>
    </div>
  );

  const currentVariant = product.variants?.[activeVariantIdx];
  const gallery = [...(product.productImage || []), ...(currentVariant?.variantImage || [])];

  return (
    <main className="bg-[#020617] min-h-screen selection:bg-indigo-500/30 overflow-x-hidden">
      <Navbar />
      
      {/* --- NOTIFICATION TOAST --- */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[110] w-full max-w-md px-6"
          >
            <div className="bg-zinc-900/90 backdrop-blur-2xl text-white p-5 rounded-[2rem] shadow-2xl flex items-center justify-between border border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <Check size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Inventory Assigned</p>
                  <p className="text-sm font-bold truncate max-w-[180px]">{currentVariant?.flavor}</p>
                </div>
              </div>
              <button 
                onClick={() => router.push('/cart')}
                className="px-6 py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-transform active:scale-95"
              >
                View Bag
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-32 pb-20 px-6 lg:px-10 relative">
        {/* Dynamic Background Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

        <section className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-3 text-zinc-500 mb-12">
            <button onClick={() => router.push('/collections')} className="hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">Catalog</button>
            <ChevronRight size={14} />
            <span className="text-indigo-400 font-black uppercase tracking-widest text-[10px]">{product.category}</span>
            <ChevronRight size={14} />
            <span className="text-white font-bold text-[10px] uppercase tracking-widest truncate max-w-[150px]">{product.name}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-20 items-start mb-40">
            
            {/* Left: Interactive Product Gallery */}
            <div className="space-y-8">
              <div className="relative sticky top-32">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={selectedImage + activeVariantIdx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="aspect-[4/5] rounded-[3.5rem] overflow-hidden bg-white/[0.02] border border-white/10 shadow-2xl relative group"
                  >
                    <img 
                      src={gallery[selectedImage]} 
                      className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" 
                      alt={product.name} 
                    />
                    <div className="absolute top-8 right-8 flex flex-col gap-4">
                      <button onClick={() => setIsWishlisted(!isWishlisted)} className="p-4 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                        <Heart size={20} className={isWishlisted ? "fill-rose-500 text-rose-500" : "text-white/70"} />
                      </button>
                      <button className="p-4 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                        <Share2 size={20} className="text-white/70" />
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {gallery.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`min-w-[110px] h-[110px] rounded-3xl overflow-hidden border-2 transition-all duration-500 ${selectedImage === idx ? 'border-indigo-500 scale-90 shadow-[0_0_20px_rgba(99,102,241,0.3)]' : 'border-transparent opacity-40 hover:opacity-100'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt="thumbnail" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Technical Meta & Controls */}
            <div className="space-y-12">
              <div className="space-y-6">
                <motion.span 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="px-5 py-2.5 bg-indigo-500/10 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-[0.4em] inline-flex items-center gap-3 border border-indigo-500/20 shadow-inner"
                >
                  <Zap size={14} className="fill-current" /> {product.category} Series Drop
                </motion.span>
                <h1 className="text-7xl font-black text-white tracking-tighter leading-[0.85]">{product.name}</h1>
                <p className="text-2xl text-zinc-400 font-light italic leading-relaxed">"{product.tagline}"</p>
                <p className="text-lg text-zinc-500 leading-relaxed max-w-xl font-light">{product.description}</p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-3 gap-8 py-10 border-y border-white/5">
                {[
                  { icon: Droplet, label: "Pure Flavor" },
                  { icon: Gauge, label: "High Efficiency" },
                  { icon: Thermometer, label: "Temp Control" }
                ].map((spec, i) => (
                  <div key={i} className="text-center group">
                    <spec.icon className="mx-auto text-indigo-400 mb-3 group-hover:scale-110 transition-transform" size={28} />
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">{spec.label}</p>
                  </div>
                ))}
              </div>

              {/* Pricing Module */}
              <div className="p-12 rounded-[3.5rem] bg-white/[0.03] backdrop-blur-3xl border border-white/10 shadow-2xl relative overflow-hidden group/price">
                <div className="relative z-10 flex justify-between items-center">
                  <div>
                    <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.5em] mb-3">Unit Valuation</p>
                    <span className="text-6xl font-black text-white tracking-tighter">Rs. {product.basePrice?.toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-2">Priority Delivery</p>
                    <p className="font-black text-2xl text-white">Rs. {product.deliveryFee}</p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 blur-[100px] rounded-full group-hover/price:bg-indigo-500/10 transition-colors duration-1000" />
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-10 pt-4">
                <div className="flex items-center gap-3 text-zinc-500"><Truck size={20} className="text-indigo-500" /> <span className="text-[10px] font-black uppercase tracking-widest">Global Express</span></div>
                <div className="flex items-center gap-3 text-zinc-500"><Shield size={20} className="text-cyan-500" /> <span className="text-[10px] font-black uppercase tracking-widest">Encrypted Checkout</span></div>
              </div>
            </div>
          </div>

          {/* Variants Selection Section */}
          <div className="space-y-16">
            <div className="border-b border-white/5 pb-10 flex items-end justify-between">
              <h2 className="text-5xl font-black text-white tracking-tighter uppercase">Available Editions<span className="text-indigo-500">.</span></h2>
              <div className="flex items-center gap-4 text-zinc-500">
                <Sparkles size={18} className="text-indigo-400" />
                <span className="text-[10px] font-black uppercase tracking-widest">{product.variants?.length} Active Profiles</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
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