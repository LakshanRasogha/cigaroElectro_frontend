"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Github, Chrome, Zap, Loader2 } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:3001/api/users/login', {
        email,
        password
      });
      console.log('Login response:', response.data);
      const userData = response.data.user;

      localStorage.setItem('currentUser', JSON.stringify(userData));
      router.push('/profile'); 
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 lg:p-10 relative overflow-hidden">
      
      {/* Background Neon Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-100/50 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-100/40 blur-[120px] rounded-full" />

      <div className="max-w-6xl w-full grid lg:grid-cols-2 bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden relative z-10">
        
        {/* --- LEFT SIDE: BRAND IMMERSION --- */}
        <div className="hidden lg:flex flex-col justify-between p-16 bg-slate-900 relative overflow-hidden">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-purple-600/20 to-transparent pointer-events-none"
          />

          <div className="relative z-10">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-900 shadow-xl group-hover:rotate-[180deg] transition-transform duration-500">
                <Zap size={24} fill="currentColor" />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase text-white">
                Figaro<span className="text-purple-400 italic">Electrico</span>
              </span>
            </Link>
          </div>

          <div className="relative z-10">
            <h2 className="text-5xl font-black text-white tracking-tighter leading-tight mb-6">
              Welcome to the <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-300 italic">Inner Circle.</span>
            </h2>
            <p className="text-slate-400 font-medium text-lg max-w-sm">
              Access your personalized collections, hardware specs, and artisanal blend history.
            </p>
          </div>

          <div className="relative z-10 flex gap-6 text-slate-500 font-mono text-[10px] uppercase tracking-[0.2em]">
            <span>Est. 2012</span>
            <span>Premium Hardware</span>
          </div>
        </div>

        {/* --- RIGHT SIDE: LOGIN FORM --- */}
        <div className="p-8 md:p-16 lg:p-20 flex flex-col justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Sign In</h3>
            <p className="text-slate-500 font-medium">
              New to the studio? <Link href="/auth/Signin" className="text-purple-600 font-bold hover:underline">Create an account</Link>
            </p>
          </motion.div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold uppercase tracking-widest border border-red-100"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-purple-600 transition-colors" size={20} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-slate-50 border-none rounded-2xl pl-16 pr-6 py-5 text-slate-900 font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Password</label>
                <Link href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-600">Forgot?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-purple-600 transition-colors" size={20} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border-none rounded-2xl pl-16 pr-6 py-5 text-slate-900 font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none"
                />
              </div>
            </div>

            <motion.button 
              type="submit"
              disabled={loading}
              whileHover={!loading ? { y: -4, boxShadow: "0 20px 40px rgba(147, 51, 234, 0.2)" } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-purple-600 transition-all duration-500 mt-4 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Enter Studio"} 
              {!loading && <ArrowRight size={18} />}
            </motion.button>

            <div className="relative py-4 flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-slate-100" />
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Or Continue With</span>
              <div className="h-[1px] flex-1 bg-slate-100" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <SocialButton icon={<Chrome size={20} />} label="Google" />
              <SocialButton icon={<Github size={20} />} label="Github" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const SocialButton = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <button type="button" className="flex items-center justify-center gap-3 py-4 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 transition-all duration-300 text-slate-600 font-bold text-sm">
    {icon}
    <span>{label}</span>
  </button>
);

export default LoginPage;