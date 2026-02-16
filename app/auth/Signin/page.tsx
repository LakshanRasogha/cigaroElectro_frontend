'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Phone, MapPin, Zap, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    address: '',
    phone: ''
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

    try {
      const res = await axios.post('http://localhost:3001/api/users/', formData);
      
      if (res.status === 201 || res.status === 200) {
        setMessage({ type: 'success', text: 'Identity created! Redirecting to login...' });
        
        // Auto-redirect after 2 seconds
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      }
    } catch (err: any) {
      // Improved error message extraction
      const errorMsg = err.response?.data?.message || 'Something went wrong. Please try again.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-50/50 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-50/40 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-white rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden relative z-10 p-8 md:p-12"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-purple-200">
              <Zap size={24} fill="currentColor" />
            </div>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
            Join the <span className="italic text-slate-300">Circle.</span>
          </h2>
          <p className="text-slate-500 font-medium mt-2 text-sm uppercase tracking-widest">Start your premium hardware journey.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Names Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField 
              icon={<User size={18} />} 
              label="First Name" 
              name="firstName" 
              type="text" 
              value={formData.firstName}
              onChange={handleChange} 
            />
            <InputField 
              icon={<User size={18} />} 
              label="Last Name" 
              name="lastName" 
              type="text" 
              value={formData.lastName}
              onChange={handleChange} 
            />
          </div>

          <InputField 
            icon={<Mail size={18} />} 
            label="Email Address" 
            name="email" 
            type="email" 
            value={formData.email}
            onChange={handleChange} 
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField 
              icon={<Lock size={18} />} 
              label="Password" 
              name="password" 
              type="password" 
              value={formData.password}
              onChange={handleChange} 
            />
            <InputField 
              icon={<Phone size={18} />} 
              label="Phone" 
              name="phone" 
              type="text" 
              value={formData.phone}
              onChange={handleChange} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 flex items-center gap-2">
              <MapPin size={12} /> Delivery Address
            </label>
            <textarea 
              name="address" 
              rows={2} 
              required
              value={formData.address}
              onChange={handleChange}
              placeholder="Your flagship location..."
              className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-900 font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none resize-none"
            />
          </div>

          {/* Feedback Message */}
          <AnimatePresence>
            {message && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`p-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-center border ${
                  message.type === 'success' 
                    ? 'bg-green-50 text-green-600 border-green-100' 
                    : 'bg-red-50 text-red-600 border-red-100'
                }`}
              >
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={!loading ? { y: -4, boxShadow: "0 20px 40px rgba(147, 51, 234, 0.2)" } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-purple-600 disabled:bg-slate-300 transition-all duration-500"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>Register Account <ArrowRight size={18} /></>
            )}
          </motion.button>

          <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-6">
            Already have an account? <Link href="/auth/login" className="text-purple-600 hover:underline">Sign In</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}

/* Internal Component for Cleanliness */
const InputField = ({ icon, label, name, type, value, onChange }: any) => (
  <div className="space-y-2 w-full">
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 flex items-center gap-2">
      {icon} {label}
    </label>
    <input 
      name={name}
      type={type}
      required
      value={value}
      onChange={onChange}
      placeholder={`Enter ${label.toLowerCase()}`}
      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-900 font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none"
    />
  </div>
);