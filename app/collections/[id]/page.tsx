"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Zap,
  Shield,
  Truck,
  Heart,
  Share2,
  Droplet,
  Gauge,
  Thermometer,
  ChevronRight,
  XCircle,
  Check,
  Star,
  Package,
  ArrowRight,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "@/app/components/navbar";

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
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/api/products/getOne/${productKey}`,
        );
        const data = response.data;

        if (Array.isArray(data)) {
          const found = data.find(
            (p: any) => p.key === productKey || p._id === productKey,
          );
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

    const existingCart = JSON.parse(localStorage.getItem("bag") || "[]");
    const itemIndex = existingCart.findIndex(
      (item: any) => item.cartId === cartItem.cartId,
    );

    if (itemIndex > -1) {
      existingCart[itemIndex].quantity += 1;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem("bag", JSON.stringify(existingCart));
    window.dispatchEvent(new Event("cartUpdated"));

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (loading)
    return (
      <div className='min-h-screen flex flex-col items-center justify-center bg-[#030303] gap-6'>
        <div className='fixed inset-0 bg-[radial-gradient(ellipse_at_top,_#1a1a1a,_#000000)]' />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className='relative'
        >
          <div className='w-16 h-16 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin' />
        </motion.div>
        <span className='font-black text-[10px] uppercase tracking-[0.4em] text-zinc-700'>
          Synchronizing Terminal...
        </span>
      </div>
    );

  if (!product)
    return (
      <div className='min-h-screen flex flex-col items-center justify-center bg-[#030303] text-center px-6'>
        <div className='fixed inset-0 bg-[radial-gradient(ellipse_at_top,_#1a1a1a,_#000000)]' />
        <div className='relative z-10'>
          <XCircle className='text-[#D4AF37]/50 mb-6' size={48} />
          <h2 className='text-4xl font-black text-white mb-6 tracking-tighter'>
            Hardware Not Located
          </h2>
          <button
            onClick={() => router.back()}
            className='px-10 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B49450] text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:shadow-[0_10px_30px_rgba(212,175,55,0.3)] transition-all duration-300'
          >
            Return to Catalog
          </button>
        </div>
      </div>
    );

  const currentVariant = product.variants?.[activeVariantIdx];
  const gallery = [
    ...(product.productImage || []),
    ...(currentVariant?.variantImage || []),
  ];

  return (
    <main className='bg-[#030303] min-h-screen selection:bg-[#D4AF37]/30 overflow-x-hidden'>
      <div className='fixed inset-0 z-0'>
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1a1a1a,_#000000)]' />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMTBhMjAgMjAgMCAwIDEgMjAgMjAgMjAgMjAgMCAwIDEtNDAgMCAyMCAyMCAwIDAgMSAyMC0yMHoiIGZpbGw9IiNENEFGMzciIGZpbGwtb3BhY2l0eT0iMC4wMyIvPjwvc3ZnPg==')] opacity-20" />
      </div>

      <Navbar />

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className='fixed top-24 left-1/2 -translate-x-1/2 z-[110] w-full max-w-md px-6'
          >
            <div className='bg-gradient-to-br from-zinc-900 to-black backdrop-blur-2xl text-white p-5 rounded-[2rem] shadow-2xl flex items-center justify-between border border-[#D4AF37]/30'>
              <div className='flex items-center gap-4'>
                <div className='w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#B49450] rounded-xl flex items-center justify-center'>
                  <Check size={16} className='text-black' />
                </div>
                <div>
                  <p className='text-[10px] font-black uppercase tracking-widest text-[#D4AF37]'>
                    Assigned
                  </p>
                  <p className='text-sm font-bold'>{currentVariant?.flavor}</p>
                </div>
              </div>
              <button
                onClick={() => router.push("/cart")}
                className='px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B49450] text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all'
              >
                View Bag
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className='relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-10'>
        <section className='max-w-7xl mx-auto'>
          {/* Breadcrumbs */}
          <div className='flex items-center gap-3 text-zinc-600 mb-12'>
            <button
              onClick={() => router.push("/collections")}
              className='hover:text-[#D4AF37] transition-colors text-[10px] font-bold uppercase tracking-widest'
            >
              Catalog
            </button>
            <ChevronRight size={14} />
            <span className='text-[#D4AF37] font-black uppercase tracking-widest text-[10px]'>
              {product.category}
            </span>
            <ChevronRight size={14} />
            <span className='text-white font-bold text-[10px] uppercase tracking-widest'>
              {product.name}
            </span>
          </div>

          <div className='grid lg:grid-cols-2 gap-12 lg:gap-20 items-start mb-40'>
            {/* Gallery Section */}
            <div className='space-y-8'>
              <div className='relative sticky top-32'>
                <AnimatePresence mode='wait'>
                  <motion.div
                    key={selectedImage + activeVariantIdx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className='aspect-[4/5] rounded-[3.5rem] overflow-hidden bg-white/[0.02] border border-white/10 shadow-2xl relative group'
                  >
                    <img
                      src={gallery[selectedImage] || product.productImage?.[0]}
                      className='w-full h-full object-cover'
                      alt={product.name}
                    />
                    <div className='absolute top-8 right-8 flex flex-col gap-4'>
                      <button
                        onClick={() => setIsWishlisted(!isWishlisted)}
                        className='p-4 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10'
                      >
                        <Heart
                          size={20}
                          className={
                            isWishlisted
                              ? "fill-[#D4AF37] text-[#D4AF37]"
                              : "text-white/70"
                          }
                        />
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className='flex gap-4 overflow-x-auto pb-4 no-scrollbar'>
                {gallery.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`min-w-[110px] h-[110px] rounded-3xl overflow-hidden border-2 transition-all ${selectedImage === idx ? "border-[#D4AF37]" : "border-transparent opacity-40"}`}
                  >
                    <img
                      src={img}
                      className='w-full h-full object-cover'
                      alt='thumb'
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className='space-y-12'>
              <div className='space-y-6'>
                <span className='px-5 py-2.5 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full text-[10px] font-black uppercase tracking-[0.4em] inline-flex items-center gap-3 border border-[#D4AF37]/20'>
                  <Zap size={14} className='fill-current' /> {product.category}{" "}
                  Series
                </span>
                <h1 className='text-5xl lg:text-7xl xl:text-8xl font-black text-white tracking-tighter leading-[0.85]'>
                  {product.name}
                </h1>
                <p className='text-xl text-zinc-400 font-light italic'>
                  "{product.tagline}"
                </p>
                <p className='text-base text-zinc-500 leading-relaxed max-w-xl'>
                  {product.description}
                </p>
              </div>

              <div className='grid grid-cols-3 gap-8 py-10 border-y border-white/5'>
                {[
                  { icon: Droplet, label: "Pure Flavor" },
                  { icon: Gauge, label: "High Efficiency" },
                  { icon: Thermometer, label: "Temp Control" },
                ].map((spec, i) => (
                  <div key={i} className='text-center'>
                    <spec.icon
                      className='mx-auto text-[#D4AF37] mb-3'
                      size={20}
                    />
                    <p className='text-[9px] font-black uppercase tracking-widest text-zinc-600'>
                      {spec.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className='p-12 rounded-[3.5rem] bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-3xl border border-white/10 shadow-2xl relative overflow-hidden'>
                <div className='relative z-10 flex justify-between items-center'>
                  <div>
                    <p className='text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.5em] mb-2'>
                      Unit Valuation
                    </p>
                    <span className='text-4xl lg:text-6xl font-black text-white tracking-tighter'>
                      Rs. {product.basePrice?.toLocaleString()}
                    </span>
                  </div>
                  <div className='text-right'>
                    <p className='text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-1'>
                      Delivery
                    </p>
                    <p className='font-black text-2xl text-white'>
                      Rs. {product.deliveryFee?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Variants Section */}
          <div className='space-y-12'>
            <div className='border-b border-white/5 pb-8 flex items-end justify-between'>
              <h2 className='text-4xl lg:text-6xl font-black text-white tracking-tighter uppercase'>
                Editions<span className='text-[#D4AF37]'>.</span>
              </h2>
              <div className='flex items-center gap-2 text-zinc-500'>
                <Package size={20} className='text-[#D4AF37]' />
                <span className='text-xs font-black uppercase tracking-widest'>
                  {product.variants?.length} Variants Available
                </span>
              </div>
            </div>

            <div className='grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
              {product.variants?.map((variant: any, idx: number) => (
                <div key={variant.vKey || idx}>
                  {/* Mobile Card (shows on small screens) */}
                  <div className='lg:hidden'>
                    <MobileVariantCard
                      variant={variant}
                      isActive={activeVariantIdx === idx}
                      onSelect={() => {
                        setActiveVariantIdx(idx);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      onAddToCart={handleAddToCart}
                    />
                  </div>
                  {/* PC View Card (shows on lg and up) */}
                  <div className='hidden lg:block'>
                    <PCVariantCard
                      variant={variant}
                      isActive={activeVariantIdx === idx}
                      onSelect={() => {
                        setActiveVariantIdx(idx);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      onAddToCart={handleAddToCart}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

// NEW: Premium Big Font PC Card
const PCVariantCard = ({ variant, isActive, onSelect, onAddToCart }: any) => {
  const [isAdded, setIsAdded] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -10 }}
      onClick={onSelect}
      className={`relative h-[450px] rounded-[3rem] overflow-hidden cursor-pointer group transition-all duration-500 border-2
        ${isActive ? "border-[#D4AF37] shadow-[0_30px_60px_-15px_rgba(212,175,55,0.3)]" : "border-white/5 hover:border-white/20"}`}
    >
      {/* Background with parallax-like effect */}
      <div className='absolute inset-0'>
        <img
          src={variant.variantImage?.[0] || "/placeholder.jpg"}
          className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
          alt={variant.flavor}
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent' />
      </div>

      {/* Side Label */}
      <div className='absolute top-10 left-0 origin-top-left -rotate-90 translate-y-full'>
        <span className='text-[10px] font-black uppercase tracking-[0.8em] text-white/30 whitespace-nowrap'>
          Hardware Edition 2026
        </span>
      </div>

      <div className='relative z-10 h-full p-10 flex flex-col justify-between'>
        <div className='flex justify-between items-start'>
          <div className='w-14 h-14 bg-white/10 backdrop-blur-2xl rounded-2xl flex items-center justify-center text-3xl border border-white/20'>
            {variant.emoji}
          </div>
          {variant.stock > 0 && (
            <div className='px-4 py-2 bg-[#D4AF37] text-black rounded-full text-[10px] font-black uppercase tracking-widest'>
              In Stock
            </div>
          )}
        </div>

        <div className='space-y-6'>
          <div className='space-y-2'>
            <h3 className='text-4xl xl:text-5xl font-black text-white tracking-tighter leading-none group-hover:text-[#D4AF37] transition-colors'>
              {variant.flavor}
            </h3>
            <div className='flex items-center gap-4 text-zinc-400'>
              <span className='text-xs font-bold uppercase tracking-widest'>
                {variant.nicotine || "5% Strength"}
              </span>
              <div className='w-1.5 h-1.5 rounded-full bg-[#D4AF37]' />
              <span className='text-xs font-bold uppercase tracking-widest'>
                {variant.stock} Units Left
              </span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(variant);
              setIsAdded(true);
              setTimeout(() => setIsAdded(false), 2000);
            }}
            className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 transition-all
              ${isAdded ? "bg-emerald-500 text-white" : "bg-white text-black hover:bg-[#D4AF37]"}`}
          >
            {isAdded ? <Check size={18} /> : <ShoppingBag size={18} />}
            {isAdded ? "Added to Terminal" : "Deploy to Bag"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Mobile Variant Card (Kept 2x2 style as requested)
const MobileVariantCard = ({
  variant,
  isActive,
  onSelect,
  onAddToCart,
}: any) => {
  const [isAdded, setIsAdded] = useState(false);

  return (
    <motion.div
      onClick={onSelect}
      className={`relative aspect-[3/4] rounded-2xl overflow-hidden border transition-all duration-300
        ${isActive ? "border-[#D4AF37] shadow-lg" : "border-white/10"}`}
    >
      <div className='absolute inset-0'>
        <img
          src={variant.variantImage?.[0]}
          className='w-full h-full object-cover opacity-60'
          alt={variant.flavor}
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black to-transparent' />
      </div>

      <div className='relative z-10 h-full p-3 flex flex-col justify-between'>
        <div className='w-8 h-8 bg-black/40 backdrop-blur-md rounded-lg flex items-center justify-center text-lg'>
          {variant.emoji}
        </div>

        <div className='space-y-2'>
          <h3 className='text-[10px] font-black text-white uppercase truncate'>
            {variant.flavor}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(variant);
              setIsAdded(true);
              setTimeout(() => setIsAdded(false), 2000);
            }}
            className={`w-full py-2 rounded-lg text-[8px] font-black uppercase tracking-widest
              ${isAdded ? "bg-emerald-500 text-white" : "bg-[#D4AF37] text-black"}`}
          >
            {isAdded ? "Added" : "Add"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetailView;
