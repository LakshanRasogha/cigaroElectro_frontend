"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Zap, Sparkles, Shield, Truck, Clock, Star, ArrowLeft, Heart,
  Share2, Maximize2, Package, Droplet, Gauge, Thermometer, ChevronRight, XCircle, Check
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

  // Sync gallery when variant changes
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

    // Visual Feedback Logic: Show Toast instead of redirecting
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-6">
      <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      <span className="font-mono text-xs font-black uppercase tracking-[0.3em] text-slate-400">Synchronizing...</span>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-6">
      <XCircle className="text-red-500 mb-6" size={60} />
      <h2 className="text-3xl font-bold text-slate-900 mb-3">Hardware Not Located</h2>
      <button onClick={() => router.back()} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold">Go Back</button>
    </div>
  );

  const currentVariant = product.variants?.[activeVariantIdx];
  const gallery = [...(product.productImage || []), ...(currentVariant?.variantImage || [])];

  return (
    <>
      <Navbar />
      
      {/* --- ADDED TO BAG NOTIFICATION (TOAST) --- */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[110] w-full max-w-md px-6"
          >
            <div className="bg-slate-900 text-white p-4 rounded-3xl shadow-2xl flex items-center justify-between border border-white/10 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center">
                  <Check size={20} strokeWidth={3} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-indigo-400">Added to Bag</p>
                  <p className="text-sm font-bold truncate max-w-[200px]">{currentVariant?.flavor} Edition</p>
                </div>
              </div>
              <button 
                onClick={() => router.push('/cart')}
                className="px-5 py-2.5 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-colors"
              >
                View Bag
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-[#F8FAFC] min-h-screen pt-32 pb-20 font-sans selection:bg-indigo-100">
        <section className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-12">
            <button onClick={() => router.push('/')} className="hover:text-indigo-600 transition-colors">Catalog</button>
            <ChevronRight size={14} />
            <span className="text-slate-600 font-bold uppercase tracking-widest text-[10px]">{product.category}</span>
            <ChevronRight size={14} />
            <span className="text-indigo-600 font-bold">{product.name}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start mb-32">
            
            {/* Left: Product Gallery */}
            <div className="space-y-6">
              <div className="relative sticky top-32">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={selectedImage + activeVariantIdx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                    className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-white border border-slate-200 shadow-2xl relative group"
                  >
                    <img 
                      src={gallery[selectedImage]} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      alt={product.name} 
                    />
                    <div className="absolute top-6 right-6 flex flex-col gap-3">
                      <button onClick={() => setIsWishlisted(!isWishlisted)} className="p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg">
                        <Heart size={20} className={isWishlisted ? "fill-red-500 text-red-500" : "text-slate-400"} />
                      </button>
                      <button className="p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg"><Share2 size={20} /></button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {gallery.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`min-w-[100px] h-[100px] rounded-2xl overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-indigo-600 scale-95 shadow-lg' : 'border-transparent opacity-60'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt="gallery" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Meta & Features */}
            <div className="space-y-10">
              <div className="space-y-4">
                <span className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 w-fit">
                  <Zap size={14} fill="currentColor" /> {product.category} Edition
                </span>
                <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-[0.9]">{product.name}</h1>
                <p className="text-xl text-slate-500 font-medium italic">"{product.tagline}"</p>
                <p className="text-lg text-slate-500 leading-relaxed max-w-xl">{product.description}</p>
              </div>

              {/* Specification Grid */}
              <div className="grid grid-cols-3 gap-6 py-8 border-y border-slate-100">
                <div className="text-center space-y-2">
                  <Droplet className="mx-auto text-indigo-600" size={24} />
                  <p className="text-[10px] font-black uppercase text-slate-400">Pure Flavor</p>
                </div>
                <div className="text-center space-y-2">
                  <Gauge className="mx-auto text-indigo-600" size={24} />
                  <p className="text-[10px] font-black uppercase text-slate-400">Efficiency</p>
                </div>
                <div className="text-center space-y-2">
                  <Thermometer className="mx-auto text-indigo-600" size={24} />
                  <p className="text-[10px] font-black uppercase text-slate-400">Stable Temp</p>
                </div>
              </div>

              {/* Master Pricing Card */}
              <div className="p-10 rounded-[3rem] bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 flex justify-between items-center">
                  <div>
                    <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-1">Market Listing</p>
                    <span className="text-5xl font-black tracking-tighter">Rs. {product.basePrice?.toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Local Courier</p>
                    <p className="font-bold text-xl">Rs. {product.deliveryFee}</p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full group-hover:bg-indigo-500/20 transition-all duration-700" />
              </div>

              <div className="flex items-center gap-6 text-slate-400">
                <div className="flex items-center gap-2"><Truck size={18} /> <span className="text-xs font-bold uppercase tracking-widest">Express Ship</span></div>
                <div className="flex items-center gap-2"><Shield size={18} /> <span className="text-xs font-bold uppercase tracking-widest">Secure Payments</span></div>
              </div>
            </div>
          </div>

          {/* Variants Section */}
          <div className="space-y-12">
            <div className="border-b border-slate-200 pb-8 flex items-end justify-between">
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Edition Variants<span className="text-indigo-600">.</span></h2>
              <div className="flex items-center gap-2 text-slate-400">
                <Sparkles size={16} className="text-indigo-600" />
                <span className="text-xs font-bold uppercase tracking-widest">{product.variants?.length} Flavors Active</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
    </>
  );
};

export default ProductDetailView;
//asdfsfd