'use client';

import React from 'react';
import { Facebook, Instagram, Twitter, MapPin, Mail, Phone, Zap } from 'lucide-react';

const Footer = () => {
  const socialIcons = [
    { Icon: Facebook, url: '#' },
    { Icon: Instagram, url: '#' },
    { Icon: Twitter, url: '#' }
  ];

  return (
    <footer className="bg-[#050505] pt-32 pb-12 border-t border-white/5 relative overflow-hidden">
      
      {/* Background Ambient Glows - Synced with The Vault's aesthetic */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/5 blur-[150px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#AA771C]/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 mb-32">
        
        {/* Brand Section */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#D4AF37] rounded-2xl flex items-center justify-center text-black shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-transform hover:scale-110 duration-500">
              <Zap size={24} fill="currentColor" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">
              Cigarro<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F2D37D] to-[#AA771C] italic" style={{ fontFamily: "'Dancing Script', cursive" }}>Eléctrico</span>
            </span>
          </div>
          <p className="text-zinc-500 text-sm leading-relaxed font-light max-w-md">
            Curating the finest hardware within <span className="text-white/80 italic">The Vault</span>. 
            The Gold Standard of vapor technology, engineered for excellence and designed in Sri Lanka.
          </p>
          <div className="flex gap-4">
            {socialIcons.map(({ Icon, url }, i) => (
              <a 
                key={i} 
                href={url} 
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-2xl border border-white/10 flex items-center justify-center text-zinc-400 bg-white/5 backdrop-blur-md transition-all duration-500 hover:text-black hover:bg-[#D4AF37] hover:border-transparent hover:-translate-y-2 hover:shadow-[0_10px_20px_rgba(212,175,55,0.2)]"
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>

        {/* Contact Info (Terminal) */}
        <div className="space-y-8 flex flex-col md:items-end">
          <div className="w-full md:max-w-xs space-y-8">
            <h4 className="font-black uppercase tracking-[0.4em] text-[10px] mb-10 text-[#D4AF37] md:text-right">
              Terminal
            </h4>
            <div className="flex items-start gap-5 text-sm text-zinc-500 group cursor-default">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5 group-hover:border-[#D4AF37]/30 transition-colors">
                <MapPin className="text-[#D4AF37] h-4 w-4" />
              </div>
              <span className="font-light leading-relaxed group-hover:text-zinc-300 transition-colors">
                101 Luxury Way, Capital City Plaza<br/>Floor 4, Colombo 03
              </span>
            </div>
            <div className="flex items-center gap-5 text-sm text-zinc-500 group cursor-default">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5 group-hover:border-[#D4AF37]/30 transition-colors">
                <Mail className="text-[#D4AF37] h-4 w-4" />
              </div>
              <a href="mailto:concierge@cigaroelectrico.com" className="font-light group-hover:text-zinc-300 transition-colors">
                concierge@cigaroelectrico.com
              </a>
            </div>
            <div className="flex items-center gap-5 text-sm text-zinc-500 group cursor-default">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5 group-hover:border-[#D4AF37]/30 transition-colors">
                <Phone className="text-[#D4AF37] h-4 w-4" />
              </div>
              <span className="font-bold tracking-[0.15em] text-white group-hover:text-[#D4AF37] transition-colors uppercase">
                +94 11-GOLD-VAPE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
        <p className="text-[9px] text-zinc-700 uppercase tracking-[0.4em] font-black">
          © {new Date().getFullYear()} CigaroElectrico Premium Group. <span className="text-[#D4AF37]">Established MMXXIV.</span>
        </p>
        
        {/* Payment Methods */}
        <div className="flex gap-8 opacity-20 hover:opacity-100 transition-all duration-1000 grayscale hover:grayscale-0">
          <img src="https://img.icons8.com/color/48/000000/visa.png" className="h-4" alt="Visa" />
          <img src="https://img.icons8.com/color/48/Mastercard-logo.png" className="h-4" alt="Mastercard" />
          <img src="https://img.icons8.com/color/48/000000/paypal.png" className="h-4" alt="Paypal" />
          <img src="https://img.icons8.com/color/48/000000/amex.png" className="h-4" alt="Amex" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;