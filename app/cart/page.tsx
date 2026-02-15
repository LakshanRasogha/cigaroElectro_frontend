"use client";

import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Loader2 } from 'lucide-react';
import gsap from 'gsap';
import Navbar from '@/app/componenets/navbar';
import Footer from '@/app/componenets/footer';

const CartPage = () => {
  // 1. Initialize state from localStorage
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(true);
  const containerRef = useRef(null);

  // 2. Load Cart Data on Mount
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

  // 3. Persist changes back to localStorage whenever cartItems changes
  useEffect(() => {
    if (!isSyncing) {
      localStorage.setItem('bag', JSON.stringify(cartItems));
      // Dispatch custom event to update Navbar count in real-time
      window.dispatchEvent(new Event('cartUpdated'));
    }
  }, [cartItems, isSyncing]);

  // GSAP Entrance Animations
  useLayoutEffect(() => {
    if (isSyncing) return;
    const ctx = gsap.context(() => {
      gsap.from(".cart-animate", {
        y: 30,
        opacity: 0,
        filter: "blur(10px)",
        stagger: 0.1,
        duration: 0.8,
        ease: "power4.out"
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

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalDelivery = cartItems.length > 0 ? (cartItems[0].delivery || 0) : 0; 
  const total = subtotal + totalDelivery;

  if (isSyncing) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  return (
    <>
      <Navbar />
      <div ref={containerRef} className="bg-white min-h-screen pt-32 font-sans selection:bg-indigo-100">
        <div className="max-w-7xl mx-auto px-6 pb-32">
          <header className="mb-16 cart-animate">
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter">
              Your <span className="italic text-slate-300">Bag.</span>
            </h1>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-4">
              {cartItems.length} hardware units ready for dispatch
            </p>
          </header>

          <div className="grid lg:grid-cols-3 gap-16">
            {/* --- ITEMS LIST --- */}
            <div className="lg:col-span-2 space-y-8">
              <AnimatePresence mode="popLayout">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <motion.div 
                      key={item.cartId}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="group relative flex flex-col md:flex-row items-center gap-8 p-8 rounded-[3rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500"
                    >
                      {/* Item Image */}
                      <div className="w-40 h-40 rounded-[2rem] overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                        <img 
                          src={item.image || "https://via.placeholder.com/150"} 
                          alt={item.flavor} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                      </div>

                      {/* Item Info */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{item.emoji}</span>
                          <p className="text-indigo-600 font-black text-[10px] tracking-widest uppercase">Edition Variant</p>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{item.name}</h3>
                        <p className="text-slate-500 font-bold italic">{item.flavor}</p>
                        <p className="text-slate-400 font-mono text-sm">Rs. {item.price.toLocaleString()}</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-6 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                        <button 
                          onClick={() => updateQuantity(item.cartId, -1)} 
                          className="p-2 hover:bg-white rounded-xl transition-colors"
                        >
                          <Minus size={16}/>
                        </button>
                        <span className="font-black text-slate-900 w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.cartId, 1)} 
                          className="p-2 hover:bg-white rounded-xl transition-colors"
                        >
                          <Plus size={16}/>
                        </button>
                      </div>

                      {/* Remove */}
                      <button 
                        onClick={() => removeItem(item.cartId)}
                        className="p-4 text-slate-300 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-20 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                    <ShoppingBag size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Your bag is currently empty</p>
                    <button 
                      onClick={() => window.location.href = '/collections'} 
                      className="mt-6 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] hover:underline"
                    >
                      Back to Inventory
                    </button>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* --- SUMMARY SIDEBAR --- */}
            <div className="cart-animate">
              <div className="sticky top-32 p-10 rounded-[3rem] bg-slate-900 text-white shadow-2xl shadow-indigo-100 overflow-hidden relative">
                <h2 className="text-3xl font-black mb-10 tracking-tighter uppercase">Summary</h2>
                
                <div className="space-y-6 mb-10">
                  <div className="flex justify-between text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                    <span>Subtotal</span>
                    <span className="text-white">Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                    <span>Delivery Fee</span>
                    <span className="text-white">Rs. {totalDelivery.toLocaleString()}</span>
                  </div>
                  <div className="h-[1px] bg-white/10 w-full" />
                  <div className="flex justify-between items-end">
                    <span className="text-indigo-400 font-black uppercase text-xs tracking-widest">Total Order</span>
                    <span className="text-5xl font-black tracking-tighter">Rs. {total.toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  disabled={cartItems.length === 0}
                  className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-2xl font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-4 transition-all shadow-xl shadow-indigo-500/20"
                >
                  Secure Checkout <ArrowRight size={16} />
                </button>

                {/* Aesthetic Background Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full" />
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