'use client';

import React from 'react';
import { Facebook, Instagram, Twitter, MapPin, Mail, Phone } from 'lucide-react';

const Footer = () => {
  const collections = ['Golden Series', 'Elite Pods', 'Artisanal Liquids', 'Limited Editions'];
  const concierge = ['Shipping Policy', 'Terms of Service', 'Privacy Policy', 'Wholesale'];
  const socialIcons = [Facebook, Instagram, Twitter];

  return (
    <footer className="bg-black pt-32 pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-32">
        
        {/* Brand Section */}
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center text-black font-bold text-lg">
              CE
            </div>
            <span className="text-xl font-bold font-serif uppercase tracking-tighter text-white">
              Cigaro<span className="text-[#D4AF37]">Electrico</span>
            </span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed font-light">
            Elevating the vaping experience through curated luxury and authentic technological excellence. 
            Designed for those who demand the finest.
          </p>
          <div className="flex gap-4">
            {socialIcons.map((Icon, i) => (
              <a 
                key={i} 
                href="#" 
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-all"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Collections Links */}
        <div>
          <h4 className="font-black uppercase tracking-[0.3em] text-[11px] mb-10 text-[#D4AF37]">
            Collections
          </h4>
          <ul className="space-y-5 text-gray-500 text-sm font-medium">
            {collections.map((link) => (
              <li key={link}>
                <a href="#" className="hover:text-[#D4AF37] transition-colors">{link}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Concierge Links */}
        <div>
          <h4 className="font-black uppercase tracking-[0.3em] text-[11px] mb-10 text-[#D4AF37]">
            Concierge
          </h4>
          <ul className="space-y-5 text-gray-500 text-sm font-medium">
            {concierge.map((link) => (
              <li key={link}>
                <a href="#" className="hover:text-[#D4AF37] transition-colors">{link}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-8">
          <h4 className="font-black uppercase tracking-[0.3em] text-[11px] mb-10 text-[#D4AF37]">
            Contact
          </h4>
          <div className="flex items-start gap-4 text-sm text-gray-400">
            <MapPin className="text-[#D4AF37] h-5 w-5 mt-1 flex-shrink-0" />
            <span className="font-light leading-relaxed">
              101 Luxury Way, Capital City Plaza, Floor 4
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <Mail className="text-[#D4AF37] h-5 w-5 flex-shrink-0" />
            <span className="font-light">concierge@cigaroelectrico.com</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <Phone className="text-[#D4AF37] h-5 w-5 flex-shrink-0" />
            <span className="font-bold tracking-widest">+1 800-GOLD-VAPE</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 border-t border-white/5 pt-12 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-8">
        <p className="text-[10px] text-gray-600 uppercase tracking-[0.3em] font-black">
          © {new Date().getFullYear()} CigaroElectrico Premium Group. Crafted for Excellence.
        </p>
        <div className="flex gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
          <img src="https://img.icons8.com/color/48/000000/visa.png" className="h-5" alt="Visa" />
          <img src="https://img.icons8.com/color/48/000000/mastercard.png" className="h-5" alt="Mastercard" />
          <img src="https://img.icons8.com/color/48/000000/paypal.png" className="h-5" alt="Paypal" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;