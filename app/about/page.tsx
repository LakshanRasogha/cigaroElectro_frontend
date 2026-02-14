"use client";

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShieldCheck, Zap, Globe, ArrowRight, Sparkles } from 'lucide-react';
import Footer from '../componenets/footer';

const AboutPage = () => {
  const { scrollYProgress } = useScroll();
  
  // Smooth entrance animations for the hero
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
  };

  return (
    <div className="bg-[#FFFFFF] text-slate-900 min-h-screen selection:bg-cyan-200 selection:text-cyan-900 overflow-x-hidden">
      
      {/* --- NEON AMBIENT BACKGROUND ELEMENTS --- */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-100/50 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-cyan-100/40 blur-[100px] rounded-full" />
      </div>

      {/* --- HERO SECTION --- */}
      <motion.section 
        style={{ opacity, y }}
        className="relative h-screen flex flex-col items-center justify-center text-center px-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="mb-8 p-3 bg-gradient-to-tr from-purple-500 to-cyan-400 rounded-2xl rotate-3 shadow-xl shadow-purple-200/50"
        >
          <Sparkles className="w-8 h-8 text-white" />
        </motion.div>
        
        <motion.span 
          initial={{ opacity: 0, letterSpacing: "0.1em" }}
          animate={{ opacity: 1, letterSpacing: "0.4em" }}
          className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-500 font-mono font-bold uppercase text-xs mb-6"
        >
          Established 2012 • Sri Lanka
        </motion.span>
        
        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-9xl font-serif font-black mb-8 text-slate-900 tracking-tighter leading-[0.9]"
        >
          Elevated <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 italic px-2">
            Discovery.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-2xl text-slate-500 text-xl font-medium leading-relaxed"
        >
          Merging artisanal precision with the vibrant energy of the future. 
          We define the benchmark for hardware excellence in a world of color.
        </motion.p>
      </motion.section>

      {/* --- STORY SECTION --- */}
      <section className="py-32 px-6 max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeUp} className="space-y-8">
            <h2 className="text-5xl font-black text-slate-900">The Neon <br/>Heritage</h2>
            <div className="w-20 h-2 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full" />
            <p className="text-slate-600 text-lg leading-loose">
              Born in the tropical heart of Sri Lanka, Figaro Electrico began as a defiant stand against the ordinary. We believe technology shouldn't just be functional—it should be an extension of your lifestyle, expressed through pure flavor and striking aesthetics.
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-4 px-8 py-4 bg-slate-900 text-white rounded-full font-bold shadow-2xl shadow-slate-300 transition-all hover:bg-purple-600"
            >
              Explore Our Timeline <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
          
          <motion.div 
            initial={{ rotate: -5, opacity: 0 }}
            whileInView={{ rotate: 0, opacity: 1 }}
            className="relative group"
          >
             <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
             <div className="relative aspect-[4/5] rounded-[2rem] bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center shadow-inner">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070')] bg-cover bg-center mix-blend-multiply opacity-10" />
                <div className="text-center">
                   <span className="block text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-200 to-slate-400">12</span>
                   <span className="text-purple-600 font-mono font-black uppercase tracking-[0.2em]">Years of Precision</span>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* --- PILLARS GRID --- */}
      <section className="py-32 bg-slate-50/50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center mb-20">
            <h2 className="text-4xl font-black mb-4 uppercase tracking-widest text-slate-400">Our Core Pillars</h2>
        </div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-10">
            <PillarCard 
              icon={<ShieldCheck className="w-10 h-10 text-blue-500" />}
              title="Certified"
              accent="bg-blue-500"
              desc="100% Brand Guarantee with encrypted serial verification on every piece of hardware we release."
            />
            <PillarCard 
              icon={<Zap className="w-10 h-10 text-purple-500" />}
              title="Pulse Tech"
              accent="bg-purple-500"
              desc="Instant-fire ignition and sub-ohm precision control calibrated for artisanal flavor profiles."
            />
            <PillarCard 
              icon={<Globe className="w-10 h-10 text-cyan-500" />}
              title="Priority"
              accent="bg-cyan-500"
              desc="Concierge-level shipping across Sri Lanka. Discreet, insured, and delivered within 24 hours."
            />
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-48 text-center relative">
        <motion.div 
          whileInView={{ scale: [0.9, 1], opacity: [0, 1] }}
          className="relative z-10"
        >
          <h2 className="text-7xl font-black mb-12 tracking-tighter">Live in <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 italic px-4">Color.</span></h2>
          <motion.button 
            whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(168, 85, 247, 0.2)" }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-12 py-6 rounded-2xl font-black text-lg tracking-widest uppercase transition-all"
          >
            Initialize Discovery
          </motion.button>
        </motion.div>
      </section>
      <section className="py-48 text-center relative">
        <Footer />
      </section>

    </div>
  );
};

/* --- SUB-COMPONENT --- */
const PillarCard = ({ icon, title, desc, accent }: { icon: React.ReactNode, title: string, desc: string, accent: string }) => (
  <motion.div 
    whileHover={{ y: -15 }}
    className="p-12 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_10px_50px_rgba(0,0,0,0.04)] hover:shadow-2xl transition-all duration-500 text-center flex flex-col items-center"
  >
    <div className={`mb-8 p-5 rounded-2xl bg-slate-50 shadow-inner group-hover:scale-110 transition-transform`}>
        {icon}
    </div>
    <h3 className="text-2xl font-black mb-4 text-slate-900 uppercase tracking-tight">{title}</h3>
    <div className={`w-8 h-1 ${accent} mb-6 rounded-full`} />
    <p className="text-slate-500 leading-relaxed font-medium">{desc}</p>
  </motion.div>
);

export default AboutPage;