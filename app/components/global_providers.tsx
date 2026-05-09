"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WHATSAPP_CONTACT = "94789696180";
const AGE_KEY = "age_verified";

// ─────────────────────────────────────────────────────────────────────────────
// 18+ Age Gate
// ─────────────────────────────────────────────────────────────────────────────
const AgeGate = ({ onVerified }: { onVerified: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-xl px-4"
  >
    {/* Ambient glow */}
    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D4AF37]/8 rounded-full blur-[120px] pointer-events-none" />

    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 24, delay: 0.1 }}
      className="relative w-full max-w-sm bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-2xl text-center"
    >
      {/* Age badge */}
      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center">
        <span className="text-3xl font-black text-[#D4AF37] leading-none">
          18+
        </span>
      </div>

      <h2 className="text-xl font-black text-white tracking-tight mb-2">
        Age Verification
      </h2>
      <p className="text-zinc-500 text-xs leading-relaxed mb-8">
        This website contains content related to tobacco and vaping products.
        You must be <strong className="text-white">18 years or older</strong> to
        enter.
      </p>

      {/* Confirm */}
      <button
        onClick={onVerified}
        className="w-full py-4 rounded-2xl bg-[#D4AF37] text-black font-black text-[11px] uppercase tracking-[0.3em] hover:bg-[#c9a432] transition-colors mb-3"
      >
        I am 18 or older — Enter
      </button>

      {/* Deny */}
      <button
        onClick={() => {
          // Navigate away — close the page
          window.location.href = "https://www.google.com";
        }}
        className="w-full py-3.5 rounded-2xl border border-white/10 text-zinc-500 font-black text-[11px] uppercase tracking-[0.3em] hover:border-rose-500/40 hover:text-rose-400 transition-colors"
      >
        I am under 18 — Leave
      </button>

      <p className="text-zinc-700 text-[9px] mt-6 leading-relaxed">
        By entering you confirm you are of legal age to purchase vaping products
        in your jurisdiction.
      </p>
    </motion.div>
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Floating WhatsApp Button
// ─────────────────────────────────────────────────────────────────────────────
const FloatingWhatsApp = () => (
  <motion.a
    href={`https://wa.me/${WHATSAPP_CONTACT}`}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat on WhatsApp"
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1.5 }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    className="fixed bottom-6 right-6 z-[500] w-14 h-14 rounded-full bg-[#25D366] shadow-[0_8px_30px_rgba(37,211,102,0.4)] flex items-center justify-center"
  >
    {/* WhatsApp SVG icon */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="26"
      height="26"
      fill="white"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>

    {/* Pulse ring */}
    <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
  </motion.a>
);

// ─────────────────────────────────────────────────────────────────────────────
// Global Providers — rendered inside RootLayout
// ─────────────────────────────────────────────────────────────────────────────
export default function GlobalProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ageVerified, setAgeVerified] = useState<boolean | null>(null);

  useEffect(() => {
    // Check sessionStorage so it shows once per browser session
    const stored = sessionStorage.getItem(AGE_KEY);
    setAgeVerified(stored === "1");
  }, []);

  const handleVerified = () => {
    sessionStorage.setItem(AGE_KEY, "1");
    setAgeVerified(true);
  };

  // While loading from sessionStorage, render nothing (avoids flash)
  if (ageVerified === null) return null;

  return (
    <>
      <AnimatePresence>
        {!ageVerified && <AgeGate key="age-gate" onVerified={handleVerified} />}
      </AnimatePresence>

      {/* Main site content — only visible after age confirmation */}
      {ageVerified && (
        <>
          {children}
          <FloatingWhatsApp />
        </>
      )}
    </>
  );
}
