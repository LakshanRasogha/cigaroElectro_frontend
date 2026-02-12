'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Effect to handle background opacity on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ['Home', 'About', 'Shop', 'Contact'];

  return (
    <nav 
      className={`fixed w-full z-[100] transition-all duration-300 border-b ${
        isScrolled 
          ? 'bg-black/95 backdrop-blur-md border-white/10 py-0' 
          : 'bg-transparent border-transparent py-2'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center text-black font-bold text-xl group-hover:rotate-[360deg] transition-transform duration-700">
              CE
            </div>
            <span className="text-xl font-bold tracking-tighter font-serif uppercase text-white">
              Cigaro<span className="text-[#D4AF37]">Electrico</span>
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-10 items-center font-medium uppercase text-[10px] tracking-[0.3em]">
            {navLinks.map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-gray-300 hover:text-[#D4AF37] transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* Right Actions (Cart & Mobile Toggle) */}
          <div className="flex items-center gap-4">
            <div className="bg-white/5 border border-white/10 px-5 py-2 rounded-full flex items-center gap-3 cursor-pointer hover:border-[#D4AF37]/50 transition-all hover:bg-white/10 group">
              <span className="text-[#D4AF37] font-bold text-sm">$0.00</span>
              <div className="relative">
                <ShoppingCart className="h-5 w-5 text-gray-400 group-hover:text-[#D4AF37] transition-colors" />
                <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-black text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                  0
                </span>
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`
        fixed inset-0 bg-black z-[-1] transition-transform duration-500 md:hidden
        ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}
      `}>
        <div className="flex flex-col items-center justify-center h-full space-y-8 font-serif uppercase tracking-widest text-2xl">
          {navLinks.map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white hover:text-[#D4AF37] transition-colors"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;