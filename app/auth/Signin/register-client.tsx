"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  MapPin,
  Zap,
  ArrowRight,
  Loader2,
  Globe,
  Sparkles,
  ShieldCheck,
  Crown,
  Gem,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiUrl } from "@/app/lib/api";
import { staticAssets } from "@/app/lib/assets";
import { getErrorMessage } from "@/app/lib/errors";
import PhoneRegionSelect from "@/app/components/phone_region_select";
import {
  DEFAULT_PHONE_REGION,
  combinePhoneNumber,
  normalizePhoneDigits,
} from "@/app/lib/phone";

export default function Register() {
  const router = useRouter();

  const backdropUrl =
    "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneRegion: DEFAULT_PHONE_REGION,
    phoneNumber: "",
    streetAddress: "",
    city: "",
    postalCode: "",
  });

  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (e.target.name === "password" || e.target.name === "confirmPassword") {
      setPasswordError("");
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match. Please retype both passwords.");
      return;
    }

    setLoading(true);
    setMessage(null);
    setPasswordError("");

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      phone: combinePhoneNumber(formData.phoneRegion, formData.phoneNumber),
      address: {
        address: formData.streetAddress,
        city: formData.city,
        postalCode: formData.postalCode,
      },
    };

    try {
      const res = await fetch(apiUrl("/users"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 201 || res.status === 200) {
        setMessage({
          type: "success",
          text: "Identity created! Redirecting to login...",
        });
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      } else {
        const errData = await res.json().catch(() => ({})) as { message?: string };
        setMessage({
          type: "error",
          text: errData?.message || "Registration failed.",
        });
      }
    } catch (error: unknown) {
      setMessage({
        type: "error",
        text: getErrorMessage(error, "Registration failed."),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center p-3 sm:p-4 md:p-6 relative overflow-hidden bg-[#030303] selection:bg-[#D4AF37]/30'>
      {/* --- GOLDEN BACKDROP --- */}
      <div className='absolute inset-0 z-0'>
        <img
          src={backdropUrl}
          alt='Backdrop'
          className='w-full h-full object-cover opacity-10 sm:opacity-15 md:opacity-20 scale-105'
          crossOrigin="anonymous"
        />
        <div className='absolute inset-0 bg-gradient-to-tr from-[#030303] via-[#030303]/95 to-[#D4AF37]/10' />

        {/* Gold pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMTBhMjAgMjAgMCAwIDEgMjAgMjAgMjAgMjAgMCAwIDEtNDAgMCAyMCAyMCAwIDAgMSAyMC0yMHoiIGZpbGw9IiNENEFGMzciIGZpbGwtb3BhY2l0eT0iMC4wMyIvPjwvc3ZnPg==')] opacity-20" />
      </div>

      {/* Floating Gold Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className='absolute top-10 left-1/4 w-48 sm:w-64 md:w-80 h-48 sm:h-64 md:h-80 bg-[#D4AF37] rounded-full blur-[80px] sm:blur-[100px] md:blur-[120px] opacity-10'
      />
      <motion.div
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.05, 0.15, 0.05],
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        className='absolute bottom-10 right-1/4 w-48 sm:w-64 md:w-80 h-48 sm:h-64 md:h-80 bg-[#D4AF37] rounded-full blur-[80px] sm:blur-[100px] md:blur-[120px] opacity-10'
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className='max-w-2xl w-full bg-gradient-to-br from-white/[0.02] to-white/[0.01] backdrop-blur-3xl rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] shadow-2xl border border-white/5 overflow-hidden relative z-10 p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12'
      >
        {/* Gold border accent */}
        <div className='absolute inset-0 border border-[#D4AF37]/10 rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] pointer-events-none' />

        {/* Header */}
        <div className='text-center mb-6 sm:mb-8 md:mb-10'>
          <div className='flex justify-center mb-3 sm:mb-4'>
            <Link href='/' className='flex items-center gap-2 sm:gap-3 group'>
              <div className='w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 relative overflow-hidden rounded-full border border-[#D4AF37]/30 shadow-lg shadow-[#D4AF37]/10 group-hover:scale-110 transition-transform duration-500'>
                <img
                  src={staticAssets.brandLogo}
                  alt='CigarroElectrico Logo'
                  className='w-full h-full object-cover'
                  crossOrigin="anonymous"
                />
              </div>
              <img
                src={staticAssets.brandWordmark}
                alt='CigaroElectro wordmark'
                className='h-8 sm:h-9 md:h-10 w-auto object-contain'
                crossOrigin="anonymous"
              />

              <span
                className='hidden text-lg sm:text-xl md:text-2xl font-normal tracking-tight text-white flex flex-col md:flex-row md:gap-1 leading-none'
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                <span className='text-[#D4AF37]'>Cigarro</span>
                <span className='text-[#F2D37D]'>Electrico</span>
              </span>
            </Link>
          </div>

          <h2 className='text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tighter flex items-center justify-center gap-2'>
            Join the{" "}
            <span className='italic text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F2D37D] to-[#AA771C]'>
              Circle.
            </span>
            <Sparkles className='text-[#D4AF37]' size={16} />
          </h2>

          <p className='text-[#D4AF37]/70 font-bold mt-2 text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em]'>
            Identity Registration
          </p>
        </div>

        <form
          className='space-y-4 sm:space-y-5 md:space-y-6'
          onSubmit={handleSubmit}
        >
          {/* Identity Section */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5'>
            <InputField
              icon={<User size={14} className='sm:hidden' />}
              iconSm={<User size={16} className='hidden sm:block' />}
              label='First Name'
              name='firstName'
              type='text'
              value={formData.firstName}
              onChange={handleChange}
            />
            <InputField
              icon={<User size={14} className='sm:hidden' />}
              iconSm={<User size={16} className='hidden sm:block' />}
              label='Last Name'
              name='lastName'
              type='text'
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5'>
            <InputField
              icon={<Mail size={14} className='sm:hidden' />}
              iconSm={<Mail size={16} className='hidden sm:block' />}
              label='Email'
              name='email'
              type='email'
              value={formData.email}
              onChange={handleChange}
            />
            <PhoneField
              icon={<Phone size={14} className='sm:hidden' />}
              iconSm={<Phone size={16} className='hidden sm:block' />}
              label='Working WhatsApp Number'
              regionCode={formData.phoneRegion}
              localNumber={formData.phoneNumber}
              onRegionChange={(value) =>
                setFormData((prev) => ({ ...prev, phoneRegion: value }))
              }
              onLocalNumberChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  phoneNumber: normalizePhoneDigits(value),
                }))
              }
            />
          </div>

          <div className='space-y-3'>
            <InputField
              icon={<Lock size={14} className='sm:hidden' />}
              iconSm={<Lock size={16} className='hidden sm:block' />}
              label='Security Password'
              name='password'
              type='password'
              value={formData.password}
              onChange={handleChange}
              error={Boolean(passwordError)}
            />
            <InputField
              icon={<Lock size={14} className='sm:hidden' />}
              iconSm={<Lock size={16} className='hidden sm:block' />}
              label='Confirm Password'
              name='confirmPassword'
              type='password'
              value={formData.confirmPassword}
              onChange={handleChange}
              error={Boolean(passwordError)}
            />
            {passwordError && (
              <p className='px-2 sm:px-3 md:px-4 text-[8px] sm:text-[9px] md:text-[10px] font-bold text-rose-400'>
                {passwordError}
              </p>
            )}
          </div>

          {/* Location Section */}
          <div className='pt-4 sm:pt-5 md:pt-6 border-t border-white/5'>
            <div className='mb-3 sm:mb-4 md:mb-5'>
              <InputField
                icon={<MapPin size={14} className='sm:hidden' />}
                iconSm={<MapPin size={16} className='hidden sm:block' />}
                label='Primary Address'
                name='streetAddress'
                type='text'
                value={formData.streetAddress}
                onChange={handleChange}
              />
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5'>
              <InputField
                icon={<Globe size={14} className='sm:hidden' />}
                iconSm={<Globe size={16} className='hidden sm:block' />}
                label='City'
                name='city'
                type='text'
                value={formData.city}
                onChange={handleChange}
              />
              <InputField
                icon={<MapPin size={14} className='sm:hidden' />}
                iconSm={<MapPin size={16} className='hidden sm:block' />}
                label='Postal'
                name='postalCode'
                type='text'
                value={formData.postalCode}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Feedback Message */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-widest text-center border ${message.type === "success"
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                  }`}
              >
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            type='submit'
            disabled={loading}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            className='w-full bg-gradient-to-r from-[#D4AF37] to-[#B49450] text-black py-4 sm:py-5 md:py-6 rounded-xl sm:rounded-2xl font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em] text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs flex items-center justify-center gap-2 sm:gap-3 hover:shadow-[0_10px_30px_rgba(212,175,55,0.3)] transition-all duration-500 disabled:opacity-50 relative overflow-hidden'
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
                <span>Deploy Identity</span>
                <ArrowRight size={12} className='sm:hidden' />
                <ArrowRight size={14} className='hidden sm:block' />
              </>
            )}
          </motion.button>

          {/* Footer Link */}
          <p className='text-center text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-zinc-600 mt-4 sm:mt-6 md:mt-8'>
            Established member?{" "}
            <Link
              href='/auth/login'
              className='text-[#D4AF37] hover:text-[#F2D37D] transition-colors'
            >
              Access Terminal
            </Link>
          </p>

          {/* Security Badge */}
          <div className='flex items-center justify-center gap-2 mt-3 text-zinc-700'>
            <ShieldCheck size={12} className='text-[#D4AF37]' />
            <span className='text-[6px] sm:text-[7px] md:text-[8px] font-black uppercase tracking-wider'>
              End-to-End Encryption Active
            </span>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

interface InputFieldProps {
  icon: React.ReactNode;
  iconSm?: React.ReactNode;
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
}

const InputField = ({
  icon,
  iconSm,
  label,
  name,
  type,
  value,
  onChange,
  error = false,
}: InputFieldProps) => {
  const isPasswordField = type === "password";
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='space-y-1 sm:space-y-1.5 md:space-y-2 w-full'>
      <label className='text-[7px] sm:text-[8px] md:text-[9px] font-black uppercase tracking-[0.1em] sm:tracking-[0.15em] md:tracking-[0.2em] text-zinc-500 ml-2 sm:ml-3 md:ml-4 flex items-center gap-1 sm:gap-2'>
        <span className='sm:hidden text-[#D4AF37]'>{icon}</span>
        <span className='hidden sm:block text-[#D4AF37]'>{iconSm || icon}</span>
        {label}
      </label>

      <div className='relative'>
        <input
          name={name}
          type={isPasswordField && showPassword ? "text" : type}
          required
          value={value}
          onChange={onChange}
          placeholder={`Enter ${label.toLowerCase()}`}
          className={`w-full bg-white/10 border border-white/10 rounded-lg sm:rounded-xl md:rounded-2xl px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-4 text-white text-xs sm:text-sm font-bold placeholder:text-zinc-500 placeholder:opacity-100 focus:bg-white/15 focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/10 transition-all outline-none ${error
              ? "border-rose-500/40 focus:border-rose-500 focus:ring-rose-500/10"
              : ""
            } ${isPasswordField ? "pr-10 sm:pr-12" : ""}`}
        />

        {isPasswordField && (
          <button
            type='button'
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className='absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-[#D4AF37] transition-colors'
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
};

const PhoneField = ({
  icon,
  iconSm,
  label,
  regionCode,
  localNumber,
  onRegionChange,
  onLocalNumberChange,
}: {
  icon: React.ReactNode;
  iconSm?: React.ReactNode;
  label: string;
  regionCode: string;
  localNumber: string;
  onRegionChange: (value: string) => void;
  onLocalNumberChange: (value: string) => void;
}) => (
  <div className='space-y-1 sm:space-y-1.5 md:space-y-2 w-full'>
    <label className='text-[7px] sm:text-[8px] md:text-[9px] font-black uppercase tracking-[0.1em] sm:tracking-[0.15em] md:tracking-[0.2em] text-zinc-500 ml-2 sm:ml-3 md:ml-4 flex items-center gap-1 sm:gap-2'>
      <span className='sm:hidden text-[#D4AF37]'>{icon}</span>
      <span className='hidden sm:block text-[#D4AF37]'>{iconSm || icon}</span>
      {label}
    </label>

    <div className='grid grid-cols-[108px_minmax(0,1fr)] sm:grid-cols-[120px_minmax(0,1fr)] gap-2 sm:gap-3'>
      <PhoneRegionSelect value={regionCode} onChange={onRegionChange} />

      <input
        type='tel'
        required
        inputMode='numeric'
        value={localNumber}
        onChange={(e) => onLocalNumberChange(e.target.value)}
        placeholder='WhatsApp number'
        className='w-full bg-white/10 border border-white/10 rounded-lg sm:rounded-xl md:rounded-2xl px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-4 text-white text-xs sm:text-sm font-bold placeholder:text-zinc-500 placeholder:opacity-100 focus:bg-white/15 focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/10 transition-all outline-none'
      />
    </div>
  </div>
);
