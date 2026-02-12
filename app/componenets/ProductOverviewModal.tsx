'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShoppingBag, 
  Truck, 
  Snowflake, 
  Star, 
  Check,
  Droplet,
  Leaf,
  Flame,
  Heart,
  Zap,
  Package
} from 'lucide-react';

const ProductOverviewModal = ({ isOpen, onClose, product }) => {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [likedVariants, setLikedVariants] = useState({});

  if (!product) return null;

  const {
    brand = "VOZOL VISTA",
    puffs = "20,000",
    description = "Smooth • Long-lasting • Premium taste",
    variants = [],
    delivery = 400,
    image = "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?q=80&w=2070&auto=format&fit=crop"
  } = product;

  const totalInStock = variants.filter(v => v.inStock).length;

  const toggleLike = (variantId, e) => {
    e.stopPropagation();
    setLikedVariants(prev => ({
      ...prev,
      [variantId]: !prev[variantId]
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-10 z-50 overflow-y-auto"
          >
            <div className="min-h-full flex items-center justify-center">
              <div className="relative w-full max-w-6xl bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
                
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                  }} />
                </div>

                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="absolute top-6 right-6 z-30 p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/20 hover:bg-black/60 transition-all"
                >
                  <X className="w-5 h-5 text-white" />
                </motion.button>

                {/* Content */}
                <div className="relative z-20 p-8 md:p-10">
                  
                  {/* Header Section */}
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <Package className="w-6 h-6 text-amber-400" />
                        <span className="text-amber-400 font-black uppercase tracking-[0.3em] text-sm">
                          {brand}
                        </span>
                      </div>
                      
                      <h2 className="text-4xl md:text-5xl font-black text-white mb-3">
                        {puffs} PUFFS
                      </h2>
                      
                      <p className="text-gray-400 text-lg mb-4">
                        {description}
                      </p>

                      {/* Quick Stats */}
                      <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                            <Droplet className="w-5 h-5 text-amber-400" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">Total Flavors</div>
                            <div className="text-2xl font-bold text-white">{variants.length}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                            <Check className="w-5 h-5 text-green-400" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">In Stock</div>
                            <div className="text-2xl font-bold text-white">{totalInStock}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Product Image */}
                    <motion.div
                      animate={{ 
                        y: [0, -10, 0],
                        rotate: [0, 2, -2, 0]
                      }}
                      transition={{ 
                        duration: 6, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shadow-2xl"
                    >
                      <img 
                        src={image} 
                        alt={brand}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  </div>

                  {/* Flavors Grid Title */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                      <Flame className="w-6 h-6 text-amber-400" />
                      Available Flavors
                    </h3>
                    <span className="text-sm text-gray-400 bg-white/5 px-4 py-2 rounded-full">
                      {totalInStock} of {variants.length} in stock
                    </span>
                  </div>

                  {/* Flavors Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
                    {variants.map((variant, index) => (
                      <motion.div
                        key={variant.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -4 }}
                        onClick={() => variant.inStock && setSelectedVariant(variant)}
                        className={`
                          relative overflow-hidden rounded-2xl p-6 cursor-pointer
                          transition-all duration-300
                          ${selectedVariant?.id === variant.id 
                            ? 'bg-gradient-to-br ' + (variant.color || 'from-amber-500 to-orange-500') + ' shadow-xl' 
                            : 'bg-white/5 hover:bg-white/10 border border-white/10'
                          }
                          ${!variant.inStock && 'opacity-50 cursor-not-allowed hover:bg-white/5'}
                        `}
                      >
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-5">
                          <div className="absolute inset-0" style={{
                            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 1px)',
                            backgroundSize: '20px 20px'
                          }} />
                        </div>

                        {/* Badges */}
                        <div className="absolute top-4 right-4 flex gap-2">
                          {variant.isPopular && (
                            <div className="px-3 py-1 bg-amber-400 rounded-full text-black text-xs font-black flex items-center gap-1">
                              <Star className="w-3 h-3 fill-black" />
                              POPULAR
                            </div>
                          )}
                          {variant.isIce && (
                            <div className="px-3 py-1 bg-sky-500 rounded-full text-white text-xs font-black flex items-center gap-1">
                              <Snowflake className="w-3 h-3" />
                              ICE
                            </div>
                          )}
                        </div>

                        {/* Like Button */}
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => toggleLike(variant.id, e)}
                          className="absolute bottom-4 right-4 p-2 bg-black/40 backdrop-blur-sm rounded-full border border-white/20 hover:bg-black/60 transition-all"
                        >
                          <Heart className={`w-4 h-4 ${
                            likedVariants[variant.id] 
                              ? 'fill-rose-500 text-rose-500' 
                              : 'text-white'
                          }`} />
                        </motion.button>

                        {/* Flavor Icon & Info */}
                        <div className="flex items-start gap-4">
                          <div className="text-5xl filter drop-shadow-lg">
                            {variant.icon || '🍃'}
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-white mb-1">
                              {variant.flavor}
                            </h4>
                            
                            <div className="flex items-center gap-3 mb-3">
                              <div className="flex items-center gap-1">
                                <Zap className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-400">{puffs} Puffs</span>
                              </div>
                              {variant.isIce && (
                                <div className="flex items-center gap-1">
                                  <Snowflake className="w-4 h-4 text-sky-400" />
                                  <span className="text-sm text-sky-400">Cooling</span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-2xl font-black text-white">
                                  Rs. {variant.price?.toLocaleString() || product.price?.toLocaleString()}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                  <Truck className="w-3 h-3" />
                                  Delivery: Rs. {variant.delivery || product.delivery}
                                </div>
                              </div>
                              
                              {!variant.inStock && (
                                <span className="px-3 py-1.5 bg-red-500/20 border border-red-500/30 rounded-full text-red-400 text-xs font-bold">
                                  Out of Stock
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Selected Indicator */}
                        {selectedVariant?.id === variant.id && (
                          <motion.div
                            layoutId="selectedFlavor"
                            className="absolute bottom-0 left-0 right-0 h-1 bg-white"
                          />
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* Order Summary & CTA */}
                  {selectedVariant && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/30"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                          <div className="text-4xl">{selectedVariant.icon || '🍃'}</div>
                          <div>
                            <h4 className="text-white font-bold text-xl">
                              {selectedVariant.flavor}
                            </h4>
                            <p className="text-gray-300 text-sm">
                              Selected Flavor • Ready to Order
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="text-3xl font-black text-white">
                              Rs. {selectedVariant.price?.toLocaleString() || product.price?.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-300">
                              + Delivery Rs. {selectedVariant.delivery || product.delivery}
                            </div>
                          </div>
                          
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-black rounded-xl font-black uppercase tracking-wider text-sm flex items-center gap-2 shadow-xl"
                          >
                            <ShoppingBag className="w-5 h-5" />
                            Order Now
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Footer Info */}
                  <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>📲 DM / Inbox to order</span>
                      <span className="w-1 h-1 bg-gray-600 rounded-full" />
                      <span className="text-amber-400 font-semibold flex items-center gap-1">
                        <Flame className="w-4 h-4" />
                        First come, first served!
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Limited stock available
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductOverviewModal;