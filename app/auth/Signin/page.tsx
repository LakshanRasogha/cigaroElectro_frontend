'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Phone, MapPin, Zap, ArrowRight, Loader2, Globe } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();
  
  // Background configuration
  const backdropUrl = "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop";

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    streetAddress: '', 
    city: '',          
    postalCode: ''     
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      address: {
        address: formData.streetAddress,
        city: formData.city,
        postalCode: formData.postalCode
      }
    };

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API}/api/users/`, payload);
      
      if (res.status === 201 || res.status === 200) {
        setMessage({ type: 'success', text: 'Identity created! Redirecting to login...' });
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Registration failed.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-950">
      
      {/* --- BACKGROUND IMAGE BACKDROP --- */}
      <div className="absolute inset-0 z-0">
        <img 
          src={backdropUrl} 
          alt="Backdrop" 
          className="w-full h-full object-cover opacity-40 scale-105"
        />
        {/* Cinematic Vignette & Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/80 to-indigo-950/50" />
      </div>

      {/* Ambient Glows for Depth */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-purple-600/20 blur-[150px] rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2" />

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-2xl w-full bg-white/95 backdrop-blur-2xl rounded-[3.5rem] shadow-2xl border border-white/20 overflow-hidden relative z-10 p-8 md:p-12"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <Link href="/" className="flex items-center gap-3 group">
            {/* Logo Container */}
            <div className="w-12 h-12 relative overflow-hidden rounded-full border-2 border-amber-500/50 shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform duration-500">
              <img 
                src="/logo.png" 
                alt="CigarroElectrico Logo" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Typography - Using a Signature/Script Style */}
            <span className="text-2xl font-normal tracking-tight text-white flex flex-col md:flex-row md:gap-1 leading-none" 
                  style={{ fontFamily: "'Dancing Script', cursive" }}>
              <span className="text-amber-400">Cigarro</span>
              <span className="text-amber-200">Electrico</span>
            </span>
          </Link>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
            Join the <span className="italic text-slate-400">Circle.</span>
          </h2>
          <p className="text-slate-500 font-bold mt-2 text-[10px] uppercase tracking-[0.3em]">Identity Registration</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          
          {/* Identity Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField 
              icon={<User size={16} />} 
              label="First Name" 
              name="firstName" 
              type="text" 
              value={formData.firstName}
              onChange={handleChange} 
            />
            <InputField 
              icon={<User size={16} />} 
              label="Last Name" 
              name="lastName" 
              type="text" 
              value={formData.lastName}
              onChange={handleChange} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField 
              icon={<Mail size={16} />} 
              label="Email" 
              name="email" 
              type="email" 
              value={formData.email}
              onChange={handleChange} 
            />
            <InputField 
              icon={<Phone size={16} />} 
              label="Phone" 
              name="phone" 
              type="text" 
              value={formData.phone}
              onChange={handleChange} 
            />
          </div>

          <InputField 
            icon={<Lock size={16} />} 
            label="Security Password" 
            name="password" 
            type="password" 
            value={formData.password}
            onChange={handleChange} 
          />

          {/* Location Section */}
          <div className="pt-6 border-t border-slate-100">
            <div className="mb-5">
               <InputField 
                icon={<MapPin size={16} />} 
                label="Primary Address" 
                name="streetAddress" 
                type="text" 
                value={formData.streetAddress}
                onChange={handleChange} 
              />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <InputField 
                icon={<Globe size={16} />} 
                label="City" 
                name="city" 
                type="text" 
                value={formData.city}
                onChange={handleChange} 
              />
              <InputField 
                icon={<MapPin size={16} />} 
                label="Postal" 
                name="postalCode" 
                type="text" 
                value={formData.postalCode}
                onChange={handleChange} 
              />
            </div>
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {message && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border ${
                  message.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                    : 'bg-rose-50 text-rose-600 border-rose-100'
                }`}
              >
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.4em] text-[11px] flex items-center justify-center gap-4 hover:bg-indigo-600 disabled:bg-slate-200 transition-all duration-500 shadow-2xl"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : (
              <>Deploy Identity <ArrowRight size={16} /></>
            )}
          </motion.button>

          <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-8">
            Established member? <Link href="/auth/login" className="text-indigo-600 hover:underline">Access Terminal</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}

const InputField = ({ icon, label, name, type, value, onChange }: any) => (
  <div className="space-y-2 w-full">
    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 flex items-center gap-2">
      {icon} {label}
    </label>
    <input 
      name={name}
      type={type}
      required
      value={value}
      onChange={onChange}
      placeholder={`Required`}
      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold placeholder:text-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all outline-none text-sm"
    />
  </div>
);