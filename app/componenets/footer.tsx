'use client';

import React from 'react';
import { Facebook, Instagram, Twitter, MapPin, Mail, Phone, Zap } from 'lucide-react';

const Footer = () => {
  const collections = ['Golden Series', 'Elite Pods', 'Artisanal Liquids', 'Limited Editions'];
  const concierge = ['Shipping Policy', 'Terms of Service', 'Privacy Policy', 'Wholesale'];
  const socialIcons = [
    { Icon: Facebook, color: 'hover:bg-blue-500' },
    { Icon: Instagram, color: 'hover:bg-pink-500' },
    { Icon: Twitter, color: 'hover:bg-cyan-400' }
  ];

  return (
    // Background changed to off-white, border changed to light slate
    <footer className="bg-[#f8fafc] pt-32 pb-12 border-t border-slate-200 relative overflow-hidden">
      
      {/* Subtle background glow to maintain the neon theme */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-purple-100/50 blur-[100px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-100/50 blur-[100px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-32">
        
        {/* Brand Section */}
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            {/* Logo changed to Neon Gradient */}
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Zap size={20} fill="currentColor" />
            </div>
            <span className="text-xl font-bold font-serif uppercase tracking-tighter text-slate-900">
              Cigaro<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Electrico</span>
            </span>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed font-medium">
            Elevating the vaping experience through curated luxury and authentic technological excellence. 
            Designed for those who demand the finest.
          </p>
          <div className="flex gap-4">
            {socialIcons.map(({ Icon, color }, i) => (
              <a 
                key={i} 
                href="#" 
                className={`w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 bg-white shadow-sm transition-all duration-300 hover:text-white hover:border-transparent hover:-translate-y-1 hover:shadow-lg ${color}`}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Collections Links */}
        <div>
          <h4 className="font-black uppercase tracking-[0.3em] text-[11px] mb-10 text-indigo-600">
            Collections
          </h4>
          <ul className="space-y-5 text-slate-600 text-sm font-semibold">
            {collections.map((link) => (
              <li key={link}>
                <a href="#" className="hover:text-purple-600 transition-colors flex items-center group">
                  <span className="w-0 group-hover:w-2 h-[2px] bg-purple-600 mr-0 group-hover:mr-2 transition-all opacity-0 group-hover:opacity-100" />
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Concierge Links */}
        <div>
          <h4 className="font-black uppercase tracking-[0.3em] text-[11px] mb-10 text-indigo-600">
            Concierge
          </h4>
          <ul className="space-y-5 text-slate-600 text-sm font-semibold">
            {concierge.map((link) => (
              <li key={link}>
                <a href="#" className="hover:text-purple-600 transition-colors flex items-center group">
                  <span className="w-0 group-hover:w-2 h-[2px] bg-purple-600 mr-0 group-hover:mr-2 transition-all opacity-0 group-hover:opacity-100" />
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-8">
          <h4 className="font-black uppercase tracking-[0.3em] text-[11px] mb-10 text-indigo-600">
            Contact
          </h4>
          <div className="flex items-start gap-4 text-sm text-slate-600">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <MapPin className="text-indigo-600 h-4 w-4 flex-shrink-0" />
            </div>
            <span className="font-medium leading-relaxed">
              101 Luxury Way, Capital City Plaza, Floor 4
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Mail className="text-purple-600 h-4 w-4 flex-shrink-0" />
            </div>
            <span className="font-medium">concierge@cigaroelectrico.com</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <div className="p-2 bg-cyan-50 rounded-lg">
              <Phone className="text-cyan-600 h-4 w-4 flex-shrink-0" />
            </div>
            <span className="font-bold tracking-widest text-slate-900">+1 800-NEON-VAPE</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 border-t border-slate-200 pt-12 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-8">
        <p className="text-[10px] text-slate-400 uppercase tracking-[0.3em] font-black">
          © {new Date().getFullYear()} CigaroElectrico Premium Group. <span className="text-indigo-500">Living in Color.</span>
        </p>
        <div className="flex gap-8 opacity-60 hover:opacity-100 transition-opacity duration-500 grayscale hover:grayscale-0">
          <img src="https://img.icons8.com/color/48/000000/visa.png" className="h-5" alt="Visa" />
          <img src="https://img.icons8.com/color/48/000000/mastercard.png" className="h-5" alt="Mastercard" />
          <img src="https://img.icons8.com/color/48/000000/paypal.png" className="h-5" alt="Paypal" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;