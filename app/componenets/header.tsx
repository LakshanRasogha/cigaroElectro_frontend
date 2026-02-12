'use client';

import React from 'react';
import { ChevronRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <header className="relative h-screen min-h-[800px] flex items-center pt-20 overflow-hidden bg-white">
      
      {/* --- Dynamic Background Layer --- */}
      <div className="absolute inset-0 z-0">
        {/* The Base Image: Higher brightness, lower grayscale */}
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
          src="https://images.unsplash.com/photo-1529641484336-ef35148bab06?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="Premium Vapor" 
          className="w-full h-full object-cover opacity-10"
        />
        
        {/* Vibrant Neon Overlays */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white via-white/40 to-cyan-100/20" />
        
        {/* Animated Neon Orbs */}
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-indigo-200/30 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-cyan-200/40 blur-[100px] rounded-full" />
        <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] bg-purple-100/30 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* --- Left Column: Content --- */}
          <div className="max-w-2xl pb-[100px]">
            {/* Value Proposition Badge - Cyber Light Style */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-8 backdrop-blur-md shadow-sm"
            >
              <Sparkles className="text-indigo-600 h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-900">
                Next-Gen Hardware • Pure Extracts
              </span>
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-bold font-serif mb-8 leading-[0.9] text-zinc-900 tracking-tighter">
              <div className="overflow-hidden">
                <motion.span 
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
                  className="block"
                >
                  Refine Your
                </motion.span>
              </div>
              <div className="overflow-hidden">
                <motion.span 
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
                  className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-cyan-500"
                >
                  Vape Ritual.
                </motion.span>
              </div>
            </h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-zinc-500 text-lg md:text-xl mb-10 leading-relaxed max-w-lg font-medium"
            >
              Sri Lanka&apos;s destination for the modern enthusiast. We curate 
              <span className="text-indigo-600 font-bold"> elite tech</span> and artisanal blends designed for peak performance and sensory perfection.
            </motion.p>

            {/* Quick Info Grid - Indigo Accents */}
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.8 }}
               className="grid grid-cols-2 gap-6 mb-12 border-l-4 border-indigo-500/20 pl-6"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-indigo-600 h-5 w-5" />
                <span className="text-[11px] uppercase tracking-widest text-zinc-800 font-bold">100% Authentic</span>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="text-cyan-500 h-5 w-5" />
                <span className="text-[11px] uppercase tracking-widest text-zinc-800 font-bold">Express Delivery</span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-col sm:flex-row gap-5"
            >
              {/* Primary Button: Electric Gradient */}
              <button className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-12 py-5 rounded-2xl uppercase text-xs font-black tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2">
                Explore Shop 
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              {/* Secondary Button: Clean Glass */}
              <button className="backdrop-blur-md bg-white border border-zinc-200 text-zinc-900 px-12 py-5 rounded-2xl uppercase text-xs font-black tracking-[0.2em] hover:bg-zinc-50 transition-all shadow-sm">
                The Heritage
              </button>
            </motion.div>
          </div>

          {/* --- Right Column: High-Contrast Visual --- */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="hidden lg:block relative"
          >
            <div className="relative z-10 w-full aspect-[4/5] rounded-[3rem] overflow-hidden border-8 border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
                <img 
                  src="https://images.unsplash.com/photo-1545095088-26a59e3f2717?q=80&w=687&auto=format&fit=crop" 
                  className="w-full h-full object-cover"
                  alt="Elite Series"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 via-transparent to-transparent" />
                
                {/* Product Label Overlay */}
                <div className="absolute bottom-10 left-10">
                  <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl">
                    <p className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.4em] mb-1">Elite Release</p>
                    <p className="text-zinc-900 font-serif text-3xl font-bold">Carbon X-2</p>
                  </div>
                </div>
            </div>
            
            {/* Background Decorative Rings - Cyan/Indigo */}
            <div className="absolute -inset-10 -z-10 border-2 border-indigo-100 rounded-[4rem] animate-pulse" />
            <div className="absolute -inset-20 -z-10 border border-cyan-50 rounded-[5rem] rotate-3" />
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Hero;