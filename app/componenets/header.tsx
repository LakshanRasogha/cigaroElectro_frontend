'use client';

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ShieldCheck, Zap, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter()

  const handleNavigation = () => {
    router.push('/collections')
  }
  // Audio Toggle Logic - Fixed to toggle correctly
  const handleMouseEnter = () => {
    if (videoRef.current) videoRef.current.muted = true;
  };

  const handleMouseLeave = () => {
    if (videoRef.current) videoRef.current.muted = true;
  };

  return (
    <header className="relative h-screen min-h-[800px] bg-black overflow-hidden flex items-center pt-20 lg:pt-24">
      {/* pt-20 lg:pt-24 creates the space for your Fixed Navbar. 
          flex items-center ensures the content remains centered in the remaining space.
      */}
      
      {/* --- Video Background Layer --- */}
      <div 
        className="absolute inset-0 z-0"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-40"
        >
          <source src="/vape.mp4" type="video/mp4" />
        </video>
        
        {/* Obsidian Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#050505]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
        
        {/* Gold Ambient Glow */}
        <motion.div 
          animate={{ 
            opacity: [0.1, 0.2, 0.1],
            scale: [1, 1.2, 1] 
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-[#D4AF37]/10 blur-[150px] rounded-full" 
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full">
        <div className="max-w-4xl">
          
          {/* Main Heading */}
          <h1 className="mb-6 leading-[1.1] tracking-tight">
            <div className="overflow-hidden py-1">
              <motion.span 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="block text-5xl md:text-7xl font-bold text-white uppercase tracking-tighter"
              >
                Cigaro
              </motion.span>
            </div>
            <div className="overflow-hidden py-1">
              <motion.span 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="block text-5xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F2D37D] to-[#AA771C]"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                Electrico
              </motion.span>
            </div>
          </h1>

          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-zinc-400 text-base md:text-xl mb-10 leading-relaxed max-w-xl font-light"
          >
            Sri Lanka&apos;s premier destination for luxury hardware. 
            Experience the <span className="text-[#D4AF37] font-medium">Gold Standard</span> — where engineering meets sensory art.
          </motion.p>

          {/* CTA Section */}
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="group relative bg-[#D4AF37] text-black px-8 py-5 rounded-full overflow-hidden font-bold uppercase text-[10px] tracking-[0.2em] transition-all shadow-[0_10px_30px_rgba(212,175,55,0.2)]"
            >
              <span onClick={handleNavigation}
                    className="relative z-10 flex items-center gap-2">
                Explore Collection <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </motion.button>

            {/* Hover Sound Indicator */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-3 text-white/50 group cursor-help"
            >
              <div className="w-10 h-10 rounded-full border border-[#D4AF37]/30 flex items-center justify-center group-hover:bg-[#D4AF37]/10 transition-all">
                <Volume2 className="h-4 w-4 text-[#D4AF37]" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">Hover video for audio</span>
            </motion.div>
          </div>

          {/* Feature Bar */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-[#D4AF37]/20"
          >
            <div className="flex items-center gap-4">
              <ShieldCheck className="text-[#D4AF37] h-6 w-6" />
              <div>
                <p className="text-white text-xs font-bold tracking-tighter uppercase">Authentic Gold Tier</p>
                <p className="text-zinc-500 text-[10px]">Verified luxury hardware</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Zap className="text-[#D4AF37] h-6 w-6" />
              <div>
                <p className="text-white text-xs font-bold tracking-tighter uppercase">Premium Logistics</p>
                <p className="text-zinc-500 text-[10px]">Concierge delivery islandwide</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Side Vertical Detail */}
      <div className="absolute right-12 bottom-12 hidden xl:block">
         <div className="flex items-center gap-6 rotate-90 origin-right">
            <span className="text-[#D4AF37]/30 text-[10px] uppercase tracking-[1em] font-black">Luxury Est. 2024</span>
            <div className="w-24 h-[1px] bg-[#D4AF37]/30" />
         </div>
      </div>
    </header>
  );
};

export default Hero;