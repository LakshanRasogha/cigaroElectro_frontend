'use client';

import React from 'react';
import { Zap, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const NewsletterSection = () => {
  return (
    <section className="px-6 py-24 relative overflow-hidden bg-[#050505]">
      <div className="max-w-7xl mx-auto overflow-hidden relative rounded-[3rem] border border-white/5 bg-black shadow-2xl">
        
        {/* --- Video Background Layer (Colored & Muted) --- */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-40"
          >
            <source src="/vape2.mp4" type="video/mp4" />
          </video>
          {/* Obsidian & Gold Ambient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 via-transparent to-[#AA771C]/10" />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Noise Overlay for Texture */}
        <div className="absolute inset-0 opacity-[0.1] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

        <div className="px-8 py-20 md:px-20 md:py-24 flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
          
          {/* Text Content */}
          <div className="text-center lg:text-left">
  {/* Member Access Badge */}
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    className="flex items-center justify-center lg:justify-start gap-3 mb-6"
  >
    <div className="p-2 bg-[#D4AF37]/10 rounded-xl backdrop-blur-md border border-[#D4AF37]/30">
      <Sparkles size={16} className="text-[#D4AF37]" />
    </div>
    <span className="font-black uppercase tracking-[0.4em] text-[9px] md:text-[10px] text-[#D4AF37]">
      Member Access
    </span>
  </motion.div>

  {/* Main Heading - Adjusted for small frames */}
  <motion.h2 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    // Mobile: text-3xl, Tablet: text-5xl, Desktop: text-7xl
    className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black leading-[1] md:leading-[0.85] mb-6 text-white tracking-tighter uppercase"
  >
    Join the <br className="hidden sm:block" /> 
    <span 
      className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F2D37D] to-[#AA771C] inline-block mt-2 md:mt-0" 
      style={{ fontFamily: "'Dancing Script', cursive" }}
    >
      Elite Registry.
    </span>
  </motion.h2>

  {/* Description Text - Adjusted for small frames */}
  <motion.p 
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ delay: 0.2 }}
    // Mobile: text-base, Tablet/Desktop: text-xl
    className="font-light text-zinc-400 max-w-sm md:max-w-md text-base md:text-xl leading-relaxed mx-auto lg:mx-0"
  >
    Join 5,000+ enthusiasts receiving weekly drops of <span className="text-white font-medium">exotic hardware</span> and artisanal gold-tier blends.
  </motion.p>
</div>

          {/* Form Side */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row w-full lg:w-auto gap-4 p-4 bg-white/[0.03] rounded-[2.5rem] backdrop-blur-3xl border border-white/5 shadow-2xl"
          >
            <input 
              type="email" 
              placeholder="Enter your client email..." 
              className="bg-black/40 px-8 py-5 rounded-2xl flex-grow lg:w-96 placeholder:text-zinc-700 focus:outline-none focus:bg-black/60 transition-all font-medium text-white border border-transparent focus:border-[#D4AF37]/40"
            />
            <button className="group bg-[#D4AF37] text-black px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all duration-500 flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(212,175,55,0.2)]">
              Register Now
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

        </div>

        {/* Bottom Gold Accent Line */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
      </div>
    </section>
  );
};

export default NewsletterSection;