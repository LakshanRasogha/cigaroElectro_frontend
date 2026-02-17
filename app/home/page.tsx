'use client';
import React, { useEffect, useState, useRef } from 'react';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';

// Importing your separated components
// Note: Ensure your component folders are named correctly (componenets vs components)
import Footer from '../componenets/footer';
import Navbar from '../componenets/navbar';
import Headers from '../componenets/header';
import TrustSection from '../UI/trustsection';
import ShopSection from '../UI/shopsection';
import HeritageSection from '../UI/aboutsection';

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Dynamic Script Loading for GSAP
    const loadScripts = async () => {
      const loadScript = (src: string) => {
        return new Promise<void>((resolve, reject) => {
          if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
          }
          const script = document.createElement('script');
          script.src = src;
          script.async = true;
          script.onload = () => resolve();
          script.onerror = reject;
          document.head.appendChild(script);
        });
      };

      try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js');
        setIsLoaded(true);
      } catch (err) {
        console.error("Failed to load GSAP scripts", err);
      }
    };

    loadScripts();
  }, []);

  useEffect(() => {
    if (!isLoaded || !(window as any).gsap) return;

    const gsap = (window as any).gsap;
    const ScrollTrigger = (window as any).ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 2. Initial Nav Entrance
      gsap.from(".navbar-anim", {
        y: -100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out"
      });

      // 3. Floating Neon Orbs Animation (Increased movement for Light Mode)
      gsap.to(".neon-orb", {
        y: "random(-80, 80)",
        x: "random(-40, 40)",
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.5
      });

      // 4. Section Reveal Animations
      const sections = gsap.utils.toArray('.reveal-section');
      sections.forEach((section: any) => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none none"
          },
          y: 40,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out"
        });
      });

      // 5. Parallax for background orbs
      gsap.to(".parallax-orb", {
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5
        },
        y: (i: number, target: any) => target.dataset.speed * 100,
        ease: "none"
      });

    }, containerRef);

    return () => ctx.revert();
  }, [isLoaded]);

  return (
    <div 
      ref={containerRef} 
      className="bg-[#fafafa] text-zinc-900 selection:bg-[#00f2ff] selection:text-black min-h-screen relative overflow-x-hidden font-sans"
    >
      <Navbar />
      
      {/* --- Ambient Colorful Neon Background Elements --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Soft Cyan Glow */}
        <div data-speed="2" className="neon-orb parallax-orb absolute top-[-5%] left-[-10%] w-[700px] h-[700px] bg-cyan-300/20 blur-[130px] rounded-full" />
        {/* Vibrant Pink Glow */}
        <div data-speed="-1" className="neon-orb parallax-orb absolute top-[20%] right-[-5%] w-[600px] h-[600px] bg-fuchsia-400/15 blur-[120px] rounded-full" />
        {/* Electric Indigo Glow */}
        <div data-speed="1.5" className="neon-orb parallax-orb absolute bottom-[10%] left-[5%] w-[500px] h-[500px] bg-indigo-400/20 blur-[110px] rounded-full" />
        {/* Lime Punch Glow */}
        <div data-speed="-2" className="neon-orb parallax-orb absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-lime-300/10 blur-[100px] rounded-full" />
      </div>

      {/* Main Content Wrap */}
      <div className="relative z-10">
        
        {/* Navigation - Glassmorphism style for Light Mode */}
        <div className="navbar-anim sticky top-0 z-[100] bg-white/60 backdrop-blur-xl border-b border-zinc-200/50">
          
        </div>

        {/* Hero Section */}
        <div className="relative">
          <Headers />
        </div>

        {/* Trust/Features Section */}
        <section className="reveal-section relative py-12">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-sm -z-10" />
          <TrustSection />
        </section>

        {/* Shop/Latest Selections - Pure White Background for Contrast */}
        <section className="reveal-section py-24 bg-white shadow-[0_-20px_50px_rgba(0,0,0,0.02)]" id="shop">
          <ShopSection />
        </section>

        {/* Heritage/About Section - Subtle Gradient Transition */}
        <section className="reveal-section bg-gradient-to-b from-white via-indigo-50/30 to-white py-20" id="about">
          <HeritageSection />
        </section>

        {/* Newsletter Section: Vibrant High-Contrast Neon Gradient */}
        <section className="px-4 py-24 reveal-section">
          <div className="max-w-6xl mx-auto overflow-hidden relative rounded-[2rem] shadow-2xl shadow-indigo-200">
            {/* Multi-color Neon Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1] via-[#a855f7] to-[#ec4899] animate-gradient-xy"></div>
            
            {/* Decorative Static Grain/Noise overlay */}
            <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            <div className="px-8 py-16 md:px-16 md:py-20 flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
              <div className="text-center lg:text-left text-white">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-6">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                    <Zap size={18} className="text-yellow-300 fill-yellow-300" />
                  </div>
                  <span className="font-bold uppercase tracking-[0.2em] text-xs">V.I.P Hub</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-extrabold leading-[1.1] mb-6 tracking-tight">
                  Unlock the <br/> Neon Archive
                </h2>
                <p className="font-medium text-white/80 max-w-md text-lg">
                  Join 5,000+ enthusiasts receiving weekly drops of exotic hardware and premium blends.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4 p-3 bg-white/10 rounded-3xl backdrop-blur-2xl border border-white/20 shadow-2xl">
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  className="bg-white/10 px-6 py-4 rounded-2xl flex-grow lg:w-80 placeholder:text-white/60 focus:outline-none focus:bg-white/20 transition-all font-semibold text-white border border-transparent focus:border-white/30"
                />
                <button className="group bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold uppercase text-xs tracking-widest hover:bg-zinc-900 hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
                  Join Now
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="bg-white border-t border-zinc-100">
          <Footer />
        </div>
      </div>

      <style jsx global>{`
        @keyframes gradient-xy {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-xy {
          background-size: 200% 200%;
          animation: gradient-xy 15s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;