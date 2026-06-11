"use client";

import React, { useEffect, useState } from "react";

const WHATSAPP_CONTACT = "94789696180";
const AGE_KEY = "age_verified";

/* ─────────────── SVG icons ─────────────── */
const VapeIcon = () => (
  <svg viewBox="0 0 60 120" fill="none" xmlns="http://www.w3.org/2000/svg" width="38" height="76">
    {/* Mouthpiece tip */}
    <rect x="22" y="0" width="16" height="8" rx="4" fill="#D4AF37" opacity="0.7" />
    {/* Neck */}
    <rect x="25" y="8" width="10" height="6" rx="2" fill="#D4AF37" opacity="0.5" />
    {/* Body */}
    <rect x="16" y="14" width="28" height="74" rx="8" fill="none" stroke="#D4AF37" strokeWidth="2" />
    {/* Window / display */}
    <rect x="20" y="22" width="20" height="28" rx="4" fill="#D4AF37" opacity="0.08" stroke="#D4AF37" strokeWidth="1" strokeOpacity="0.3" />
    <rect x="22" y="24" width="8" height="3" rx="1.5" fill="#D4AF37" opacity="0.5" />
    <rect x="22" y="29" width="14" height="2" rx="1" fill="#D4AF37" opacity="0.25" />
    <rect x="22" y="33" width="10" height="2" rx="1" fill="#D4AF37" opacity="0.25" />
    {/* Fire button */}
    <rect x="19" y="56" width="22" height="10" rx="5" fill="#D4AF37" opacity="0.15" stroke="#D4AF37" strokeWidth="1" strokeOpacity="0.4" />
    {/* Base */}
    <rect x="16" y="88" width="28" height="14" rx="6" fill="#D4AF37" opacity="0.1" stroke="#D4AF37" strokeWidth="1.5" strokeOpacity="0.5" />
    {/* Charge port */}
    <rect x="26" y="104" width="8" height="4" rx="2" fill="#D4AF37" opacity="0.4" />
    {/* Vapor wisps */}
    <path d="M30 0 Q27 -6 30 -12" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round" opacity="0.35" />
    <path d="M30 0 Q33 -8 30 -16" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round" opacity="0.2" />
  </svg>
);

const CigaretteIcon = () => (
  <svg viewBox="0 0 120 20" fill="none" xmlns="http://www.w3.org/2000/svg" width="90" height="16">
    {/* Filter (orange-gold) */}
    <rect x="0" y="3" width="28" height="14" rx="4" fill="#D4AF37" opacity="0.6" />
    <rect x="4" y="5" width="2" height="10" rx="1" fill="#AA771C" opacity="0.5" />
    <rect x="8" y="5" width="2" height="10" rx="1" fill="#AA771C" opacity="0.5" />
    <rect x="12" y="5" width="2" height="10" rx="1" fill="#AA771C" opacity="0.5" />
    {/* Divider band */}
    <rect x="28" y="3" width="4" height="14" rx="1" fill="#D4AF37" opacity="0.9" />
    {/* White paper */}
    <rect x="32" y="3" width="76" height="14" rx="3" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeOpacity="0.5" />
    {/* Printed lines */}
    <line x1="45" y1="6" x2="45" y2="14" stroke="#D4AF37" strokeWidth="0.5" strokeOpacity="0.2" />
    <line x1="65" y1="6" x2="65" y2="14" stroke="#D4AF37" strokeWidth="0.5" strokeOpacity="0.2" />
    <line x1="85" y1="6" x2="85" y2="14" stroke="#D4AF37" strokeWidth="0.5" strokeOpacity="0.2" />
    {/* Burning tip */}
    <circle cx="111" cy="10" r="5" fill="#D4AF37" opacity="0.2" />
    <circle cx="111" cy="10" r="3" fill="#D4AF37" opacity="0.5" />
    <circle cx="111" cy="10" r="1.5" fill="#fff" opacity="0.8" />
    {/* Smoke wisps */}
    <path d="M116 8 Q119 4 117 0" stroke="#D4AF37" strokeWidth="0.8" strokeLinecap="round" opacity="0.3" />
    <path d="M118 9 Q122 5 120 0" stroke="#D4AF37" strokeWidth="0.6" strokeLinecap="round" opacity="0.2" />
  </svg>
);

