'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const HeritageSection = () => {
  return (
    <section className="py-32 bg-black overflow-hidden" id="about">
      <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-20">
        
        {/* Image Side with Interactive Border Frame */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:w-1/2 relative group"
        >
          {/* Top-Left Corner Frame */}
          <div className="absolute -top-10 -left-10 w-40 h-40 border-t-2 border-l-2 border-[#D4AF37]/40 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform duration-700 ease-out"></div>
          
          <div className="relative z-10 overflow-hidden rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <img 
              src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000" 
              alt="CigaroElectrico Heritage" 
              className="w-full h-[500px] object-cover transition-transform duration-[2s] group-hover:scale-110" 
            />
            {/* Subtle Gold Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>

          {/* Bottom-Right Corner Frame */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 border-b-2 border-r-2 border-[#D4AF37]/40 group-hover:-translate-x-4 group-hover:-translate-y-4 transition-transform duration-700 ease-out"></div>
        </motion.div>

        {/* Content Side */}
        <div className="lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#D4AF37] uppercase tracking-[0.4em] text-xs font-black block mb-6">
              The Island&apos;s Premier Collection • Since 2012
            </span>
            <h2 className="text-5xl md:text-6xl font-bold font-serif mb-10 leading-tight text-white">
              Crafting the <br/>
              <span className="text-[#D4AF37] italic">Standard.</span>
            </h2>
            
            <p className="text-gray-400 mb-10 text-lg leading-relaxed font-light">
              CigaroElectrico was founded with a singular vision: to introduce the pinnacle of electronic sophistication to Sri Lanka. We don’t just sell hardware; we curate an experience for the connoisseur who values authenticity and technological excellence above all else.
            </p>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
              <div className="flex items-start gap-4 group">
                <CheckCircle2 className="text-[#D4AF37] h-6 w-6 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-widest mb-1 text-white">Pure Authenticity</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">Direct partnerships with the world’s most renowned master craftsmen.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <CheckCircle2 className="text-[#D4AF37] h-6 w-6 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-widest mb-1 text-white">Elite Technology</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">Cutting-edge temperature control for a consistently smooth experience.</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button className="relative overflow-hidden group bg-[#D4AF37] text-black px-12 py-5 rounded-full uppercase text-xs font-black tracking-[0.2em] transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl shadow-[#D4AF37]/20">
              <span className="relative z-10">Discover Our Heritage</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </button>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default HeritageSection;