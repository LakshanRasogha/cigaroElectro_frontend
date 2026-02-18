"use client";

import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, Plus, Minus, ArrowRight, ShoppingBag, Loader2, 
  Sparkles, MapPin, X, Home, CheckCircle2, Phone 
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

    // Determine target shipping address
    const shippingAddress = addressOption === 'profile' 
      ? {
          address: user.address?.address || "",
          city: user.address?.city || "",
          postalCode: user.address?.postalCode || "",
          phone: user.phone || ""
        }
      : newAddress;

    /**
     * FIX: Payload Construction
     * Directly using 'key' and 'vKey' stored in the cart item
     * structure: { orderedItems: [{ key, vKey, qty }], shippingAddress }
     */
    const orderPayload = {
      orderedItems: cartItems.map(item => ({
        key: item.key,     // Product slug (e.g., "phantom-puffs")
        vKey: item.vKey,   // Variant slug (e.g., "phantom-puffs-black")
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
    <div className="h-screen flex flex-col items-center justify-center bg-[#020617]">
      <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
      <p className="text-zinc-500 font-black text-[10px] uppercase tracking-[0.4em]">Syncing Terminal...</p>
    </div>
  );

  return (
    <>
      <Navbar />
      <div ref={containerRef} className="bg-[#020617] min-h-screen pt-32 relative overflow-hidden selection:bg-indigo-500/30">
        
        {/* --- VIDEO BACKGROUND --- */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src="/vape2.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-transparent to-[#020617]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 pb-32 relative z-10">
          <header className="mb-16 cart-animate">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="text-indigo-400 w-4 h-4" />
              <span className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.5em]">Inventory Status</span>
            </div>
            <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-none uppercase">
              Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 italic">Bag.</span>
            </h1>
          </header>

          <div className="grid lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence mode="popLayout">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <motion.div 
                      key={item.cartId} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: -50 }}
                      className="group relative flex flex-col md:flex-row items-center gap-8 p-8 rounded-[3rem] bg-white/[0.03] backdrop-blur-3xl border border-white/10 transition-all duration-500 shadow-2xl"
                    >
                      <div className="w-44 h-44 rounded-[2.5rem] overflow-hidden bg-zinc-900 border border-white/5 shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.emoji}</span>
                          <p className="text-indigo-400 font-black text-[9px] tracking-[0.3em] uppercase">Authorized Hardware</p>
                        </div>
                        <h3 className="text-3xl font-bold text-white tracking-tight leading-none uppercase">{item.name}</h3>
                        <p className="text-zinc-400 font-medium italic">{item.flavor}</p>
                        <p className="text-indigo-400 font-mono text-lg font-black">Rs. {item.price.toLocaleString()}</p>
                      </div>
                      <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center gap-6 bg-white/5 p-2 rounded-2xl border border-white/10">
                          <button onClick={() => updateQuantity(item.cartId, -1)} className="p-3 text-white hover:bg-white/10 rounded-xl transition-colors"><Minus size={14}/></button>
                          <span className="font-black text-white w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.cartId, 1)} className="p-3 text-white hover:bg-white/10 rounded-xl transition-colors"><Plus size={14}/></button>
                        </div>
                        <button onClick={() => removeItem(item.cartId)} className="flex items-center gap-2 text-zinc-600 hover:text-rose-500 transition-colors text-[10px] font-black uppercase"><Trash2 size={14} /> Remove</button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-32 text-center bg-white/[0.02] backdrop-blur-xl rounded-[4rem] border border-dashed border-white/10">
                    <ShoppingBag size={64} className="mx-auto text-zinc-800 mb-6" />
                    <p className="text-zinc-500 font-black text-[10px] uppercase mb-8 tracking-[0.3em]">No Assets Logged</p>
                    <button onClick={() => router.push('/collections')} className="bg-white text-black px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">Initialize discovery</button>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* --- SUMMARY SIDEBAR --- */}
            <div className="cart-animate">
              <div className="sticky top-32 p-10 rounded-[3.5rem] bg-white/[0.03] backdrop-blur-3xl border border-white/10 shadow-2xl">
                <h2 className="text-3xl font-black mb-10 uppercase text-white">Summary</h2>
                <div className="space-y-6 mb-12">
                  <div className="flex justify-between text-zinc-500 font-bold uppercase text-[10px] tracking-widest">
                    <span>Subtotal</span><span className="text-white">Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500 font-bold uppercase text-[10px] tracking-widest">
                    <span>Delivery</span><span className="text-white">Rs. {totalDelivery.toLocaleString()}</span>
                  </div>
                  <div className="h-[1px] bg-white/5 w-full" />
                  <div className="flex flex-col gap-2">
                    <span className="text-indigo-400 font-black uppercase text-[10px] tracking-widest">Total Dispatch</span>
                    <span className="text-5xl font-black text-white tracking-tighter">Rs. {total.toLocaleString()}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAddressModal(true)}
                  disabled={cartItems.length === 0}
                  className="w-full py-7 bg-white text-black disabled:bg-zinc-800 disabled:text-zinc-600 rounded-3xl font-black uppercase tracking-[0.4em] text-[10px] flex items-center justify-center gap-4 transition-all hover:bg-indigo-500 hover:text-white group shadow-2xl"
                >
                  Configure Dispatch <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-500" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- ADDRESS SELECTION MODAL --- */}
        <AnimatePresence>
          {showAddressModal && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setShowAddressModal(false)}
                className="absolute inset-0 bg-black/90 backdrop-blur-xl"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-[#020617] border border-white/10 w-full max-w-xl rounded-[3.5rem] relative z-10 overflow-hidden shadow-2xl"
              >
                <div className="p-10">
                  <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Dispatch Zone.</h2>
                    <button onClick={() => setShowAddressModal(false)} className="p-3 bg-white/5 rounded-full text-white hover:bg-rose-500/20 hover:text-rose-500 transition-all"><X size={20}/></button>
                  </div>

                  <div className="space-y-6">
                    <button 
                      onClick={() => setAddressOption('profile')}
                      className={`w-full p-6 rounded-[2rem] border transition-all text-left flex items-start gap-5 ${addressOption === 'profile' ? 'bg-indigo-600 border-indigo-500 shadow-xl shadow-indigo-500/20' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                    >
                      <Home className={addressOption === 'profile' ? 'text-white' : 'text-zinc-500'} size={24} />
                      <div className="flex-1">
                        <p className={`text-[10px] font-black uppercase tracking-widest ${addressOption === 'profile' ? 'text-indigo-200' : 'text-zinc-500'}`}>Saved Identity</p>
                        <p className="text-white font-bold text-lg mt-1">{user?.address?.address || "No Address Data"}</p>
                        <p className="text-white/60 text-xs tracking-widest uppercase">{user?.address?.city || "Unknown City"} • {user?.address?.postalCode || "N/A"}</p>
                        {addressOption === 'profile' && <CheckCircle2 className="mt-3 text-white" size={20} />}
                      </div>
                    </button>

                    <button 
                      onClick={() => setAddressOption('new')}
                      className={`w-full p-6 rounded-[2rem] border transition-all text-left flex items-start gap-5 ${addressOption === 'new' ? 'bg-indigo-600 border-indigo-500 shadow-xl shadow-indigo-500/20' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                    >
                      <MapPin className={addressOption === 'new' ? 'text-white' : 'text-zinc-500'} size={24} />
                      <div className="flex-1">
                        <p className={`text-[10px] font-black uppercase tracking-widest ${addressOption === 'new' ? 'text-indigo-200' : 'text-zinc-500'}`}>Manual Override</p>
                        <p className="text-white font-bold text-lg mt-1">Specify New Destination</p>
                      </div>
                    </button>

                    {addressOption === 'new' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 pt-4 border-t border-white/5">
                        <input 
                          placeholder="Street Address" value={newAddress.address} 
                          onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-indigo-500 font-bold"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <input 
                            placeholder="City" value={newAddress.city} 
                            onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-indigo-500 font-bold"
                          />
                          <input 
                            placeholder="Postal Code" value={newAddress.postalCode} 
                            onChange={(e) => setNewAddress({...newAddress, postalCode: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-indigo-500 font-bold"
                          />
                        </div>
                        <div className="relative">
                           <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
                           <input 
                            placeholder="Secure Phone Line" value={newAddress.phone} 
                            onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white outline-none focus:border-indigo-500 font-bold"
                          />
                        </div>
                      </motion.div>
                    )}

                    <button 
                      onClick={handleOrder}
                      disabled={isOrderLoading || (addressOption === 'new' && !newAddress.address)}
                      className="w-full py-6 bg-white text-black rounded-3xl font-black uppercase tracking-[0.4em] text-[11px] flex items-center justify-center gap-4 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                      {isOrderLoading ? <Loader2 className="animate-spin" size={20}/> : "Execute Synchronized Dispatch"}
                    </button>
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