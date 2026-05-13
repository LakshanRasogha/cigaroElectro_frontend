"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { staticAssets } from "@/app/lib/assets";

const Hero = () => {
  const router = useRouter();

  const handleNavigation = () => {
    router.push("/collections");
  };

  return (
    <header className='relative h-screen min-h-[800px] bg-black overflow-hidden flex items-center'>
      {/* --- Background Layer Stack --- */}
      <div className='absolute inset-0 z-0'>
        {/* 1. The Pattern Image (BRIGHTER) */}
        <img
          src={staticAssets.backgroundPattern}
          alt='Background Pattern'
          className='absolute inset-0 w-full h-full object-cover'
          style={{ objectPosition: "center 15%" }}
        />

        {/* 2. Radial Gradient (LIGHTER) */}
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,transparent_0%,rgba(0,0,0,0.5)_70%,#000_100%)]' />

        {/* 3. Linear Overlays (SUBTLER) */}
        <div className='absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#050505]' />
        <div className='absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent' />

        {/* 4. Animated Gold Ambient Glow */}
        <motion.div
          animate={{
            opacity: [0.05, 0.12, 0.05],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className='absolute top-1/3 -left-20 w-[650px] h-[650px] bg-[#D4AF37]/20 blur-[160px] rounded-full'
        />
      </div>

      {/* --- Content Layer --- */}
      <div className='relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full'>
        <div className='max-w-4xl'>
          {/* Main Heading with Masking Animation */}
          <h1 className='mb-6 leading-[1.1] tracking-tight'>
            <div className='overflow-hidden py-1'>
              <motion.span
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.9,
                  delay: 0.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className='block text-5xl md:text-7xl font-light tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#e8cd75] via-[#f3dfa7] to-[#AA771C] drop-shadow-[0_4px_15px_rgba(212,175,55,0.25)]'
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                THE APEX OF VAPOR
              </motion.span>
            </div>
          </h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className='text-zinc-300 text-base md:text-xl mb-12 leading-relaxed max-w-xl font-light italic'
          >
            It&apos;s your entry into the gold standard of modern indulgence.
          </motion.p>

          {/* CTA Section (WIDTH REDUCED) */}
          <div className='flex flex-col sm:flex-row gap-6 items-start sm:items-center'>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              onClick={handleNavigation}
              // UPDATED: px-5 (was px-7) and py-2.5 (was py-3) for a slimmer look
              className='group relative bg-[#D4AF37] text-black px-5 py-2.5 rounded-full overflow-hidden font-bold uppercase text-[10px] tracking-[0.25em] transition-all shadow-[0_10px_25px_rgba(212,175,55,0.25)]'
            >
              <span className='relative z-10 flex items-center gap-3'>
                Explore Collection{" "}
                <ChevronRight className='h-3.5 w-3.5 transition-transform group-hover:translate-x-1.5' />
              </span>
              <div className='absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out' />
            </motion.button>
          </div>

          {/* Feature Bar (Bottom Left) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className='mt-20 grid grid-cols-1 sm:grid-cols-2 gap-10 pt-10 border-t border-[#D4AF37]/15'
          >
            <div className='flex items-center gap-5'>
              <div className='p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm'>
                <ShieldCheck className='text-[#D4AF37] h-5 w-5' />
              </div>
              <div>
                <p className='text-white text-xs font-bold tracking-[0.1em] uppercase'>
                  Authentic Gold Tier
                </p>
                <p className='text-zinc-400 text-[10px] mt-1 font-medium'>
                  Verified luxury hardware & components
                </p>
              </div>
            </div>

            <div className='flex items-center gap-5'>
              <div className='p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm'>
                <Zap className='text-[#D4AF37] h-5 w-5' />
              </div>
              <div>
                <p className='text-white text-xs font-bold tracking-[0.1em] uppercase'>
                  Premium Logistics
                </p>
                <p className='text-zinc-400 text-[10px] mt-1 font-medium'>
                  Concierge delivery islandwide
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Aesthetic Side Detail */}
      <div className='absolute right-12 bottom-12 hidden xl:block'>
        <div className='flex items-center gap-8 rotate-90 origin-right'>
          <span className='text-[#D4AF37]/40 text-[9px] uppercase tracking-[1.5em] font-black'>
            Cigarro Eléctrico
          </span>
          <div className='w-32 h-[1px] bg-gradient-to-r from-[#D4AF37]/50 to-transparent' />
        </div>
      </div>
    </header>
  );
};

export default Hero;
