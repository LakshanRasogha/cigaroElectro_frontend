"use client";

import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import axios from "axios";
import { apiUrl, getAuthHeaders } from "@/app/lib/api";
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
  CheckCircle2,
  Phone,
  Zap,
  Shield,
  Award,
  Truck,
  MessageCircle,
} from "lucide-react";
import gsap from "gsap";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import Link from "next/link";
import type { CartItem } from "@/app/lib/types";

// WhatsApp business number
const WHATSAPP_NUMBER = "94789696180"; // 0789696180 → international format

interface AddressForm {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}

interface CartItemCardProps {
  item: CartItem;
  onUpdate: (cartId: string, delta: number) => void;
  onRemove: (cartId: string) => void;
}

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: AddressForm;
  setForm: React.Dispatch<React.SetStateAction<AddressForm>>;
  onConfirm: () => void;
  loading: boolean;
  cartItems: CartItem[];
  subtotal: number;
  totalDelivery: number;
  total: number;
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  WhatsApp message builder                                                    */
/* ─────────────────────────────────────────────────────────────────────────── */
function buildWhatsAppMessage(
  form: AddressForm,
  cartItems: CartItem[],
  subtotal: number,
  totalDelivery: number,
  total: number,
): string {
  const lines: string[] = [];

  lines.push("🛒 *NEW ORDER — CIGARRO ELECTRICO*");
  lines.push("─────────────────────────────");

  // Customer details
  lines.push("👤 *Customer Details*");
  lines.push(`Name: ${form.name}`);
  lines.push(`Phone: ${form.phone}`);
  lines.push("");

  // Shipping address
  lines.push("📍 *Shipping Address*");
  lines.push(`Address: ${form.address}`);
  lines.push(`City: ${form.city}`);
  if (form.postalCode) lines.push(`Postal Code: ${form.postalCode}`);
  lines.push("");

  // Order items
  lines.push("📦 *Order Items*");
  cartItems.forEach((item, idx) => {
    const itemTotal = item.price * item.quantity;
    lines.push(
      `${idx + 1}. ${item.name}${item.flavor ? ` — ${item.flavor}${item.emoji ? " " + item.emoji : ""}` : ""}`,
    );
    lines.push(
      `   Qty: ${item.quantity} × Rs. ${Number(item.price).toLocaleString()} = Rs. ${itemTotal.toLocaleString()}`,
    );
    if (item.delivery) {
      lines.push(
        `   Shipping: Rs. ${Number(item.delivery).toLocaleString()}`,
      );
    }
  });
  lines.push("");

  // Price breakdown
  lines.push("💰 *Price Breakdown*");
  lines.push(`Subtotal: Rs. ${subtotal.toLocaleString()}`);
  lines.push(`Total Delivery: Rs. ${totalDelivery.toLocaleString()}`);
  lines.push(`*GRAND TOTAL: Rs. ${total.toLocaleString()}*`);
  lines.push("");
  lines.push("─────────────────────────────");
  lines.push("_Sent via CigarroElectrico.com_");

  return lines.join("\n");
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Main Cart Page                                                              */
/* ─────────────────────────────────────────────────────────────────────────── */
const CartPage = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(true);
  const [isOrderLoading, setIsOrderLoading] = useState(false);
  const [orderSent, setOrderSent] = useState(false);

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [form, setForm] = useState<AddressForm>({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  const containerRef = useRef(null);

  // Initialize from localStorage
  useEffect(() => {
    const savedBag = localStorage.getItem("bag");
    const storedUser = localStorage.getItem("user");

    if (savedBag) {
      try {
        setCartItems(JSON.parse(savedBag) as CartItem[]);
      } catch (err) {
        console.error("Cart Sync Error:", err);
      }
    }

    // Pre-fill form from stored user if available
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        setForm((prev) => ({
          ...prev,
          name: u.name || u.firstName
            ? `${u.firstName || ""} ${u.lastName || ""}`.trim()
            : prev.name,
          phone: u.phone || prev.phone,
          address: u.address?.address || prev.address,
          city: u.address?.city || prev.city,
          postalCode: u.address?.postalCode || prev.postalCode,
        }));
      } catch (err) {
        console.error("User Sync Error:", err);
      }
    }

    setIsSyncing(false);
  }, []);

  // Persist bag changes
  useEffect(() => {
    if (!isSyncing) {
      localStorage.setItem("bag", JSON.stringify(cartItems));
      window.dispatchEvent(new Event("cartUpdated"));
    }
  }, [cartItems, isSyncing]);

  // Entrance animations
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

  const toCurrencyNumber = (value: unknown) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const subtotal = cartItems.reduce(
    (acc, item) =>
      acc +
      toCurrencyNumber(item.price) *
      Math.max(1, toCurrencyNumber(item.quantity)),
    0,
  );
  const totalDelivery = cartItems.reduce(
    (acc, item) => acc + toCurrencyNumber(item.delivery),
    0,
  );
  const total = subtotal + totalDelivery;

  /**
   * Order flow:
   * 1. Require login — redirect to /auth/login if no token.
   * 2. Validate form fields.
   * 3. Open a blank window NOW (inside the user gesture, before any await)
   *    so mobile browsers do not block the popup after the async API call.
   * 4. POST to /orders/create to persist the order in the DB.
   * 5. On success: navigate the pre-opened window to WhatsApp, clear cart.
   *    On failure: close the window, show the real error, keep cart intact.
   */
  const handleOrder = async () => {
    // ── 1. Login guard ─────────────────────────────────────────────────────
    const token = localStorage.getItem("token");
    if (!token) {
      setShowAddressModal(false);
      router.push("/auth/login");
      return;
    }

    // ── 2. Form validation ─────────────────────────────────────────────────
    if (!form.name.trim()) {
      alert("Please enter your name.");
      return;
    }
    if (!form.phone.trim()) {
      alert("Please enter your phone number.");
      return;
    }
    if (!form.address.trim() || !form.city.trim()) {
      alert("Please enter your delivery address and city.");
      return;
    }

    setIsOrderLoading(true);

    // ── 3. Open a blank window SYNCHRONOUSLY inside the user gesture ────────
    // Mobile browsers (Android Chrome, iOS Safari) block window.open() when
    // called after an `await` because the user-gesture context is lost.
    // Opening an empty window here keeps it within the gesture; we navigate
    // it to WhatsApp only after the API call succeeds.
    const whatsappWindow = window.open("", "_blank");

    // ── 4. Save order to DB ────────────────────────────────────────────────
    try {
      await axios.post(
        apiUrl("/orders/create"),
        {
          orderedItems: cartItems.map((item) => ({
            key: item.key,
            vKey: item.vKey,
            qty: item.quantity,
          })),
          shippingAddress: {
            address: form.address,
            city: form.city,
            postalCode: form.postalCode,
            phone: form.phone,
          },
        },
        { headers: getAuthHeaders() },
      );
    } catch (err: unknown) {
      // Close the blank tab so the user is not left with an empty window.
      whatsappWindow?.close();
      setIsOrderLoading(false);

      // Surface the real backend message (e.g. "Insufficient stock for Mango")
      // instead of the generic axios "Request failed with status code 400".
      let msg = "Failed to place order. Please try again.";
      const axiosErr = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      if (axiosErr?.response?.data?.message) {
        msg = axiosErr.response.data.message;
      } else if (axiosErr?.message) {
        msg = axiosErr.message;
      }

      alert(`Order failed: ${msg}`);
      return;
    }

    // ── 5. API succeeded → navigate pre-opened window to WhatsApp ──────────
    const message = buildWhatsAppMessage(
      form,
      cartItems,
      subtotal,
      totalDelivery,
      total,
    );
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    if (whatsappWindow) {
      // Navigate the already-open window — works on all mobile browsers
      whatsappWindow.location.href = whatsappUrl;
    } else {
      // Popup was blocked entirely — fall back to navigating the current tab
      window.location.href = whatsappUrl;
    }

    // Clear cart only after everything succeeds
    setCartItems([]);
    localStorage.removeItem("bag");
    window.dispatchEvent(new Event("cartUpdated"));

    setShowAddressModal(false);
    setIsOrderLoading(false);
    setOrderSent(true);
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
        {/* Cinematic Overlay */}
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

          {/* Order Sent Success Banner */}
          <AnimatePresence>
            {orderSent && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className='mb-10 p-6 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center gap-4'
              >
                <CheckCircle2 className='text-green-400 shrink-0' size={22} />
                <div>
                  <p className='text-green-300 font-black text-[10px] uppercase tracking-widest'>
                    Order Dispatched to WhatsApp
                  </p>
                  <p className='text-zinc-500 text-[9px] mt-1 tracking-wide'>
                    Your order details have been sent. Complete the chat on
                    WhatsApp to confirm with us.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className='grid lg:grid-cols-3 gap-12 items-start'>
            {/* Cart Items */}
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

            {/* Order Summary Sidebar */}
            <div className='cart-animate'>
              <div className='sticky top-32 p-10 rounded-[3rem] bg-white/[0.01] border border-white/5 backdrop-blur-3xl shadow-2xl'>
                <h2 className='text-xs font-serif tracking-[0.4em] text-white mb-10 uppercase'>
                  Order Summary
                </h2>

                <div className='space-y-6 mb-12'>
                  <div className='flex justify-between text-[9px] font-bold tracking-widest text-zinc-500 uppercase'>
                    <span>Subtotal</span>
                    <span className='text-white'>
                      Rs. {subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className='flex justify-between text-[9px] font-bold tracking-widest text-zinc-500 uppercase'>
                    <span>Total Delivery</span>
                    <span className='text-white'>
                      Rs. {totalDelivery.toLocaleString()}
                    </span>
                  </div>
                  <div className='h-px bg-white/5' />
                  <div className='space-y-2'>
                    <p className='text-[#D4AF37] text-[8px] font-bold uppercase tracking-[0.4em]'>
                      Grand Total
                    </p>
                    <p className='text-4xl font-serif tracking-tighter text-white'>
                      Rs. {total.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* WhatsApp CTA */}
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: "#25D366",
                    color: "#fff",
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (!localStorage.getItem("token")) {
                      router.push("/auth/login");
                      return;
                    }
                    setShowAddressModal(true);
                  }}
                  disabled={cartItems.length === 0}
                  className='w-full py-6 border border-[#25D366]/40 text-[#25D366] rounded-2xl font-black uppercase tracking-[0.4em] text-[9px] flex items-center justify-center gap-3 transition-all disabled:opacity-40 disabled:cursor-not-allowed'
                >
                  <MessageCircle size={14} />
                  Order via WhatsApp
                </motion.button>

                {/* Trust signals */}
                <div className='mt-8 space-y-3'>
                  {[
                    { icon: Truck, text: "Island-wide delivery" },
                    { icon: Shield, text: "Secure order handling" },
                    { icon: Zap, text: "Fast dispatch" },
                    { icon: Award, text: "Authentic products" },
                  ].map(({ icon: Icon, text }) => (
                    <div
                      key={text}
                      className='flex items-center gap-3 text-[8px] text-zinc-600 uppercase tracking-widest'
                    >
                      <Icon size={10} className='text-[#D4AF37]' />
                      {text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <AddressModal
          isOpen={showAddressModal}
          onClose={() => setShowAddressModal(false)}
          form={form}
          setForm={setForm}
          onConfirm={handleOrder}
          loading={isOrderLoading}
          cartItems={cartItems}
          subtotal={subtotal}
          totalDelivery={totalDelivery}
          total={total}
        />

        <Footer />
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Cart Item Card                                                              */
/* ─────────────────────────────────────────────────────────────────────────── */
const CartItemCard = ({ item, onUpdate, onRemove }: CartItemCardProps) => {
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

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Address + Details Modal                                                     */
/* ─────────────────────────────────────────────────────────────────────────── */
const AddressModal = ({
  isOpen,
  onClose,
  form,
  setForm,
  onConfirm,
  loading,
  cartItems,
  subtotal,
  totalDelivery,
  total,
}: AddressModalProps) => {
  if (!isOpen) return null;

  const inputClass =
    "w-full bg-white/5 border border-white/5 rounded-xl px-5 py-4 text-[9px] text-white tracking-widest uppercase outline-none focus:border-[#D4AF37]/40 transition-all placeholder:text-zinc-500 placeholder:opacity-100";
  const labelClass =
    "text-[7px] font-bold uppercase tracking-widest text-zinc-500";

  return (
    <div className='fixed inset-0 z-[120] flex items-center justify-center p-4 overflow-y-auto'>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
        className='fixed inset-0 bg-black/95 backdrop-blur-xl'
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='bg-[#0a0a0a] border border-[#D4AF37]/20 w-full max-w-xl rounded-[3rem] relative z-10 overflow-hidden my-auto'
      >
        {/* Header */}
        <div className='flex justify-between items-center px-10 pt-10 pb-6 border-b border-white/5'>
          <div>
            <div className='flex items-center gap-2 mb-1'>
              <MessageCircle size={14} className='text-[#25D366]' />
              <span className='text-[#25D366] text-[8px] font-bold uppercase tracking-widest'>
                WhatsApp Order
              </span>
            </div>
            <h2 className='text-xl font-serif tracking-[0.2em] text-white uppercase italic'>
              Delivery Details.
            </h2>
          </div>
          <button onClick={onClose} className='text-zinc-500 hover:text-white transition-colors'>
            <X size={20} />
          </button>
        </div>

        <div className='px-10 py-8 space-y-8 max-h-[70vh] overflow-y-auto'>
          {/* Customer Info */}
          <div className='space-y-4'>
            <p className='text-[8px] font-bold uppercase tracking-[0.4em] text-[#D4AF37]'>
              Your Information
            </p>

            <div className='space-y-2'>
              <p className={labelClass}>Full Name *</p>
              <input
                value={form.name}
                placeholder='YOUR FULL NAME'
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
                required
              />
            </div>

            <div className='space-y-2'>
              <p className={labelClass}>Phone Number *</p>
              <div className='relative'>
                <Phone
                  size={10}
                  className='absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500'
                />
                <input
                  value={form.phone}
                  placeholder='07X XXX XXXX'
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={`${inputClass} pl-9`}
                  type='tel'
                  required
                />
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className='space-y-4'>
            <p className='text-[8px] font-bold uppercase tracking-[0.4em] text-[#D4AF37]'>
              Delivery Address
            </p>

            <div className='space-y-2'>
              <p className={labelClass}>Street Address *</p>
              <input
                autoComplete='shipping address-line1'
                value={form.address}
                placeholder='STREET ADDRESS'
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className={inputClass}
                required
              />
            </div>

            <div className='grid grid-cols-2 gap-3'>
              <div className='space-y-2'>
                <p className={labelClass}>City *</p>
                <input
                  autoComplete='shipping address-level2'
                  value={form.city}
                  placeholder='CITY'
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>
              <div className='space-y-2'>
                <p className={labelClass}>Postal Code</p>
                <input
                  autoComplete='shipping postal-code'
                  value={form.postalCode}
                  placeholder='POSTAL'
                  onChange={(e) =>
                    setForm({ ...form, postalCode: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Order Preview */}
          <div className='space-y-3'>
            <p className='text-[8px] font-bold uppercase tracking-[0.4em] text-[#D4AF37]'>
              Order Preview
            </p>
            <div className='bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-3'>
              {cartItems.map((item) => (
                <div
                  key={item.cartId}
                  className='flex justify-between text-[8px] text-zinc-400 tracking-wider'
                >
                  <span>
                    {item.name}
                    {item.flavor ? ` — ${item.flavor}` : ""} ×{item.quantity}
                  </span>
                  <span className='text-white'>
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
              <div className='h-px bg-white/5 my-2' />
              <div className='flex justify-between text-[8px] text-zinc-500 tracking-wider'>
                <span>Delivery</span>
                <span>Rs. {totalDelivery.toLocaleString()}</span>
              </div>
              <div className='flex justify-between text-[10px] font-bold text-white tracking-wider'>
                <span>Total</span>
                <span className='text-[#D4AF37]'>
                  Rs. {total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Confirm Button */}
        <div className='px-10 pb-10 pt-4 border-t border-white/5'>
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "#20bc59" }}
            whileTap={{ scale: 0.98 }}
            onClick={onConfirm}
            disabled={loading}
            className='w-full py-6 bg-[#25D366] text-white rounded-2xl font-black uppercase tracking-[0.4em] text-[9px] flex items-center justify-center gap-3 transition-all'
          >
            {loading ? (
              <Loader2 className='animate-spin' size={14} />
            ) : (
              <>
                <MessageCircle size={14} />
                Send Order via WhatsApp
              </>
            )}
          </motion.button>
          <p className='text-center text-[7px] text-zinc-600 uppercase tracking-widest mt-4'>
            You&apos;ll be redirected to WhatsApp to complete your order
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default CartPage;
