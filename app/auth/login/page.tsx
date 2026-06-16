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
                />
              </div>
              <img
                src={staticAssets.brandWordmark}
                alt='CigaroElectro wordmark'
                className='h-10 w-auto object-contain'
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
                <span className='text-[8px] font-black uppercase tracking-[0.2em]'>
                  Premium Access Only
                </span>
              </div>
              <div className='flex items-center gap-2 text-zinc-600 group hover:text-[#D4AF37] transition-colors'>
                <Star size={14} className='group-hover:text-[#D4AF37]' />
                <span className='text-[8px] font-black uppercase tracking-[0.2em]'>
                  Elite Member Benefits
                </span>
              </div>
            </div>
          </div>

          <div className='relative z-10 flex flex-col gap-3'>
            <div className='flex items-center gap-2 text-zinc-700'>
              <ShieldCheck size={14} className='text-[#D4AF37]' />
              <span className='text-[7px] font-black uppercase tracking-[0.2em]'>
                End-to-End Encryption Active
              </span>
            </div>
            <div className='h-[1px] w-12 bg-gradient-to-r from-[#D4AF37]/50 to-transparent' />
          </div>
        </div>

        {/* --- RIGHT SIDE: LOGIN FORM - Gold Themed & Mobile Optimized --- */}
        <div className='p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 flex flex-col justify-center relative'>
          {/* Mobile brand (visible only on mobile) */}
          <div className='lg:hidden flex items-center gap-2 mb-6'>
            <div className='w-8 h-8 rounded-lg border border-[#D4AF37]/30 overflow-hidden'>
              <img
                src={staticAssets.brandLogo}
                alt='Logo'
                className='w-full h-full object-cover'
              />
            </div>
            <img
              src={staticAssets.brandWordmark}
              alt='CigaroElectro wordmark'
              className='h-8 w-auto object-contain'
            />
            <span
              className='hidden text-base font-normal text-white'
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              <span className='text-[#D4AF37]'>Cigarro</span>Eléctrico
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='mb-6 sm:mb-8 md:mb-10'
          >
            <h3 className='text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tighter mb-2 uppercase flex items-center gap-2'>
              Sign In
              <Sparkles className='text-[#D4AF37]' size={16} />
            </h3>
            <p className='text-xs sm:text-sm text-zinc-500 font-medium'>
              New User?{" "}
              <Link
                href='/auth/Signin'
                className='text-[#D4AF37] font-bold hover:text-[#F2D37D] transition-colors'
              >
                Create Account
              </Link>
            </p>
          </motion.div>

          <form
            onSubmit={handleLogin}
            className='space-y-4 sm:space-y-5 md:space-y-6'
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className='bg-rose-500/10 text-rose-500 p-3 sm:p-4 rounded-xl text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-rose-500/20 flex items-center gap-2'
              >
                <div className='w-1 h-1 rounded-full bg-rose-500 animate-pulse' />
                {error}
              </motion.div>
            )}

            {/* Email Field */}
            <div className='space-y-1.5 sm:space-y-2'>
              <label className='text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-4'>
                Credential Link
              </label>
              <div className='relative group'>
                <Mail
                  className='absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-[#D4AF37] transition-colors'
                  size={16}
                />
                <input
                  type='email'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='terminal@identity.io'
                  className='w-full bg-white/[0.03] border border-white/5 rounded-xl sm:rounded-2xl pl-10 pr-4 py-3 sm:py-4 text-white text-xs sm:text-sm font-bold placeholder:text-zinc-800 focus:bg-white/[0.05] focus:border-[#D4AF37]/30 focus:ring-2 focus:ring-[#D4AF37]/10 transition-all outline-none'
                />
              </div>
            </div>

            {/* Password Field */}
            <div className='space-y-1.5 sm:space-y-2'>
              <div className='flex justify-between items-center px-4'>
                <label className='text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600'>
                  Access Key
                </label>
                <Link
                  href='#'
                  className='text-[7px] sm:text-[8px] md:text-[9px] font-black uppercase tracking-widest text-[#D4AF37] hover:text-[#F2D37D] transition-colors'
                >
                  Recovery
                </Link>
              </div>
              <div className='relative group'>
                <Key
                  className='absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-[#D4AF37] transition-colors'
                  size={16}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='••••••••'
                  className='w-full bg-white/[0.03] border border-white/5 rounded-xl sm:rounded-2xl pl-10 pr-12 py-3 sm:py-4 text-white text-xs sm:text-sm font-bold placeholder:text-zinc-800 focus:bg-white/[0.05] focus:border-[#D4AF37]/30 focus:ring-2 focus:ring-[#D4AF37]/10 transition-all outline-none'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className='absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-[#D4AF37] transition-colors'
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <motion.button
              type='submit'
              disabled={loading}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              className='w-full bg-gradient-to-r from-[#D4AF37] to-[#B49450] text-black py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em] text-[8px] sm:text-[9px] md:text-xs flex items-center justify-center gap-2 hover:shadow-[0_10px_30px_rgba(212,175,55,0.3)] transition-all duration-500 disabled:opacity-50 relative overflow-hidden'
            >
              {/* Shimmer effect */}
              {!loading && (
                <motion.div
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent'
                />
              )}

              {loading ? (
                <>
                  <Loader2 className='animate-spin' size={14} />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Execute Login</span>
                  <ArrowRight size={12} className='sm:hidden' />
                  <ArrowRight size={14} className='hidden sm:block' />
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div className='relative py-4 sm:py-5 flex items-center gap-2 sm:gap-3'>
              <div className='h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent' />
              <span className='text-[7px] sm:text-[8px] md:text-[9px] font-black text-zinc-700 uppercase tracking-[0.2em] whitespace-nowrap'>
                Alternative Port
              </span>
              <div className='h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent' />
            </div>

            {/* Social Buttons - Mobile Optimized */}
            <div className='grid gap-3 sm:gap-4'>
              {googleClientId ? (
                <GoogleOAuthProvider clientId={googleClientId}>
                  <div className='space-y-2'>
                    <div className='min-h-11 rounded-xl sm:rounded-2xl overflow-hidden'>
                      <div className='w-full [&>div]:!w-full [&_iframe]:!w-full'>
                        <GoogleLogin
                          onSuccess={handleGoogleSuccess}
                          onError={handleGoogleError}
                          text='signin_with'
                          shape='pill'
                          theme='outline'
                          size='large'
                          width='100%'
                        />
                      </div>
                    </div>
                    {googleLoading && (
                      <div className='flex items-center justify-center gap-2 text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#D4AF37]'>
                        <Loader2 className='animate-spin' size={14} />
                        Verifying Google Identity
                      </div>
                    )}
                  </div>
                </GoogleOAuthProvider>
              ) : (
                <div className='rounded-xl sm:rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-widest text-amber-400 text-center'>
                  Set NEXT_PUBLIC_GOOGLE_CLIENT_ID to enable Google sign-in
                </div>
              )}
            </div>

            <p className='text-[9px] sm:text-[10px] md:text-[11px] leading-6 text-zinc-500 font-medium text-center'>
              By continuing, you confirm that you are an adult and have read
              and accepted our{" "}
              <Link
                href='/free-membership-agreement'
                className='text-[#D4AF37] hover:text-[#F2D37D] transition-colors underline underline-offset-4'
              >
                CigarroElectrico Free Membership Agreement
              </Link>{" "}
              and{" "}
              <Link
                href='/privacy-policy'
                className='text-[#D4AF37] hover:text-[#F2D37D] transition-colors underline underline-offset-4'
              >
                Privacy Policy
              </Link>
              . Your information may be used for marketing purposes, but you
              can opt out at any time.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
