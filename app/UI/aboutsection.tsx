'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, ArrowRight } from 'lucide-react';

const HeritageSection = () => {
  return (
    <section className="relative py-32 bg-[#050505] overflow-hidden" id="about">
      
      {/* Ambient Gold Background Glows */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#AA771C]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-20 relative z-10">
        
        {/* --- Video Card Side --- */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:w-1/2 relative group"
        >
          {/* Top-Left Gold Accent */}
          <div className="absolute -top-6 -left-6 w-32 h-32 border-t-2 border-l-2 border-[#D4AF37] rounded-tl-[3rem] z-20 group-hover:-translate-x-2 group-hover:-translate-y-2 transition-all duration-700 shadow-[0_0_25px_rgba(212,175,55,0.4)]" />
          
          {/* The Live Video Container */}
          <div className="relative z-10 overflow-hidden rounded-[3rem] border-4 border-white/5 bg-zinc-900 shadow-2xl aspect-[4/5] lg:h-[650px]">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-80 transition-transform duration-[3s] group-hover:scale-105"
            >
              <source src="/vape4.mp4" type="video/mp4" />
            </video>
            
            {/* Inner Video Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 opacity-60" />
            
            {/* Play/Live Indicator */}
            <div className="absolute bottom-10 left-10 flex items-center gap-3">
               <div className="w-3 h-3 bg-[#D4AF37] rounded-full animate-pulse shadow-[0_0_10px_rgba(212,175,55,1)]" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">Live Heritage Feed</span>
            </div>
          </div>

          {/* Bottom-Right Gold Accent */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 border-b-2 border-r-2 border-[#D4AF37]/50 rounded-br-[3rem] z-20 group-hover:translate-x-2 group-hover:translate-y-2 transition-all duration-700 shadow-[0_0_25px_rgba(212,175,55,0.2)]" />
        </motion.div>

        {/* --- Content Side --- */}
        <div className="lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-6 mb-10">
                <span className="h-[1px] w-16 bg-gradient-to-r from-[#D4AF37] to-transparent"></span>
                <span className="text-[#D4AF37] uppercase tracking-[0.5em] text-[10px] font-black block">
                  Established 2012 • The Archipelago
                </span>
            </div>
            
            <h2 className="text-6xl md:text-8xl font-black mb-12 leading-[0.85] text-white tracking-tighter uppercase">
              Crafting the <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F2D37D] to-[#AA771C] italic" style={{ fontFamily: "'Dancing Script', cursive" }}>
                Future Aesthetic.
              </span>
            </h2>
            
            <p className="text-zinc-400 mb-12 text-xl leading-relaxed font-light border-l-2 border-[#D4AF37]/20 pl-10 max-w-xl">
              CigaroElectrico remains the island&apos;s pioneer in high-tech vapor design. We curate an ecosystem where <span className="text-[#D4AF37] font-medium">luxury meets craftsmanship</span>—strictly for those who demand peak performance.
            </p>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
              {/* Card 1 */}
              <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-[#D4AF37]/30 transition-all group/card">
                <div className="w-14 h-14 rounded-2xl bg-black border border-white/10 flex items-center justify-center mb-6 group-hover/card:bg-[#D4AF37] group-hover/card:text-black transition-all duration-500 shadow-inner">
                  <ShieldCheck className="h-7 w-7 text-[#D4AF37] group-hover/card:text-black" />
                </div>
                <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-3 text-white">Pure Verity</h4>
                <p className="text-[11px] text-zinc-500 leading-relaxed font-medium group-hover/card:text-zinc-300">Encrypted serial verification on every device drop.</p>
              </div>

              {/* Card 2 */}
              <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-[#D4AF37]/30 transition-all group/card">
                <div className="w-14 h-14 rounded-2xl bg-black border border-white/10 flex items-center justify-center mb-6 group-hover/card:bg-[#D4AF37] group-hover/card:text-black transition-all duration-500 shadow-inner">
                  <Zap className="h-7 w-7 text-[#D4AF37] group-hover/card:text-black" />
                </div>
                <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-3 text-white">Pulse Tech</h4>
                <p className="text-[11px] text-zinc-500 leading-relaxed font-medium group-hover/card:text-zinc-300">Instant-fire ignition and sub-ohm precision control.</p>
              </div>
            </div>

            {/* Primary Action Button */}
            <button className="group relative bg-[#D4AF37] text-black px-12 py-6 rounded-2xl uppercase text-[10px] font-black tracking-[0.3em] transition-all duration-500 hover:bg-white hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(212,175,55,0.1)]">
              <span className="relative z-10 flex items-center gap-4">
                Initialize Discovery
                <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-500" />
              </span>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Background Decorative Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#D4AF3708_1px,transparent_1px),linear-gradient(to_bottom,#D4AF3708_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
    </section>
  );
};

export default HeritageSection;