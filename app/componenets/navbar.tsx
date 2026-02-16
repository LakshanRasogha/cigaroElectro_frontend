"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X, Zap, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Mock cart values - in a real app, pull these from your Cart Context
  const cartItemCount = 0;
  const cartTotal = 0;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Collections', path: '/collections' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav 
      className={`fixed w-full z-[100] transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-xl border-b border-slate-100 py-0 shadow-sm' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-cyan-400 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-200 group-hover:rotate-[180deg] transition-transform duration-500">
              <Zap size={20} fill="currentColor" />
            </div>
            <span className={`text-xl font-black tracking-tighter uppercase transition-colors duration-300 ${isScrolled ? 'text-slate-900' : 'text-slate-800'}`}>
              Figaro<span className="text-purple-600 italic">Electrico</span>
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center font-bold uppercase text-[11px] tracking-[0.2em]">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link 
                  key={link.name} 
                  href={link.path} 
                  className={`relative px-2 py-1 transition-colors duration-300 ${
                    isActive ? 'text-purple-600' : 'text-slate-500 hover:text-purple-500'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span 
                      layoutId="navUnderline"
                      className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-cyan-400 rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 md:gap-6">
            
            {/* Profile Section */}
            <div className="relative group">
              <Link 
                href="/profile" 
                className={`p-2 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-slate-100 ${isScrolled ? 'text-slate-900' : 'text-slate-600'}`}
              >
                <User className="h-5 w-5 group-hover:text-purple-600 transition-colors" />
              </Link>
              
              <div className="absolute top-full right-0 mt-2 w-32 py-2 bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 -translate-y-2 group-hover:translate-y-0 hidden md:block">
                <Link href="/auth/login" className="block px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-purple-600">Login</Link>
                <Link href="/profile" className="block px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-purple-600">Profile</Link>
              </div>
            </div>

            {/* Cart Section - NOW ROUTED TO /cart */}
            <Link 
              href="/cart"
              className={`flex items-center gap-3 cursor-pointer group transition-all duration-300 ${isScrolled ? 'text-slate-900' : 'text-slate-600'}`}
            >
              <div className="relative p-2 rounded-full group-hover:bg-slate-100 transition-colors">
                <ShoppingCart className="h-5 w-5 group-hover:text-purple-600 transition-colors" />
                <span className="absolute top-0 right-0 bg-purple-600 text-white text-[8px] font-black rounded-full w-4 h-4 flex items-center justify-center border-2 border-white">
                  {cartItemCount}
                </span>
              </div>
              <span className="hidden lg:inline text-xs font-black tracking-widest">
                Rs. {cartTotal.toLocaleString()}
              </span>
            </Link>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-slate-900 p-2 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-white z-[90] md:hidden pt-24 px-10"
          >
            <div className="flex flex-col space-y-6">
              {navLinks.map((link, i) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={link.name}
                >
                  <Link 
                    href={link.path} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-4xl font-black text-slate-900 hover:text-purple-600 transition-colors tracking-tighter"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link 
                  href="/cart" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-black text-indigo-600 flex items-center gap-2 mb-4"
                >
                  Shopping Bag <ShoppingCart size={24} />
                </Link>
                <Link 
                  href="/auth/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-black text-purple-600 flex items-center gap-2"
                >
                  Account Access <User size={24} />
                </Link>
              </motion.div>
            </div>
            
            <div className="absolute bottom-10 left-10 border-l-2 border-purple-600 pl-4">
              <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                Living in Color <br /> Since 2012
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;