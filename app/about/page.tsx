"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  Package,
  Truck,
  Phone,
  Mail,
  MapPin,
  Award,
  Gem,
  Star,
  Shirt,
  Cigarette,
  Battery,
  Droplet,
  Heart,
  ChevronRight,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const COMPANY_PHONE = "+94 77 123 4567";
const COMPANY_EMAIL = "concierge@cigarro.lk";
const COMPANY_ADDRESS = "Colombo, Sri Lanka";

const AboutPage = () => {
  const containerRef = useRef(null);
  const statsRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState("all");

  useIsomorphicLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".hero-title", {
        y: 40,
        opacity: 0,
        duration: 1.5,
        ease: "power4.out",
      });

      gsap.from(".hero-subtitle", {
        opacity: 0,
        duration: 1.2,
        delay: 0.5,
      });

      gsap.from(".stat-item", {
        y: 20,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 90%",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const categories = [
    {
      id: "devices",
      name: "Devices",
      icon: <Cigarette size={18} />,
      count: 24,
    },
    {
      id: "accessories",
      name: "Accessories",
      icon: <Battery size={18} />,
      count: 36,
    },
    { id: "eliquid", name: "E-Liquid", icon: <Droplet size={18} />, count: 48 },
    { id: "apparel", name: "Apparel", icon: <Shirt size={18} />, count: 18 },
  ];

  const features = [
    {
      icon: <Truck className='w-5 h-5' />,
      title: "TRUSTED DELIVERY",
      description:
        "Priority islandwide logistics with real-time tracking. Bespoke insulated packaging.",
      stats: "1000+ DELIVERIES",
    },
    {
      icon: <ShieldCheck className='w-5 h-5' />,
      title: "7+ YEARS EXCELLENCE",
      description:
        "Serving the Sri Lankan community since 2017 with authentic hardware.",
      stats: "EST. 2017",
    },
    {
      icon: <Phone className='w-5 h-5' />,
      title: "CONCIERGE SUPPORT",
      description:
        "Personal delivery coordination via your registered contact number.",
      stats: "24/7 TERMINAL",
    },
    {
      icon: <Gem className='w-5 h-5' />,
      title: "PREMIUM SELECTION",
      description:
        "Hand-selected collection meeting rigorous performance standards.",
      stats: "100% AUTHENTIC",
    },
  ];

  return (
    <div
      ref={containerRef}
      className='bg-[#030303] text-white min-h-screen selection:bg-[#D4AF37]/30 overflow-x-hidden font-sans'
    >
      <Navbar />

      {/* Hero Section */}
      <section className='relative min-h-[90vh] flex items-center justify-center px-6 overflow-hidden pt-20'>
        <div className='absolute inset-0 z-0 opacity-30'>
          <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_#1a1a1a_0%,_transparent_70%)]' />
        </div>

        <div className='relative z-10 max-w-5xl mx-auto text-center'>
          <motion.div
            className='hero-badge inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/5 rounded-full border border-[#D4AF37]/20 mb-6'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Sparkles className='w-3 h-3 text-[#D4AF37]' />
            <span className='text-[8px] font-bold uppercase tracking-[0.4em] text-[#D4AF37]'>
              The Apex of Vapor
            </span>
          </motion.div>

          <h1 className='hero-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-white tracking-[0.25em] leading-tight mb-8'>
            ENGINEERED FOR
            <br />
            <span className='text-[#D4AF37] italic opacity-90'>EXCELLENCE</span>
          </h1>

          <p className='hero-subtitle max-w-xl mx-auto text-[10px] sm:text-xs text-zinc-500 font-light tracking-[0.15em] leading-loose mb-10 uppercase'>
            Sri Lanka's premier destination for high-quality vaping hardware,
            accessories, and apparel. Seven years of trusted curation.
          </p>

          <div className='flex flex-col sm:flex-row items-center justify-center gap-6'>
            <Link
              href='/collections'
              className='group text-[9px] font-black uppercase tracking-[0.4em] text-[#D4AF37] flex items-center gap-2 border-b border-[#D4AF37]/20 pb-1 hover:border-[#D4AF37] transition-all'
            >
              Explore Collection
              <ArrowRight
                size={12}
                className='group-hover:translate-x-1 transition-transform'
              />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className='py-20 border-y border-white/5'>
        <div className='max-w-6xl mx-auto px-6'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-12'>
            {[
              { number: "07", label: "YEARS TRUST" },
              { number: "10K", label: "DELIVERIES" },
              { number: "100", label: "AUTHENTIC" },
              { number: "24H", label: "CONCIERGE" },
            ].map((stat, index) => (
              <div key={index} className='stat-item text-center'>
                <div className='text-2xl font-serif text-white tracking-widest mb-2'>
                  {stat.number}
                  <span className='text-[#D4AF37] text-sm'>+</span>
                </div>
                <div className='text-[8px] font-bold uppercase tracking-[0.3em] text-zinc-600'>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className='py-24 px-6'>
        <div className='max-w-6xl mx-auto'>
          <div className='grid md:grid-cols-2 gap-px bg-white/5 border border-white/5'>
            {features.map((feature, index) => (
              <div
                key={index}
                className='bg-[#030303] p-10 hover:bg-white/[0.02] transition-colors group'
              >
                <div className='text-[#D4AF37] mb-6 opacity-60 group-hover:opacity-100 transition-opacity'>
                  {feature.icon}
                </div>
                <h3 className='text-xs font-serif tracking-[0.3em] text-white mb-3'>
                  {feature.title}
                </h3>
                <p className='text-[9px] text-zinc-500 tracking-[0.1em] leading-relaxed mb-4 uppercase'>
                  {feature.description}
                </p>
                <div className='flex items-center gap-2 text-[#D4AF37]/40'>
                  <span className='text-[7px] font-bold tracking-[0.2em]'>
                    {feature.stats}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className='py-24 bg-white/[0.01]'>
        <div className='max-w-6xl mx-auto px-6'>
          <div className='flex flex-col md:flex-row justify-between items-end mb-12 gap-6'>
            <div>
              <span className='text-[#D4AF37] text-[8px] font-bold uppercase tracking-[0.4em]'>
                Curated
              </span>
              <h2 className='text-2xl font-serif tracking-widest text-white mt-2'>
                COLLECTIONS
              </h2>
            </div>
          </div>

          <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
            {categories.map((cat) => (
              <div
                key={cat.id}
                className='p-8 border border-white/5 hover:border-[#D4AF37]/20 transition-all cursor-pointer group'
              >
                <div className='text-zinc-600 group-hover:text-[#D4AF37] transition-colors mb-6'>
                  {cat.icon}
                </div>
                <h3 className='text-[10px] font-bold tracking-[0.2em] text-white mb-1 uppercase'>
                  {cat.name}
                </h3>
                <p className='text-[7px] text-zinc-600 tracking-widest uppercase'>
                  {cat.count} Units
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Concierge */}
      <section id='contact' className='py-32 px-6'>
        <div className='max-w-4xl mx-auto'>
          <div className='text-center space-y-8'>
            <div className='space-y-4'>
              <h2 className='text-3xl font-serif tracking-[0.2em] text-white uppercase'>
                Personal Concierge
              </h2>
              <p className='text-[10px] text-zinc-500 tracking-[0.15em] leading-loose uppercase max-w-lg mx-auto'>
                Direct coordination for all premium orders. We save your
                preferences for a bespoke terminal experience.
              </p>
              <p className='text-[10px] text-zinc-500 tracking-[0.15em] leading-loose uppercase max-w-lg mx-auto'>
                Process
              </p>
              <p className='text-[10px] text-zinc-500 tracking-[0.15em] leading-loose uppercase max-w-lg mx-auto'>
                give a working phone number and email address, and our team will
                contact you within 24 hours to coordinate delivery and
                preferences.
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-8 pt-10'>
              <div className='space-y-2'>
                <p className='text-[7px] font-bold text-zinc-600 uppercase tracking-widest'>
                  Phone
                </p>
                <p className='text-[10px] text-white tracking-widest'>
                  {COMPANY_PHONE}
                </p>
              </div>
              <div className='space-y-2'>
                <p className='text-[7px] font-bold text-zinc-600 uppercase tracking-widest'>
                  Inquiries
                </p>
                <p className='text-[10px] text-white tracking-widest'>
                  {COMPANY_EMAIL}
                </p>
              </div>
              <div className='space-y-2'>
                <p className='text-[7px] font-bold text-zinc-600 uppercase tracking-widest'>
                  Location
                </p>
                <p className='text-[10px] text-white tracking-widest uppercase'>
                  {COMPANY_ADDRESS}
                </p>
              </div>
            </div>

            <div className='pt-12'>
              <Link
                href='/collections'
                className='inline-block px-12 py-4 bg-[#D4AF37] text-black text-[9px] font-black uppercase tracking-[0.5em] hover:bg-[#F2D37D] transition-colors'
              >
                Browse Catalog
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
