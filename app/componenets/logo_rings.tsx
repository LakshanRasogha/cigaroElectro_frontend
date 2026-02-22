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
    { name: 'Elfbar', logo: 'https://imgs.search.brave.com/6S_i65H3-M0f9VlglRSeiD5Fn60c1NuPZfvZ-pn6GFo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9lbGZi/YXJ2YXBlc3VzYS5j/b20vbXlTdGFnaW5n/L3dwLWNvbnRlbnQ/dXBsb2Fkcy8yMDI1/LzA4L0VsZl9CYXJf/NjAweDYwMC5wbmc' },
    { name: 'Vozol', logo: 'https://imgs.search.brave.com/7E98hlqlPhm2WdSzTDGVRYOo3-BmkEr-GuAQlnZGqHk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly92b3pv/bC5jby56YS93cC1j/b250ZW50L3VwbG9h/ZHMvMjAyNC8wOC9z/aGFyZS1pbWFnZS5w/bmc' },
    { name: 'Voltbar', logo: 'https://imgs.search.brave.com/cvnqE1_DHj-MwfWAgq3scYNyAbLfd5cB00cy47sJelU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aGV2/b2x0YmFyLmNvbS93/cC1jb250ZW50L3VwbG9h/ZHMvMjAyNS8wNy9GcnVpdHktU2Vy/aWVzLmpwZw' },
    { name: 'Lost Mary', logo: 'https://imgs.search.brave.com/Gmwm2FVHyO8ekAD31UZa--DXOiTj3FhJr3UQPDj0SkQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9kMzFp/eHl0azh6dWE2aS5j/bG91ZGZyb250Lm5l/dC91cGxvYWRzLzIw/MjUwNjE4MTEzODMx/NzM2Ni5wbmc' },
    { name: 'Nasty', logo: 'https://imgs.search.brave.com/WkbJS_GF-XQS6psn6HlhMlpSqfzN94oxp2F79SuFyNo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9sb2dv/ZGl4LmNvbS9sb2dv/LzM3ODExNC5qcGc' },
    { name: 'Tkyo', logo: 'https://imgs.search.brave.com/eCxGBCTBxLIOoSfCoJQ0xuyUKWRMR5BocnE_o3RzBy0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly92YXBl/ZHViYWlsZXNzLmNv/bS9jZG4vc2hvcC9w/cm9kdWN0cy9DNF85/MF9DM19BMG8tbF9F/MV9CQV9BMW5oLW5o/X0UxX0JBX0FEdC1l/MTU2NDExOTYzMDM5/Ny5qcGc_Y3JvcD1j/ZW50ZXImaGVpZ2h0/PTY0NSZ2PTE2OTkx/NjU5MTImd2lkdGg9/NjQ1' },
    { name: 'GeekVape', logo: 'https://imgs.search.brave.com/Y-xZVmblOgTXxp9ssg9NNRJjxFZUaj15-OiMUdP_QRg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zY290/dmFwZXMuY29tL3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDI0LzAz/L2dlZWt2YXBlLWxv/Z28uanBnLnBuZy5w/YWdlc3BlZWQuY2Uu/UTFRMUdWNDJsbi5w/bmc' },
    { name: 'Caliburn', logo: 'https://imgs.search.brave.com/aQhN-1vJGwJbOnpUkPhPBvwOkpFyvgRLfZJlCO_rJgk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/c2hvcGlmeS5jb20v/cy9maWxlcy8xLzA4/ODIvMTk0Mi9maWxl/cy91d2VsbC1jYWxp/YnVybi1nMy1wcm8t/a2l0c180ODB4NDgw/LndlYnA_dj0xNzI4/NDYxOTM1' },
  ];

  useEffect(() => {
    if (!ringRef.current) return;

    const ring = ringRef.current;
    const items = ring.children;
    // Zoom Out Logic: Reduced radius for mobile from 200 to 150
    const radius = window.innerWidth < 768 ? 150 : 350; 
    const totalItems = items.length;

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

    autoRotateRef.current = gsap.to(ring, {
      rotationY: '+=360',
      duration: 50,
      ease: 'none',
      repeat: -1,
    });

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
    <section className="py-20 md:py-32 bg-[#050505] overflow-hidden relative min-h-[700px] md:min-h-[900px] flex items-center">
      
      {/* Background Lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[700px] h-[300px] md:h-[700px] bg-[#D4AF37]/5 blur-[100px] md:blur-[150px] rounded-full animate-pulse" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="text-center mb-16 md:mb-24">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-[#D4AF37] font-black text-[10px] md:text-xs uppercase tracking-[0.5em] mb-4"
          >
            Global Distribution
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase mb-6"
          >
            Strategic <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F2D37D]" style={{ fontFamily: "'Dancing Script', cursive" }}>Partners.</span>
          </motion.h2>
          <div className="w-24 md:w-32 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto" />
        </div>

        {/* 3D Ring Container */}
        <div 
          className="relative w-full flex items-center justify-center"
          // Zoom out: Scale the container down on mobile via Tailwind scale-75
          style={{ height: '400px', perspective: '1200px' }}
        >
          <div 
            ref={ringRef}
            className="relative w-full h-full cursor-grab active:cursor-grabbing scale-[0.65] md:scale-100"
            style={{ 
              transformStyle: 'preserve-3d',
              transition: isDragging ? 'none' : 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
            }}
          >
            {partners.map((partner, index) => (
              <div
                key={index}
                className="absolute group"
                style={{
                  width: '140px', // Smaller card for mobile/zoom
                  height: '140px',
                  backfaceVisibility: 'visible'
                }}
              >
                {/* Gold Obsidian Card */}
                <div className="relative w-full h-full preserve-3d transition-all duration-700 group-hover:scale-110">
                  <div className={`absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-2xl rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center p-4 md:p-8 transition-all duration-500 group-hover:border-[#D4AF37]/40 overflow-hidden shadow-2xl shadow-black`}>
                    
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 blur-3xl" 
                      style={{ background: `radial-gradient(circle, #D4AF37, transparent)` }}
                    />
                    
                    {/* Logo Image */}
                    <div className="relative w-16 h-16 md:w-24 md:h-24 mb-3 md:mb-6 flex items-center justify-center">
                      <img 
                        src={partner.logo} 
                        alt={partner.name}
                        className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-700 drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          if (target.parentElement) {
                            target.parentElement.innerHTML = `
                                <div class="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
                                  <span class="text-xl font-black text-[#D4AF37]">${partner.name[0]}</span>
                                </div>
                            `;
                          }
                        }}
                      />
                    </div>
                    
                    {/* Brand Label */}
                    <span className="relative z-10 text-[7px] md:text-[9px] font-black text-white uppercase tracking-[0.2em] md:tracking-[0.3em] bg-[#D4AF37]/10 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-[#D4AF37]/20 group-hover:bg-[#D4AF37] group-hover:text-black transition-all">
                      {partner.name}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interaction hint */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 2 }}
          className="flex flex-col items-center gap-4 mt-12 md:mt-24"
        >
          <div className="w-[1px] h-8 md:h-12 bg-gradient-to-b from-[#D4AF37] to-transparent" />
          <p className="text-white/40 text-[8px] md:text-[10px] uppercase tracking-[0.5em]">
            Drag to Rotate • Proprietary Network
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default LogoRing;