'use client';

import React from 'react';
import { Globe, ShieldCheck, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

const TrustSection = () => {
  const trustFeatures = [
    {
      title: "Concierge Support",
      desc: "Direct access to our premium concierge team 24/7 for a bespoke experience.",
      icon: <Headphones size={28} className="text-indigo-400" />,
      glow: "group-hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]",
    },
    {
      title: "Island-wide Priority",
      desc: "Discreet, insured priority shipping across Sri Lanka directly to your door.",
      icon: <Globe size={28} className="text-cyan-400" />,
      glow: "group-hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]",
    },
    {
      title: "Certified Authentic",
      desc: "100% Brand Guarantee with encrypted serial verification on all hardware.",
      icon: <ShieldCheck size={28} className="text-purple-400" />,
      glow: "group-hover:shadow-[0_0_30px_rgba(192,132,252,0.2)]",
    },
  ];

  return (
    <section className="relative py-32 overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-40">
          <source src="/vape2.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-20 text-center">
          <p className="text-indigo-500 font-black text-[10px] uppercase tracking-[0.5em] mb-4">The Gold Standard</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tighter">Uncompromising Quality.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trustFeatures.map((feat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              className="group relative"
            >
              <div className={`h-full p-10 rounded-[3rem] bg-white/[0.03] backdrop-blur-2xl border border-white/10 transition-all duration-500 hover:bg-white/[0.07] ${feat.glow}`}>
                <div className="mb-8 inline-flex p-5 rounded-2xl bg-white/5 border border-white/10 group-hover:border-indigo-500/50 transition-all">
                  {feat.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{feat.title}</h3>
                <p className="text-zinc-400 leading-relaxed text-sm font-light">{feat.desc}</p>
                <div className="mt-8 h-[1px] w-12 bg-white/10 group-hover:w-full transition-all duration-700" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;