"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Standardizing component imports
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import Headers from "../components/header";
import LogoRing from "../components/logo_rings";

// UI Sections
import ShopSection from "../UI/shopsection";
import HeritageSection from "../UI/aboutsection";
import TshirtSection from "../UI/tshirtsection";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const Home = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Nav Entrance
      gsap.from(".navbar-anim", {
        y: -100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.2,
      });

      // 2. Floating Gold Orbs
      gsap.to(".gold-orb", {
        y: "random(-100, 100)",
        x: "random(-50, 50)",
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.8,
      });

      // 3. Section Reveal (Updated for tighter layout)
      const sections = gsap.utils.toArray(".reveal-section");
      sections.forEach((section: any) => {
        gsap.fromTo(
          section,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      // 4. Parallax
      gsap.to(".parallax-orb", {
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 2,
        },
        y: (i, target) => {
          const speed = parseFloat(target.dataset.speed || "1");
          return speed * 150;
        },
        ease: "none",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className='bg-[#050505] text-white selection:bg-[#D4AF37] selection:text-black min-h-screen relative overflow-x-hidden font-sans'
    >
      {/* --- FIXED NAVBAR --- */}
      <div className='navbar-anim fixed top-0 left-0 right-0 z-[100]'>
        <Navbar />
      </div>

      {/* --- Ambient Luxury Gold Background Elements --- */}
      <div className='fixed inset-0 pointer-events-none z-0'>
        <div
          data-speed='1.2'
          className='gold-orb parallax-orb absolute top-[-10%] left-[-5%] w-[800px] h-[800px] bg-[#D4AF37]/5 blur-[150px] rounded-full'
        />
        <div
          data-speed='-0.8'
          className='gold-orb parallax-orb absolute top-[30%] right-[-10%] w-[700px] h-[700px] bg-[#AA771C]/5 blur-[130px] rounded-full'
        />
        <div
          data-speed='1.5'
          className='gold-orb parallax-orb absolute bottom-[5%] left-[-5%] w-[600px] h-[600px] bg-[#D4AF37]/3 blur-[120px] rounded-full'
        />
      </div>

      {/* --- Main Content Wrap --- */}
      <div className='relative z-10'>
        <header className='relative'>
          <Headers />
        </header>

        {/* Shop Section */}
        {/* Removed padding, keeping background consistent */}
        <section className='reveal-section bg-[#050505]' id='shop'>
          <ShopSection />
        </section>

        {/* T-Shirt Section */}
        {/* Removed 'py-20', added bg color to match previous section seamlessly */}
        <section className='reveal-section bg-[#050505]'>
          <TshirtSection />
        </section>

        {/* Heritage Section */}
        {/* Removed specific gradients that might cause visual breaks, ensuring seamless flow */}
        <section className='reveal-section bg-[#050505]' id='about'>
          <HeritageSection />
        </section>

        {/* 3D Partner Ring */}
        {/* Removed 'py-32', reduced to minimal padding just for the 3D element safety */}
        <section className='reveal-section relative py-10 overflow-visible bg-[#050505]'>
          <LogoRing />
        </section>

        {/* Footer */}
        <footer className='bg-black border-t border-white/5'>
          <Footer />
        </footer>
      </div>

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        @keyframes gold-shimmer {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
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
          background: #d4af37;
        }
      `}</style>
    </div>
  );
};

export default Home;
