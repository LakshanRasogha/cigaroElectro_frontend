'use client';

import React from 'react';
import { Globe, ShieldCheck, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

const TrustSection = () => {
  const trustFeatures = [
    {
      title: "Concierge Support",
      desc: "Direct access to our premium concierge team 24/7 for a bespoke, high-end experience.",
      icon: <Headphones size={28} className="text-[#D4AF37]" />,
      glow: "group-hover:shadow-[0_0_40px_rgba(212,175,55,0.15)]",
    },
    {
      title: "Island-wide Priority",
      desc: "Discreet, insured priority shipping across Sri Lanka directly to your door in custom packaging.",
      icon: <Globe size={28} className="text-[#D4AF37]" />,
      glow: "group-hover:shadow-[0_0_40px_rgba(212,175,55,0.15)]",
    },
    {
      title: "Certified Authentic",
      desc: "100% Brand Guarantee with encrypted gold-tier verification on all premium hardware.",
      icon: <ShieldCheck size={28} className="text-[#D4AF37]" />,
      glow: "group-hover:shadow-[0_0_40px_rgba(212,175,55,0.15)]",
    },
  ];

  return (
    <section className="relative py-32 overflow-hidden bg-[#050505]">
      {/* --- Background Layer --- */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover opacity-50"
        >
          <source src="/vape2.mp4" type="video/mp4" />
        </video>
        
        {/* Premium Overlay: 
            This keeps the video colored but ensures text remains readable by 
            adding a dark gradient wash.
        */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-black/20 to-[#050505]" />
        <div className="absolute inset-0 bg-black/30" />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-20 text-center">
          <motion.p 
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            whileInView={{ opacity: 1, letterSpacing: "0.5em" }}
            viewport={{ once: true }}
            className="text-[#D4AF37] font-black text-[10px] uppercase mb-4"
          >
            The Gold Standard
          </motion.p>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter uppercase">
            Uncompromising <span className="text-[#D4AF37]" style={{ fontFamily: "'Dancing Script', cursive" }}>Quality</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trustFeatures.map((feat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="group relative"
            >
              {/* Card Container */}
              <div className={`h-full p-10 rounded-[2.5rem] bg-gradient-to-br from-white/[0.07] to-transparent backdrop-blur-3xl border border-white/10 transition-all duration-700 hover:border-[#D4AF37]/40 ${feat.glow}`}>
                
                {/* Icon Box */}
                <div className="mb-8 inline-flex p-5 rounded-2xl bg-black/60 border border-white/10 group-hover:border-[#D4AF37]/50 transition-all duration-500 shadow-inner">
                  {feat.icon}
                </div>

                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight uppercase group-hover:text-[#D4AF37] transition-colors duration-500">
                  {feat.title}
                </h3>
                
                <p className="text-zinc-400 leading-relaxed text-sm font-light group-hover:text-zinc-200 transition-colors duration-500">
                  {feat.desc}
                </p>

                {/* Animated Decorative Line */}
                <div className="mt-8 relative h-[1px] w-12 bg-white/20 overflow-hidden">
                  <div className="absolute inset-0 bg-[#D4AF37] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Subtle Bottom Gold Glow */}
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#D4AF37]/10 blur-[120px] rounded-full" />
    </section>
  );
};

export default TrustSection;