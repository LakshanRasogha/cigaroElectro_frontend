'use client';

import React from 'react';
import { CheckCircle2, ExternalLink, ShieldCheck } from 'lucide-react';
import FeatureCard from '../componenets/feature_card';

const TrustSection = () => {
  const trustFeatures = [
    {
      title: "Premium Support",
      desc: "Direct access to our concierge team 24/7 for a seamless experience.",
      icon: <CheckCircle2 size={32} />,
    },
    {
      title: "Global Delivery",
      desc: "Discrete, insured priority shipping worldwide to your doorstep.",
      icon: <ExternalLink size={32} />,
    },
    {
      title: "Authentic Gear",
      desc: "100% Brand Guarantee and serial verification on all hardware.",
      icon: <ShieldCheck size={32} />,
    },
  ];

  return (
    <section className="py-24 bg-[#0a0a0a] border-y border-white/5 relative overflow-hidden">
      {/* Optional: Subtle background texture or glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.02),transparent)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trustFeatures.map((feat, i) => (
            <FeatureCard 
              key={i} 
              index={i} 
              title={feat.title} 
              desc={feat.desc} 
              icon={feat.icon} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;