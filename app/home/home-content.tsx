"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { UserCircle2, X } from "lucide-react";
import Link from "next/link";

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

// ─────────────────────────────────────────────────────────────────────────────
// Profile completion calculator (mirrors the profile page logic)
// 7 fields, each worth 1/7 of 100%
// ─────────────────────────────────────────────────────────────────────────────
function getProfileCompletion(user: Record<string, unknown>): number {
  const addr =
    user.address && typeof user.address === "object"
      ? (user.address as Record<string, unknown>)
      : {};

  const checks = [
    Boolean(user.profilePicture && String(user.profilePicture).trim()),
    Boolean(user.firstName && String(user.firstName).trim()),
    Boolean(user.lastName && String(user.lastName).trim()),
    Boolean(user.phone && String(user.phone).trim()),
    Boolean(addr.address && String(addr.address).trim()),
    Boolean(addr.city && String(addr.city).trim()),
    Boolean(addr.postalCode && String(addr.postalCode).trim()),
  ];
  const filled = checks.filter(Boolean).length;
  return Math.round((filled / checks.length) * 100);
}

// ─────────────────────────────────────────────────────────────────────────────
// Profile Nudge Banner — shown once per session for 3 s when pct < 100
// ─────────────────────────────────────────────────────────────────────────────
const NUDGE_KEY = "profile_nudge_shown";

function getInitialNudgeState() {
  if (typeof window === "undefined") {
    return { visible: false, pct: 0, shouldMark: false };
  }

  if (sessionStorage.getItem(NUDGE_KEY)) {
    return { visible: false, pct: 0, shouldMark: false };
  }

  const raw = localStorage.getItem("user");
  if (!raw) {
    return { visible: false, pct: 0, shouldMark: false };
  }

  try {
    const user = JSON.parse(raw) as Record<string, unknown>;
    const completion = getProfileCompletion(user);

    if (completion >= 100) {
      return { visible: false, pct: 0, shouldMark: false };
    }

    return { visible: true, pct: completion, shouldMark: true };
  } catch {
    return { visible: false, pct: 0, shouldMark: false };
  }
}

const ProfileNudgeBanner = () => {
  const [nudgeState, setNudgeState] = useState(getInitialNudgeState);
  const { visible, pct, shouldMark } = nudgeState;

  useEffect(() => {
    if (visible && shouldMark) {
      sessionStorage.setItem(NUDGE_KEY, "1");
    }

    if (!visible) return;

    const timer = setTimeout(() => {
      setNudgeState((prev) => ({ ...prev, visible: false }));
    }, 3000);
    return () => clearTimeout(timer);
  }, [shouldMark, visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -60 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="fixed top-20 left-0 right-0 z-[200] flex justify-center px-4 pointer-events-none"
        >
          <div className="pointer-events-auto flex items-center gap-4 px-5 py-3.5 rounded-2xl bg-[#0d0d0d]/95 border border-[#D4AF37]/30 backdrop-blur-xl shadow-2xl max-w-sm w-full">
            {/* Icon */}
            <div className="shrink-0 w-9 h-9 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center">
              <UserCircle2 size={18} className="text-[#D4AF37]" />
            </div>

            {/* Text + bar */}
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-white leading-tight">
                Complete your profile
              </p>

              {/* Progress bar */}
              <div className="mt-1.5 h-1 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#ffe066]"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>

              <div className="flex items-center justify-between mt-1">
                <p className="text-[8px] text-zinc-500 tracking-wide">
                  {pct}% done · add your missing details
                </p>
                <Link
                  href="/profile"
                  onClick={() =>
                    setNudgeState((prev) => ({ ...prev, visible: false }))
                  }
                  className="text-[8px] font-black uppercase tracking-widest text-[#D4AF37] hover:underline"
                >
                  Go →
                </Link>
              </div>
            </div>

            {/* Dismiss */}
            <button
              onClick={() =>
                setNudgeState((prev) => ({ ...prev, visible: false }))
              }
              className="shrink-0 text-zinc-600 hover:text-white transition-colors"
              aria-label="Dismiss nudge"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Home Page
// ─────────────────────────────────────────────────────────────────────────────
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
      {/* Profile completion nudge — auto-dismisses after 3 s, once per session */}
      <ProfileNudgeBanner />

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
