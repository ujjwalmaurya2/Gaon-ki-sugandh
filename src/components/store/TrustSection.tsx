import React from 'react';
import { Droplets, Sparkles, Sprout, HeartHandshake, ShieldCheck, Truck } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const pillars = [
    {
      icon: <Droplets className="w-6 h-6 text-brand-green" />,
      title: 'Wooden Kohlu Cold-Pressed',
      desc: 'Extracted slowly at room temperature without synthetic solvents, chemical bleaching, or artificial preservatives.',
    },
    {
      icon: <Sprout className="w-6 h-6 text-brand-green" />,
      title: 'Traditional Sourcing',
      desc: 'Direct partnerships with multi-generational organic farming clusters across Rajasthan, MP, and Karnataka.',
    },
    {
      icon: <Sparkles className="w-6 h-6 text-brand-green" />,
      title: 'Zero Chemical Polish',
      desc: 'Pulses and rice remain naturally unpolished, preserving authentic dietary fiber, vitamins, and earthy aroma.',
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-brand-green" />,
      title: 'Responsible Packaging',
      desc: 'Glass bottles and food-grade tins for pure edible oils and A2 ghee to prevent microplastic contamination.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-10">
      <div className="bg-brand-greenLight/60 rounded-3xl border border-brand-green/20 p-6 sm:p-10">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-black uppercase tracking-wider text-brand-green bg-white px-3 py-1 rounded-full border border-brand-green/30 inline-block shadow-xs">
            🌿 Gaon Ki Shuddhta
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-brand-dark mt-2 tracking-tight">
            Why Families Trust Gaon Ki Sugandh
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted mt-1 font-medium">
            Bridging the gap between pure village harvests and fast, modern urban kitchens.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map((pillar, index) => (
            <div 
              key={index}
              className="bg-white p-5 rounded-2xl border border-brand-border shadow-xs hover:border-brand-green transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-greenLight flex items-center justify-center mb-3">
                {pillar.icon}
              </div>
              <h3 className="text-sm font-bold text-brand-dark leading-snug">
                {pillar.title}
              </h3>
              <p className="text-xs text-brand-muted mt-1.5 leading-relaxed font-normal">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
