'use client';
import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

// Importing your separated components
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
      // Nav Entrance
      gsap.from(".navbar-anim", {
        y: -100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.2,
      });

      // Floating Gold Orbs
      gsap.to(".gold-orb", {
        y: "random(-100, 100)",
        x: "random(-50, 50)",
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.8
      });

      // Section Reveal
      const sections = gsap.utils.toArray('.reveal-section');
      sections.forEach((section: any) => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: "top 90%",
            toggleActions: "play none none none"
          },
          y: 60,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out"
        });
      });

      // Parallax
      gsap.to(".parallax-orb", {
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 2
        },
        y: (i: number, target: any) => target.dataset.speed * 150,
        ease: "none"
      });

    }, containerRef);

    return () => ctx.revert();
  }, [isLoaded]);

  return (
    <div 
      ref={containerRef} 
      className="bg-[#050505] text-white selection:bg-[#D4AF37] selection:text-black min-h-screen relative overflow-x-hidden font-sans"
    >
      {/* --- FIXED NAVBAR FIX --- */}
      <div className="navbar-anim fixed top-0 left-0 right-0 z-[100]">
        <Navbar />
      </div>

      {/* --- Ambient Luxury Gold Background Elements --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div data-speed="1.2" className="gold-orb parallax-orb absolute top-[-10%] left-[-5%] w-[800px] h-[800px] bg-[#D4AF37]/5 blur-[150px] rounded-full" />
        <div data-speed="-0.8" className="gold-orb parallax-orb absolute top-[30%] right-[-10%] w-[700px] h-[700px] bg-[#AA771C]/5 blur-[130px] rounded-full" />
        <div data-speed="1.5" className="gold-orb parallax-orb absolute bottom-[5%] left-[-5%] w-[600px] h-[600px] bg-[#D4AF37]/3 blur-[120px] rounded-full" />
      </div>

      {/* Main Content Wrap */}
      <div className="relative z-10">
        {/* Hero Section - Added pt-20 to prevent overlap with the fixed navbar */}
        <header className="relative pt-20">
          <Headers />
        </header>

        {/* Trust/Features Section */}
        <section className="reveal-section relative py-20">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md -z-10" />
          <TrustSection />
        </section>

        {/* Shop Section */}
        <section className="reveal-section bg-[#050505]" id="shop">
          <ShopSection />
        </section>

        {/* Heritage Section */}
        <section className="reveal-section bg-gradient-to-b from-[#050505] via-zinc-900/20 to-[#050505]" id="about">
          <HeritageSection />
        </section>

        {/* Newsletter Section */}
        <section className="reveal-section py-20">
          <NewsletterSection />
        </section>

        {/* 3D Partner Ring */}
        <section className="reveal-section relative py-32 overflow-visible">
          <LogoRing />
        </section>

        {/* Footer */}
        <footer className="bg-black border-t border-white/5">
          <Footer />
        </footer>
      </div>

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        @keyframes gold-shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-gold {
          background-size: 200% 200%;
          animation: gold-shimmer 12s ease infinite;
        }

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
          background: #D4AF37;
        }
      `}</style>
    </div>
  );
};

export default Home;