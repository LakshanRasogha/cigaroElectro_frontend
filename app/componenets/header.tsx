'use client';

import React from 'react';
import { ChevronRight, ShieldCheck, Zap, Sparkles, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <header className="relative h-screen min-h-[800px] flex items-center overflow-hidden bg-black">
      
      {/* --- Video Background Layer --- */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-60"
        >
          <source src="/vape.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Dynamic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/20 to-transparent" />
        
        {/* Animated Glows to match the video energy */}
        <motion.div 
          animate={{ 
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.1, 1] 
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full" 
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-4xl">
          
          {/* Main Heading: Bold & Immersive with Dancing Script */}
          <h1 className="mb-8 leading-[1.1] tracking-tight" style={{ fontFamily: "'Dancing Script', cursive" }}>
            <div className="overflow-hidden py-2">
              <motion.span 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="block text-7xl md:text-7xl font-bold text-white"
              >
                Pure
              </motion.span>
            </div>
            <div className="overflow-hidden py-2">
              <motion.span 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="block text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400"
              >
                Atmosphere
              </motion.span>
            </div>
          </h1>

          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-zinc-400 text-lg md:text-2xl mb-12 leading-relaxed max-w-xl font-light"
          >
            Sri Lanka&apos;s premier destination for high-fidelity hardware. 
            Experience the <span className="text-white font-medium italic">Carbon Series</span> — where engineering meets sensory art.
          </motion.p>

          {/* CTA Section */}
          <div className="flex flex-wrap gap-6 items-center">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="group relative bg-white text-black px-10 py-6 rounded-full overflow-hidden font-bold uppercase text-xs tracking-widest transition-all"
            >
              <span className="relative z-10 flex items-center gap-2">
                Shop The Range <ChevronRight className="h-4 w-4" />
              </span>
              <div className="absolute inset-0 bg-indigo-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </motion.button>

            <motion.button 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-4 text-white/70 hover:text-white transition-colors group"
            >
              <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white/10 transition-all">
                <Play className="h-4 w-4 fill-current" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">Process Film</span>
            </motion.button>
          </div>

          {/* Feature Bar */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-20 flex flex-wrap gap-12 pt-8 border-t border-white/10"
          >
            <div className="flex items-center gap-4">
              <ShieldCheck className="text-indigo-400 h-6 w-6" />
              <div>
                <p className="text-white text-xs font-bold tracking-tighter uppercase">Authentic Hardware</p>
                <p className="text-zinc-500 text-[10px]">Direct from manufacturers</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Zap className="text-cyan-400 h-6 w-6" />
              <div>
                <p className="text-white text-xs font-bold tracking-tighter uppercase">Islandwide Delivery</p>
                <p className="text-zinc-500 text-[10px]">Same day in Colombo</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Side Detail (Only visible on large screens) */}
      <div className="absolute right-12 bottom-12 hidden xl:block">
         <div className="flex items-center gap-6 rotate-90 origin-right">
            <span className="text-white/20 text-[10px] uppercase tracking-[1em] font-black">Est. MMXXIV</span>
            <div className="w-24 h-[1px] bg-white/20" />
         </div>
      </div>
    </header>
  );
};

export default Hero;