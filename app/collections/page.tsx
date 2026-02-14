"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation'; // Import the router

const collections = [
  {
    id: "electric-series", // Changed to string IDs for cleaner URLs
    title: "The Electric Series",
    category: "Hardware",
    image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1000",
    color: "from-purple-600/80",
  },
  {
    id: "artisanal-blends",
    title: "Artisanal Blends",
    category: "Liquids",
    image: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1000",
    color: "from-cyan-500/80",
  },
  {
    id: "carbon-x",
    title: "Carbon X Edition",
    category: "Elite Release",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000",
    color: "from-pink-500/80",
  },
  {
    id: "neon-pods",
    title: "Neon Pods",
    category: "Essentials",
    image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=1000",
    color: "from-blue-600/80",
  },
];

const CollectionsPage = () => {
  return (
    <div className="bg-white min-h-screen pt-32 pb-20 px-6 lg:px-10">
      <header className="max-w-7xl mx-auto mb-16">
        <motion.span 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-purple-600 font-mono text-xs font-bold tracking-[0.3em] uppercase"
        >
          2024 Hardware Drop
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter mt-4"
        >
          Curated <br /> <span className="italic text-slate-300">Collections.</span>
        </motion.h1>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {collections.map((item, index) => (
          <CollectionCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </div>
  );
};

const CollectionCard = ({ item, index }: { item: any, index: number }) => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      // Navigation Trigger
      onClick={() => router.push(`/collections/${item.id}`)}
      className="group relative h-[600px] w-full rounded-[2.5rem] overflow-hidden bg-slate-100 cursor-pointer active:scale-[0.98] transition-transform"
    >
      <motion.div 
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
        className="absolute inset-0 w-full h-full"
      >
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
        />
      </motion.div>

      <div className={`absolute inset-0 bg-gradient-to-t ${item.color} via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      <div className="absolute top-8 right-8 overflow-hidden rounded-full">
        <motion.div 
          whileHover={{ rotate: 90 }}
          className="bg-white/20 backdrop-blur-md p-4 text-white border border-white/30"
        >
          <ArrowUpRight size={24} />
        </motion.div>
      </div>

      <div className="absolute inset-0 p-10 flex flex-col justify-end text-white translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
        <motion.span className="font-mono text-xs uppercase tracking-[0.2em] mb-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
          {item.category}
        </motion.span>
        <h3 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 leading-none">
          {item.title}
        </h3>
        
        <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity delay-200">
          <div className="h-[1px] w-12 bg-white" />
          <span className="text-sm font-black uppercase tracking-widest">Explore Series</span>
        </div>
      </div>

      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/20 blur-[80px] rounded-full pointer-events-none group-hover:bg-purple-400/40 transition-colors duration-700" />
    </motion.div>
  );
};

export default CollectionsPage;