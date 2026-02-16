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

  // Background configuration to match high-end aesthetic
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

      // 1. Extract data from response
      const { user, token } = response.data;

      // 2. Save session with the 'user' key for Navbar detection
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);

      // 3. Dispatch storage event to update Navbar immediately
      window.dispatchEvent(new Event('storage'));

      // 4. Role-Based Redirection Logic
      if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
      
      router.refresh();
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authorization failed. Verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 lg:p-10 relative overflow-hidden bg-slate-950">
      
      {/* --- BACKDROP LAYER --- */}
      <div className="absolute inset-0 z-0">
        <img 
          src={backdropUrl} 
          alt="Backdrop" 
          className="w-full h-full object-cover opacity-30 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/80 to-indigo-950/40" />
      </div>

      {/* Ambient Neon Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />

      <div className="max-w-6xl w-full grid lg:grid-cols-2 bg-white/95 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white/10 overflow-hidden relative z-10">
        
        {/* --- LEFT SIDE: BRAND IMMERSION --- */}
        <div className="hidden lg:flex flex-col justify-between p-16 bg-slate-900 relative overflow-hidden">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 to-transparent pointer-events-none"
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
              Access the <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300 italic">Control Terminal.</span>
            </h2>
            <p className="text-slate-400 font-medium text-lg max-w-sm">
              Resume your premium hardware journey and manage your artisanal collections.
            </p>
          </div>

          <div className="relative z-10 flex gap-6 text-slate-500 font-mono text-[10px] uppercase tracking-[0.2em]">
            <span>Secured Session</span>
            <span>Premium Hub v2.6</span>
          </div>
        </div>

        {/* --- RIGHT SIDE: LOGIN FORM --- */}
        <div className="p-8 md:p-16 lg:p-20 flex flex-col justify-center bg-white/50 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-2 uppercase">Sign In</h3>
            <p className="text-slate-500 font-medium text-sm">
              Unregistered? <Link href="/auth/register" className="text-indigo-600 font-bold hover:underline">Establish identity</Link>
            </p>
          </motion.div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="bg-rose-50 text-rose-600 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest border border-rose-100"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Credential Link (Email)</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@terminal.com"
                  className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl pl-16 pr-6 py-5 text-slate-900 font-bold placeholder:text-slate-200 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Security Key</label>
                <Link href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 hover:text-indigo-400">Recover</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl pl-16 pr-6 py-5 text-slate-900 font-bold placeholder:text-slate-200 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none"
                />
              </div>
            </div>

            <motion.button 
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase tracking-[0.4em] text-[11px] flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all duration-500 mt-4 disabled:bg-slate-200 shadow-2xl shadow-indigo-100"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Authenticate"} 
              {!loading && <ArrowRight size={18} />}
            </motion.button>

            <div className="relative py-4 flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-slate-100" />
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">External Auth</span>
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
  <button type="button" className="flex items-center justify-center gap-3 py-4 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 transition-all duration-300 text-slate-600 font-black uppercase text-[10px] tracking-widest">
    {icon}
    <span>{label}</span>
  </button>
);

export default LoginPage;