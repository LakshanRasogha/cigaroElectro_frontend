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
  Star
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
    e.stopPropagation(); // Prevents triggering card selection
    
    if (variant.availability && variant.stock > 0) {
      // 1. Trigger the logic to update localStorage and Navbar stats
      onAddToCart(variant);
      
      // 2. Trigger local visual feedback animation
      setIsAdded(true);
      controls.start({
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0],
        transition: { duration: 0.4 }
      });
      
      // 3. Reset button state after a delay (without redirecting)
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  const backgroundImage = variant.variantImage?.[0];
  
  const getFlavorGradient = () => {
    const flavor = variant.flavor?.toLowerCase() || '';
    if (flavor.includes('strawberry')) return 'from-pink-500/30 to-red-500/30';
    if (flavor.includes('mango')) return 'from-orange-500/30 to-yellow-500/30';
    if (flavor.includes('apple')) return 'from-green-500/30 to-emerald-500/30';
    if (flavor.includes('grape')) return 'from-purple-500/30 to-indigo-500/30';
    if (flavor.includes('mint')) return 'from-emerald-400/30 to-teal-500/30';
    return 'from-indigo-500/30 to-purple-500/30';
  };

  const particleVariants: Variants[] = [...Array(8)].map((_, i) => ({
    initial: { x: 0, y: 0, opacity: 0, scale: 0 },
    animate: { 
      x: (Math.random() - 0.5) * 120,
      y: (Math.random() - 0.5) * 120,
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      transition: { 
        duration: 2 + Math.random() * 2,
        repeat: Infinity,
        delay: i * 0.2,
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
      whileHover={{ y: -10 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onSelect}
      className={`relative p-8 rounded-[2.5rem] border transition-all duration-700 cursor-pointer overflow-hidden group min-h-[500px] flex flex-col justify-between
        ${isActive 
          ? 'border-indigo-500 shadow-2xl ring-4 ring-indigo-500/20' 
          : 'border-white/10 hover:border-white/20 shadow-xl'}`}
      style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
    >
      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          rotateX: isHovered ? mousePosition.y * 8 : 0,
          rotateY: isHovered ? -mousePosition.x * 8 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute inset-0">
          <motion.img 
            src={backgroundImage} 
            alt={variant.flavor}
            animate={{ scale: isActive ? 1.15 : isHovered ? 1.1 : 1 }}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 transition-opacity duration-500 
            ${isActive ? 'bg-black/70' : 'bg-black/50'}`} 
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${getFlavorGradient()} mix-blend-overlay`} />
        </div>
      </motion.div>

      {(isHovered || isActive) && (
        <div className="absolute inset-0 z-5 pointer-events-none">
          {particleVariants.map((pVariant, i) => (
            <motion.div
              key={i}
              variants={pVariant}
              initial="initial"
              animate="animate"
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{ left: '50%', top: '50%', filter: 'blur(1px)' }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 flex justify-between items-start">
        <motion.div 
          animate={{ scale: isHovered ? 1.1 : 1 }}
          className={`w-16 h-16 rounded-2xl backdrop-blur-xl flex items-center justify-center text-4xl border
            ${isActive ? 'bg-indigo-500/20 border-white/30' : 'bg-black/40 border-white/10'}`}
        >
          {variant.emoji}
        </motion.div>
        
        {variant.availability && variant.stock > 0 ? (
          <div className="flex items-center gap-1.5 text-emerald-400 font-black text-[9px] uppercase tracking-widest bg-emerald-500/20 backdrop-blur-xl px-4 py-2 rounded-full border border-emerald-500/30">
            <CheckCircle2 size={12} className="animate-pulse" /> Live Stock
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-rose-400 font-black text-[9px] uppercase tracking-widest bg-rose-500/20 backdrop-blur-xl px-4 py-2 rounded-full border border-rose-500/30">
            <XCircle size={12} /> Sold Out
          </div>
        )}
      </div>

      <div className="relative z-10 mt-auto space-y-6">
        <div>
          <p className="text-indigo-400 font-mono text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
            <Sparkles size={12} /> Edition {index + 1}
          </p>
          <h3 className="text-4xl font-black text-white mb-2 leading-tight tracking-tight drop-shadow-2xl">
            {variant.flavor}
          </h3>
          <div className="flex items-center gap-3">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
              <Zap size={10} className="text-amber-400" /> {variant.stock} Units left
            </p>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={10} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>
        </div>

        <motion.button
          disabled={!variant.availability || variant.stock <= 0 || isAdded}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddClick}
          animate={controls}
          className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 transition-all duration-500 backdrop-blur-xl border
            ${isAdded 
              ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg' 
              : variant.availability && variant.stock > 0
                ? 'bg-indigo-600/80 border-indigo-400 text-white hover:bg-indigo-500 shadow-xl' 
                : 'bg-white/10 border-white/10 text-slate-400 cursor-not-allowed'}`}
        >
          {isAdded ? (
            <><Check size={18} strokeWidth={3} /> Added To Bag</>
          ) : (
            <><ShoppingBag size={18} /> {variant.availability && variant.stock > 0 ? 'Secure Yours Now' : 'Out of Stock'}</>
          )}
        </motion.button>
      </div>

      <div className="absolute -bottom-8 -right-8 text-9xl font-black text-white/5 uppercase pointer-events-none select-none">
        {variant.flavor?.split(' ')[0]}
      </div>
    </motion.div>
  );
};

export default VariantCard;