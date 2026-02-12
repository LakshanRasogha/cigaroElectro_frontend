'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, ArrowRight } from 'lucide-react';

const HeritageSection = () => {
  return (
    <section className="relative py-32 bg-white overflow-hidden" id="about">
      {/* --- Ambient Neon Background (Adjusted for Light Mode) --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-[-10%] w-[600px] h-[600px] bg-indigo-100/60 blur-[130px] rounded-full" />
        <div className="absolute bottom-0 right-[5%] w-[500px] h-[500px] bg-cyan-100/40 blur-[110px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-20 relative z-10">
        
        {/* Image Side with Floating Neon Frame */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:w-1/2 relative group"
        >
          {/* Top-Left Neon Accent */}
          <div className="absolute -top-6 -left-6 w-32 h-32 border-t-4 border-l-4 border-indigo-500 rounded-tl-3xl z-20 group-hover:-translate-x-2 group-hover:-translate-y-2 transition-all duration-500 ease-out shadow-[10px_10px_30px_rgba(99,102,241,0.2)]"></div>
          
          <div className="relative z-10 overflow-hidden rounded-[2.5rem] border-8 border-white shadow-2xl shadow-indigo-100">
            <img 
              src="https://images.unsplash.com/photo-1553273058-03f8445d9f2e?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="CigaroElectrico Heritage" 
              className="w-full h-[600px] object-cover transition-transform duration-[2s] group-hover:scale-105" 
            />
            {/* Vibrant Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-white/20"></div>
          </div>

          {/* Bottom-Right Neon Accent */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 border-b-4 border-r-4 border-cyan-400 rounded-br-3xl z-20 group-hover:translate-x-2 group-hover:translate-y-2 transition-all duration-500 ease-out shadow-[10px_10px_30px_rgba(34,211,238,0.2)]"></div>
        </motion.div>

        {/* Content Side */}
        <div className="lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center gap-4 mb-8">
               <span className="h-[2px] w-12 bg-gradient-to-r from-indigo-600 to-cyan-400"></span>
               <span className="text-indigo-600 uppercase tracking-[0.4em] text-[10px] font-black block">
                 Established 2012 • Sri Lanka
               </span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-bold font-serif mb-10 leading-[0.95] text-zinc-900 tracking-tighter">
              Crafting the <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-cyan-500 italic">
                Future Aesthetic.
              </span>
            </h2>
            
            <p className="text-zinc-500 mb-10 text-lg leading-relaxed font-medium border-l-4 border-indigo-500/20 pl-8">
              CigaroElectrico remains the island&apos;s pioneer in high-tech vapor design. We curate an ecosystem where <span className="text-indigo-600 font-bold">luxury meets the neon grid</span>—strictly for those who demand peak performance and unmatched authenticity.
            </p>

            {/* Feature Cards with Neon Glows */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-100/50 hover:shadow-cyan-100 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center mb-4 group-hover:bg-cyan-500 group-hover:text-white transition-colors duration-300">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-sm uppercase tracking-widest mb-2 text-zinc-900">Pure Verity</h4>
                <p className="text-xs text-zinc-500 leading-relaxed font-medium">Encrypted serial verification on every device drop.</p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-100/50 hover:shadow-purple-100 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center mb-4 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300">
                  <Zap className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-sm uppercase tracking-widest mb-2 text-zinc-900">Pulse Tech</h4>
                <p className="text-xs text-zinc-500 leading-relaxed font-medium">Instant-fire ignition and sub-ohm precision control.</p>
              </div>
            </div>

            {/* Neon Button */}
            <button className="relative overflow-hidden group bg-zinc-900 text-white px-12 py-5 rounded-2xl uppercase text-[10px] font-black tracking-[0.2em] transition-all duration-300 hover:bg-indigo-600 hover:shadow-2xl hover:shadow-indigo-300 active:scale-95">
              <span className="relative z-10 flex items-center gap-3">
                Initialize Discovery
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default HeritageSection;