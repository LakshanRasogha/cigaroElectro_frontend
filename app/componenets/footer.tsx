'use client';

import React from 'react';
import { Facebook, Instagram, Twitter, MapPin, Mail, Phone, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const collections = ['Golden Series', 'Elite Pods', 'Artisanal Liquids', 'Limited Editions'];
  const concierge = ['Shipping Policy', 'Terms of Service', 'Privacy Policy', 'Wholesale'];
  const socialIcons = [
    { Icon: Facebook, color: 'hover:bg-blue-600 hover:shadow-blue-500/40' },
    { Icon: Instagram, color: 'hover:bg-pink-600 hover:shadow-pink-500/40' },
    { Icon: Twitter, color: 'hover:bg-cyan-500 hover:shadow-cyan-400/40' }
  ];

  return (
    <footer className="bg-[#020617] pt-32 pb-12 border-t border-white/5 relative overflow-hidden">
      
      {/* Background Neon Decor */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-32">
        
        {/* Brand Section */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-500/20">
              <Zap size={24} fill="currentColor" />
            </div>
            <span className="text-2xl font-black uppercase tracking-tighter text-white">
              Cigaro<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Electrico</span>
            </span>
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed font-light max-w-xs">
            Elevating the vaping experience through curated luxury and authentic technological excellence. 
            Designed in Sri Lanka for the modern enthusiast.
          </p>
          <div className="flex gap-4">
            {socialIcons.map(({ Icon, color }, i) => (
              <a 
                key={i} 
                href="#" 
                className={`w-11 h-11 rounded-2xl border border-white/10 flex items-center justify-center text-zinc-400 bg-white/5 backdrop-blur-md transition-all duration-500 hover:text-white hover:border-transparent hover:-translate-y-2 hover:shadow-2xl ${color}`}
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>

        {/* Collections Links */}
        <div>
          <h4 className="font-black uppercase tracking-[0.4em] text-[10px] mb-10 text-indigo-400">
            Collections
          </h4>
          <ul className="space-y-5 text-zinc-400 text-xs font-bold uppercase tracking-widest">
            {collections.map((link) => (
              <li key={link}>
                <a href="#" className="hover:text-white transition-all flex items-center group">
                  <span className="w-0 group-hover:w-4 h-[1px] bg-indigo-400 mr-0 group-hover:mr-3 transition-all duration-300 opacity-0 group-hover:opacity-100" />
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Concierge Links */}
        <div>
          <h4 className="font-black uppercase tracking-[0.4em] text-[10px] mb-10 text-indigo-400">
            Concierge
          </h4>
          <ul className="space-y-5 text-zinc-400 text-xs font-bold uppercase tracking-widest">
            {concierge.map((link) => (
              <li key={link}>
                <a href="#" className="hover:text-white transition-all flex items-center group">
                  <span className="w-0 group-hover:w-4 h-[1px] bg-purple-400 mr-0 group-hover:mr-3 transition-all duration-300 opacity-0 group-hover:opacity-100" />
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-8">
          <h4 className="font-black uppercase tracking-[0.4em] text-[10px] mb-10 text-indigo-400">
            Terminal
          </h4>
          <div className="flex items-start gap-5 text-sm text-zinc-400">
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
              <MapPin className="text-indigo-400 h-4 w-4" />
            </div>
            <span className="font-light leading-relaxed">
              101 Luxury Way, Capital City Plaza<br/>Floor 4, Colombo 03
            </span>
          </div>
          <div className="flex items-center gap-5 text-sm text-zinc-400">
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
              <Mail className="text-purple-400 h-4 w-4" />
            </div>
            <span className="font-light">concierge@cigaroelectrico.com</span>
          </div>
          <div className="flex items-center gap-5 text-sm text-zinc-400">
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
              <Phone className="text-cyan-400 h-4 w-4" />
            </div>
            <span className="font-bold tracking-[0.15em] text-white">+1 800-NEON-VAPE</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
        <p className="text-[9px] text-zinc-600 uppercase tracking-[0.4em] font-black">
          © {new Date().getFullYear()} CigaroElectrico Premium Group. <span className="text-indigo-400">Beyond the Horizon.</span>
        </p>
        
        <div className="flex gap-8 opacity-40 hover:opacity-100 transition-all duration-700 grayscale hover:grayscale-0">
          <img src="https://img.icons8.com/color/48/000000/visa.png" className="h-4" alt="Visa" />
          <img src="https://img.icons8.com/color/48/000000/mastercard.png" className="h-4" alt="Mastercard" />
          <img src="https://img.icons8.com/color/48/000000/paypal.png" className="h-4" alt="Paypal" />
          <img src="https://img.icons8.com/color/48/000000/amex.png" className="h-4" alt="Amex" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;