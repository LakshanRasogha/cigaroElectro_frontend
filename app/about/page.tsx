"use client";

import React, { useLayoutEffect, useRef } from 'react';
import { ShieldCheck, Zap, Globe, ArrowRight, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '../componenets/footer';
import Navbar from '../componenets/navbar';

// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

const AboutPage = () => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const heroRef = useRef(null);
  const storyRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero Entrance Animation
      gsap.from(".hero-content", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.2
      });

      // 2. Cinematic Image Expand Animation (Matches Video Reference)
      // The image starts scaled down and expands as it enters the viewport center
      gsap.fromTo(imageRef.current, 
        { scale: 0.8, borderRadius: "100px", opacity: 0.5 },
        { 
          scale: 1, 
          borderRadius: "40px", 
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: imageRef.current,
            start: "top bottom", // Animation starts when image top hits viewport bottom
            end: "center center", // Ends when image center hits viewport center
            scrub: 1, // Smoothly ties animation to scroll progress
          }
        }
      );

      // 3. Story Text Reveal (Staggered Blur)
      gsap.from(".story-reveal", {
        x: -50,
        opacity: 0,
        filter: "blur(10px)",
        stagger: 0.3,
        scrollTrigger: {
          trigger: ".story-reveal",
          start: "top 80%",
        }
      });

      // 4. Pillar Cards Hover-like Entrance
      gsap.from(".pillar-card", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".pillars-grid",
          start: "top 75%",
        }
      });
    }, containerRef);

    return () => ctx.revert(); // Cleanup GSAP context on unmount
  }, []);

  return (
    <div ref={containerRef} className="bg-[#FFFFFF] text-slate-900 min-h-screen selection:bg-cyan-200 selection:text-cyan-900 overflow-x-hidden">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section ref={heroRef} className="relative h-[90vh] flex flex-col items-center justify-center text-center px-6">
        <div className="hero-content mb-8 p-3 bg-gradient-to-tr from-purple-500 to-cyan-400 rounded-2xl rotate-3 shadow-xl">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        
        <span className="hero-content text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-500 font-mono font-bold uppercase text-xs mb-6 tracking-[0.4em]">
          Established 2012 • Sri Lanka
        </span>
        
        <h1 className="hero-content text-6xl md:text-9xl font-serif font-black mb-8 text-slate-900 tracking-tighter leading-[0.9]">
          Elevated <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 italic px-2">
            Discovery.
          </span>
        </h1>

        <p className="hero-content max-w-2xl text-slate-500 text-xl font-medium leading-relaxed">
          Merging artisanal precision with the vibrant energy of the future. 
          We define the benchmark for hardware excellence.
        </p>
      </section>

      {/* --- CINEMATIC EXPANDING IMAGE --- */}
      <section className="px-6 py-20 overflow-hidden">
        <div 
          ref={imageRef} 
          className="max-w-7xl mx-auto h-[600px] rounded-[3rem] bg-slate-200 overflow-hidden shadow-2xl relative"
        >
          <img 
            src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2000" 
            alt="Product Focus"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-12">
            <h3 className="text-white text-4xl font-black uppercase tracking-tighter">Pure Hardware Drop.</h3>
          </div>
        </div>
      </section>

      {/* --- STORY SECTION --- */}
      <section ref={storyRef} className="py-32 px-6 max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="story-reveal text-5xl font-black text-slate-900">The Neon <br/>Heritage</h2>
            <div className="story-reveal w-20 h-2 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full" />
            <p className="story-reveal text-slate-600 text-lg leading-loose">
              Born in the tropical heart of Sri Lanka, Cigaro Electrio began as a defiant stand against the ordinary. We believe technology should be an extension of your lifestyle.
            </p>
            <button className="story-reveal flex items-center gap-4 px-8 py-4 bg-slate-900 text-white rounded-full font-bold shadow-2xl transition-all hover:bg-indigo-600">
              Explore Our Timeline <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative aspect-[4/5] rounded-[2rem] bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center shadow-inner">
              <div className="text-center">
                 <span className="block text-9xl font-black text-slate-200">12</span>
                 <span className="text-purple-600 font-mono font-black uppercase tracking-[0.2em]">Years of Precision</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PILLARS GRID --- */}
      <section className="py-32 bg-slate-50/50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center mb-20">
          <h2 className="text-4xl font-black mb-4 uppercase tracking-widest text-slate-400">Our Core Pillars</h2>
        </div>
        <div className="pillars-grid max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-10">
            <PillarCard 
              icon={<ShieldCheck className="w-10 h-10 text-blue-500" />}
              title="Certified"
              accent="bg-blue-500"
              desc="100% Brand Guarantee with encrypted serial verification on every hardware drop."
            />
            <PillarCard 
              icon={<Zap className="w-10 h-10 text-purple-500" />}
              title="Pulse Tech"
              accent="bg-purple-500"
              desc="Instant-fire ignition and sub-ohm precision control calibrated for artisanal flavor."
            />
            <PillarCard 
              icon={<Globe className="w-10 h-10 text-cyan-500" />}
              title="Priority"
              accent="bg-cyan-500"
              desc="Concierge-level shipping across Sri Lanka delivered within 24 hours."
            />
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-60 text-center relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-7xl md:text-9xl font-black mb-12 tracking-tighter">Live in <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 italic px-4">Color.</span></h2>
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-16 py-8 rounded-3xl font-black text-xl tracking-widest uppercase transition-transform hover:scale-110 active:scale-95 shadow-[0_20px_50px_rgba(168,85,247,0.3)]">
            Initialize Discovery
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

/* --- SUB-COMPONENT --- */
const PillarCard = ({ icon, title, desc, accent }: { icon: React.ReactNode, title: string, desc: string, accent: string }) => (
  <div className="pillar-card p-12 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_10px_50px_rgba(0,0,0,0.04)] hover:shadow-2xl transition-all duration-500 text-center flex flex-col items-center">
    <div className="mb-8 p-5 rounded-2xl bg-slate-50 shadow-inner group-hover:scale-110 transition-transform">
        {icon}
    </div>
    <h3 className="text-2xl font-black mb-4 text-slate-900 uppercase tracking-tight">{title}</h3>
    <div className={`w-8 h-1 ${accent} mb-6 rounded-full`} />
    <p className="text-slate-500 leading-relaxed font-medium">{desc}</p>
  </div>
);

export default AboutPage;