'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  index: number;
}

const FeatureCard = ({ icon, title, desc, index }: FeatureCardProps) => {
  return (
    <motion.div
      // Fade in and slide up based on index for a "staggered" look
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1, 
        ease: [0.21, 0.47, 0.32, 0.98] 
      }}
      whileHover={{ y: -10 }}
      className="relative group cursor-default"
    >
      {/* Background with Glassmorphism and subtle border */}
      <div className="h-full bg-gradient-to-br from-zinc-900/80 to-black p-10 border border-white/5 border-l-2 border-l-[#D4AF37]/30 group-hover:border-l-[#D4AF37] transition-all duration-500 backdrop-blur-sm overflow-hidden">
        
        {/* Decorative background glow on hover */}
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#D4AF37]/5 blur-3xl rounded-full group-hover:bg-[#D4AF37]/10 transition-colors duration-500" />

        {/* Icon with scaling and glow */}
        <div className="text-[#D4AF37] mb-8 relative">
          <div className="transform group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all duration-500">
            {icon}
          </div>
        </div>

        {/* Text Content */}
        <h3 className="font-bold text-xl mb-3 text-white tracking-tight group-hover:text-[#D4AF37] transition-colors duration-300">
          {title}
        </h3>
        
        <p className="text-gray-400 text-sm leading-relaxed font-light group-hover:text-gray-300 transition-colors duration-300">
          {desc}
        </p>

        {/* Animated bottom bar reveal */}
        <div className="absolute bottom-0 left-0 h-[2px] bg-[#D4AF37] w-0 group-hover:w-full transition-all duration-700 ease-in-out" />
      </div>
    </motion.div>
  );
};

export default FeatureCard;