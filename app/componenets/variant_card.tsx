"use client";

import React, { useState, useEffect } from 'react';
import { motion, useAnimation, Variants } from 'framer-motion';
import { 
  ShoppingBag, 
  CheckCircle2, 
  XCircle, 
  Check,
  Sparkles,
  Zap,
  Star,
  Shield,
  Droplet
} from 'lucide-react';

interface VariantCardProps {
  variant: any;
  index: number;
  isActive: boolean;
  onSelect: () => void;
  onAddToCart: (variant: any) => void;
}

const VariantCard = ({ variant, index, isActive, onSelect, onAddToCart }: VariantCardProps) => {
  const [isAdded, setIsAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const controls = useAnimation();

  // Mouse move effect for 3D parallax tilt
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isHovered) {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMousePosition({ x, y });
      }
    };

    const element = document.getElementById(`variant-card-${variant._id}`);
    if (element) {
      element.addEventListener('mousemove', (e) => handleMouseMove(e as unknown as MouseEvent));
      return () => element.removeEventListener('mousemove', (e) => handleMouseMove(e as unknown as MouseEvent));
    }
  }, [isHovered, variant._id]);

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (variant.availability && variant.stock > 0) {
      onAddToCart(variant);
      
      setIsAdded(true);
      controls.start({
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0],
        transition: { duration: 0.4 }
      });
      
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  const backgroundImage = variant.variantImage?.[0];
  
  const getFlavorGradient = () => {
    const flavor = variant.flavor?.toLowerCase() || '';
    if (flavor.includes('strawberry')) return 'from-pink-500/20 to-red-500/20';
    if (flavor.includes('mango')) return 'from-orange-500/20 to-yellow-500/20';
    if (flavor.includes('apple')) return 'from-green-500/20 to-emerald-500/20';
    if (flavor.includes('grape')) return 'from-purple-500/20 to-indigo-500/20';
    if (flavor.includes('mint')) return 'from-emerald-400/20 to-teal-500/20';
    return 'from-[#D4AF37]/20 to-[#AA771C]/20'; // Default gold gradient
  };

  const particleVariants: Variants[] = [...Array(12)].map((_, i) => ({
    initial: { x: 0, y: 0, opacity: 0, scale: 0 },
    animate: { 
      x: (Math.random() - 0.5) * 150,
      y: (Math.random() - 0.5) * 150,
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      transition: { 
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        delay: i * 0.15,
        ease: "easeOut" 
      }
    }
  }));

  return (
    <motion.div
      id={`variant-card-${variant._id}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onSelect}
      className={`relative p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] transition-all duration-700 cursor-pointer overflow-hidden group min-h-[400px] sm:min-h-[450px] md:min-h-[500px] flex flex-col justify-between
        ${isActive 
          ? 'border-2 border-[#D4AF37] shadow-[0_20px_50px_rgba(212,175,55,0.3)]' 
          : 'border border-white/10 hover:border-[#D4AF37]/30 shadow-xl'}`}
      style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
    >
      {/* Gold Border Glow Effect */}
      <div className={`absolute inset-0 rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] transition-opacity duration-700 pointer-events-none
        ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}
        style={{
          boxShadow: 'inset 0 0 30px rgba(212,175,55,0.2), 0 0 30px rgba(212,175,55,0.2)'
        }}
      />

      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          rotateX: isHovered ? mousePosition.y * 5 : 0,
          rotateY: isHovered ? -mousePosition.x * 5 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute inset-0">
          <motion.img 
            src={backgroundImage} 
            alt={variant.flavor}
            animate={{ scale: isActive ? 1.2 : isHovered ? 1.15 : 1 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full object-cover"
          />
          
          {/* Gradient Overlay with Gold Tint */}
          <div className={`absolute inset-0 transition-opacity duration-700 
            ${isActive ? 'bg-gradient-to-b from-black/80 via-black/70 to-black/80' : 'bg-gradient-to-b from-black/70 via-black/60 to-black/70'}`} 
          />
          
          {/* Flavor-specific gradient with gold overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${getFlavorGradient()} mix-blend-overlay`} />
          
          {/* Gold overlay on hover/active */}
          <div className={`absolute inset-0 bg-[#D4AF37] mix-blend-overlay transition-opacity duration-700
            ${isActive ? 'opacity-10' : 'opacity-0 group-hover:opacity-5'}`} 
          />
        </div>
      </motion.div>

      {/* Gold particles effect */}
      {(isHovered || isActive) && (
        <div className="absolute inset-0 z-5 pointer-events-none">
          {particleVariants.map((pVariant, i) => (
            <motion.div
              key={i}
              variants={pVariant}
              initial="initial"
              animate="animate"
              className="absolute w-1 h-1 bg-[#D4AF37] rounded-full"
              style={{ 
                left: '50%', 
                top: '50%', 
                filter: 'blur(1px)',
                boxShadow: '0 0 10px #D4AF37'
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 flex justify-between items-start">
        <motion.div 
          animate={{ scale: isHovered ? 1.1 : 1, rotate: isHovered ? 5 : 0 }}
          className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl backdrop-blur-xl flex items-center justify-center text-2xl sm:text-3xl md:text-4xl border
            ${isActive 
              ? 'bg-[#D4AF37]/20 border-[#D4AF37]/30 shadow-[0_0_20px_rgba(212,175,55,0.2)]' 
              : 'bg-black/40 border-white/10'}`}
        >
          {variant.emoji}
        </motion.div>
        
        {variant.availability && variant.stock > 0 ? (
          <div className="flex items-center gap-1 sm:gap-1.5 text-[#D4AF37] font-black text-[7px] sm:text-[8px] md:text-[9px] uppercase tracking-widest bg-[#D4AF37]/10 backdrop-blur-xl px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full border border-[#D4AF37]/30">
            <CheckCircle2 size={8} className="sm:hidden" />
            <CheckCircle2 size={10} className="hidden sm:block md:hidden" />
            <CheckCircle2 size={12} className="hidden md:block" />
            <span className="hidden sm:inline">Live Stock</span>
            <span className="sm:hidden">Live</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 sm:gap-1.5 text-zinc-400 font-black text-[7px] sm:text-[8px] md:text-[9px] uppercase tracking-widest bg-zinc-500/10 backdrop-blur-xl px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full border border-zinc-500/30">
            <XCircle size={8} className="sm:hidden" />
            <XCircle size={10} className="hidden sm:block md:hidden" />
            <XCircle size={12} className="hidden md:block" />
            <span className="hidden sm:inline">Sold Out</span>
            <span className="sm:hidden">Out</span>
          </div>
        )}
      </div>

      <div className="relative z-10 mt-auto space-y-4 sm:space-y-5 md:space-y-6">
        <div>
          <p className="text-[#D4AF37] font-mono text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
            <Sparkles size={8} className="sm:hidden" />
            <Sparkles size={10} className="hidden sm:block md:hidden" />
            <Sparkles size={12} className="hidden md:block" />
            Edition {index + 1}
          </p>
          
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-1 sm:mb-2 leading-tight tracking-tight drop-shadow-2xl">
            {variant.flavor}
          </h3>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <p className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1 sm:gap-1.5">
              <Zap size={8} className="sm:hidden text-[#D4AF37]" />
              <Zap size={10} className="hidden sm:block md:hidden text-[#D4AF37]" />
              <Zap size={12} className="hidden md:block text-[#D4AF37]" />
              {variant.stock} Units left
            </p>
            
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={8} 
                  className="sm:hidden fill-[#D4AF37] text-[#D4AF37]" 
                />
              ))}
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={10} 
                  className="hidden sm:block md:hidden fill-[#D4AF37] text-[#D4AF37]" 
                />
              ))}
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={12} 
                  className="hidden md:block fill-[#D4AF37] text-[#D4AF37]" 
                />
              ))}
            </div>
          </div>

          {/* Additional variant info */}
          <div className="mt-3 sm:mt-4 flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-1 sm:gap-2 text-zinc-600">
              <Droplet size={8} className="sm:hidden text-[#D4AF37]" />
              <Droplet size={10} className="hidden sm:block md:hidden text-[#D4AF37]" />
              <Droplet size={12} className="hidden md:block text-[#D4AF37]" />
              <span className="text-[6px] sm:text-[7px] md:text-[8px] font-black uppercase tracking-wider">
                {variant.nicotine || '5%'} Nic
              </span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 text-zinc-600">
              <Shield size={8} className="sm:hidden text-[#D4AF37]" />
              <Shield size={10} className="hidden sm:block md:hidden text-[#D4AF37]" />
              <Shield size={12} className="hidden md:block text-[#D4AF37]" />
              <span className="text-[6px] sm:text-[7px] md:text-[8px] font-black uppercase tracking-wider">
                Verified
              </span>
            </div>
          </div>
        </div>

        <motion.button
          disabled={!variant.availability || variant.stock <= 0 || isAdded}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddClick}
          animate={controls}
          className={`w-full py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[8px] sm:text-[10px] md:text-xs flex items-center justify-center gap-2 sm:gap-3 transition-all duration-500 backdrop-blur-xl border relative overflow-hidden
            ${isAdded 
              ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 border-emerald-400 text-white shadow-lg' 
              : variant.availability && variant.stock > 0
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#B49450] border-[#D4AF37]/50 text-black hover:shadow-[0_10px_30px_rgba(212,175,55,0.3)]' 
                : 'bg-white/5 border-white/10 text-zinc-600 cursor-not-allowed'}`}
        >
          {/* Shimmer effect on hover */}
          {variant.availability && variant.stock > 0 && !isAdded && (
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />
          )}
          
          {isAdded ? (
            <>
              <Check size={12} className="sm:hidden" strokeWidth={3} />
              <Check size={14} className="hidden sm:block md:hidden" strokeWidth={3} />
              <Check size={16} className="hidden md:block" strokeWidth={3} />
              <span>Added</span>
            </>
          ) : (
            <>
              <ShoppingBag size={12} className="sm:hidden" />
              <ShoppingBag size={14} className="hidden sm:block md:hidden" />
              <ShoppingBag size={16} className="hidden md:block" />
              <span className="hidden xs:inline">
                {variant.availability && variant.stock > 0 ? 'Secure Now' : 'Out of Stock'}
              </span>
              <span className="xs:hidden">
                {variant.availability && variant.stock > 0 ? 'Buy' : 'Out'}
              </span>
            </>
          )}
        </motion.button>
      </div>

      {/* Decorative background text */}
      <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 md:-bottom-8 md:-right-8 text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white/5 uppercase pointer-events-none select-none">
        {variant.flavor?.split(' ')[0] || 'ELITE'}
      </div>

      {/* Corner gold accents */}
      <div className={`absolute top-0 left-0 w-6 sm:w-8 h-6 sm:h-8 border-t border-l transition-all duration-700
        ${isActive ? 'border-[#D4AF37]' : 'border-transparent group-hover:border-[#D4AF37]/30'}`} 
      />
      <div className={`absolute bottom-0 right-0 w-6 sm:w-8 h-6 sm:h-8 border-b border-r transition-all duration-700
        ${isActive ? 'border-[#D4AF37]' : 'border-transparent group-hover:border-[#D4AF37]/30'}`} 
      />
    </motion.div>
  );
};

export default VariantCard;