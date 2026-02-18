'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/dist/Draggable';

// Register GSAP plugins safely for Next.js
if (typeof window !== "undefined") {
  gsap.registerPlugin(Draggable);
}

const LogoRing = () => {
  const [isDragging, setIsDragging] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);
  const autoRotateRef = useRef<gsap.core.Tween | null>(null);
  
  const partners = [
    { 
      name: 'Elfbar', 
      logo: 'https://imgs.search.brave.com/6S_i65H3-M0f9VlglRSeiD5Fn60c1NuPZfvZ-pn6GFo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9lbGZi/YXJ2YXBlc3VzYS5j/b20vbXlTdGFnaW5n/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDI1/LzA4L0VsZl9CYXJf/NjAweDYwMC5wbmc',
      color: '#6366f1',
      bg: 'from-indigo-500/20 to-indigo-600/20'
    },
    { 
      name: 'Vozol', 
      logo: 'https://imgs.search.brave.com/7E98hlqlPhm2WdSzTDGVRYOo3-BmkEr-GuAQlnZGqHk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly92b3pv/bC5jby56YS93cC1j/b250ZW50L3VwbG9h/ZHMvMjAyNC8wOC9z/aGFyZS1pbWFnZS5w/bmc',
      color: '#8b5cf6',
      bg: 'from-purple-500/20 to-purple-600/20'
    },
    { 
      name: 'Voltbar', 
      logo: 'https://imgs.search.brave.com/cvnqE1_DHj-MwfWAgq3scYNyAbLfd5cB00cy47sJelU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aGV2/b2x0YmFyLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyNS8w/Ny9GcnVpdHktU2Vy/aWVzLmpwZw',
      color: '#ec4899',
      bg: 'from-pink-500/20 to-pink-600/20'
    },
    { 
      name: 'Lost Mary', 
      logo: 'https://imgs.search.brave.com/Gmwm2FVHyO8ekAD31UZa--DXOiTj3FhJr3UQPDj0SkQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9kMzFp/eHl0azh6dWE2aS5j/bG91ZGZyb250Lm5l/dC91cGxvYWRzLzIw/MjUwNjE4MTEzODMx/NzM2Ni5wbmc',
      color: '#f97316',
      bg: 'from-orange-500/20 to-orange-600/20'
    },
    { 
      name: 'Nasty', 
      logo: 'https://imgs.search.brave.com/WkbJS_GF-XQS6psn6HlhMlpSqfzN94oxp2F79SuFyNo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9sb2dv/ZGl4LmNvbS9sb2dv/LzM3ODExNC5qcGc',
      color: '#ef4444',
      bg: 'from-red-500/20 to-red-600/20'
    },
    { 
      name: 'Tkyo', 
      logo: 'https://imgs.search.brave.com/eCxGBCTBxLIOoSfCoJQ0xuyUKWRMR5BocnE_o3RzBy0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly92YXBl/ZHViYWlsZXNzLmNv/bS9jZG4vc2hvcC9w/cm9kdWN0cy9DNF85/MF9DM19BMG8tbF9F/MV9CQV9BMW5oLW5o/X0UxX0JBX0FEdC1l/MTU2NDExOTYzMDM5/Ny5qcGc_Y3JvcD1j/ZW50ZXImaGVpZ2h0/PTY0NSZ2PTE2OTkx/NjU5MTImd2lkdGg9/NjQ1',
      color: '#06b6d4',
      bg: 'from-cyan-500/20 to-cyan-600/20'
    },
    { 
      name: 'GeekVape', 
      logo: 'https://imgs.search.brave.com/Y-xZVmblOgTXxp9ssg9NNRJjxFZUaj15-OiMUdP_QRg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zY290/dmFwZXMuY29tL3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDI0LzAz/L2dlZWt2YXBlLWxv/Z28uanBnLnBuZy5w/YWdlc3BlZWQuY2Uu/UTFRMUdWNDJsbi5w/bmc',
      color: '#10b981',
      bg: 'from-emerald-500/20 to-emerald-600/20'
    },
    { 
      name: 'Caliburn', 
      logo: 'https://imgs.search.brave.com/aQhN-1vJGwJbOnpUkPhPBvwOkpFyvgRLfZJlCO_rJgk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/c2hvcGlmeS5jb20v/cy9maWxlcy8xLzA4/ODIvMTk0Mi9maWxl/cy91d2VsbC1jYWxp/YnVybi1nMy1wcm8t/a2l0c180ODB4NDgw/LndlYnA_dj0xNzI4/NDYxOTM1',
      color: '#f59e0b',
      bg: 'from-amber-500/20 to-amber-600/20'
    },
  ];

  useEffect(() => {
    if (!ringRef.current) return;

    const ring = ringRef.current;
    const items = ring.children;
    const radius = window.innerWidth < 768 ? 200 : 320; 
    const totalItems = items.length;

    // Position items in a 3D ring
    gsap.set(items, {
      position: 'absolute',
      top: '50%',
      left: '50%',
      xPercent: -50,
      yPercent: -50,
      transformStyle: 'preserve-3d',
    });

    Array.from(items).forEach((item, index) => {
      const angle = (index / totalItems) * Math.PI * 2;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      
      gsap.set(item, {
        x: x,
        z: z,
        rotationY: -angle * (180 / Math.PI),
      });
    });

    // Auto-rotate animation
    autoRotateRef.current = gsap.to(ring, {
      rotationY: '+=360',
      duration: 40,
      ease: 'none',
      repeat: -1,
    });

    // Make ring draggable
    const draggable = Draggable.create(ring, {
      type: 'rotation',
      inertia: true,
      onDragStart: () => {
        setIsDragging(true);
        autoRotateRef.current?.pause();
      },
      onDragEnd: function() {
        setIsDragging(false);
        autoRotateRef.current?.resume();
      }
    })[0];

    return () => {
      autoRotateRef.current?.kill();
      if (draggable) draggable.kill();
    };
  }, []);

  return (
    <section className="py-32 bg-[#020617] overflow-hidden relative min-h-[800px] flex items-center">
      
      {/* Background Lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="text-center mb-16">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-indigo-400 font-black text-xs uppercase tracking-[0.5em] mb-3"
          >
            Global Distribution
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mb-4"
          >
            Strategic Partners.
          </motion.h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full" />
        </div>

        {/* 3D Ring Container */}
        <div 
          className="relative w-full flex items-center justify-center"
          style={{ height: '500px', perspective: '1200px' }}
        >
          <div 
            ref={ringRef}
            className="relative w-full h-full cursor-grab active:cursor-grabbing"
            style={{ 
              transformStyle: 'preserve-3d',
              transition: isDragging ? 'none' : 'transform 0.5s ease-out',
            }}
          >
            {partners.map((partner, index) => (
              <div
                key={index}
                className="absolute group"
                style={{
                  width: '180px',
                  height: '180px',
                  backfaceVisibility: 'visible'
                }}
              >
                {/* Logo card with 3D effect */}
                <div className="relative w-full h-full preserve-3d transition-all duration-500 group-hover:scale-110">
                  {/* Front face */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${partner.bg} backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-2xl flex flex-col items-center justify-center p-6 transition-all duration-500 group-hover:border-white/30 overflow-hidden`}>
                    
                    {/* Dynamic Glow using Style for SSR Safety */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-500 blur-2xl" 
                      style={{ background: `radial-gradient(circle, ${partner.color}, transparent)` }}
                    />
                    
                    {/* Logo Image */}
                    <div className="relative w-24 h-24 mb-4 flex items-center justify-center">
                      <img 
                        src={partner.logo} 
                        alt={partner.name}
                        className="max-w-full max-h-full object-contain filter drop-shadow-2xl"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          if (target.parentElement) {
                            target.parentElement.innerHTML = `
                                <div class="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                                  <span class="text-2xl font-black text-white">${partner.name[0]}</span>
                                </div>
                            `;
                          }
                        }}
                      />
                    </div>
                    
                    {/* Brand name */}
                    <span className="relative z-10 text-[10px] font-black text-white uppercase tracking-widest bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
                      {partner.name}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interaction hint */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1.5 }}
          className="text-center text-white/40 text-[10px] uppercase tracking-[0.3em] mt-20"
        >
          Drag to investigate • 360° rotational view
        </motion.p>
      </div>
    </section>
  );
};

export default LogoRing;