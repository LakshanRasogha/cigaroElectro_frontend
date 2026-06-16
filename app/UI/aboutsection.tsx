import React from "react";
import Link from "next/link";
import { ShieldCheck, Zap, ChevronRight } from "lucide-react";
import { staticAssets } from "@/app/lib/assets";

/**
 * Heritage / About section.
 * This is a SERVER COMPONENT — no client JS needed.
 * The CTA is a plain <Link> (prefetches on hover, no useRouter overhead).
 */
const HeritageSection = () => {
  const partners = [
    "Elfbar",
    "Vozol",
    "Voltbar",
    "Lost Mary",
    "Nasty",
    "Tkyo",
    "GeekVape",
    "Caliburn",
  ];

  return (
    <section className='relative py-10 md:py-14 bg-[#050505] overflow-hidden' id='about'>
      {/* Ambient Gold Background Glows */}
      <div className='absolute top-1/4 left-0 w-96 h-96 bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none' />
      <div className='absolute bottom-1/4 right-0 w-96 h-96 bg-[#AA771C]/5 blur-[120px] rounded-full pointer-events-none' />

      <div className='max-w-7xl mx-auto px-4 md:px-6 flex flex-col lg:flex-row items-center gap-8 lg:gap-10 relative z-10'>
        {/* --- Video Card Side --- */}
        <div className='lg:w-1/2 relative group'>
          {/* Top-Left Gold Accent */}
          <div className='hidden sm:block absolute -top-6 -left-6 w-32 h-32 border-t-2 border-l-2 border-[#D4AF37] rounded-tl-[3rem] z-20 group-hover:-translate-x-2 group-hover:-translate-y-2 transition-all duration-700 shadow-[0_0_25px_rgba(212,175,55,0.4)]' />

          {/* The Live Video Container */}
          <div className='relative z-10 overflow-hidden rounded-2xl sm:rounded-[3rem] border-4 border-white/5 bg-zinc-900 shadow-2xl aspect-[3/4] lg:aspect-auto lg:h-[680px]'>
            <video
              autoPlay
              loop
              muted
              playsInline
              preload='metadata'
              poster={staticAssets.poster}
              crossOrigin="anonymous"
              className='w-full h-full object-cover opacity-80'
            >
              <source src={staticAssets.aboutVideo} type='video/mp4' />
            </video>

            {/* Inner Video Overlays */}
            <div className='absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 opacity-60' />

            {/* Play/Live Indicator */}
            <div className='absolute bottom-10 left-10 flex items-center gap-3'>
              <div className='w-3 h-3 bg-[#D4AF37] rounded-full animate-pulse shadow-[0_0_10px_rgba(212,175,55,1)]' />
              <span className='text-[10px] font-black uppercase tracking-[0.3em] text-white/70'>
                Live Heritage Feed
              </span>
            </div>
          </div>

          {/* Bottom-Right Gold Accent */}
          <div className='hidden sm:block absolute -bottom-6 -right-6 w-32 h-32 border-b-2 border-r-2 border-[#D4AF37]/50 rounded-br-[3rem] z-20 group-hover:translate-x-2 group-hover:translate-y-2 transition-all duration-700 shadow-[0_0_25px_rgba(212,175,55,0.2)]' />
        </div>

        {/* --- Content Side --- */}
        <div className='lg:w-1/2'>
          <div>
            <div className='flex items-center gap-6 mb-5'>
              <span className='h-[1px] w-16 bg-gradient-to-r from-[#D4AF37] to-transparent'></span>
              <span className='text-[#D4AF37] uppercase tracking-[0.5em] text-[10px] font-black block'>
                Established 2012
              </span>
            </div>

            <h2 className='text-2xl md:text-3xl font-black mb-6 leading-[0.85] text-white tracking-tighter uppercase'>
              <span
                className='text-[#D4AF37]'
                style={{ fontFamily: "var(--font-cormorant-garamond), serif" }}
              >
                Future Aesthetic.
              </span>
            </h2>

            <p className='text-zinc-200 mb-6 text-md leading-relaxed font-light border-l-2 border-[#D4AF37]/20 pl-10 max-w-xl'>
              <span className='text-[#D4AF37] font-medium'>
                CigarroEléctrico
              </span>{" "}
              remains the island&apos;s pioneer in high-tech vapor design. We
              curate an ecosystem where{" "}
              <span className='text-[#D4AF37] font-medium'>
                luxury meets craftsmanship
              </span>
            </p>

            {/* Feature Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8'>
              {/* Card 1 */}
              <div className='p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-[#D4AF37]/30 transition-all group/card'>
                <div className='w-14 h-14 rounded-2xl bg-black border border-white/10 flex items-center justify-center mb-6 group-hover/card:bg-[#D4AF37] group-hover/card:text-black transition-all duration-500 shadow-inner'>
                  <ShieldCheck className='h-7 w-7 text-[#D4AF37] group-hover/card:text-black' />
                </div>
                <h3 className='font-bold text-xs uppercase tracking-[0.2em] mb-3 text-white'>
                  Pure Verity
                </h3>
                <p className='text-[11px] text-zinc-500 leading-relaxed font-medium group-hover/card:text-zinc-300'>
                  Encrypted serial verification on every device drop.
                </p>
              </div>

              {/* Card 2 */}
              <div className='p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-[#D4AF37]/30 transition-all group/card'>
                <div className='w-14 h-14 rounded-2xl bg-black border border-white/10 flex items-center justify-center mb-6 group-hover/card:bg-[#D4AF37] group-hover/card:text-black transition-all duration-500 shadow-inner'>
                  <Zap className='h-7 w-7 text-[#D4AF37] group-hover/card:text-black' />
                </div>
                <h3 className='font-bold text-xs uppercase tracking-[0.2em] mb-3 text-white'>
                  Pulse Tech
                </h3>
                <p className='text-[11px] text-zinc-500 leading-relaxed font-medium group-hover/card:text-zinc-300'>
                  Instant-fire ignition and sub-ohm precision control.
                </p>
              </div>
            </div>

            <div className='mb-8'>
              <div className='flex items-center gap-4 mb-6'>
                <span className='h-[1px] w-12 bg-gradient-to-r from-[#D4AF37] to-transparent' />
                <span className='text-[#D4AF37] uppercase tracking-[0.35em] text-[10px] font-black'>
                  Partner Network
                </span>
              </div>

              <div className='flex flex-wrap gap-3 max-w-2xl'>
                {partners.map((partner) => (
                  <div
                    key={partner}
                    className='rounded-full border border-[#D4AF37]/20 bg-white/[0.03] px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-200 transition-colors hover:border-[#D4AF37]/40 hover:text-[#D4AF37]'
                  >
                    {partner}
                  </div>
                ))}
              </div>
            </div>

            {/* Primary Action Button */}
            <div className='flex flex-col sm:flex-row gap-6 items-start sm:items-center'>
              <Link
                href='/about'
                className='group relative bg-[#D4AF37] text-black px-5 py-2.5 rounded-full overflow-hidden font-bold uppercase text-[10px] tracking-[0.25em] transition-all shadow-[0_10px_25px_rgba(212,175,55,0.25)] inline-flex items-center gap-3'
              >
                <span className='relative z-10 flex items-center gap-3'>
                  About Cigarro{" "}
                  <ChevronRight className='h-3.5 w-3.5 transition-transform group-hover:translate-x-1.5' />
                </span>
                <div className='absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out' />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decorative Grid Overlay */}
      <div className='absolute inset-0 bg-[linear-gradient(to_right,#D4AF3708_1px,transparent_1px),linear-gradient(to_bottom,#D4AF3708_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none' />
    </section>
  );
};

export default HeritageSection;
