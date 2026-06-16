"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import { Mail, Phone, CheckCircle2, Sparkles } from "lucide-react";
import { staticAssets } from "@/app/lib/assets";
import { siteConfig } from "@/app/lib/site";
import Navbar from "../components/navbar";

const CONTACT_EMAIL = siteConfig.contactEmail;
const CONTACT_PHONE = siteConfig.contactPhone;

const ContactContent = () => {
  const fadeUp: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [inquiry, setInquiry] = useState("Hardware Support");
  const [message, setMessage] = useState("");

  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form data is captured — extend here to POST to your backend or email API
    setSent(true);
    setName("");
    setEmail("");
    setInquiry("Hardware Support");
    setMessage("");
  };

  return (
    <>
      <Navbar />
      <div className='bg-[#030303] min-h-screen pt-32 pb-20 px-6 lg:px-10 overflow-hidden relative selection:bg-[#D4AF37]/30'>
        {/* --- CINEMATIC BACKGROUND LAYER --- */}
        <div className='fixed inset-0 z-0 pointer-events-none'>
          {/* Subtle Radial Gradient */}
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,_#1a1a1a_0%,_#030303_100%)] ' />

          {/* Static Background Image (Replaced Video) */}
          <img
            src={staticAssets.backgroundPattern}
            alt='Background Pattern'
            className='w-full h-full object-cover opacity-99'
            crossOrigin="anonymous"
          />

          {/* Branded Overlay */}
          <div className='absolute inset-0 bg-gradient-to-b from-[#030303] via-transparent to-[#030303]' />
        </div>

        <div className='max-w-7xl mx-auto relative z-10 font-sans'>
          {/* Header Section */}
          <motion.div
            initial='initial'
            animate='animate'
            variants={fadeUp}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className='mb-20'
          >
            <div className='flex items-center gap-3 mb-6'>
              <Sparkles className='text-[#D4AF37] w-3 h-3' />
              <span className='text-[#D4AF37] font-bold text-[8px] uppercase tracking-[0.6em]'>
                Terminal 04 • Concierge
              </span>
            </div>
            <h1 className='text-5xl md:text-8xl font-serif text-white tracking-[0.15em] leading-[0.9] uppercase'>
              REACH THE <br />
              <span className='text-[#D4AF37]'>SUMMIT</span>
            </h1>
          </motion.div>

          <div className='grid lg:grid-cols-2 gap-16 lg:gap-32 items-start'>
            {/* --- LEFT: CONTACT INFO --- */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className='space-y-16'
            >
              <p className='text-[10px] sm:text-xs text-zinc-500 font-light tracking-[0.2em] leading-loose max-w-sm uppercase border-l border-[#D4AF37]/30 pl-8'>
                Whether seeking precision hardware support or artisanal blend
                consultation, our specialists await your transmission.
              </p>

              <div className='space-y-12'>
                <ContactMethod
                  icon={<Mail size={20} className='text-[#D4AF37]' />}
                  title='DIRECT TERMINAL'
                  detail={CONTACT_EMAIL}
                />
                <ContactMethod
                  icon={<Phone size={20} className='text-[#D4AF37]' />}
                  title='VOICE LINE'
                  detail={CONTACT_PHONE}
                />
              </div>

              {/* Status Badge */}
              <div className='px-8 py-5 rounded-full bg-white/[0.02] border border-white/5 inline-block shadow-2xl'>
                <div className='flex items-center gap-4'>
                  <div className='w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-pulse shadow-[0_0_10px_#D4AF37]' />
                  <span className='font-bold text-zinc-400 uppercase tracking-[0.3em] text-[7px]'>
                    OPERATIONAL: 9AM - 9PM (IST)
                  </span>
                </div>
              </div>
            </motion.div>

            {/* --- RIGHT: THE FORM --- */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className='bg-white/[0.01] border border-white/5 p-8 md:p-14 rounded-[3rem] shadow-2xl relative overflow-hidden'
            >
              {/* Form Glass Decoration */}
              <div className='absolute -top-20 -right-20 w-40 h-40 bg-[#D4AF37]/5 blur-[80px] rounded-full' />

              <form
                className='space-y-12 relative z-10'
                onSubmit={handleSubmit}
              >
                <div className='grid md:grid-cols-2 gap-10'>
                  <InputField
                    label='IDENTITY'
                    placeholder='ENTER NAME'
                    value={name}
                    onChange={(v) => setName(v)}
                    required
                  />
                  <InputField
                    label='TERMINAL EMAIL'
                    placeholder='USER@DOMAIN.COM'
                    type='email'
                    value={email}
                    onChange={(v) => setEmail(v)}
                    required
                  />
                </div>

                <div className='space-y-3'>
                  <label className='text-[7px] font-bold uppercase tracking-[0.4em] text-zinc-600 ml-4'>
                    INQUIRY VECTOR
                  </label>
                  <div className='relative'>
                    <select
                      value={inquiry}
                      onChange={(e) => setInquiry(e.target.value)}
                      className='w-full bg-white/[0.03] border border-white/5 rounded-xl px-6 py-4 text-[10px] text-white font-bold tracking-[0.2em] focus:border-[#D4AF37]/40 transition-all outline-none appearance-none cursor-pointer uppercase'
                    >
                      <option className='bg-[#030303]'>Hardware Support</option>
                      <option className='bg-[#030303]'>Order Logistics</option>
                      <option className='bg-[#030303]'>
                        Artisanal Curation
                      </option>
                      <option className='bg-[#030303]'>
                        Partnership Terminal
                      </option>
                    </select>
                    <div className='absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 text-[#D4AF37] text-[8px]'>
                      ▼
                    </div>
                  </div>
                </div>

                <div className='space-y-3'>
                  <label className='text-[7px] font-bold uppercase tracking-[0.4em] text-zinc-600 ml-4'>
                    ENCRYPTED MESSAGE
                  </label>
                  <textarea
                    rows={4}
                    placeholder='INITIALIZE INPUT...'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className='w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-5 text-[10px] text-white font-medium tracking-[0.1em] placeholder:text-zinc-800 focus:border-[#D4AF37]/40 transition-all outline-none resize-none uppercase'
                  />
                </div>

                {sent ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='flex flex-col items-center gap-4 py-8'
                  >
                    <CheckCircle2 size={36} className='text-[#D4AF37]' />
                    <p className='text-[#D4AF37] font-black text-[11px] uppercase tracking-widest'>Message Received</p>
                    <p className='text-zinc-500 text-[9px] tracking-wide text-center'>
                      We&apos;ll get back to you as soon as possible.
                    </p>
                    <button
                      onClick={() => setSent(false)}
                      className='mt-2 text-[8px] uppercase tracking-widest text-zinc-600 hover:text-[#D4AF37] transition-colors'
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.button
                    type='submit'
                    whileHover={{ backgroundColor: "#D4AF37", color: "#000" }}
                    whileTap={{ scale: 0.98 }}
                    className='w-full border border-[#D4AF37]/40 text-[#D4AF37] py-6 rounded-xl font-bold uppercase tracking-[0.6em] text-[9px] flex items-center justify-center gap-4 transition-all duration-500'
                  >
                    SEND MESSAGE <Sparkles size={14} />
                  </motion.button>
                )}
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
  link,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  isExternal?: boolean;
  link?: string;
}) => {
  const Wrapper = link ? "a" : "div";

  return (
    <motion.div whileHover={{ x: 8 }} className='w-full group'>
      <Wrapper
        href={link}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className='flex items-center gap-10 cursor-pointer no-underline'
      >
        <div className='w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center group-hover:border-[#D4AF37]/30 transition-all duration-500'>
          {icon}
        </div>
        <div>
          <h4 className='text-[7px] font-bold uppercase tracking-[0.5em] text-zinc-600 mb-2'>
            {title}
          </h4>
          <p className='text-white font-serif text-lg tracking-widest group-hover:text-[#D4AF37] transition-colors'>
            {detail}
          </p>
        </div>
      </Wrapper>
    </motion.div>
  );
};

const InputField = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) => (
  <div className='space-y-3 w-full'>
    <label className='text-[7px] font-bold uppercase tracking-[0.4em] text-zinc-600 ml-4'>
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className='w-full bg-white/[0.03] border border-white/5 rounded-xl px-6 py-4 text-[10px] text-white font-bold tracking-[0.2em] placeholder:text-zinc-800 focus:border-[#D4AF37]/40 transition-all outline-none uppercase'
    />
  </div>
);

export default ContactContent;
