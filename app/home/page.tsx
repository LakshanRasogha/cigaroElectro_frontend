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
import NewsletterSection from '../UI/newsletter';
import LogoRing from '../componenets/logo_rings';

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
        <section className="reveal-section relative ">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-sm -z-10" />
          <TrustSection />
        </section>

        {/* Shop/Latest Selections - Pure White Background for Contrast */}
        <section className="reveal-section  bg-white shadow-[0_-20px_50px_rgba(0,0,0,0.02)]" id="shop">
          <ShopSection />
        </section>

        {/* Heritage/About Section - Subtle Gradient Transition */}
        <section className="reveal-section bg-gradient-to-b from-white via-indigo-50/30 to-white" id="about">
          <HeritageSection />
        </section>

        {/* Newsletter Section: Vibrant High-Contrast Neon Gradient */}
        <section className="reveal-section">
         <NewsletterSection />
        </section>

        <div className='relative'>
          <LogoRing />
        </div>

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