/* ─────────────── Background pattern tile ─────────────── */
const bgPatternStyle: React.CSSProperties = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Ccircle cx='10' cy='10' r='2' fill='%23D4AF37' opacity='0.06'/%3E%3Crect x='35' y='5' width='12' height='4' rx='2' fill='%23D4AF37' opacity='0.05'/%3E%3Ccircle cx='70' cy='20' r='3' fill='%23D4AF37' opacity='0.05'/%3E%3Crect x='5' y='40' width='4' height='14' rx='2' fill='%23D4AF37' opacity='0.05'/%3E%3Ccircle cx='55' cy='60' r='2.5' fill='%23D4AF37' opacity='0.06'/%3E%3Crect x='60' y='35' width='14' height='4' rx='2' fill='%23D4AF37' opacity='0.05'/%3E%3Ccircle cx='30' cy='70' r='3' fill='%23D4AF37' opacity='0.05'/%3E%3C/svg%3E")`,
  backgroundRepeat: "repeat",
  backgroundSize: "80px 80px",
};

const AgeGate = ({ onVerified }: { onVerified: () => void }) => (
  <div
    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center px-4 animate-fade-in"
    style={{ backgroundColor: "#0a0a0a", ...bgPatternStyle }}
  >
    {/* Ambient glow */}
    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D4AF37]/6 rounded-full blur-[130px] pointer-events-none" />

    {/* Icons row */}
    <div
      className="flex items-end justify-center gap-8 mb-8 animate-scale-in"
      style={{ animationDelay: "80ms" }}
    >
      {/* Vape */}
      <div className="flex flex-col items-center gap-2">
        <VapeIcon />
      </div>

      {/* Separator dot */}
      <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/40 mb-4" />

      {/* Cigarette — rotated to stand upright */}
      <div className="flex flex-col items-center gap-2" style={{ transform: "rotate(90deg) translateY(-10px)" }}>
        <CigaretteIcon />
      </div>
    </div>

    {/* Brand */}
    <div
      className="text-center mb-2 animate-scale-in"
      style={{ animationDelay: "120ms" }}
    >
      <p className="text-[#D4AF37] font-black text-[9px] tracking-[0.45em] uppercase mb-1">
        CIGARRO ELECTRICO
      </p>
      <div className="h-px w-20 mx-auto bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
    </div>

    {/* Question */}
    <p
      className="text-white/80 text-sm tracking-wide mb-8 animate-scale-in"
      style={{ animationDelay: "160ms" }}
    >
      Are you over 18 years of age?
    </p>

    {/* Buttons */}
    <div
      className="flex items-center gap-3 animate-scale-in"
      style={{ animationDelay: "200ms" }}
    >
      <button
        id="age-gate-yes"
        onClick={onVerified}
        className="px-10 py-3 rounded-lg bg-[#1c1c1c] border border-[#D4AF37]/60 text-[#D4AF37] font-black text-[11px] uppercase tracking-[0.3em] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] transition-all duration-200 shadow-[0_0_18px_rgba(212,175,55,0.15)]"
      >
        Yes
      </button>
      <button
        id="age-gate-no"
        onClick={() => window.location.assign("https://www.google.com")}
        className="px-10 py-3 rounded-lg bg-[#1c1c1c] border border-white/15 text-zinc-400 font-black text-[11px] uppercase tracking-[0.3em] hover:border-rose-500/40 hover:text-rose-400 transition-all duration-200"
      >
        No
      </button>
    </div>

    {/* Fine print */}
    <p
      className="text-zinc-700 text-[9px] mt-10 tracking-wider animate-scale-in"
      style={{ animationDelay: "240ms" }}
    >
      By entering you confirm you are of legal age in your jurisdiction.
    </p>
  </div>
);

const FloatingWhatsApp = () => (
  <a
    href={`https://wa.me/${WHATSAPP_CONTACT}`}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat on WhatsApp"
    className="fixed bottom-6 right-6 z-[500] w-14 h-14 rounded-full bg-[#25D366] shadow-[0_8px_30px_rgba(37,211,102,0.4)] flex items-center justify-center transition-transform duration-300 hover:scale-110 active:scale-95 animate-scale-in"
    style={{ animationDelay: "150ms" }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="26"
      height="26"
      fill="white"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>

    <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
  </a>
);

export default function GlobalProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ageVerified, setAgeVerified] = useState<boolean | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAgeVerified(sessionStorage.getItem(AGE_KEY) === "1");
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const handleVerified = () => {
    sessionStorage.setItem(AGE_KEY, "1");
    setAgeVerified(true);
  };

  if (ageVerified === null) return null;

  return (
    <>
      {!ageVerified && <AgeGate onVerified={handleVerified} />}

      {ageVerified && (
        <>
          {children}
          <FloatingWhatsApp />
        </>
      )}
    </>
  );
}
