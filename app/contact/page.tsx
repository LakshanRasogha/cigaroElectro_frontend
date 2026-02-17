"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Mail, Phone, Send, MessageCircle, Sparkles } from 'lucide-react';
import Navbar from '../componenets/navbar';

const ContactPage = () => {
  const fadeUp: Variants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <>
      <Navbar />
      <div className="bg-[#020617] min-h-screen pt-32 pb-20 px-6 lg:px-10 overflow-hidden relative selection:bg-indigo-500/30">
        
        {/* --- VIDEO BACKGROUND LAYER --- */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/vape2.mp4" type="video/mp4" />
          </video>
          {/* Dark Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-transparent to-[#020617]" />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header Section */}
          <motion.div 
            initial="initial"
            animate="animate"
            variants={fadeUp}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="text-indigo-400 w-4 h-4" />
              <span className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.5em]">
                Terminal 04 • Concierge
              </span>
            </div>
            <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-[0.85]">
              Get in <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 italic">Touch.</span>
            </h1>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-20 items-start">
            
            {/* --- LEFT: CONTACT INFO --- */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="space-y-16"
            >
              <p className="text-xl text-zinc-400 font-light leading-relaxed max-w-md border-l-2 border-white/10 pl-8">
                Whether you're seeking technical hardware support or artisanal blend recommendations, our specialists are ready to initialize communication.
              </p>

              <div className="space-y-10">
                <ContactMethod 
                  icon={<MessageCircle size={26} className="text-[#25D366]" />} 
                  title="WhatsApp Secure" 
                  detail="+94 77 123 4567"
                  isExternal
                  link="https://wa.me/94771234567" 
                />
                <ContactMethod 
                  icon={<Mail size={26} className="text-indigo-400" />} 
                  title="Direct Terminal" 
                  detail="concierge@figaroelectrico.com" 
                />
                <ContactMethod 
                  icon={<Phone size={26} className="text-cyan-400" />} 
                  title="Voice Line" 
                  detail="+94 11 234 5678" 
                />
              </div>

              {/* Status Badge */}
              <div className="p-8 rounded-[2.5rem] bg-white/[0.03] backdrop-blur-xl border border-white/10 inline-block shadow-2xl">
                  <div className="flex items-center gap-4">
                      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                      <span className="font-bold text-white uppercase tracking-[0.2em] text-[10px]">Active Session: 9AM - 9PM (IST)</span>
                  </div>
              </div>
            </motion.div>

            {/* --- RIGHT: THE FORM --- */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="bg-white/[0.02] backdrop-blur-3xl p-8 md:p-14 rounded-[3.5rem] shadow-2xl border border-white/10 relative"
            >
              <form className="space-y-10">
                <div className="grid md:grid-cols-2 gap-10">
                  <InputField label="Identity" placeholder="John Doe" />
                  <InputField label="Terminal Email" placeholder="john@example.com" />
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-6">Inquiry Vector</label>
                  <div className="relative">
                    <select className="w-full bg-white/5 border border-white/5 rounded-2xl px-8 py-5 text-white font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none appearance-none cursor-pointer">
                        <option className="bg-[#020617]">Hardware Inquiry</option>
                        <option className="bg-[#020617]">Order Status</option>
                        <option className="bg-[#020617]">Artisanal Blends</option>
                        <option className="bg-[#020617]">Wholesale Terminal</option>
                    </select>
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 text-white text-xs">▼</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-6">Data Transmission</label>
                  <textarea 
                    rows={4}
                    placeholder="Input your requirements..."
                    className="w-full bg-white/5 border border-white/5 rounded-[2.5rem] px-8 py-6 text-white font-medium placeholder:text-zinc-700 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none resize-none"
                  />
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02, backgroundColor: "#6366f1" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-white text-black py-7 rounded-2xl font-black uppercase tracking-[0.4em] text-xs flex items-center justify-center gap-4 transition-all duration-500 shadow-xl shadow-white/5"
                >
                  Broadcast Message <Send size={18} />
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

/* --- UI COMPONENTS --- */

const ContactMethod = ({ 
  icon, 
  title, 
  detail, 
  isExternal, 
  link 
}: { 
  icon: React.ReactNode, 
  title: string, 
  detail: string, 
  isExternal?: boolean, 
  link?: string 
}) => {
  const Wrapper = link ? 'a' : 'div';
  
  return (
    <motion.div whileHover={{ x: 12 }} className="w-full">
      <Wrapper 
        href={link} 
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="flex items-center gap-8 group cursor-pointer no-underline"
      >
        <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-500">
          {icon}
        </div>
        <div>
          <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-1">{title}</h4>
          <p className="text-white font-bold text-xl tracking-tight group-hover:text-indigo-400 transition-colors">{detail}</p>
        </div>
      </Wrapper>
    </motion.div>
  );
};

const InputField = ({ label, placeholder }: { label: string, placeholder: string }) => (
  <div className="space-y-3 w-full">
    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-6">{label}</label>
    <input 
      type="text" 
      placeholder={placeholder}
      className="w-full bg-white/5 border border-white/5 rounded-2xl px-8 py-5 text-white font-bold placeholder:text-zinc-800 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
    />
  </div>
);

export default ContactPage;