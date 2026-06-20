"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import { UserCircle2, X } from "lucide-react";
import Link from "next/link";

import Footer from "../components/footer";
import Navbar from "../components/navbar";
import Headers from "../components/header";
import HeritageSection from "../UI/aboutsection";
import { apiUrl } from "@/app/lib/api";

const TrendingSection = dynamic(() => import("../UI/trendingsection"), {
  ssr: false,
});

type IdleCapableWindow = Window &
  typeof globalThis & {
    cancelIdleCallback?: (handle: number) => void;
    requestIdleCallback?: (
      callback: IdleRequestCallback,
      options?: IdleRequestOptions,
    ) => number;
  };

function getProfileCompletion(user: Record<string, unknown>): number {
  const addr =
    user.address && typeof user.address === "object"
      ? (user.address as Record<string, unknown>)
      : {};

  const checks = [
    Boolean(user.profilePicture && String(user.profilePicture).trim()),
    Boolean(user.firstName && String(user.firstName).trim()),
    Boolean(user.lastName && String(user.lastName).trim()),
    Boolean(user.phone && String(user.phone).trim()),
    Boolean(addr.address && String(addr.address).trim()),
    Boolean(addr.city && String(addr.city).trim()),
    Boolean(addr.postalCode && String(addr.postalCode).trim()),
  ];

  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

const NUDGE_KEY = "profile_nudge_shown";

function getInitialNudgeState() {
  if (typeof window === "undefined") {
    return { visible: false, pct: 0, shouldMark: false };
  }

  if (sessionStorage.getItem(NUDGE_KEY)) {
    return { visible: false, pct: 0, shouldMark: false };
  }

  const raw = localStorage.getItem("user");
  if (!raw) {
    return { visible: false, pct: 0, shouldMark: false };
  }

  try {
    const user = JSON.parse(raw) as Record<string, unknown>;
    const completion = getProfileCompletion(user);

    if (completion >= 100) {
      return { visible: false, pct: 0, shouldMark: false };
    }

    return { visible: true, pct: completion, shouldMark: true };
  } catch {
    return { visible: false, pct: 0, shouldMark: false };
  }
}

const SectionFallback = ({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) => (
  <section className="relative bg-[#050505] overflow-hidden py-8 md:py-12">
    <div className="max-w-7xl mx-auto px-4 md:px-6">
      <div className="mb-10 md:mb-14">
        <p className="text-[#D4AF37] font-black text-[9px] md:text-[11px] tracking-[0.4em] uppercase mb-3">
          {eyebrow}
        </p>
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase">
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 animate-pulse">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03]"
          >
            <div className="aspect-[4/5] bg-white/5" />
            <div className="space-y-3 p-4">
              <div className="h-2 w-20 rounded-full bg-white/10" />
              <div className="h-4 w-3/4 rounded-full bg-white/10" />
              <div className="h-4 w-1/2 rounded-full bg-white/10" />
              <div className="h-8 w-full rounded-xl bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const DeferredSection = ({
  children,
  fallback,
  loadOnIdle = false,
  rootMargin = "220px 0px",
}: {
  children: React.ReactNode;
  fallback: React.ReactNode;
  loadOnIdle?: boolean;
  rootMargin?: string;
}) => {
  const [shouldRender, setShouldRender] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loadOnIdle || shouldRender || typeof window === "undefined") {
      return;
    }

    const browserWindow = window as IdleCapableWindow;

    if (typeof browserWindow.requestIdleCallback === "function") {
      const handle = browserWindow.requestIdleCallback(
        () => setShouldRender(true),
        { timeout: 1200 },
      );

      return () => {
        browserWindow.cancelIdleCallback?.(handle);
      };
    }

    const timeout = window.setTimeout(() => setShouldRender(true), 450);
    return () => window.clearTimeout(timeout);
  }, [loadOnIdle, shouldRender]);

  useEffect(() => {
    if (shouldRender) return;

    const node = containerRef.current;
    if (!node) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      const timeout = window.setTimeout(() => setShouldRender(true), 0);
      return () => window.clearTimeout(timeout);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, shouldRender]);

  return <div ref={containerRef}>{shouldRender ? children : fallback}</div>;
};

