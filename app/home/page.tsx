"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

// Standardizing component imports
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import Headers from "../components/header";

// UI Sections
import ShopSection from "../UI/shopsection";
import HeritageSection from "../UI/aboutsection";
import TshirtSection from "../UI/tshirtsection";
import TrendingSection from "../UI/trendingsection";
import { apiUrl } from "@/app/lib/api";
import type { Product } from "@/app/lib/types";

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [bestsellerKeys, setBestsellerKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    let active = true;

    // Fetch all products
    axios
      .get(apiUrl("/products/get"))
      .then((response) => {
        if (!active) return;
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.products || [];
        setProducts(data);
      })
      .catch((error) => console.error("Failed to fetch products", error))
      .finally(() => {
        if (active) setLoading(false);
      });

    // Fetch bestseller keys in parallel (non-critical — silently ignore errors)
    axios
      .get(apiUrl("/analytics/bestseller-keys?limit=20"))
      .then((res) => {
        if (!active) return;
        const keys: string[] = Array.isArray(res.data) ? res.data : [];
        setBestsellerKeys(new Set(keys));
      })
      .catch(() => {/* no bestsellers yet — that's fine */});

    return () => {
      active = false;
    };
  }, []);

  const hardwareProducts = useMemo(
    () =>
      products.filter((product) => {
        const name = product.name.toLowerCase();
        const category = product.category.toLowerCase();
        return !name.includes("t-shirt") && !category.includes("t-shirt");
      }),
    [products],
  );

  const tshirtProducts = useMemo(
    () =>
      products.filter((product) => {
        const name = product.name.toLowerCase();
        const category = product.category.toLowerCase();
        return name.includes("t-shirts") || category.includes("t-shirts");
      }),
    [products],
  );

  return (
    <div className='bg-[#050505] text-white selection:bg-[#D4AF37] selection:text-black min-h-screen relative overflow-x-hidden font-sans'>
      {/* --- FIXED NAVBAR --- */}
      <div className='fixed top-0 left-0 right-0 z-[100]'>
        <Navbar />
      </div>

      {/* --- Ambient Luxury Gold Background Elements --- */}
      <div className='absolute inset-0 pointer-events-none z-0 overflow-hidden'>
        <div className='absolute top-0 left-[-10%] w-[28rem] h-[28rem] bg-[#D4AF37]/5 blur-[110px] rounded-full' />
        <div className='absolute top-[28%] right-[-8%] w-[24rem] h-[24rem] bg-[#AA771C]/5 blur-[100px] rounded-full' />
        <div className='absolute bottom-[10%] left-[-6%] w-[22rem] h-[22rem] bg-[#D4AF37]/4 blur-[90px] rounded-full' />
      </div>

      {/* --- Main Content Wrap --- */}
      <div className='relative z-10'>
        <header className='relative'>
          <Headers />
        </header>

        {/* Shop Section */}
        <section className='bg-[#050505]' id='shop'>
          <ShopSection
            products={hardwareProducts}
            loading={loading}
            bestsellerKeys={bestsellerKeys}
          />
        </section>

        {/* Trending / Most Viewed Section */}
        <TrendingSection bestsellerKeys={bestsellerKeys} />

        {/* T-Shirt Section */}
        <section className='bg-[#050505]'>
          <TshirtSection
            products={tshirtProducts}
            loading={loading}
            bestsellerKeys={bestsellerKeys}
          />
        </section>

        {/* Heritage Section */}
        <section className='bg-[#050505]' id='about'>
          <HeritageSection />
        </section>

        {/* Footer */}
        <footer className='bg-black border-t border-white/5'>
          <Footer />
        </footer>
      </div>

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        @keyframes gold-shimmer {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-gold {
          background-size: 200% 200%;
          animation: gold-shimmer 12s ease infinite;
        }

        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #050505;
        }
        ::-webkit-scrollbar-thumb {
          background: #222;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #d4af37;
        }
      `}</style>
    </div>
  );
};

export default Home;
