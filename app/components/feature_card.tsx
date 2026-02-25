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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.15, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      whileHover={{ y: -8 }}
      className="relative group cursor-pointer h-full"
    >
      {/* Main Card Container with Gold Gradient Border */}
      <div className="relative h-full p-[1px] rounded-2xl sm:rounded-3xl bg-gradient-to-br from-transparent via-[#D4AF37]/20 to-transparent group-hover:via-[#D4AF37]/40 transition-all duration-700">
        
        {/* Inner Content with Dark Background */}
        <div className="relative h-full bg-gradient-to-br from-[#0a0a0a] to-[#030303] rounded-2xl sm:rounded-3xl overflow-hidden backdrop-blur-sm">
          
          {/* Animated Gold Orbs Background */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.5
            }}
            className="absolute -right-16 -top-16 w-40 h-40 bg-[#D4AF37] rounded-full blur-[60px] opacity-20 group-hover:opacity-30 transition-opacity duration-700"
          />
          
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.7
            }}
            className="absolute -left-16 -bottom-16 w-40 h-40 bg-[#D4AF37] rounded-full blur-[60px] opacity-20 group-hover:opacity-30 transition-opacity duration-700"
          />

          {/* Subtle Pattern Overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMTBhMjAgMjAgMCAwIDEgMjAgMjAgMjAgMjAgMCAwIDEtNDAgMCAyMCAyMCAwIDAgMSAyMC0yMHoiIGZpbGw9IiNENEFGMzciIGZpbGwtb3BhY2l0eT0iMC4wMyIvPjwvc3ZnPg==')] opacity-30" />

          {/* Content Container with Responsive Padding */}
          <div className="relative z-10 p-6 sm:p-8 md:p-10 lg:p-12">
            
            {/* Icon Container with Enhanced Gold Effects */}
            <motion.div 
              whileHover={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
              className="relative inline-block mb-6 sm:mb-8"
            >
              {/* Icon Background Glow */}
              <div className="absolute inset-0 bg-[#D4AF37] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full" />
              
              {/* Icon with Gradient Border */}
              <div className="relative p-3 sm:p-4 bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-xl sm:rounded-2xl border border-[#D4AF37]/30 group-hover:border-[#D4AF37]/60 transition-all duration-500 shadow-[0_5px_20px_rgba(212,175,55,0.15)] group-hover:shadow-[0_10px_30px_rgba(212,175,55,0.3)]">
                <div className="text-[#D4AF37] transform group-hover:scale-110 transition-transform duration-500">
                  {/* Clone icon with size adjustment for mobile */}
                  <div className="sm:hidden w-6 h-6">
                    {icon}
                  </div>
                  <div className="hidden sm:block md:hidden w-7 h-7">
                    {icon}
                  </div>
                  <div className="hidden md:block w-8 h-8">
                    {icon}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Title with Gold Gradient on Hover */}
            <h3 className="relative font-black text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4 text-white tracking-tight">
              <span className="relative z-10 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#D4AF37] group-hover:via-[#F2D37D] group-hover:to-[#AA771C] transition-all duration-500">
                {title}
              </span>
              
              {/* Animated Underline */}
              <motion.div 
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#D4AF37] to-transparent"
              />
            </h3>
            
            {/* Description with Gold Tint on Hover */}
            <p className="text-xs sm:text-sm md:text-base text-zinc-500 leading-relaxed font-light group-hover:text-zinc-400 transition-colors duration-500 max-w-[90%]">
              {desc}
            </p>

            {/* Decorative Elements */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="w-1 h-1 rounded-full bg-[#D4AF37]"
                  />
                ))}
              </div>
            </div>

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#D4AF37]/0 group-hover:border-[#D4AF37]/30 transition-all duration-700 rounded-tl-2xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#D4AF37]/0 group-hover:border-[#D4AF37]/30 transition-all duration-700 rounded-br-2xl" />
          </div>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <motion.div 
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0, 0.1, 0],
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -inset-4 bg-[#D4AF37] rounded-3xl blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700 -z-10"
      />
    </motion.div>
  );
};

export default FeatureCard;