const ProfileNudgeBanner = () => {
  const [nudgeState, setNudgeState] = useState(getInitialNudgeState);
  const { visible, pct, shouldMark } = nudgeState;

  useEffect(() => {
    if (visible && shouldMark) {
      sessionStorage.setItem(NUDGE_KEY, "1");
    }

    if (!visible) return;

    const timer = window.setTimeout(() => {
      setNudgeState((prev) => ({ ...prev, visible: false }));
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [shouldMark, visible]);

  if (!visible) return null;

  return (
    <div className="fixed top-20 left-0 right-0 z-[200] flex justify-center px-4 pointer-events-none animate-fade-in-down">
      <div className="pointer-events-auto flex items-center gap-4 px-5 py-3.5 rounded-2xl bg-[#0d0d0d]/95 border border-[#D4AF37]/30 backdrop-blur-xl shadow-2xl max-w-sm w-full">
        <div className="shrink-0 w-9 h-9 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center">
          <UserCircle2 size={18} className="text-[#D4AF37]" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black uppercase tracking-widest text-white leading-tight">
            Complete your profile
          </p>

          <div className="mt-1.5 h-1 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#ffe066]"
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="flex items-center justify-between mt-1">
            <p className="text-[8px] text-zinc-500 tracking-wide">
              {pct}% done - add your missing details
            </p>
            <Link
              href="/profile"
              onClick={() =>
                setNudgeState((prev) => ({ ...prev, visible: false }))
              }
              className="text-[8px] font-black uppercase tracking-widest text-[#D4AF37] hover:underline"
            >
              Go to profile
            </Link>
          </div>
        </div>

        <button
          onClick={() => setNudgeState((prev) => ({ ...prev, visible: false }))}
          className="shrink-0 text-zinc-600 hover:text-white transition-colors"
          aria-label="Dismiss nudge"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

const Home = () => {
  const [bestsellerKeys, setBestsellerKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    let active = true;

    fetch(apiUrl("/analytics/bestseller-keys?limit=20"))
      .then((res) => (res.ok ? res.json() : []))
      .then((data: string[]) => {
        if (!active) return;
        const keys: string[] = Array.isArray(data) ? data : [];
        setBestsellerKeys(new Set(keys));
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="bg-[#050505] text-white selection:bg-[#D4AF37] selection:text-black min-h-screen relative overflow-x-hidden font-sans">
      <ProfileNudgeBanner />

      <div className="fixed top-0 left-0 right-0 z-[100]">
        <Navbar />
      </div>

      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 left-[-10%] w-[28rem] h-[28rem] bg-[#D4AF37]/5 blur-[110px] rounded-full" />
        <div className="absolute top-[28%] right-[-8%] w-[24rem] h-[24rem] bg-[#AA771C]/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-[10%] left-[-6%] w-[22rem] h-[22rem] bg-[#D4AF37]/4 blur-[90px] rounded-full" />
      </div>

      <div className="relative z-10">
        <header className="relative">
          <Headers />
        </header>

        {/* Semantic optimization of dynamic sections using trending keyword anchors */}
        <DeferredSection
          loadOnIdle
          rootMargin="260px 0px"
          fallback={
            <SectionFallback
              eyebrow="Trending Vapes"
              title="Loading Most Viewed Devices in Sri Lanka"
            />
          }
        >
          <TrendingSection bestsellerKeys={bestsellerKeys} />
        </DeferredSection>

        <div className="bg-[#050505] px-4 pb-8 md:px-6">
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-[#D4AF37]/15 bg-white/[0.03] p-6 sm:p-8 backdrop-blur-xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="max-w-3xl">
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#D4AF37]">
                  CigarroElectrico Vape Shop Sri Lanka
                </p>
                <h2 className="mt-3 text-2xl font-black uppercase tracking-tight text-white sm:text-4xl">
                  Buy Vapes Online in Sri Lanka
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
                  Discover CigarroElectrico&apos;s curated vape catalogue for Sri Lanka, including premium disposable vapes, refill-ready pod systems, nicotine salts, e-liquids, coils, pods, and everyday vape accessories.
                </p>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-500">
                  Shop by collection with dedicated pages for{" "}
                  <Link
                    href="/collections/category/disposable-vapes"
                    className="font-semibold text-[#D4AF37] underline-offset-4 hover:underline"
                  >
                    disposable vapes
                  </Link>
                  ,{" "}
                  <Link
                    href="/collections/category/refill-vapes"
                    className="font-semibold text-[#D4AF37] underline-offset-4 hover:underline"
                  >
                    refillable pod systems
                  </Link>
                  ,{" "}
                  <Link
                    href="/collections/category/e-liquid"
                    className="font-semibold text-[#D4AF37] underline-offset-4 hover:underline"
                  >
                    e-liquids and nicotine salts
                  </Link>
                  , and{" "}
                  <Link
                    href="/collections/category/vape-accessories"
                    className="font-semibold text-[#D4AF37] underline-offset-4 hover:underline"
                  >
                    vape accessories
                  </Link>
                  .
                </p>
              </div>

              <Link
                href="/collections"
                className="inline-flex items-center justify-center rounded-full bg-[#D4AF37] px-6 py-4 text-[11px] font-black uppercase tracking-[0.28em] text-black transition-colors hover:bg-[#c9a432]"
              >
                Open Catalog
              </Link>
            </div>
          </div>
        </div>

        <section className="bg-[#050505]" id="about" aria-label="About CigarroElectrico">
          <HeritageSection />
        </section>

        <footer className="bg-black border-t border-white/5">
          <Footer />
        </footer>
      </div>

      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #050505;
        }
        ::-webkit-scrollbar-thumb {
          background: #222;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #d4af37;
        }
      `}</style>
    </div>
  );
};

export default Home;
