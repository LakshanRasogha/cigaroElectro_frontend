"use client";

import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Loader2,
  Sparkles,
  MapPin,
  X,
  Home,
  CheckCircle2,
  Phone,
  Zap,
  Shield,
  Award,
  Truck,
  Clock,
} from "lucide-react";
import gsap from "gsap";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiUrl, getAuthHeaders } from "@/app/lib/api";

const CartPage = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(true);
  const [isOrderLoading, setIsOrderLoading] = useState(false);

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [addressOption, setAddressOption] = useState<"profile" | "new">(
    "profile",
  );
  const [newAddress, setNewAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  const containerRef = useRef(null);

  // Initialize Terminal Data
  useEffect(() => {
    const savedBag = localStorage.getItem("bag");
    const storedUser = localStorage.getItem("user");

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

  // Persist Bag Changes
  useEffect(() => {
    if (!isSyncing) {
      localStorage.setItem("bag", JSON.stringify(cartItems));
      window.dispatchEvent(new Event("cartUpdated"));
    }
  }, [cartItems, isSyncing]);

  // Entrance Animations
  useLayoutEffect(() => {
    if (isSyncing) return;
    const ctx = gsap.context(() => {
      gsap.from(".cart-animate", {
        y: 40,
        opacity: 0,
        filter: "blur(15px)",
        stagger: 0.1,
        duration: 1,
        ease: "expo.out",
      });
    }, containerRef);
    return () => ctx.revert();
  }, [isSyncing]);

  const handleOrder = async () => {
    if (!user) {
      return router.push("/auth/login");
    }

    setIsOrderLoading(true);

    const shippingAddress =
      addressOption === "profile"
        ? {
            address: user.address?.address || "",
            city: user.address?.city || "",
            postalCode: user.address?.postalCode || "",
            phone: user.phone || "",
          }
        : newAddress;

    const orderPayload = {
      orderedItems: cartItems.map((item) => ({
        key: item.key,
        vKey: item.vKey,
        qty: item.quantity,
      })),
      shippingAddress,
    };

    try {
      const res = await axios.post(apiUrl("/orders/create"), orderPayload, {
        headers: getAuthHeaders(),
      });

      if (res.status === 201 || res.status === 200) {
        setCartItems([]);
        localStorage.removeItem("bag");
        window.dispatchEvent(new Event("cartUpdated"));
        setShowAddressModal(false);
        router.push("/profile");
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Dispatch failure.");
    } finally {
      setIsOrderLoading(false);
    }
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.cartId === cartId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  };

  const removeItem = (cartId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const totalDelivery = cartItems.length > 0 ? cartItems[0].delivery || 0 : 0;
  const total = subtotal + totalDelivery;

  if (isSyncing)
    return (
      <div className='min-h-screen flex flex-col items-center justify-center bg-[#030303] gap-6'>
        <div className='fixed inset-0 bg-[radial-gradient(ellipse_at_top,_#1a1a1a,_#000000)]' />
        <div className='relative'>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className='w-16 h-16 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full'
          />
        </div>
        <p className='text-zinc-700 font-black text-[10px] uppercase tracking-[0.4em]'>
          Initialize Bag...
        </p>
      </div>
    );

  return (
    <>
      <Navbar />
      <div
        ref={containerRef}
        className='bg-[#030303] min-h-screen pt-32 relative overflow-hidden selection:bg-[#D4AF37]/30 font-sans'
      >
        {/* Cinematic Overlays */}
        <div className='fixed inset-0 z-0 opacity-20 pointer-events-none'>
          <video
            autoPlay
            loop
            muted
            playsInline
            className='w-full h-full object-cover'
          >
            <source src='/vape2.mp4' type='video/mp4' />
          </video>
          <div className='absolute inset-0 bg-gradient-to-b from-[#030303] via-transparent to-[#030303]' />
        </div>

        <div className='max-w-7xl mx-auto px-6 pb-32 relative z-10'>
          <header className='mb-16 cart-animate'>
            <div className='flex items-center gap-3 mb-4'>
              <Sparkles className='text-[#D4AF37] w-4 h-4' />
              <span className='text-[#D4AF37] font-bold text-[8px] uppercase tracking-[0.6em]'>
                Terminal Bag 0.1
              </span>
            </div>
            <h1 className='text-4xl md:text-6xl font-serif text-white tracking-[0.2em] uppercase leading-none'>
              Your <span className='text-[#D4AF37] italic'>Cart.</span>
            </h1>
          </header>

          <div className='grid lg:grid-cols-3 gap-12 items-start'>
            {/* --- CART ITEMS GRID (2x2 on Mobile) --- */}
            <div className='lg:col-span-2'>
              <AnimatePresence mode='popLayout'>
                {cartItems.length > 0 ? (
                  <div className='grid grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-6'>
                    {cartItems.map((item) => (
                      <CartItemCard
                        key={item.cartId}
                        item={item}
                        onUpdate={updateQuantity}
                        onRemove={removeItem}
                      />
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className='py-32 text-center border border-dashed border-white/5 rounded-[3rem]'
                  >
                    <ShoppingBag
                      size={40}
                      className='mx-auto text-zinc-800 mb-6'
                    />
                    <p className='text-zinc-600 font-bold text-[10px] uppercase tracking-[0.4em] mb-10'>
                      No Assets Allocated
                    </p>
                    <Link
                      href='/collections'
                      className='text-[#D4AF37] font-black text-[9px] uppercase tracking-widest border-b border-[#D4AF37]/20 pb-1'
                    >
                      Start Discovery
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* --- SUMMARY SIDEBAR --- */}
            <div className='cart-animate'>
              <div className='sticky top-32 p-10 rounded-[3rem] bg-white/[0.01] border border-white/5 backdrop-blur-3xl shadow-2xl'>
                <h2 className='text-xs font-serif tracking-[0.4em] text-white mb-10 uppercase'>
                  Order Summary
                </h2>

                <div className='space-y-6 mb-12'>
                  <div className='flex justify-between text-[9px] font-bold tracking-widest text-zinc-500 uppercase'>
                    <span>Valuation</span>
                    <span className='text-white'>
                      Rs. {subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className='flex justify-between text-[9px] font-bold tracking-widest text-zinc-500 uppercase'>
                    <span>Logistics</span>
                    <span className='text-white'>
                      Rs. {totalDelivery.toLocaleString()}
                    </span>
                  </div>
                  <div className='h-px bg-white/5' />
                  <div className='space-y-2'>
                    <p className='text-[#D4AF37] text-[8px] font-bold uppercase tracking-[0.4em]'>
                      Total Dispatch
                    </p>
                    <p className='text-4xl font-serif tracking-tighter text-white'>
                      Rs. {total.toLocaleString()}
                    </p>
                  </div>
                </div>

                <motion.button
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: "#D4AF37",
                    color: "#000",
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAddressModal(true)}
                  disabled={cartItems.length === 0}
                  className='w-full py-6 border border-[#D4AF37]/40 text-[#D4AF37] rounded-2xl font-black uppercase tracking-[0.4em] text-[9px] flex items-center justify-center gap-3 transition-all'
                >
                  Configure Dispatch <ArrowRight size={14} />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        <AddressModal
          isOpen={showAddressModal}
          onClose={() => setShowAddressModal(false)}
          user={user}
          option={addressOption}
          setOption={setAddressOption}
          newAddress={newAddress}
          setNewAddress={setNewAddress}
          onConfirm={handleOrder}
          loading={isOrderLoading}
        />
        <Footer />
      </div>
    </>
  );
};

/* --- RESPONSIVE GRID CARD --- */
const CartItemCard = ({ item, onUpdate, onRemove }: any) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className='relative flex flex-col lg:flex-row items-center gap-4 lg:gap-8 p-4 lg:p-8 rounded-[2rem] lg:rounded-[3rem] bg-white/[0.02] border border-white/5 hover:border-[#D4AF37]/20 transition-all group'
    >
      {/* Product Image */}
      <div className='w-full lg:w-40 aspect-square lg:h-44 rounded-2xl overflow-hidden bg-black shrink-0'>
        <img
          src={item.image}
          className='w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700'
          alt={item.name}
        />
      </div>

      {/* Product Details */}
      <div className='flex-1 w-full text-center lg:text-left space-y-2 lg:space-y-4'>
        <div>
          <h3 className='text-[10px] lg:text-xl font-serif text-white tracking-[0.1em] lg:tracking-widest uppercase truncate'>
            {item.name}
          </h3>
          <p className='text-[7px] lg:text-xs text-zinc-500 italic font-light tracking-widest uppercase truncate'>
            {item.flavor} {item.emoji}
          </p>
        </div>
        <p className='text-xs lg:text-2xl font-serif text-[#D4AF37] tracking-tighter'>
          Rs. {item.price.toLocaleString()}
        </p>
      </div>

      {/* Controls */}
      <div className='flex lg:flex-col items-center justify-between w-full lg:w-auto gap-4 pt-2 lg:pt-0'>
        <div className='flex items-center gap-3 lg:gap-5 bg-black/40 p-1.5 rounded-xl border border-white/5'>
          <button
            onClick={() => onUpdate(item.cartId, -1)}
            className='p-1 text-zinc-500 hover:text-white transition-colors'
          >
            <Minus size={10} />
          </button>
          <span className='text-[9px] font-black text-white w-3 text-center'>
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdate(item.cartId, 1)}
            className='p-1 text-zinc-500 hover:text-white transition-colors'
          >
            <Plus size={10} />
          </button>
        </div>

        <button
          onClick={() => onRemove(item.cartId)}
          className='p-2 text-zinc-700 hover:text-rose-500 transition-colors'
        >
          <Trash2 size={14} strokeWidth={1.5} />
        </button>
      </div>
    </motion.div>
  );
};

/* --- ADDRESS MODAL COMPONENT --- */
const AddressModal = ({
  isOpen,
  onClose,
  user,
  option,
  setOption,
  newAddress,
  setNewAddress,
  onConfirm,
  loading,
}: any) => {
  if (!isOpen) return null;
  return (
    <div className='fixed inset-0 z-[120] flex items-center justify-center p-6'>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
        className='absolute inset-0 bg-black/95 backdrop-blur-xl'
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='bg-[#0a0a0a] border border-[#D4AF37]/20 w-full max-w-xl rounded-[3rem] relative z-10 p-10 overflow-hidden'
      >
        <div className='flex justify-between items-center mb-10'>
          <h2 className='text-xl font-serif tracking-[0.2em] text-white uppercase italic'>
            Dispatch Zone.
          </h2>
          <button onClick={onClose} className='text-zinc-500 hover:text-white'>
            <X size={20} />
          </button>
        </div>

        <div className='space-y-4'>
          <button
            onClick={() => setOption("profile")}
            className={`w-full p-6 rounded-2xl border text-left flex items-start gap-4 transition-all ${option === "profile" ? "border-[#D4AF37] bg-[#D4AF37]/5" : "border-white/5 bg-white/[0.02]"}`}
          >
            <div className='p-3 rounded-xl bg-white/5 text-[#D4AF37]'>
              <Home size={18} />
            </div>
            <div>
              <p className='text-[7px] font-bold uppercase tracking-widest text-zinc-500 mb-1'>
                Stored Identity
              </p>
              <p className='text-[11px] text-white tracking-widest uppercase'>
                {user?.address?.address || "No Stored Data"}
              </p>
            </div>
          </button>

          <button
            onClick={() => setOption("new")}
            className={`w-full p-6 rounded-2xl border text-left flex items-start gap-4 transition-all ${option === "new" ? "border-[#D4AF37] bg-[#D4AF37]/5" : "border-white/5 bg-white/[0.02]"}`}
          >
            <div className='p-3 rounded-xl bg-white/5 text-zinc-500'>
              <MapPin size={18} />
            </div>
            <p className='text-[7px] font-bold uppercase tracking-widest text-zinc-600 mt-3'>
              Manual Destination
            </p>
          </button>

          {option === "new" && (
            <div className='space-y-3 pt-4'>
              <input
                placeholder='STREET ADDRESS'
                onChange={(e) =>
                  setNewAddress({ ...newAddress, address: e.target.value })
                }
                className='w-full bg-white/5 border border-white/5 rounded-xl px-5 py-4 text-[9px] text-white tracking-widest uppercase outline-none focus:border-[#D4AF37]/40 transition-all placeholder:text-zinc-800'
              />
              <div className='grid grid-cols-2 gap-3'>
                <input
                  placeholder='CITY'
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                  className='bg-white/5 border border-white/5 rounded-xl px-5 py-4 text-[9px] text-white tracking-widest uppercase outline-none placeholder:text-zinc-800'
                />
                <input
                  placeholder='POSTAL'
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, postalCode: e.target.value })
                  }
                  className='bg-white/5 border border-white/5 rounded-xl px-5 py-4 text-[9px] text-white tracking-widest uppercase outline-none placeholder:text-zinc-800'
                />
              </div>
            </div>
          )}

          <motion.button
            onClick={onConfirm}
            disabled={loading}
            className='w-full py-6 mt-6 bg-[#D4AF37] text-black rounded-2xl font-black uppercase tracking-[0.4em] text-[9px] flex items-center justify-center gap-3 transition-all'
          >
            {loading ? (
              <Loader2 className='animate-spin' size={14} />
            ) : (
              "Initialize Synchronized Dispatch"
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default CartPage;
