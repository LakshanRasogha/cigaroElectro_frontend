"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Zap, Loader2, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation'; // Added useRouter
import axios from 'axios';
import Navbar from '@/app/componenets/navbar';
import VariantCard from '@/app/componenets/variant_card';

/**
 * --- MAIN VIEW: ProductDetailView ---
 */
const ProductDetailView = () => {
  const params = useParams();
  const router = useRouter(); // Initialize the router for redirection
  const productKey = params.id; 

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeVariantIdx, setActiveVariantIdx] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/products/getOne/${productKey}`);
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

  /**
   * FIXED: handleAddToCart logic
   * Saves the item to localStorage and redirects to /cart
   */
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
    
    // Dispatch event for Navbar to listen to
    window.dispatchEvent(new Event('cartUpdated'));

    // REDIRECT LOGIC: 
    // We wait 800ms so the user sees the "Added" success state on the VariantCard
    setTimeout(() => {
      router.push('/cart');
    }, 800);
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
      <span className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Syncing Warehouse...</span>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-6">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Hardware Not Found</h2>
      <p className="text-slate-500">Record "{productKey}" could not be located.</p>
    </div>
  );

  const currentVariant = product.variants?.[activeVariantIdx];
  const gallery = [...(product.productImage || []), ...(currentVariant?.variantImage || [])];

  return (
    <>
      <Navbar />
      <div className="bg-[#FFFFFF] min-h-screen pt-32 pb-20 font-sans selection:bg-indigo-100">
        <section className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-start mb-32">
            
            {/* Left: Dynamic Image Display */}
            <div className="relative sticky top-32">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={`${activeVariantIdx}`}
                  initial={{ opacity: 0, scale: 0.95, filter: "blur(15px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-2xl relative"
                >
                  <img src={gallery[0]} className="w-full h-full object-cover" alt={product.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent pointer-events-none" />
                </motion.div>
              </AnimatePresence>
              
              <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="absolute -bottom-6 -right-6 bg-white p-8 rounded-[2.5rem] shadow-2xl max-w-xs border border-slate-50 hidden md:block"
              >
                  <p className="text-sm font-bold text-slate-900 leading-snug italic">"{product.tagline}"</p>
              </motion.div>
            </div>

            {/* Right: Info & Pricing */}
            <div className="space-y-12">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
                  <Zap size={14} fill="currentColor" /> {product.category} Series
                </span>
                <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                  {product.name}
                </h1>
                <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
                  {product.description}
                </p>
              </div>

              <div className="p-10 rounded-[3rem] bg-slate-900 text-white shadow-2xl shadow-indigo-100 relative overflow-hidden group">
                 <div className="relative z-10 flex justify-between items-center">
                    <div>
                      <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-1">Base Series Pricing</p>
                      <span className="text-5xl font-black tracking-tighter">
                        Rs. {product.basePrice?.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Courier Fee</p>
                      <p className="font-bold text-xl">Rs. {product.deliveryFee}</p>
                    </div>
                 </div>
                 <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full group-hover:bg-indigo-500/20 transition-colors duration-700" />
              </div>
            </div>
          </div>

          <div className="space-y-12">
            <div className="flex items-end justify-between border-b border-slate-100 pb-8">
              <div className="space-y-2">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Edition Variants<span className="text-indigo-600">.</span></h2>
                  <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Select hardware flavor profile</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {product.variants?.map((v: any, idx: number) => (
                <VariantCard 
                  key={v.vKey || v._id || idx} 
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