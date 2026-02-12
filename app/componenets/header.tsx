'use client';

import React from 'react';
import { ChevronRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <header className="relative h-screen min-h-[800px] flex items-center pt-20 overflow-hidden bg-[#050505]">
      
      {/* --- Dynamic Background Layer --- */}
      <div className=" absolute inset-0 z-0">
        {/* The Base Image */}
        <motion.img 
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          src="https://images.unsplash.com/photo-1602410086232-0cdfb78b434f?q=80&w=1118&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="Premium Vapor" 
          className="w-full h-full object-cover opacity-40 grayscale-[30%]"
        />
        
        {/* Luxury Color Overlays */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/60 to-[#D4AF37]/10" />
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#D4AF37]/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-600/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center ">
          
          {/* --- Left Column: Content --- */}
          <div className="max-w-2xl pb-[100px]">
            {/* Value Proposition Badge */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md"
            >
              <Sparkles className="text-[#D4AF37] h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
                Premium Hardware • Lab Tested Liquids
              </span>
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-bold font-serif mb-8 leading-[0.9] text-white">
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
                  className="block text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A028]"
                >
                  Vape Ritual.
                </motion.span>
              </div>
            </h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-gray-400 text-lg md:text-xl mb-10 leading-relaxed max-w-lg font-light"
            >
              Sri Lanka&apos;s destination for the elite. We curate world-class 
              hardware and artisanal e-liquids with <span className="text-white font-medium">zero compromise on safety</span> and peak performance.
            </motion.p>

            {/* Quick Info Grid */}
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.8 }}
               className="grid grid-cols-2 gap-6 mb-12 border-l border-white/10 pl-6"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-[#D4AF37] h-5 w-5" />
                <span className="text-[11px] uppercase tracking-widest text-gray-300 font-bold">Verified Authentic</span>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="text-[#D4AF37] h-5 w-5" />
                <span className="text-[11px] uppercase tracking-widest text-gray-300 font-bold">Fast Island-wide</span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-col sm:flex-row gap-5"
            >
              <button className="group bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-black px-12 py-5 rounded-full uppercase text-xs font-black tracking-[0.2em] hover:scale-105 transition-all shadow-2xl shadow-[#D4AF37]/20 flex items-center justify-center gap-2">
                Explore Shop 
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="backdrop-blur-md bg-white/5 border border-white/10 text-white px-12 py-5 rounded-full uppercase text-xs font-black tracking-[0.2em] hover:bg-white/10 transition-all">
                The Heritage
              </button>
            </motion.div>
          </div>

          {/* --- Right Column: Visual Element --- */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="hidden lg:block relative"
          >
            {/* This represents a floating "Signature Product" or Abstract shape */}
            <div className="relative z-10 w-full aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1545095088-26a59e3f2717?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  className="w-full h-full object-cover"
                  alt="Elite Series"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <p className="text-[#D4AF37] font-black text-[10px] uppercase tracking-[0.4em] mb-2">New Arrival</p>
                  <p className="text-white font-serif text-3xl">Carbon Elite X</p>
                </div>
            </div>
            
            {/* Background glowing rings */}
            <div className="absolute inset-0 -z-10 border border-[#D4AF37]/20 rounded-3xl scale-110 blur-sm animate-pulse" />
            <div className="absolute inset-0 -z-10 border border-[#D4AF37]/10 rounded-3xl scale-125" />
          </motion.div>
        </div>
      </div>

      {/* Section Divider */}
      {/* <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#050505] to-transparent z-10"></div> */}
    </header>
  );
};

export default Hero;