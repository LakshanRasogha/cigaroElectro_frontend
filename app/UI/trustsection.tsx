'use client';

import React from 'react';
import { CheckCircle2, Globe, ShieldCheck, Headphones } from 'lucide-react';
import FeatureCard from '../componenets/feature_card';

const TrustSection = () => {
  const trustFeatures = [
    {
      title: "Concierge Support",
      desc: "Direct access to our premium concierge team 24/7 for a bespoke experience.",
      icon: <Headphones size={32} className="text-indigo-600" />,
      color: "from-indigo-500/10 to-purple-500/5",
    },
    {
      title: "Island-wide Priority",
      desc: "Discreet, insured priority shipping across Sri Lanka directly to your door.",
      icon: <Globe size={32} className="text-cyan-500" />,
      color: "from-cyan-500/10 to-blue-500/5",
    },
    {
      title: "Certified Authentic",
      desc: "100% Brand Guarantee with encrypted serial verification on all hardware.",
      icon: <ShieldCheck size={32} className="text-purple-600" />,
      color: "from-purple-500/10 to-pink-500/5",
    },
  ];

  return (
    <section className="py-24 bg-white border-y border-slate-100 relative overflow-hidden">
      {/* Subtle background glow for Light Mode */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.03),transparent)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {trustFeatures.map((feat, i) => (
            <div key={i} className="group relative">
              {/* Decorative Background Blob for hover effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feat.color} opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 -z-10 rounded-[2rem]`} />
              
              <div className="h-full p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-500">
                <div className="mb-6 inline-flex p-4 rounded-2xl bg-slate-50 group-hover:bg-white group-hover:scale-110 transition-all duration-500 shadow-inner group-hover:shadow-lg">
                  {feat.icon}
                </div>
                
                <h3 className="text-xl font-bold text-zinc-900 mb-3 tracking-tight">
                  {feat.title}
                </h3>
                
                <p className="text-zinc-500 leading-relaxed text-sm font-medium">
                  {feat.desc}
                </p>

                {/* Cyber accent line */}
                <div className="mt-6 w-8 h-1 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full group-hover:w-full transition-all duration-700" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;