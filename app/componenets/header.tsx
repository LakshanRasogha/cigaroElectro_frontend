'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <header className="relative h-screen flex items-center pt-20 overflow-hidden bg-black">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 scale-110">
        <img 
          src="https://images.unsplash.com/photo-1559819614-81fea9efd090?q=80&w=2070&auto=format&fit=crop" 
          alt="Luxury Vaping Hero" 
          className="w-full h-full object-cover opacity-50 hero-bg-parallax"
        />
        {/* Gradient mask for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          {/* Animated Heading */}
          <h1 className="text-6xl md:text-8xl font-bold font-serif mb-8 leading-tight text-white">
            <div className="overflow-hidden">
              <motion.span 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
                className="hero-line block"
              >
                Elevate Your
              </motion.span>
            </div>
            <div className="overflow-hidden">
              <motion.span 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
                className="hero-line block text-[#D4AF37]"
              >
                Senses.
              </motion.span>
            </div>
          </h1>

          {/* Animated Subtext */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-gray-400 text-lg md:text-xl mb-12 leading-relaxed max-w-lg font-light"
          >
            Experience the pinnacle of electronic sophistication. From gold-standard devices 
            to exotic artisanal blends designed for the connoisseur.
          </motion.p>

          {/* Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-5"
          >
            <button className="group bg-[#D4AF37] text-black px-12 py-5 rounded-full uppercase text-xs font-black tracking-[0.2em] hover:bg-[#C5A028] hover:-translate-y-1 transition-all shadow-xl shadow-[#D4AF37]/20 flex items-center justify-center gap-2">
              Shop Now 
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button className="border border-[#D4AF37] text-white px-12 py-5 rounded-full uppercase text-xs font-black tracking-[0.2em] hover:bg-[#D4AF37] hover:text-black transition-all">
              Get In Touch
            </button>
          </motion.div>
        </div>
      </div>

      {/* Subtle Bottom Glow Decor */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10"></div>
    </header>
  );
};

export default Hero;