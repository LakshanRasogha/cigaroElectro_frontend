"use client";

import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Loader2, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import Navbar from '@/app/componenets/navbar';
import Footer from '@/app/componenets/footer';

const CartPage = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(true);
  const containerRef = useRef(null);

  // 1. Load Cart Data on Mount
  useEffect(() => {
    const savedBag = localStorage.getItem('bag');
    if (savedBag) {
      try {
        setCartItems(JSON.parse(savedBag));
      } catch (err) {
        console.error("Failed to parse cart data:", err);
      }
    }
    setIsSyncing(false);
  }, []);

  // 2. Persist changes back to localStorage
  useEffect(() => {
    if (!isSyncing) {
      localStorage.setItem('bag', JSON.stringify(cartItems));
      window.dispatchEvent(new Event('cartUpdated'));
    }
  }, [cartItems, isSyncing]);

  // GSAP Entrance Animations
  useLayoutEffect(() => {
    if (isSyncing) return;
    const ctx = gsap.context(() => {
      gsap.from(".cart-animate", {
        y: 40,
        opacity: 0,
        filter: "blur(15px)",
        stagger: 0.1,
        duration: 1,
        ease: "expo.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, [isSyncing]);

  const updateQuantity = (cartId: string, delta: number) => {
    setCartItems(prev => prev.map(item => 
      item.cartId === cartId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeItem = (cartId: string) => {
    setCartItems(prev => prev.filter(item => item.cartId !== cartId));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalDelivery = cartItems.length > 0 ? (cartItems[0].delivery || 0) : 0; 
  const total = subtotal + totalDelivery;

  if (isSyncing) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#020617]">
      <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
      <p className="text-zinc-500 font-black text-[10px] uppercase tracking-[0.4em]">Syncing Terminal...</p>
    </div>
  );

  return (
    <>
      <Navbar />
      <div ref={containerRef} className="bg-[#020617] min-h-screen pt-32 relative overflow-hidden selection:bg-indigo-500/30">
        
        {/* --- VIDEO BACKGROUND LAYER --- */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src="/vape2.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-transparent to-[#020617]" />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="max-w-7xl mx-auto px-6 pb-32 relative z-10">
          <header className="mb-16 cart-animate">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="text-indigo-400 w-4 h-4" />
              <span className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.5em]">Inventory Status</span>
            </div>
            <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-none">
              Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 italic">Bag.</span>
            </h1>
            <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-6 border-l border-white/10 pl-6">
              {cartItems.length} hardware units ready for dispatch
            </p>
          </header>

          <div className="grid lg:grid-cols-3 gap-16">
            {/* --- ITEMS LIST --- */}
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence mode="popLayout">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <motion.div 
                      key={item.cartId}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="group relative flex flex-col md:flex-row items-center gap-8 p-8 rounded-[3rem] bg-white/[0.03] backdrop-blur-3xl border border-white/10 hover:border-white/20 transition-all duration-500"
                    >
                      {/* Item Image */}
                      <div className="w-44 h-44 rounded-[2.5rem] overflow-hidden bg-zinc-900 border border-white/5 shrink-0">
                        <img 
                          src={item.image || "https://via.placeholder.com/150"} 
                          alt={item.flavor} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80" 
                        />
                      </div>

                      {/* Item Info */}
                      <div className="flex-1 space-y-3 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3">
                          <span className="text-2xl drop-shadow-lg">{item.emoji}</span>
                          <p className="text-indigo-400 font-black text-[9px] tracking-[0.3em] uppercase">Elite Variant</p>
                        </div>
                        <h3 className="text-3xl font-bold text-white tracking-tight leading-none">{item.name}</h3>
                        <p className="text-zinc-400 font-medium italic">{item.flavor}</p>
                        <p className="text-indigo-400 font-mono text-lg font-black">Rs. {item.price.toLocaleString()}</p>
                      </div>

                      {/* Quantity & Delete Controls */}
                      <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center gap-6 bg-white/5 p-2 rounded-2xl border border-white/10">
                          <button 
                            onClick={() => updateQuantity(item.cartId, -1)} 
                            className="p-3 text-white hover:bg-white/10 rounded-xl transition-colors"
                          >
                            <Minus size={14}/>
                          </button>
                          <span className="font-black text-white w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.cartId, 1)} 
                            className="p-3 text-white hover:bg-white/10 rounded-xl transition-colors"
                          >
                            <Plus size={14}/>
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => removeItem(item.cartId)}
                          className="flex items-center gap-2 text-zinc-600 hover:text-rose-500 transition-colors text-[10px] font-black uppercase tracking-widest"
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-32 text-center bg-white/[0.02] backdrop-blur-xl rounded-[4rem] border border-dashed border-white/10">
                    <ShoppingBag size={64} className="mx-auto text-zinc-800 mb-6" />
                    <p className="text-zinc-500 font-black text-[10px] uppercase tracking-[0.5em] mb-8">Terminal Empty: No Assets Detected</p>
                    <button 
                      onClick={() => window.location.href = '/collections'} 
                      className="group relative bg-white text-black px-10 py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] transition-all hover:scale-105 active:scale-95"
                    >
                      Re-Initialize Discovery
                    </button>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* --- SUMMARY SIDEBAR --- */}
            <div className="cart-animate">
              <div className="sticky top-32 p-10 rounded-[3.5rem] bg-white/[0.03] backdrop-blur-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                <h2 className="text-3xl font-black mb-10 tracking-tighter uppercase text-white">Summary</h2>
                
                <div className="space-y-6 mb-12">
                  <div className="flex justify-between text-zinc-500 font-bold uppercase text-[10px] tracking-widest">
                    <span>Subtotal</span>
                    <span className="text-white">Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500 font-bold uppercase text-[10px] tracking-widest">
                    <span>Delivery</span>
                    <span className="text-white">Rs. {totalDelivery.toLocaleString()}</span>
                  </div>
                  <div className="h-[1px] bg-white/5 w-full" />
                  <div className="flex flex-col gap-2">
                    <span className="text-indigo-400 font-black uppercase text-[10px] tracking-[0.3em]">Total Terminal Order</span>
                    <span className="text-5xl font-black text-white tracking-tighter">Rs. {total.toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  disabled={cartItems.length === 0}
                  className="w-full py-7 bg-white text-black disabled:bg-zinc-800 disabled:text-zinc-600 rounded-3xl font-black uppercase tracking-[0.4em] text-[10px] flex items-center justify-center gap-4 transition-all hover:bg-indigo-500 hover:text-white group"
                >
                  Confirm Dispatch <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-500" />
                </button>

                {/* Aesthetic Detail */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 blur-[80px] rounded-full" />
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default CartPage;