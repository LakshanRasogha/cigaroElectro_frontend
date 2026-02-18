"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Github, Chrome, Zap, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const backdropUrl = "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API}/api/users/login`, {
        email,
        password
      });

      const { user, token } = response.data;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      
      // Setup Secure Cookie for Middleware Proxy handling
      document.cookie = `session=${token}; path=/; Secure; SameSite=Strict`;

      window.dispatchEvent(new Event('storage'));

      if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
      
      router.refresh();
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Access Denied. Terminal could not verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 lg:p-10 relative overflow-hidden bg-[#020617] selection:bg-indigo-500/30">
      
      {/* --- CINEMATIC BACKDROP --- */}
      <div className="absolute inset-0 z-0">
        <img 
          src={backdropUrl} 
          alt="Backdrop" 
          className="w-full h-full object-cover opacity-20 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#020617] via-[#020617]/90 to-indigo-900/20" />
      </div>

      {/* Floating Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 blur-[150px] rounded-full" />

      <div className="max-w-6xl w-full grid lg:grid-cols-2 bg-white/[0.02] backdrop-blur-3xl rounded-[3.5rem] shadow-2xl border border-white/5 overflow-hidden relative z-10">
        
        {/* --- LEFT SIDE: BRAND IMMERSION --- */}
        <div className="hidden lg:flex flex-col justify-between p-20 bg-black/40 relative overflow-hidden border-r border-white/5">
          {/* Animated Tech Grid */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          
          <div className="relative z-10">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="w-14 h-14 relative overflow-hidden rounded-2xl border border-amber-500/30 shadow-lg shadow-amber-500/10 group-hover:scale-110 transition-transform duration-700">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-3xl font-normal tracking-tight text-white" style={{ fontFamily: "'Dancing Script', cursive" }}>
                <span className="text-amber-400">Cigarro</span>Electric
              </span>
            </Link>
          </div>

          <div className="relative z-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 text-indigo-400 mb-6"
            >
              <Zap size={14} className="fill-current" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">Command Center v2.6</span>
            </motion.div>
            <h2 className="text-6xl font-black text-white tracking-tighter leading-none mb-8">
              Initialize <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 italic">Discovery.</span>
            </h2>
            <p className="text-zinc-500 font-light text-lg max-w-sm leading-relaxed">
              Resume your journey into high-fidelity hardware. Securely manage your artisanal collections through the control terminal.
            </p>
          </div>

          <div className="relative z-10 flex flex-col gap-4">
             <div className="flex items-center gap-3 text-zinc-600">
                <ShieldCheck size={16} className="text-indigo-500" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em]">End-to-End Encryption Active</span>
             </div>
             <div className="h-[1px] w-12 bg-white/10" />
          </div>
        </div>

        {/* --- RIGHT SIDE: LOGIN FORM --- */}
        <div className="p-10 md:p-20 flex flex-col justify-center relative">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h3 className="text-4xl font-black text-white tracking-tighter mb-3 uppercase">Sign In</h3>
            <p className="text-zinc-500 font-medium text-sm">
              New User? <Link href="/auth/Signin" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">Establish Identity</Link>
            </p>
          </motion.div>

          <form onSubmit={handleLogin} className="space-y-8">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="bg-rose-500/10 text-rose-500 p-5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-rose-500/20 flex items-center gap-3"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                {error}
              </motion.div>
            )}

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 ml-6">Credential Link</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="terminal@identity.io"
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-16 pr-6 py-5 text-white font-bold placeholder:text-zinc-800 focus:bg-white/[0.05] focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center px-6">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Access Key</label>
                <Link href="#" className="text-[9px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-400">Recovery</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-16 pr-6 py-5 text-white font-bold placeholder:text-zinc-800 focus:bg-white/[0.05] focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none"
                />
              </div>
            </div>

            <motion.button 
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              className="w-full bg-white text-black py-6 rounded-2xl font-black uppercase tracking-[0.5em] text-xs flex items-center justify-center gap-4 hover:bg-indigo-500 hover:text-white transition-all duration-500 shadow-2xl disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Execute Login"} 
              {!loading && <ArrowRight size={18} />}
            </motion.button>

            <div className="relative py-6 flex items-center gap-6">
              <div className="h-[1px] flex-1 bg-white/5" />
              <span className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em]">Alternative Port</span>
              <div className="h-[1px] flex-1 bg-white/5" />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <SocialButton icon={<Chrome size={18} />} label="Google" />
              <SocialButton icon={<Github size={18} />} label="Github" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const SocialButton = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <button type="button" className="flex items-center justify-center gap-4 py-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500 text-zinc-400 font-bold uppercase text-[10px] tracking-widest">
    {icon}
    <span>{label}</span>
  </button>
);

export default LoginPage;