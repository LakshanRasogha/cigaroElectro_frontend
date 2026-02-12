'use client';
import React, { useEffect, useState, useRef } from 'react';
import { ShoppingCart, Menu, Mail, MapPin, Phone, CheckCircle2, Facebook, Instagram, Twitter, ExternalLink, ChevronRight } from 'lucide-react';
import Footer from '../componenets/footer';
import Navbar from '../componenets/navbar';
import Headers from '../componenets/header';
import TrustSection from '../UI/trustsection';
import ShopSection from '../UI/shopsection';
import HeritageSection from '../UI/aboutsection';

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    // Load GSAP scripts dynamically to avoid resolution errors in the preview environment
    const loadScripts = async () => {
      const loadScript = (src) => {
        return new Promise((resolve, reject) => {
          if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
          }
          const script = document.createElement('script');
          script.src = src;
          script.async = true;
          script.onload = resolve;
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
    if (!isLoaded || !window.gsap) return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Initial Nav Entrance
      gsap.from(navRef.current, {
        y: -100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out"
      });

      // 2. Hero Text Animation
      const heroTl = gsap.timeline();
      heroTl.from(".hero-line", {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out",
        delay: 0.5
      })
      .from(".hero-btn", {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)"
      }, "-=0.5");

      // 3. Section Reveal Animations
      const sections = gsap.utils.toArray('.reveal-section');
      sections.forEach((section) => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none none"
          },
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power3.out"
        });
      });

      // 4. Staggered Card Animation
      gsap.from(".product-card-anim", {
        scrollTrigger: {
          trigger: ".products-grid",
          start: "top 80%"
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out"
      });

      // 5. Gold Line Growth
      gsap.from(".gold-line", {
        scrollTrigger: {
          trigger: ".gold-line",
          start: "top 90%"
        },
        width: 0,
        duration: 1.5,
        ease: "expo.out"
      });

      // 6. Parallax effect for hero image
      gsap.to(".hero-bg-parallax", {
        scrollTrigger: {
          trigger: "header",
          start: "top top",
          end: "bottom top",
          scrub: true
        },
        y: 150,
        ease: "none"
      });

    }, containerRef);

    return () => ctx.revert();
  }, [isLoaded]);

  return (
    <div ref={containerRef} className="bg-[#0a0a0a] text-white selection:bg-[#D4AF37] selection:text-black min-h-screen">
      
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Headers />

      {/* Features Staggered */}
      <section className=" bg-[#0a0a0a] border-y border-white/5 reveal-section">
        <TrustSection />
      </section>

      {/* Latest Products */}
      <section className="max-w-7xl mx-auto px-4 reveal-section" id="shop">
        <ShopSection />
      </section>

      {/* About Section */}
      <section className=" bg-zinc-950 reveal-section" id="about">
        <HeritageSection />
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-[#D4AF37] text-black overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-bold font-serif leading-none mb-4">Join the Inner Circle</h2>
            <p className="font-bold uppercase tracking-widest text-xs opacity-80">Get exclusive access to new drops and limited editions.</p>
          </div>
          <div className="flex w-full md:w-auto gap-3 bg-black/5 p-2 rounded-full border border-black/10">
            <input 
              type="email" 
              placeholder="Your premium email" 
              className="bg-transparent px-8 py-4 flex-grow md:w-80 placeholder:text-black/40 focus:outline-none font-bold"
            />
            <button className="bg-black text-white px-10 py-4 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-zinc-800 transition-all whitespace-nowrap">
              Subscribe Now
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default App;
