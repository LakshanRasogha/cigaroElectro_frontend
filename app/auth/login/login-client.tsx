"use client";

import React, { useState } from "react";
import type { CredentialResponse } from "@react-oauth/google";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { motion } from "framer-motion";
import {
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Sparkles,
  ShieldCheck,
  Crown,
  Gem,
  Star,
  Key,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiUrl } from "@/app/lib/api";
import { persistAuthSession } from "@/app/lib/auth";
import { staticAssets } from "@/app/lib/assets";
import { getErrorMessage } from "@/app/lib/errors";
import type { AppUser } from "@/app/lib/types";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const backdropUrl =
    "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop";

  const completeLogin = (user: AppUser, token: string) => {
    persistAuthSession(user, token);

    if (user.role === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/");
    }

    router.refresh();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(apiUrl("/users/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({})) as { message?: string };
        throw new Error(errData?.message || "Access Denied. Terminal could not verify credentials.");
      }
      const { user, token } = await res.json();
      completeLogin(user, token);
    } catch (error: unknown) {
      setError(
        getErrorMessage(
          error,
          "Access Denied. Terminal could not verify credentials.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setError("Google sign-in did not return a valid credential.");
      return;
    }

    setGoogleLoading(true);
    setError("");

    try {
      const res = await fetch(apiUrl("/users/google"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({})) as { message?: string };
        throw new Error(errData?.message || "Google authentication failed.");
      }
      const { user, token } = await res.json();
      completeLogin(user, token);
    } catch (error: unknown) {
      setError(
        getErrorMessage(
          error,
          "Google authentication failed. Check your Google client setup.",
        ),
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google authentication failed before the token reached the server.");
  };

  return (
    <div className='min-h-screen flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-10 relative overflow-hidden bg-[#030303] selection:bg-[#D4AF37]/30'>
      {/* --- GOLDEN CINEMATIC BACKDROP --- */}
      <div className='absolute inset-0 z-0'>
        <img
          src={backdropUrl}
          alt='Backdrop'
          className='w-full h-full object-cover opacity-10 sm:opacity-15 md:opacity-20 scale-105'
        />
        <div className='absolute inset-0 bg-gradient-to-tr from-[#030303] via-[#030303]/95 to-[#D4AF37]/10' />

        {/* Gold pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMTBhMjAgMjAgMCAwIDEgMjAgMjAgMjAgMjAgMCAwIDEtNDAgMCAyMCAyMCAwIDAgMSAyMC0yMHoiIGZpbGw9IiNENEFGMzciIGZpbGwtb3BhY2l0eT0iMC4wMyIvPjwvc3ZnPg==')] opacity-20" />
      </div>

      {/* Floating Gold Orbs - Animated */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className='absolute top-10 sm:top-20 left-1/4 w-48 sm:w-64 md:w-80 lg:w-96 h-48 sm:h-64 md:h-80 lg:h-96 bg-[#D4AF37] rounded-full blur-[80px] sm:blur-[100px] md:blur-[120px] lg:blur-[150px] opacity-10'
      />
      <motion.div
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.05, 0.15, 0.05],
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        className='absolute bottom-10 sm:bottom-20 right-1/4 w-48 sm:w-64 md:w-80 lg:w-96 h-48 sm:h-64 md:h-80 lg:h-96 bg-[#D4AF37] rounded-full blur-[80px] sm:blur-[100px] md:blur-[120px] lg:blur-[150px] opacity-10'
      />

      {/* Main Container */}
      <div className='max-w-6xl w-full grid lg:grid-cols-2 bg-gradient-to-br from-white/[0.02] to-white/[0.01] backdrop-blur-3xl rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] lg:rounded-[3.5rem] shadow-2xl border border-white/5 overflow-hidden relative z-10'>
        {/* Gold border accent */}
        <div className='absolute inset-0 border border-[#D4AF37]/10 rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] lg:rounded-[3.5rem] pointer-events-none' />

        {/* --- LEFT SIDE: BRAND IMMERSION - Gold Themed --- */}
        <div className='hidden lg:flex flex-col justify-between p-12 xl:p-16 2xl:p-20 bg-gradient-to-br from-black/60 to-black/40 relative overflow-hidden border-r border-white/5'>
          {/* Animated gold grid */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

          {/* Gold accent orbs */}
          <div className='absolute -top-20 -right-20 w-48 h-48 bg-[#D4AF37] rounded-full blur-[80px] opacity-20' />
          <div className='absolute -bottom-20 -left-20 w-48 h-48 bg-[#D4AF37] rounded-full blur-[80px] opacity-20' />

          <div className='relative z-10'>
            <Link href='/' className='flex items-center gap-3 group'>
              <div className='w-12 h-12 relative overflow-hidden rounded-xl border border-[#D4AF37]/30 shadow-lg shadow-[#D4AF37]/10 group-hover:scale-110 transition-transform duration-700'>
                <img
                  src={staticAssets.brandLogo}
                  alt='Logo'
                  className='w-full h-full object-cover'
                  crossOrigin="anonymous"
                />
              </div>
              <img
                src={staticAssets.brandWordmark}
                alt='CigarroElectrico wordmark'
                className='h-10 w-auto object-contain'
                crossOrigin="anonymous"
              />
              <span
                className='hidden text-2xl font-normal tracking-tight text-white'
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                <span className='text-[#D4AF37]'>Cigarro</span>Eléctrico
              </span>
            </Link>
          </div>

          <div className='relative z-10'>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className='flex items-center gap-2 text-[#D4AF37] mb-4'
            >
              <div className='p-1 bg-[#D4AF37]/10 rounded-lg border border-[#D4AF37]/20'>
                <Crown size={14} className='fill-current' />
              </div>
              <span className='text-[8px] font-black uppercase tracking-[0.3em]'>
                Command Center v2.6
              </span>
            </motion.div>

            <h2 className='text-4xl xl:text-5xl 2xl:text-6xl font-black text-white tracking-tighter leading-none mb-6'>
              Initialize <br />
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F2D37D] to-[#AA771C] italic'>
                Discovery.
              </span>
            </h2>

            <p className='text-zinc-500 font-light text-sm xl:text-base max-w-sm leading-relaxed'>
              Resume your journey into high-fidelity hardware. Securely manage
              your artisanal collections through the gold terminal.
            </p>

            {/* Feature badges */}
            <div className='mt-8 space-y-3'>
              <div className='flex items-center gap-2 text-zinc-600 group hover:text-[#D4AF37] transition-colors'>
                <Gem size={14} className='group-hover:text-[#D4AF37]' />
                <span className='text-xs font-semibold'>Premium Device Access</span>
              </div>
              <div className='flex items-center gap-2 text-zinc-600 group hover:text-[#D4AF37] transition-colors'>
                <ShieldCheck size={14} className='group-hover:text-[#D4AF37]' />
                <span className='text-xs font-semibold'>Secure Session Vault</span>
              </div>
              <div className='flex items-center gap-2 text-zinc-600 group hover:text-[#D4AF37] transition-colors'>
                <Star size={14} className='group-hover:text-[#D4AF37]' />
                <span className='text-xs font-semibold'>Member Rewards</span>
              </div>
            </div>
          </div>

          <div className='relative z-10 flex items-center gap-3 text-zinc-500 text-xs'>
            <Key size={14} className='text-[#D4AF37]' />
            <span>Protected by enterprise-grade authentication</span>
          </div>
        </div>

        {/* --- RIGHT SIDE: LOGIN TERMINAL --- */}
        <div className='relative p-6 sm:p-8 md:p-10 xl:p-12'>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className='relative z-10'
          >
            <div className='text-center mb-8'>
              <div className='flex justify-center mb-4'>
                <Link href='/' className='flex items-center gap-3 group'>
                  <div className='w-12 h-12 relative overflow-hidden rounded-2xl border border-[#D4AF37]/30 shadow-lg shadow-[#D4AF37]/10 group-hover:scale-110 transition-transform duration-700'>
                    <img
                      src={staticAssets.brandLogo}
                      alt='CigarroElectrico logo'
                      className='w-full h-full object-cover'
                      crossOrigin="anonymous"
                    />
                  </div>
                  <img
                    src={staticAssets.brandWordmark}
                    alt='CigarroElectrico wordmark'
                    className='h-10 w-auto object-contain'
                    crossOrigin="anonymous"
                  />
                </Link>
              </div>

              <div className='flex items-center justify-center gap-2 mb-3'>
                <Sparkles className='text-[#D4AF37]' size={16} />
                <h1 className='text-3xl sm:text-4xl font-black text-white tracking-tight'>
                  Secure Access
                </h1>
              </div>

              <p className='text-zinc-400 text-sm'>Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleLogin} className='space-y-5'>
              <div>
                <label className='block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2'>
                  Email Address
                </label>
                <div className='relative'>
                  <Mail className='absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500' size={16} />
                  <input
                    type='email'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='your@email.com'
                    className='w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-4 text-sm text-white placeholder:text-zinc-600 focus:border-[#D4AF37]/40 focus:ring-2 focus:ring-[#D4AF37]/10 outline-none transition'
                  />
                </div>
              </div>

              <div>
                <label className='block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2'>
                  Password
                </label>
                <div className='relative'>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='••••••••'
                    className='w-full bg-white/5 border border-white/10 rounded-2xl pl-4 pr-12 py-4 text-sm text-white placeholder:text-zinc-600 focus:border-[#D4AF37]/40 focus:ring-2 focus:ring-[#D4AF37]/10 outline-none transition'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword((prev) => !prev)}
                    className='absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-[#D4AF37] transition'
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className='rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300'>
                  {error}
                </div>
              )}

              <button
                type='submit'
                disabled={loading}
                className='w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#F2D37D] px-6 py-4 text-sm font-black uppercase tracking-[0.2em] text-black transition hover:shadow-[0_10px_30px_rgba(212,175,55,0.3)] disabled:opacity-50'
              >
                {loading ? (
                  <>
                    <Loader2 className='animate-spin' size={16} />
                    Verifying Credentials
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className='mt-6 space-y-4'>
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <span className='w-full border-t border-white/10' />
                </div>
                <div className='relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600'>
                  <span className='bg-[#030303] px-3'>Or continue with</span>
                </div>
              </div>

              {googleClientId ? (
                <GoogleOAuthProvider clientId={googleClientId}>
                  <div className='flex justify-center'>
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      theme='filled_black'
                      text='signin_with'
                    />
                  </div>
                </GoogleOAuthProvider>
              ) : (
                <div className='text-center text-sm text-amber-300'>
                  Google sign-in is not configured.
                </div>
              )}
            </div>

            <div className='mt-8 flex flex-wrap justify-center gap-3 text-sm'>
              <Link href='/auth/Signin' className='text-[#D4AF37] hover:text-[#F2D37D] transition-colors'>
                Create account
              </Link>
              <Link href='/auth/login/free-membership-agreement' className='text-zinc-400 hover:text-[#D4AF37] transition-colors'>
                Membership Agreement
              </Link>
              <Link href='/auth/login/privacy-policy' className='text-zinc-400 hover:text-[#D4AF37] transition-colors'>
                Privacy Policy
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
