'use client';

import React from 'react';
import { Zap, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const NewsletterSection = () => {
  return (
    <section className="px-6 py-24 relative overflow-hidden bg-black">
      <div className="max-w-7xl mx-auto overflow-hidden relative rounded-[3rem] border border-white/10 bg-zinc-950 shadow-2xl">
        
        {/* --- Video Background Layer --- */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-30"
          >
            <source src="/vape2.mp4" type="video/mp4" />
          </video>
          {/* Neon Glow Overlays */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-purple-600/20" />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Noise Overlay */}
        <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

        <div className="px-8 py-20 md:px-20 md:py-24 flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
          
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center lg:justify-start gap-3 mb-8"
            >
              <div className="p-2.5 bg-indigo-500/20 rounded-xl backdrop-blur-md border border-indigo-500/30">
                <Sparkles size={18} className="text-indigo-400" />
              </div>
              <span className="font-black uppercase tracking-[0.4em] text-[10px] text-indigo-300">Member Access</span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black leading-[0.85] mb-8 text-white tracking-tighter"
            >
              Unlock the <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Neon Archive.</span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-light text-zinc-400 max-w-md text-xl leading-relaxed"
            >
              Join 5,000+ enthusiasts receiving weekly drops of <span className="text-white font-medium">exotic hardware</span> and artisanal blends.
            </motion.p>
          </div>

          {/* Form Side */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row w-full lg:w-auto gap-4 p-4 bg-white/[0.03] rounded-[2.5rem] backdrop-blur-3xl border border-white/10 shadow-2xl"
          >
            <input 
              type="email" 
              placeholder="Enter your terminal email..." 
              className="bg-white/5 px-8 py-5 rounded-2xl flex-grow lg:w-96 placeholder:text-zinc-600 focus:outline-none focus:bg-white/10 transition-all font-medium text-white border border-transparent focus:border-indigo-500/50"
            />
            <button className="group bg-white text-black px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-500 hover:text-white transition-all duration-500 flex items-center justify-center gap-3">
              Join Archive
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

        </div>

        {/* Accent Light Line */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
      </div>
    </section>
  );
};

export default NewsletterSection;