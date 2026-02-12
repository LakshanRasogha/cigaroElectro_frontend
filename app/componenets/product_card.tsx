'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Sparkles, Zap, Heart, Flame, ShoppingCart } from 'lucide-react';

const ProductCard = ({ 
  brand = "VOZOL VISTA",
  puffs = "20,000",
  description = "Smooth • Long-lasting • Premium taste",
  price = 8900,
  delivery = 400,
  inStock = true,
  isPopular = false,
  isNew = false,
  image = "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?q=80&w=2070&auto=format&fit=crop",
  variants = [],
  onClick,
  index = 0 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Get unique flavors count
  const flavorCount = variants.length;
  const inStockCount = variants.filter(v => v.inStock).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group h-full"
    >
      <div className="relative h-full rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 hover:border-amber-500/50 transition-all duration-300 shadow-xl">
        
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src={image} 
            alt={brand}
            className="w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
        </div>

        {/* Animated Gradient Overlay on Hover */}
        <motion.div
          animate={{ opacity: isHovered ? 0.2 : 0 }}
          className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500"
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          {isPopular && (
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="px-4 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full text-black text-xs font-black shadow-lg flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              BESTSELLER
            </motion.div>
          )}
          
          {isNew && (
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="px-4 py-1.5 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full text-white text-xs font-black shadow-lg flex items-center gap-1"
            >
              NEW
            </motion.div>
          )}
        </div>

        {/* Like Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-4 right-4 z-20 p-2.5 bg-black/40 backdrop-blur-md rounded-full border border-white/20 hover:bg-black/60 transition-all"
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
        </motion.button>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col p-6">
          {/* Brand & Puffs */}
          <div className="mb-4">
            <span className="text-xs text-amber-400 font-bold uppercase tracking-[0.2em]">
              {brand}
            </span>
            <h3 className="text-2xl font-black text-white mt-2">
              {puffs} PUFFS
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              {description}
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <div className="text-xs text-gray-400">Flavors</div>
                <div className="text-white font-bold">{flavorCount}</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
              </div>
              <div>
                <div className="text-xs text-gray-400">In Stock</div>
                <div className="text-white font-bold">{inStockCount}</div>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="text-sm text-gray-400">Starting from</div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white">
                Rs. {price.toLocaleString()}
              </span>
              <span className="text-gray-400">/=</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              + Delivery Rs. {delivery}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto flex flex-col gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClick}
              className="w-full py-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl text-black font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-500/30 transition-all"
            >
              <Eye className="w-4 h-4" />
              See {flavorCount} Flavors
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-white/5 backdrop-blur-sm rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 border border-white/10 hover:bg-white/10 transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              Quick Order
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;