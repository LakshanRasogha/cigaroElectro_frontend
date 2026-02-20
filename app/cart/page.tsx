"use client";

import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, Plus, Minus, ArrowRight, ShoppingBag, Loader2, 
  Sparkles, MapPin, X, Home, CheckCircle2, Phone, Zap,
  Shield, Award, Truck, Clock
} from 'lucide-react';
import gsap from 'gsap';
import Navbar from '@/app/componenets/navbar';
import Footer from '@/app/componenets/footer';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const CartPage = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(true);
  const [isOrderLoading, setIsOrderLoading] = useState(false);
  
  // Modal & Address States
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [addressOption, setAddressOption] = useState<'profile' | 'new'>('profile');
  const [newAddress, setNewAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  });

  const containerRef = useRef(null);

  // 1. Initialize Terminal Data
  useEffect(() => {
    const savedBag = localStorage.getItem('bag');
    console.log("Initializing Cart Terminal. Retrieved Bag:", savedBag);
    const storedUser = localStorage.getItem('user');
    
    if (savedBag) {
      try { 
        setCartItems(JSON.parse(savedBag)); 
      } catch (err) { 
        console.error("Cart Sync Error:", err); 
      }
    }
    if (storedUser) {
      try { 
        setUser(JSON.parse(storedUser)); 
      } catch (err) { 
        console.error("User Sync Error:", err); 
      }
    }
    setIsSyncing(false);
  }, []);

  // 2. Persist Bag Changes
  useEffect(() => {
    if (!isSyncing) {
      localStorage.setItem('bag', JSON.stringify(cartItems));
      window.dispatchEvent(new Event('cartUpdated'));
    }
  }, [cartItems, isSyncing]);

  // Entrance Animations
  useLayoutEffect(() => {
    if (isSyncing) return;
    const ctx = gsap.context(() => {
      gsap.from(".cart-animate", {
        y: 40, opacity: 0, filter: "blur(15px)", stagger: 0.1, duration: 1, ease: "expo.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, [isSyncing]);

  // 3. Handle Order Submission
  const handleOrder = async () => {
    if (!user) {
      alert("Terminal Access Denied. Please login to complete dispatch.");
      return router.push('/auth/login');
    }

    setIsOrderLoading(true);

    const shippingAddress = addressOption === 'profile' 
      ? {
          address: user.address?.address || "",
          city: user.address?.city || "",
          postalCode: user.address?.postalCode || "",
          phone: user.phone || ""
        }
      : newAddress;

    const orderPayload = {
      orderedItems: cartItems.map(item => ({
        key: item.key,
        vKey: item.vKey,
        qty: item.quantity
      })),
      shippingAddress
    };

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API}/api/orders/create`, orderPayload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (res.status === 201 || res.status === 200) {
        setCartItems([]);
        localStorage.removeItem('bag');
        window.dispatchEvent(new Event('cartUpdated'));
        setShowAddressModal(false);
        router.push('/profile'); 
      }
    } catch (err: any) {
      console.error("Transmission Error:", err);
      alert(err.response?.data?.message || "Dispatch failure. Check network connection.");
    } finally {
      setIsOrderLoading(false);
    }
  };

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#030303] gap-6">
      {/* Animated background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_#1a1a1a,_#000000)]" />
      
      {/* Gold spinning loader */}
      <div className="relative">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-[#D4AF37] rounded-full blur-xl opacity-20"
        />
      </div>
      <p className="text-zinc-700 font-black text-[8px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.4em]">
        Syncing Terminal...
      </p>
    </div>
  );

  return (
    <>
      <Navbar />
      <div ref={containerRef} className="bg-[#030303] min-h-screen pt-20 sm:pt-24 md:pt-32 relative overflow-hidden selection:bg-[#D4AF37]/30">
        
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

        {/* Video background (optional) */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-20 sm:opacity-30">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src="/vape2.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-transparent to-[#030303]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20 md:pb-32 relative z-10">
          <header className="mb-10 sm:mb-12 md:mb-16 cart-animate">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="p-1 sm:p-1.5 bg-[#D4AF37]/10 rounded-lg border border-[#D4AF37]/20">
                <Sparkles className="text-[#D4AF37] w-3 h-3 sm:w-4 sm:h-4" />
              </div>
              <span className="text-[#D4AF37] font-black text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.5em]">
                Inventory Status
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-black text-white tracking-tighter leading-none uppercase">
              Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F2D37D] to-[#AA771C] italic">Bag.</span>
            </h1>
          </header>

          <div className="grid lg:grid-cols-3 gap-8 sm:gap-10 md:gap-16">
            <div className="lg:col-span-2 space-y-4 sm:space-y-5 md:space-y-6">
              <AnimatePresence mode="popLayout">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <motion.div 
                      key={item.cartId} 
                      layout 
                      initial={{ opacity: 0, scale: 0.95 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      exit={{ opacity: 0, x: -50 }}
                      className="group relative flex flex-col md:flex-row items-center gap-4 sm:gap-6 md:gap-8 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl md:rounded-[3rem] bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-3xl border border-white/10 transition-all duration-500 shadow-2xl hover:border-[#D4AF37]/30"
                    >
                      {/* Gold accent on hover */}
                      <div className="absolute inset-0 rounded-2xl sm:rounded-3xl md:rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                        style={{ boxShadow: 'inset 0 0 30px rgba(212,175,55,0.1), 0 0 30px rgba(212,175,55,0.1)' }}
                      />
                      
                      <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-44 rounded-xl sm:rounded-2xl md:rounded-[2.5rem] overflow-hidden bg-zinc-900 border border-white/5 shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" />
                      </div>
                      
                      <div className="flex-1 space-y-1 sm:space-y-2 md:space-y-3 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-1 sm:gap-2 md:gap-3">
                          <span className="text-xl sm:text-2xl">{item.emoji}</span>
                          <p className="text-[#D4AF37] font-black text-[7px] sm:text-[8px] md:text-[9px] tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em] uppercase">
                            Authorized Hardware
                          </p>
                        </div>
                        
                        <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-none uppercase">
                          {item.name}
                        </h3>
                        
                        <p className="text-xs sm:text-sm md:text-base text-zinc-400 font-medium italic">
                          {item.flavor}
                        </p>
                        
                        <div className="flex items-center justify-center md:justify-start gap-2 sm:gap-3">
                          <p className="text-[#D4AF37] font-mono text-base sm:text-lg md:text-xl font-black">
                            Rs. {item.price.toLocaleString()}
                          </p>
                          {item.delivery > 0 && (
                            <span className="text-[8px] sm:text-[9px] md:text-[10px] text-zinc-600 font-black uppercase tracking-wider flex items-center gap-1">
                              <Truck size={8} className="sm:hidden" />
                              <Truck size={10} className="hidden sm:block" />
                              +{item.delivery}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center gap-3 sm:gap-4">
                        <div className="flex items-center gap-3 sm:gap-4 md:gap-6 bg-white/5 p-1 sm:p-1.5 md:p-2 rounded-xl sm:rounded-2xl border border-white/10">
                          <motion.button 
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.cartId, -1)} 
                            className="p-2 sm:p-2.5 md:p-3 text-white hover:bg-[#D4AF37]/20 rounded-lg sm:rounded-xl transition-colors"
                          >
                            <Minus size={10} className="sm:hidden" />
                            <Minus size={12} className="hidden sm:block md:hidden" />
                            <Minus size={14} className="hidden md:block" />
                          </motion.button>
                          
                          <span className="font-black text-white text-sm sm:text-base w-4 sm:w-5 text-center">
                            {item.quantity}
                          </span>
                          
                          <motion.button 
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.cartId, 1)} 
                            className="p-2 sm:p-2.5 md:p-3 text-white hover:bg-[#D4AF37]/20 rounded-lg sm:rounded-xl transition-colors"
                          >
                            <Plus size={10} className="sm:hidden" />
                            <Plus size={12} className="hidden sm:block md:hidden" />
                            <Plus size={14} className="hidden md:block" />
                          </motion.button>
                        </div>
                        
                        <motion.button 
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeItem(item.cartId)} 
                          className="flex items-center gap-1 sm:gap-2 text-zinc-600 hover:text-rose-500 transition-colors text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-black uppercase"
                        >
                          <Trash2 size={10} className="sm:hidden" />
                          <Trash2 size={12} className="hidden sm:block md:hidden" />
                          <Trash2 size={14} className="hidden md:block" />
                          <span className="hidden xs:inline">Remove</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-16 sm:py-20 md:py-32 text-center bg-gradient-to-br from-white/[0.02] to-white/[0.01] backdrop-blur-xl rounded-3xl sm:rounded-4xl md:rounded-[4rem] border border-dashed border-white/10"
                  >
                    <ShoppingBag size={40} className="mx-auto text-zinc-800 mb-4 sm:mb-6" />
                    <p className="text-zinc-600 font-black text-[8px] sm:text-[9px] md:text-[10px] uppercase mb-6 sm:mb-8 tracking-[0.2em] sm:tracking-[0.3em]">
                      No Assets Logged
                    </p>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => router.push('/collections')} 
                      className="bg-gradient-to-r from-[#D4AF37] to-[#B49450] text-black px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl font-black text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-widest hover:shadow-[0_10px_30px_rgba(212,175,55,0.3)] transition-all"
                    >
                      Initialize discovery
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* --- SUMMARY SIDEBAR - Gold Themed --- */}
            <div className="cart-animate">
              <div className="sticky top-20 sm:top-24 md:top-32 p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl md:rounded-[3.5rem] bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-3xl border border-white/10 shadow-2xl">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black mb-6 sm:mb-8 md:mb-10 uppercase text-white flex items-center gap-2">
                  Summary
                  <Zap size={14} className="text-[#D4AF37]" />
                </h2>
                
                <div className="space-y-4 sm:space-y-5 md:space-y-6 mb-8 sm:mb-10 md:mb-12">
                  <div className="flex justify-between text-zinc-500 font-bold uppercase text-[8px] sm:text-[9px] md:text-[10px] tracking-widest">
                    <span>Subtotal</span>
                    <span className="text-white">Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-zinc-500 font-bold uppercase text-[8px] sm:text-[9px] md:text-[10px] tracking-widest">
                    <span className="flex items-center gap-1">
                      <Truck size={8} className="sm:hidden text-[#D4AF37]" />
                      <Truck size={10} className="hidden sm:block text-[#D4AF37]" />
                      Delivery
                    </span>
                    <span className="text-white">Rs. {totalDelivery.toLocaleString()}</span>
                  </div>
                  
                  <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent w-full" />
                  
                  <div className="flex flex-col gap-1 sm:gap-2">
                    <span className="text-[#D4AF37] font-black uppercase text-[8px] sm:text-[9px] md:text-[10px] tracking-widest flex items-center gap-1">
                      <Award size={8} className="sm:hidden" />
                      <Award size={10} className="hidden sm:block" />
                      Total Dispatch
                    </span>
                    <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tighter">
                      Rs. {total.toLocaleString()}
                    </span>
                    
                    {/* Estimated delivery */}
                    {cartItems.length > 0 && (
                      <div className="mt-2 sm:mt-3 flex items-center gap-1 sm:gap-2 text-zinc-600">
                        <Clock size={8} className="sm:hidden" />
                        <Clock size={10} className="hidden sm:block" />
                        <span className="text-[6px] sm:text-[7px] md:text-[8px] font-black uppercase tracking-wider">
                          Est. delivery 2-3 business days
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAddressModal(true)}
                  disabled={cartItems.length === 0}
                  className="w-full py-5 sm:py-6 md:py-7 bg-gradient-to-r from-[#D4AF37] to-[#B49450] text-black disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 rounded-xl sm:rounded-2xl md:rounded-3xl font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.4em] text-[8px] sm:text-[9px] md:text-[10px] flex items-center justify-center gap-2 sm:gap-3 md:gap-4 transition-all hover:shadow-[0_10px_30px_rgba(212,175,55,0.3)] group relative overflow-hidden"
                >
                  {/* Shimmer effect */}
                  {cartItems.length > 0 && (
                    <motion.div
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    />
                  )}
                  
                  <span>Configure Dispatch</span>
                  <ArrowRight size={12} className="sm:hidden group-hover:translate-x-1 transition-transform" />
                  <ArrowRight size={14} className="hidden sm:block md:hidden group-hover:translate-x-1 transition-transform" />
                  <ArrowRight size={16} className="hidden md:block group-hover:translate-x-2 transition-transform duration-500" />
                </motion.button>
                
                {/* Secure checkout badge */}
                <div className="mt-4 sm:mt-6 flex items-center justify-center gap-2 text-zinc-700">
                  <Shield size={8} className="sm:hidden" />
                  <Shield size={10} className="hidden sm:block" />
                  <span className="text-[6px] sm:text-[7px] md:text-[8px] font-black uppercase tracking-wider">
                    Encrypted Transaction
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- ADDRESS SELECTION MODAL - Gold Themed --- */}
        <AnimatePresence>
          {showAddressModal && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 md:p-6">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={() => setShowAddressModal(false)}
                className="absolute inset-0 bg-black/90 backdrop-blur-xl"
              />
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-gradient-to-br from-[#0a0a0a] to-[#030303] border border-[#D4AF37]/20 w-full max-w-lg sm:max-w-xl rounded-2xl sm:rounded-3xl md:rounded-[3.5rem] relative z-10 overflow-hidden shadow-2xl"
              >
                {/* Gold accent orbs */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#D4AF37] rounded-full blur-[80px] opacity-20" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#D4AF37] rounded-full blur-[80px] opacity-20" />
                
                <div className="relative z-10 p-6 sm:p-8 md:p-10">
                  <div className="flex justify-between items-center mb-6 sm:mb-8 md:mb-10">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tighter uppercase italic flex items-center gap-2">
                      <MapPin className="text-[#D4AF37]" size={20} />
                      Dispatch Zone.
                    </h2>
                    <motion.button 
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowAddressModal(false)} 
                      className="p-2 sm:p-2.5 md:p-3 bg-white/5 rounded-full text-white hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] transition-all"
                    >
                      <X size={16} className="sm:hidden" />
                      <X size={18} className="hidden sm:block md:hidden" />
                      <X size={20} className="hidden md:block" />
                    </motion.button>
                  </div>

                  <div className="space-y-4 sm:space-y-5 md:space-y-6">
                    {/* Profile Address Option */}
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setAddressOption('profile')}
                      className={`w-full p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl md:rounded-[2rem] border transition-all text-left flex items-start gap-3 sm:gap-4 md:gap-5 ${
                        addressOption === 'profile' 
                          ? 'bg-gradient-to-r from-[#D4AF37]/20 to-transparent border-[#D4AF37]/50 shadow-[0_10px_30px_rgba(212,175,55,0.15)]' 
                          : 'bg-white/5 border-white/5 hover:border-[#D4AF37]/30'
                      }`}
                    >
                      <div className={`p-2 sm:p-2.5 md:p-3 rounded-xl ${
                        addressOption === 'profile' ? 'bg-[#D4AF37] text-black' : 'bg-white/10 text-zinc-500'
                      }`}>
                        <Home size={16} className="sm:hidden" />
                        <Home size={18} className="hidden sm:block md:hidden" />
                        <Home size={20} className="hidden md:block" />
                      </div>
                      
                      <div className="flex-1">
                        <p className={`text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-black uppercase tracking-widest mb-1 ${
                          addressOption === 'profile' ? 'text-[#D4AF37]' : 'text-zinc-500'
                        }`}>
                          Saved Identity
                        </p>
                        <p className="text-white font-bold text-sm sm:text-base md:text-lg mt-1">
                          {user?.address?.address || "No Address Data"}
                        </p>
                        <p className="text-white/60 text-[10px] sm:text-xs tracking-widest uppercase">
                          {user?.address?.city || "Unknown City"} • {user?.address?.postalCode || "N/A"}
                        </p>
                        {addressOption === 'profile' && (
                          <CheckCircle2 className="mt-2 sm:mt-3 text-[#D4AF37]" size={16} />
                        )}
                      </div>
                    </motion.button>

                    {/* New Address Option */}
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setAddressOption('new')}
                      className={`w-full p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl md:rounded-[2rem] border transition-all text-left flex items-start gap-3 sm:gap-4 md:gap-5 ${
                        addressOption === 'new' 
                          ? 'bg-gradient-to-r from-[#D4AF37]/20 to-transparent border-[#D4AF37]/50 shadow-[0_10px_30px_rgba(212,175,55,0.15)]' 
                          : 'bg-white/5 border-white/5 hover:border-[#D4AF37]/30'
                      }`}
                    >
                      <div className={`p-2 sm:p-2.5 md:p-3 rounded-xl ${
                        addressOption === 'new' ? 'bg-[#D4AF37] text-black' : 'bg-white/10 text-zinc-500'
                      }`}>
                        <MapPin size={16} className="sm:hidden" />
                        <MapPin size={18} className="hidden sm:block md:hidden" />
                        <MapPin size={20} className="hidden md:block" />
                      </div>
                      
                      <div className="flex-1">
                        <p className={`text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-black uppercase tracking-widest mb-1 ${
                          addressOption === 'new' ? 'text-[#D4AF37]' : 'text-zinc-500'
                        }`}>
                          Manual Override
                        </p>
                        <p className="text-white font-bold text-sm sm:text-base md:text-lg mt-1">
                          Specify New Destination
                        </p>
                      </div>
                    </motion.button>

                    {addressOption === 'new' && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }} 
                        className="space-y-3 sm:space-y-4 pt-4 border-t border-white/5"
                      >
                        <input 
                          placeholder="Street Address" 
                          value={newAddress.address} 
                          onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 text-white text-sm sm:text-base outline-none focus:border-[#D4AF37]/50 font-bold transition-all"
                        />
                        
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                          <input 
                            placeholder="City" 
                            value={newAddress.city} 
                            onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 text-white text-sm sm:text-base outline-none focus:border-[#D4AF37]/50 font-bold transition-all"
                          />
                          <input 
                            placeholder="Postal Code" 
                            value={newAddress.postalCode} 
                            onChange={(e) => setNewAddress({...newAddress, postalCode: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 text-white text-sm sm:text-base outline-none focus:border-[#D4AF37]/50 font-bold transition-all"
                          />
                        </div>
                        
                        <div className="relative">
                          <Phone className="absolute left-3 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 text-zinc-700" size={14} />
                          <input 
                            placeholder="Secure Phone Line" 
                            value={newAddress.phone} 
                            onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl pl-8 sm:pl-10 md:pl-14 pr-4 sm:pr-5 md:pr-6 py-3 sm:py-3.5 md:py-4 text-white text-sm sm:text-base outline-none focus:border-[#D4AF37]/50 font-bold transition-all"
                          />
                        </div>
                      </motion.div>
                    )}

                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleOrder}
                      disabled={isOrderLoading || (addressOption === 'new' && !newAddress.address)}
                      className="w-full py-4 sm:py-5 md:py-6 bg-gradient-to-r from-[#D4AF37] to-[#B49450] text-black rounded-xl sm:rounded-2xl md:rounded-3xl font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em] text-[8px] sm:text-[9px] md:text-[10px] lg:text-[11px] flex items-center justify-center gap-2 sm:gap-3 md:gap-4 transition-all hover:shadow-[0_10px_30px_rgba(212,175,55,0.3)] disabled:opacity-50 relative overflow-hidden"
                    >
                      {/* Shimmer effect */}
                      {!isOrderLoading && (addressOption !== 'new' || newAddress.address) && (
                        <motion.div
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        />
                      )}
                      
                      {isOrderLoading ? (
                        <>
                          <Loader2 className="animate-spin" size={14} />
                          <span>Processing...</span>
                        </>
                      ) : (
                        "Execute Synchronized Dispatch"
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        
        <Footer />
      </div>
    </>
  );
};

export default CartPage;