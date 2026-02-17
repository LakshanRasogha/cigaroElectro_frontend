"use client";

import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { ShieldCheck, Zap, Globe, ArrowRight, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import Footer from '../componenets/footer';
import Navbar from '../componenets/navbar';

// Register GSAP Plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Hook to prevent useLayoutEffect warnings on SSR
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const AboutPage = () => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // 1. Hero Entrance: Smooth stagger with expo ease
      gsap.from(".hero-content", {
        y: 100,
        opacity: 0,
        scale: 0.9,
        filter: "blur(20px)",
        duration: 1.5,
        stagger: 0.1,
        ease: "expo.out",
      });

      // 2. Hardware Expand: Cinematic scroll-bound scale
      gsap.fromTo(imageRef.current, 
        { scale: 0.8, borderRadius: "100px", opacity: 0.3 },
        { 
          scale: 1, 
          borderRadius: "48px", 
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: imageRef.current,
            start: "top bottom",
            end: "center center",
            scrub: 1.5,
          }
        }
      );

      // 3. Story Reveal: Subtle slide with blur
      gsap.from(".story-reveal", {
        opacity: 0,
        x: -30,
        filter: "blur(10px)",
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: ".story-reveal",
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      });

      // 4. Pillars Grid: Staggered entrance
      gsap.from(".pillar-card", {
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".pillar-grid-container",
          start: "top 80%",
        }
      });

      // 5. Parallax Background Glows
      gsap.to(".floating-glow", {
        y: -150,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-[#020617] text-white min-h-screen selection:bg-indigo-500/30 overflow-x-hidden">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="floating-glow absolute top-1/4 -left-20 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="floating-glow absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-cyan-600/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="hero-content mb-10 p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
          <Sparkles className="w-8 h-8 text-indigo-400" />
        </div>
        
        <span className="hero-content text-indigo-400 font-black uppercase text-[10px] mb-8 tracking-[0.6em]">
          Est. MMXXII • The Archipelago
        </span>
        
        <h1 className="hero-content text-6xl md:text-[10rem] font-black mb-10 text-white tracking-tighter leading-[0.85]">
          ENGINEERED <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 italic">
            PURITY.
          </span>
        </h1>

        <p className="hero-content max-w-2xl text-zinc-400 text-lg md:text-2xl font-light leading-relaxed">
          Where high-fidelity tech meets sensory perfection. 
          We don&apos;t just curate hardware; we craft the standard.
        </p>
      </section>

      {/* --- CINEMATIC EXPANDING HARDWARE --- */}
      <section className="px-6 py-20 relative z-10">
        <div 
          ref={imageRef} 
          className="max-w-7xl mx-auto h-[500px] md:h-[700px] rounded-[3rem] bg-zinc-900 overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)] border border-white/5 relative group"
        >
          <img 
            src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2000" 
            alt="Hardware Core"
            className="w-full h-full object-cover opacity-60 transition-transform duration-[3s] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex items-end p-8 md:p-16">
            <div>
                <p className="text-indigo-400 font-black text-xs uppercase tracking-[0.4em] mb-4">Inside the Carbon Series</p>
                <h3 className="text-white text-5xl md:text-7xl font-black uppercase tracking-tighter">THE CORE DROP.</h3>
            </div>
          </div>
        </div>
      </section>

      {/* --- STORY SECTION --- */}
      <section className="py-40 px-6 max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <h2 className="story-reveal text-6xl md:text-8xl font-black text-white tracking-tighter leading-none">The Neon <br/><span className="text-zinc-600">Heritage</span></h2>
            <div className="story-reveal w-32 h-[1px] bg-indigo-500" />
            <p className="story-reveal text-zinc-400 text-xl leading-relaxed font-light">
              Born in the tropical heart of Sri Lanka, Cigaro Electrio began as a defiant stand against the ordinary. 
              We believe technology is more than a tool—it is a sensory statement.
            </p>
            <motion.button 
              whileHover={{ x: 10 }}
              className="story-reveal flex items-center gap-6 text-white group"
            >
              <span className="font-bold uppercase tracking-widest text-xs">Explore Our Timeline</span>
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                <ArrowRight className="w-5 h-5" />
              </div>
            </motion.button>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-10 bg-indigo-500/20 rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative aspect-square rounded-[4rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl overflow-hidden flex items-center justify-center shadow-2xl">
              <div className="text-center">
                 <span className="block text-[10rem] md:text-[14rem] font-black text-white/5 leading-none">12</span>
                 <span className="text-indigo-400 font-black uppercase tracking-[0.4em] text-xs">Years of precision</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PILLARS GRID --- */}
      <section className="py-40 relative z-10">
        <div className="max-w-7xl mx-auto px-6 mb-24">
          <h2 className="text-[10px] font-black uppercase tracking-[0.8em] text-zinc-600 mb-4">Foundational Virtues</h2>
          <div className="h-[1px] w-full bg-white/5" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 pillar-grid-container">
          <div className="grid md:grid-cols-3 gap-8">
            <PillarCard 
              icon={<ShieldCheck className="w-10 h-10 text-indigo-400" />}
              title="Verified"
              desc="Encrypted serial verification on every hardware drop. We guarantee authenticity where others hide behind clones."
            />
            <PillarCard 
              icon={<Zap className="w-10 h-10 text-cyan-400" />}
              title="Pulse Fire"
              desc="Sub-ohm precision and instant ignition tech. Calibrated for the purist who values every note of flavor."
            />
            <PillarCard 
              icon={<Globe className="w-10 h-10 text-purple-400" />}
              title="Terminal"
              desc="Priority islandwide logistics. Your hardware arrives in bespoke insulated packaging within the 24-hour cycle."
            />
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-40 md:py-60 text-center relative overflow-hidden bg-white text-black">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
        <div className="relative z-10 px-6">
          <h2 className="text-6xl md:text-[14rem] font-black mb-16 tracking-tighter leading-none">Live in <br/><span className="italic">Color.</span></h2>
          <button className="bg-black text-white px-12 md:px-20 py-6 md:py-8 rounded-full font-black text-[10px] md:text-xs tracking-[0.4em] uppercase transition-all hover:scale-105 active:scale-95 shadow-2xl">
            Initialize Discovery
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const PillarCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="pillar-card group p-10 md:p-12 rounded-[3.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-md hover:bg-white/[0.05] hover:border-white/10 transition-all duration-700">
    <div className="mb-10 w-20 h-20 rounded-3xl bg-zinc-950 flex items-center justify-center border border-white/5 group-hover:border-indigo-500/50 transition-all duration-500">
        {icon}
    </div>
    <h3 className="text-3xl font-bold mb-6 text-white tracking-tight">{title}</h3>
    <p className="text-zinc-500 leading-relaxed font-light text-lg">{desc}</p>
    <div className="mt-10 h-[2px] w-0 bg-indigo-500 group-hover:w-full transition-all duration-700" />
  </div>
);

export default AboutPage;