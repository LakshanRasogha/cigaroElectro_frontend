"use client";

import React, { useState, useEffect } from "react";
import ProductCard from "../components/product_card";
import {
  Zap,
  Sparkles,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import axios from "axios";
import Link from "next/link";
import { motion } from "framer-motion";

// --- Swiper Imports ---
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// --- TypeScript Interfaces ---
interface Variant {
  flavor: string;
  emoji: string;
  stock: number;
  availability: boolean;
}

interface Product {
  _id: string;
  key: string;
  name: string;
  tagline: string;
  basePrice: number;
  productImage: string[];
  variants: Variant[];
  category: string;
  sale?: string;
  [key: string]: any;
}

const TshirtSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API}/api/products/get`)
      .then((response) => {
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.products || [];
        console.log(data);
        // --- FILTERING LOGIC ---
        // Filters out any product where the name or category contains "t-shirt" (case-insensitive)
        const filteredProducts = data.filter((product: Product) => {
          const name = product.name.toLowerCase();
          const category = product.category.toLowerCase();
          return !name.includes("t-shirt") && !category.includes("t-shirt");
        });

        setProducts(filteredProducts);
      })
      .catch((error) => console.error("Failed to fetch products", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      className='pt-10 pb-20 md:pt-16 md:pb-32 bg-[#050505] overflow-hidden relative -mt-16 md:-mt-24'
      id='shop'
    >
      {/* Background Overlay */}
      <div className='absolute inset-0 z-0'>
        <div className='absolute inset-0 bg-[#050505]/60 md:bg-transparent md:bg-gradient-to-b md:from-[#050505] md:via-transparent md:to-[#050505]' />
      </div>

      <div className='max-w-7xl mx-auto px-4 md:px-6 relative z-10'>
        {/* Header Section */}
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-10 md:mb-16 gap-6'>
          <div className='max-w-2xl'>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className='flex items-center gap-3 mb-3'
            >
              <div className='p-1.5 bg-[#D4AF37] rounded-lg shadow-lg shadow-[#D4AF37]/20'>
                <Zap
                  size={12}
                  className='text-black fill-black md:w-[14px] md:h-[14px]'
                />
              </div>
              <span className='text-[#D4AF37] font-black text-[9px] md:text-[11px] tracking-[0.4em] uppercase'>
                Hardware Drop 2026
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className='text-2xl md:text-3xl font-black text-white tracking-tighter leading-none uppercase'
            >
              Vape and Electric{" "}
              <span
                className='text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F2D37D] to-[#AA771C] normal-case'
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Collection
              </span>
            </motion.h2>
          </div>

          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 w-full md:w-auto'>
            <Link
              href='/collections'
              className='flex items-center gap-3 px-8 py-4 bg-[#D4AF37] text-black rounded-xl font-black text-[10px] md:text-[11px] uppercase tracking-widest hover:bg-white transition-all shadow-xl group'
            >
              Full Catalog
              <ArrowRight
                size={14}
                className='group-hover:translate-x-1 transition-transform'
              />
            </Link>

            <div className='flex gap-2'>
              <button className='swiper-prev-btn p-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all active:scale-95'>
                <ChevronLeft size={18} />
              </button>
              <button className='swiper-next-btn p-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all active:scale-95'>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className='flex flex-col items-center justify-center py-20'>
            <Loader2 className='animate-spin text-[#D4AF37] mb-4 w-10 h-10' />
            <p className='text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500'>
              Syncing Catalog...
            </p>
          </div>
        ) : (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={15}
            slidesPerView={2} // Strictly 2 cards on smallest mobile
            navigation={{
              nextEl: ".swiper-next-btn",
              prevEl: ".swiper-prev-btn",
            }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{
              // Tablet
              768: {
                slidesPerView: 3,
                spaceBetween: 25,
              },
              // Desktop
              1024: {
                slidesPerView: 4,
                spaceBetween: 30,
                slidesPerGroup: 4, // Navigates by full pages of 4
              },
            }}
            className='pb-10 custom-gold-swiper !overflow-visible'
          >
            {products.map((prod, i) => {
              // Destructure 'key' to avoid React 19 spread error
              const { key: productKey, ...otherProps } = prod;

              return (
                <SwiperSlide key={prod._id || productKey} className='h-auto'>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className='group relative h-full py-2'
                  >
                    <div className='h-full rounded-[2rem] md:rounded-[2.5rem] bg-white/[0.04] backdrop-blur-3xl border border-white/5 overflow-hidden transition-all duration-500 group-hover:border-[#D4AF37]/40'>
                      {prod.sale && (
                        <div className='absolute top-3 right-3 md:top-4 md:right-4 z-20 px-2.5 py-1 rounded-full bg-[#D4AF37] shadow-lg'>
                          <span className='text-[7px] md:text-[8px] font-black text-black uppercase'>
                            {prod.sale}
                          </span>
                        </div>
                      )}

                      <ProductCard
                        productKey={productKey}
                        index={i}
                        {...otherProps}
                        tagline={otherProps.tagline || ""}
                      />
                    </div>
                  </motion.div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default TshirtSection;
