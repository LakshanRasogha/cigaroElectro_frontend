"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Mail, Phone, Send, MessageCircle } from 'lucide-react';
import Navbar from '../componenets/navbar';

const ContactPage = () => {
  // Fixed: Explicitly typed the variants to prevent the 'string' ease error
  const fadeUp: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <>
      <Navbar />
      <div className="bg-white min-h-screen pt-32 pb-20 px-6 lg:px-10 overflow-hidden relative">
      
        {/* Background Ambient Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-100/40 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-100/30 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/3" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial="initial"
            animate="animate"
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-16"
          >
            <span className="text-purple-600 font-mono text-xs font-bold tracking-[0.3em] uppercase">Concierge Support</span>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter mt-4">
              Get in <span className="italic text-slate-300">Touch.</span>
            </h1>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            {/* --- LEFT: CONTACT INFO --- */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="space-y-12"
            >
              <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-md">
                Whether you're seeking technical hardware support or artisanal blend recommendations, our specialists are ready to assist.
              </p>

              <div className="space-y-8">
                {/* WhatsApp Option */}
                <ContactMethod 
                  icon={<MessageCircle size={24} className="text-[#25D366]" />} 
                  title="WhatsApp Business" 
                  detail="+94 77 123 4567"
                  isExternal
                  link="https://wa.me/94771234567" 
                />
                <ContactMethod 
                  icon={<Mail size={24} className="text-purple-600" />} 
                  title="Email Us" 
                  detail="concierge@figaroelectrico.com" 
                />
                <ContactMethod 
                  icon={<Phone size={24} className="text-cyan-600" />} 
                  title="Direct Line" 
                  detail="+94 11 234 5678" 
                />
              </div>

              {/* Support Badge */}
              <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 inline-block">
                  <div className="flex items-center gap-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      <span className="font-bold text-slate-900 uppercase tracking-widest text-[10px]">Active Support Hours: 9AM - 9PM (IST)</span>
                  </div>
              </div>
            </motion.div>

            {/* --- RIGHT: THE FORM --- */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-white p-8 md:p-12 rounded-[3rem] shadow-[0_20px_80px_rgba(0,0,0,0.05)] border border-slate-100 relative"
            >
              <form className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <InputField label="Your Name" placeholder="John Doe" />
                  <InputField label="Email Address" placeholder="john@example.com" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Subject</label>
                  <div className="relative">
                    <select className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-900 font-bold focus:ring-2 focus:ring-purple-500/20 transition-all outline-none appearance-none cursor-pointer">
                        <option>Hardware Inquiry</option>
                        <option>Order Status</option>
                        <option>Artisanal Blends</option>
                        <option>Wholesale</option>
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-30 text-slate-900 text-xs">▼</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Message</label>
                  <textarea 
                    rows={4}
                    placeholder="How can we help you today?"
                    className="w-full bg-slate-50 border-none rounded-[2rem] px-6 py-4 text-slate-900 font-medium focus:ring-2 focus:ring-purple-500/20 transition-all outline-none resize-none"
                  />
                </div>

                <motion.button 
                  whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(147, 51, 234, 0.2)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-purple-600 transition-all duration-300"
                >
                  Send Message <Send size={18} />
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
  // If no link is provided, it's a div. If link is provided, it's an anchor.
  const Wrapper = link ? 'a' : 'div';
  
  return (
    <motion.div whileHover={{ x: 10 }} className="w-full">
      <Wrapper 
        href={link} 
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="flex items-center gap-6 group cursor-pointer no-underline"
      >
        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 border border-transparent group-hover:border-slate-100">
          {icon}
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{title}</h4>
          <p className="text-slate-900 font-bold text-lg">{detail}</p>
        </div>
      </Wrapper>
    </motion.div>
  );
};

const InputField = ({ label, placeholder }: { label: string, placeholder: string }) => (
  <div className="space-y-2 w-full">
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">{label}</label>
    <input 
      type="text" 
      placeholder={placeholder}
      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-900 font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none"
    />
  </div>
);

export default ContactPage;