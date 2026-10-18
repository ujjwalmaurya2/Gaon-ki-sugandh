import React from 'react';
import { CategoryId } from '../../types';

interface AnimatedCategoryIconProps {
  categoryId: CategoryId | 'all';
  className?: string;
  size?: number;
}

export const AnimatedCategoryIcon: React.FC<AnimatedCategoryIconProps> = ({ 
  categoryId, 
  className = '', 
  size = 56 
}) => {
  // Styles for smooth animations embedded directly in SVGs
  const svgStyle = {
    width: `${size}px`,
    height: `${size}px`,
  };

  switch (categoryId) {
    case 'all':
      return (
        <svg 
          viewBox="0 0 100 100" 
          style={svgStyle}
          className={`shrink-0 overflow-visible transition-transform duration-300 ${className}`}
        >
          <defs>
            <linearGradient id="allBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0C831F" />
              <stop offset="100%" stopColor="#086518" />
            </linearGradient>
            <linearGradient id="basketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F8CB46" />
              <stop offset="100%" stopColor="#D99E1B" />
            </linearGradient>
            <filter id="allShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#0C831F" floodOpacity="0.25" />
            </filter>
          </defs>
          <style>{`
            @keyframes allFloat {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-3px) rotate(1deg); }
            }
            @keyframes sparkleTwinkle {
              0%, 100% { opacity: 0.3; transform: scale(0.8) rotate(0deg); }
              50% { opacity: 1; transform: scale(1.2) rotate(45deg); }
            }
            .anim-all-basket { animation: allFloat 3s ease-in-out infinite; transform-origin: center; }
            .anim-sparkle-1 { animation: sparkleTwinkle 2s ease-in-out infinite; transform-origin: 80px 22px; }
            .anim-sparkle-2 { animation: sparkleTwinkle 2.5s ease-in-out infinite 0.7s; transform-origin: 20px 30px; }
          `}</style>
          
          {/* Circular Backdrop */}
          <circle cx="50" cy="50" r="44" fill="#E8F5E9" stroke="#0C831F" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="39" fill="url(#allBgGrad)" filter="url(#allShadow)" />

          {/* Sparkles */}
          <g className="anim-sparkle-1">
            <path d="M80 18 L82 22 L86 24 L82 26 L80 30 L78 26 L74 24 L78 22 Z" fill="#F8CB46" />
          </g>
          <g className="anim-sparkle-2">
            <path d="M20 28 L21.5 31 L24.5 32.5 L21.5 34 L20 37 L18.5 34 L15.5 32.5 L18.5 31 Z" fill="#FFF3C4" />
          </g>

          {/* Village Grocery Basket */}
          <g className="anim-all-basket">
            {/* Basket Base */}
            <ellipse cx="50" cy="68" rx="26" ry="10" fill="#064210" opacity="0.4" />
            <path d="M26 50 C26 70, 74 70, 74 50 L68 70 C68 76, 32 76, 32 70 Z" fill="url(#basketGrad)" stroke="#B87D09" strokeWidth="1.5" />
            
            {/* Woven details */}
            <path d="M30 56 Q50 64 70 56" stroke="#9A6504" strokeWidth="1.2" fill="none" />
            <path d="M32 64 Q50 72 68 64" stroke="#9A6504" strokeWidth="1.2" fill="none" />

            {/* Produce inside basket */}
            {/* Pure oil bottle */}
            <rect x="44" y="32" width="12" height="24" rx="3" fill="#F8CB46" stroke="#FFFFFF" strokeWidth="1" />
            <rect x="47" y="27" width="6" height="5" rx="1.5" fill="#0C831F" />
            {/* Wheat stalks */}
            <path d="M36 48 Q32 30 38 24 Q40 28 36 48 Z" fill="#FFF3C4" />
            <path d="M64 48 Q68 30 62 24 Q60 28 64 48 Z" fill="#FFF3C4" />
            {/* Fresh Green Sprout Leaves */}
            <path d="M50 42 C45 34, 38 38, 42 46 C46 45, 48 44, 50 42 Z" fill="#4CAF50" />
            <path d="M50 42 C55 34, 62 38, 58 46 C54 45, 52 44, 50 42 Z" fill="#81C784" />
          </g>
        </svg>
      );

    case 'oils':
      return (
        <svg 
          viewBox="0 0 100 100" 
          style={svgStyle}
          className={`shrink-0 overflow-visible transition-transform duration-300 ${className}`}
        >
          <defs>
            <linearGradient id="oilBottleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFF3C4" />
              <stop offset="30%" stopColor="#F8CB46" />
              <stop offset="80%" stopColor="#E5A611" />
              <stop offset="100%" stopColor="#C98802" />
            </linearGradient>
            <linearGradient id="dropGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F8CB46" />
              <stop offset="100%" stopColor="#D98A00" />
            </linearGradient>
            <filter id="oilGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#D98A00" floodOpacity="0.4" />
            </filter>
          </defs>
          <style>{`
            @keyframes oilDrip {
              0% { transform: translateY(0px) scale(0.6); opacity: 0; }
              30% { transform: translateY(4px) scale(1); opacity: 1; }
              80% { transform: translateY(18px) scale(1.1); opacity: 0.9; }
              100% { transform: translateY(24px) scale(0.2); opacity: 0; }
            }
            @keyframes oilSway {
              0%, 100% { transform: rotate(-2deg); }
              50% { transform: rotate(2deg); }
            }
            @keyframes rippleEffect {
              0% { transform: scale(0.7); opacity: 0.8; }
              100% { transform: scale(1.5); opacity: 0; }
            }
            .anim-oil-bottle { animation: oilSway 4s ease-in-out infinite; transform-origin: 50px 75px; }
            .anim-oil-drop { animation: oilDrip 2.2s cubic-bezier(0.55, 0.085, 0.68, 0.53) infinite; transform-origin: center; }
            .anim-ripple { animation: rippleEffect 2.2s ease-out infinite 1.4s; transform-origin: 50px 84px; }
          `}</style>

          {/* Background circle */}
          <circle cx="50" cy="50" r="44" fill="#FFFBEA" stroke="#F8CB46" strokeWidth="2.5" />

          {/* Ground reflection shadow */}
          <ellipse cx="50" cy="85" rx="22" ry="5" fill="#D99E1B" opacity="0.35" />

          {/* Animated ripple under drip */}
          <ellipse cx="50" cy="84" rx="14" ry="4" fill="none" stroke="#F8CB46" strokeWidth="1.5" className="anim-ripple" />

          {/* Cold-Pressed Oil Bottle & Wooden Kolhu elements */}
          <g className="anim-oil-bottle">
            {/* Wooden Cap / Cork */}
            <path d="M44 18 L56 18 L54 25 L46 25 Z" fill="#8D5B18" stroke="#5C3806" strokeWidth="1" />
            
            {/* Bottle Neck */}
            <rect x="46" y="25" width="8" height="9" fill="#FFF8E1" stroke="#E0C36D" strokeWidth="1" opacity="0.8" />
            
            {/* Glass Bottle Body with Golden Mustard Oil */}
            <path d="M36 40 C36 34, 46 34, 46 34 L54 34 C54 34, 64 34, 64 40 L65 74 C65 78, 61 80, 50 80 C39 80, 35 78, 35 74 Z" 
              fill="url(#oilBottleGrad)" 
              stroke="#B8860B" 
              strokeWidth="1.5" 
              filter="url(#oilGlow)"
            />

            {/* Glass highlight glare line */}
            <path d="M40 42 L39 74" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.75" />

            {/* Traditional Lakdi Ghani Leaf emblem on bottle label */}
            <rect x="42" y="48" width="16" height="18" rx="2" fill="#FFFFFF" opacity="0.95" />
            <path d="M50 51 C47 55, 45 61, 50 63 C55 61, 53 55, 50 51 Z" fill="#0C831F" />
            <circle cx="50" cy="57" r="1.5" fill="#F8CB46" />
          </g>

          {/* Golden Dripping Droplet */}
          <g className="anim-oil-drop">
            <path d="M50 66 C48 66, 46 69, 46 71 C46 73.5, 47.8 75, 50 75 C52.2 75, 54 73.5, 54 71 C54 69, 52 66, 50 66 Z" fill="url(#dropGrad)" />
          </g>

          {/* Yellow Mustard Flower Accent */}
          <g transform="translate(64, 56) scale(0.85)">
            <circle cx="0" cy="0" r="3" fill="#D98A00" />
            <ellipse cx="0" cy="-6" rx="2.5" ry="4" fill="#F8CB46" />
            <ellipse cx="0" cy="6" rx="2.5" ry="4" fill="#F8CB46" />
            <ellipse cx="-6" cy="0" rx="4" ry="2.5" fill="#F8CB46" />
            <ellipse cx="6" cy="0" rx="4" ry="2.5" fill="#F8CB46" />
          </g>
        </svg>
      );

    case 'atta':
      return (
        <svg 
          viewBox="0 0 100 100" 
          style={svgStyle}
          className={`shrink-0 overflow-visible transition-transform duration-300 ${className}`}
        >
          <defs>
            <linearGradient id="attaSackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EED9B3" />
              <stop offset="60%" stopColor="#DEC294" />
              <stop offset="100%" stopColor="#C4A16C" />
            </linearGradient>
            <linearGradient id="wheatGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F8CB46" />
              <stop offset="100%" stopColor="#C9940A" />
            </linearGradient>
          </defs>
          <style>{`
            @keyframes wheatSway {
              0%, 100% { transform: rotate(-3deg); }
              50% { transform: rotate(3deg); }
            }
            @keyframes millRotate {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes flourMound {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.04); }
            }
            .anim-wheat-left { animation: wheatSway 3s ease-in-out infinite; transform-origin: 30px 75px; }
            .anim-wheat-right { animation: wheatSway 3.2s ease-in-out infinite 0.5s; transform-origin: 70px 75px; }
            .anim-mill { animation: millRotate 18s linear infinite; transform-origin: 50px 36px; }
            .anim-flour { animation: flourMound 4s ease-in-out infinite; transform-origin: 50px 70px; }
          `}</style>

          <circle cx="50" cy="50" r="44" fill="#FBF8EE" stroke="#E2C997" strokeWidth="2.5" />
          <ellipse cx="50" cy="84" rx="26" ry="6" fill="#A88B57" opacity="0.3" />

          {/* Stone Chakki in background */}
          <g className="anim-mill" opacity="0.25">
            <circle cx="50" cy="36" r="16" fill="none" stroke="#795548" strokeWidth="3" strokeDasharray="6 4" />
          </g>

          {/* Wheat Spikes on sides */}
          <g className="anim-wheat-left">
            <path d="M26 75 Q24 45 28 26" stroke="#C9940A" strokeWidth="2" fill="none" />
            <ellipse cx="26" cy="32" rx="3" ry="5" fill="url(#wheatGold)" transform="rotate(-25 26 32)" />
            <ellipse cx="31" cy="38" rx="3" ry="5" fill="url(#wheatGold)" transform="rotate(25 31 38)" />
            <ellipse cx="25" cy="44" rx="3" ry="5" fill="url(#wheatGold)" transform="rotate(-25 25 44)" />
            <ellipse cx="30" cy="50" rx="3" ry="5" fill="url(#wheatGold)" transform="rotate(25 30 50)" />
          </g>

          <g className="anim-wheat-right">
            <path d="M74 75 Q76 45 72 26" stroke="#C9940A" strokeWidth="2" fill="none" />
            <ellipse cx="74" cy="32" rx="3" ry="5" fill="url(#wheatGold)" transform="rotate(25 74 32)" />
            <ellipse cx="69" cy="38" rx="3" ry="5" fill="url(#wheatGold)" transform="rotate(-25 69 38)" />
            <ellipse cx="75" cy="44" rx="3" ry="5" fill="url(#wheatGold)" transform="rotate(25 75 44)" />
            <ellipse cx="70" cy="50" rx="3" ry="5" fill="url(#wheatGold)" transform="rotate(-25 70 50)" />
          </g>

          {/* Chakki Atta Jute Sack */}
          <path d="M30 54 C30 50, 70 50, 70 54 L67 78 C67 82, 33 82, 33 78 Z" fill="url(#attaSackGrad)" stroke="#9E7843" strokeWidth="1.5" />
          <path d="M32 54 Q50 57 68 54" stroke="#9E7843" strokeWidth="2" fill="none" />

          {/* Overflowing pure white Sharbati stone-milled flour */}
          <g className="anim-flour">
            <ellipse cx="50" cy="52" rx="18" ry="8" fill="#FFFDF5" stroke="#E0D2BC" strokeWidth="1" />
            <path d="M38 52 Q50 42 62 52 Z" fill="#FFFFFF" />
          </g>

          {/* Hindi 'आटा' badge on sack */}
          <rect x="41" y="62" width="18" height="11" rx="2" fill="#0C831F" />
          <text x="50" y="70" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold">आटा</text>
        </svg>
      );

    case 'dal':
      return (
        <svg 
          viewBox="0 0 100 100" 
          style={svgStyle}
          className={`shrink-0 overflow-visible transition-transform duration-300 ${className}`}
        >
          <defs>
            <linearGradient id="dalClayBowl" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#C86A3D" />
              <stop offset="100%" stopColor="#873E1B" />
            </linearGradient>
            <linearGradient id="toorYellow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F8CB46" />
              <stop offset="100%" stopColor="#E2A50E" />
            </linearGradient>
          </defs>
          <style>{`
            @keyframes pulseLentils {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-3px); }
            }
            @keyframes sproutBounce {
              0%, 100% { transform: scale(1) rotate(-5deg); }
              50% { transform: scale(1.15) rotate(5deg); }
            }
            .anim-lentils { animation: pulseLentils 2.5s ease-in-out infinite; }
            .anim-sprout { animation: sproutBounce 3s ease-in-out infinite; transform-origin: 50px 42px; }
          `}</style>

          <circle cx="50" cy="50" r="44" fill="#FFF8F0" stroke="#E8C3A7" strokeWidth="2.5" />
          <ellipse cx="50" cy="82" rx="24" ry="5" fill="#873E1B" opacity="0.25" />

          {/* Clay Handi/Bowl */}
          <path d="M22 52 C22 76, 78 76, 78 52 C78 48, 22 48, 22 52 Z" fill="url(#dalClayBowl)" stroke="#682E12" strokeWidth="2" />
          <ellipse cx="50" cy="50" rx="28" ry="10" fill="#B3582D" stroke="#682E12" strokeWidth="1.5" />

          {/* Heap of Golden Toor & Moong Pulses */}
          <g className="anim-lentils">
            <ellipse cx="50" cy="48" rx="23" ry="8" fill="url(#toorYellow)" />
            
            {/* Individual Lentil Seeds */}
            <circle cx="42" cy="46" r="3" fill="#F8CB46" stroke="#D19807" strokeWidth="0.8" />
            <circle cx="49" cy="45" r="3.2" fill="#F4B400" stroke="#D19807" strokeWidth="0.8" />
            <circle cx="56" cy="47" r="2.8" fill="#F8CB46" stroke="#D19807" strokeWidth="0.8" />
            <circle cx="38" cy="49" r="2.7" fill="#4CAF50" stroke="#2E7D32" strokeWidth="0.8" /> {/* Green Moong */}
            <circle cx="61" cy="48" r="2.9" fill="#FF7043" stroke="#D84315" strokeWidth="0.8" /> {/* Masoor Dal */}
            <circle cx="46" cy="50" r="3.2" fill="#F8CB46" stroke="#D19807" strokeWidth="0.8" />
            <circle cx="53" cy="50" r="3" fill="#F4B400" stroke="#D19807" strokeWidth="0.8" />
          </g>

          {/* Organic Sprout Leaf on top */}
          <g className="anim-sprout">
            <path d="M50 42 C45 32, 38 35, 42 41 C46 41, 48 41, 50 42 Z" fill="#0C831F" />
            <path d="M50 42 C55 32, 62 35, 58 41 C54 41, 52 41, 50 42 Z" fill="#34A853" />
            <path d="M50 42 L50 45" stroke="#0C831F" strokeWidth="1.5" />
          </g>

          {/* Clay Bowl detail lines */}
          <path d="M26 56 Q50 64 74 56" stroke="#D7855C" strokeWidth="1.5" fill="none" opacity="0.6" />
        </svg>
      );

    case 'rice':
      return (
        <svg 
          viewBox="0 0 100 100" 
          style={svgStyle}
          className={`shrink-0 overflow-visible transition-transform duration-300 ${className}`}
        >
          <defs>
            <linearGradient id="brassBowl" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F8CB46" />
              <stop offset="60%" stopColor="#C9940A" />
              <stop offset="100%" stopColor="#8A6300" />
            </linearGradient>
          </defs>
          <style>{`
            @keyframes steamRise {
              0% { transform: translateY(0px); opacity: 0; }
              40% { opacity: 0.7; }
              100% { transform: translateY(-16px); opacity: 0; }
            }
            @keyframes grainGleam {
              0%, 100% { opacity: 0.8; }
              50% { opacity: 1; }
            }
            .anim-steam-1 { animation: steamRise 3s ease-out infinite; }
            .anim-steam-2 { animation: steamRise 3.2s ease-out infinite 1.2s; }
            .anim-steam-3 { animation: steamRise 2.8s ease-out infinite 0.6s; }
            .anim-rice-grains { animation: grainGleam 2.5s ease-in-out infinite; }
          `}</style>

          <circle cx="50" cy="50" r="44" fill="#F4FAF5" stroke="#C2E5D0" strokeWidth="2.5" />
          <ellipse cx="50" cy="82" rx="24" ry="5" fill="#8A6300" opacity="0.25" />

          {/* Rising Aromatic Steam */}
          <path d="M42 36 Q38 28 42 22 Q46 16 42 12" stroke="#0C831F" strokeWidth="1.8" strokeLinecap="round" fill="none" className="anim-steam-1" />
          <path d="M50 34 Q54 26 50 20 Q46 14 50 10" stroke="#34A853" strokeWidth="2" strokeLinecap="round" fill="none" className="anim-steam-2" />
          <path d="M58 36 Q62 28 58 22 Q54 16 58 12" stroke="#0C831F" strokeWidth="1.8" strokeLinecap="round" fill="none" className="anim-steam-3" />

          {/* Traditional Royal Brass Degchi / Bowl */}
          <path d="M24 50 C24 74, 76 74, 76 50 C76 46, 24 46, 24 50 Z" fill="url(#brassBowl)" stroke="#664600" strokeWidth="1.5" />
          <ellipse cx="50" cy="48" rx="26" ry="9" fill="#996E00" />

          {/* Cooked Long Grain Himalayan Basmati Rice Mound */}
          <g className="anim-rice-grains">
            <path d="M26 48 C26 36, 74 36, 74 48 Z" fill="#FFFFFF" stroke="#E0E0E0" strokeWidth="1" />
            
            {/* Slender Aged Basmati Grains */}
            <ellipse cx="44" cy="43" rx="4" ry="1.4" fill="#FFFDF5" stroke="#D1D5DB" strokeWidth="0.6" transform="rotate(-15 44 43)" />
            <ellipse cx="52" cy="41" rx="4.5" ry="1.5" fill="#FFFDF5" stroke="#D1D5DB" strokeWidth="0.6" transform="rotate(10 52 41)" />
            <ellipse cx="58" cy="44" rx="4" ry="1.4" fill="#FFFDF5" stroke="#D1D5DB" strokeWidth="0.6" transform="rotate(-25 58 44)" />
            <ellipse cx="48" cy="45" rx="4.2" ry="1.5" fill="#FFFDF5" stroke="#D1D5DB" strokeWidth="0.6" transform="rotate(5 48 45)" />
            <ellipse cx="38" cy="46" rx="3.8" ry="1.3" fill="#FFFDF5" stroke="#D1D5DB" strokeWidth="0.6" transform="rotate(20 38 46)" />
          </g>

          {/* Green Cardamom pod & Clove on rice */}
          <ellipse cx="50" cy="44" rx="2.5" ry="4" fill="#2E7D32" transform="rotate(45 50 44)" />
          <circle cx="55" cy="45" r="1.5" fill="#3E2723" />
        </svg>
      );

    case 'spices':
      return (
        <svg 
          viewBox="0 0 100 100" 
          style={svgStyle}
          className={`shrink-0 overflow-visible transition-transform duration-300 ${className}`}
        >
          <defs>
            <linearGradient id="chilliRed" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF4D4D" />
              <stop offset="100%" stopColor="#D32F2F" />
            </linearGradient>
            <linearGradient id="haldiGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F8CB46" />
              <stop offset="100%" stopColor="#FF8F00" />
            </linearGradient>
          </defs>
          <style>{`
            @keyframes spiceSpark {
              0%, 100% { transform: scale(0.8) rotate(0deg); opacity: 0.5; }
              50% { transform: scale(1.2) rotate(30deg); opacity: 1; }
            }
            @keyframes pestleCrush {
              0%, 100% { transform: rotate(0deg); }
              50% { transform: rotate(8deg); }
            }
            .anim-sparks { animation: spiceSpark 2s ease-in-out infinite; transform-origin: 50px 30px; }
            .anim-pestle { animation: pestleCrush 3s ease-in-out infinite; transform-origin: 65px 35px; }
          `}</style>

          <circle cx="50" cy="50" r="44" fill="#FFF6F3" stroke="#FFCCBC" strokeWidth="2.5" />
          <ellipse cx="50" cy="83" rx="24" ry="5" fill="#5D4037" opacity="0.25" />

          {/* Aromatic Spices Flame / Sparks */}
          <g className="anim-sparks">
            <path d="M50 20 L52 24 L56 25 L52 27 L50 31 L48 27 L44 25 L48 24 Z" fill="#FF6D00" />
            <path d="M34 26 L35 28 L38 29 L35 30 L34 32 L33 30 L30 29 L33 28 Z" fill="#F8CB46" />
            <path d="M68 28 L69 30 L72 31 L69 32 L68 34 L67 32 L64 31 L67 30 Z" fill="#D32F2F" />
          </g>

          {/* Stone Mortar (सिलबट्टा / ओखली) */}
          <path d="M26 50 C26 74, 74 74, 74 50 L68 76 C68 80, 32 80, 32 76 Z" fill="#616161" stroke="#37474F" strokeWidth="1.8" />
          <ellipse cx="50" cy="50" rx="24" ry="9" fill="#424242" stroke="#212121" strokeWidth="1.5" />

          {/* Pure Lakadong Turmeric & Red Chilli inside Mortar */}
          <ellipse cx="46" cy="50" rx="14" ry="6" fill="url(#haldiGold)" />
          
          {/* Kashmiri Red Chilli curving out */}
          <path d="M36 46 Q42 32 54 36 Q56 40 44 49 Z" fill="url(#chilliRed)" stroke="#B71C1C" strokeWidth="0.8" />
          <path d="M54 36 Q58 35 60 33" stroke="#2E7D32" strokeWidth="1.5" strokeLinecap="round" fill="none" />

          {/* Star Anise (चक्र फूल) */}
          <g transform="translate(62, 54) scale(0.65)">
            <ellipse cx="0" cy="-6" rx="2.5" ry="4" fill="#4E342E" />
            <ellipse cx="0" cy="6" rx="2.5" ry="4" fill="#4E342E" />
            <ellipse cx="-6" cy="0" rx="4" ry="2.5" fill="#4E342E" />
            <ellipse cx="6" cy="0" rx="4" ry="2.5" fill="#4E342E" />
            <circle cx="0" cy="0" r="2.5" fill="#3E2723" />
          </g>

          {/* Stone Pestle (मूसल) */}
          <g className="anim-pestle">
            <rect x="58" y="32" width="9" height="24" rx="4" fill="#757575" stroke="#424242" strokeWidth="1" transform="rotate(25 58 32)" />
          </g>
        </svg>
      );

    case 'dairy':
      return (
        <svg 
          viewBox="0 0 100 100" 
          style={svgStyle}
          className={`shrink-0 overflow-visible transition-transform duration-300 ${className}`}
        >
          <defs>
            <linearGradient id="gheeGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF9C4" />
              <stop offset="40%" stopColor="#F8CB46" />
              <stop offset="100%" stopColor="#E5A100" />
            </linearGradient>
            <linearGradient id="earthenPot" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D35400" />
              <stop offset="100%" stopColor="#873600" />
            </linearGradient>
          </defs>
          <style>{`
            @keyframes bilonaChurn {
              0%, 100% { transform: rotate(-5deg); }
              50% { transform: rotate(5deg); }
            }
            @keyframes goldenAura {
              0%, 100% { opacity: 0.3; transform: scale(0.95); }
              50% { opacity: 0.7; transform: scale(1.05); }
            }
            .anim-bilona { animation: bilonaChurn 3.5s ease-in-out infinite; transform-origin: 50px 20px; }
            .anim-aura { animation: goldenAura 3s ease-in-out infinite; transform-origin: 50px 50px; }
          `}</style>

          <circle cx="50" cy="50" r="44" fill="#FFFDF0" stroke="#FDE68A" strokeWidth="2.5" />
          
          {/* Golden divine aura */}
          <circle cx="50" cy="50" r="32" fill="#FEF3C7" className="anim-aura" />
          <ellipse cx="50" cy="83" rx="22" ry="5" fill="#873600" opacity="0.3" />

          {/* Wooden Bilona Churner Stick */}
          <g className="anim-bilona">
            <rect x="48" y="14" width="4" height="42" rx="2" fill="#78350F" stroke="#451A03" strokeWidth="0.8" />
            {/* Churner flutes */}
            <circle cx="50" cy="48" r="7" fill="#92400E" stroke="#451A03" strokeWidth="0.8" />
          </g>

          {/* Traditional Matka (Earthen Pot for Ghee) */}
          <path d="M26 50 C26 38, 74 38, 74 50 C74 76, 26 76, 26 50 Z" fill="url(#earthenPot)" stroke="#6E2C00" strokeWidth="1.8" />
          <ellipse cx="50" cy="42" rx="20" ry="7" fill="#BA4A00" stroke="#6E2C00" strokeWidth="1.2" />

          {/* Overflowing Golden Danedaar A2 Ghee */}
          <ellipse cx="50" cy="44" rx="16" ry="6" fill="url(#gheeGold)" stroke="#D97706" strokeWidth="0.8" />
          
          {/* Sacred Kalawa (Mauli) Red-Yellow Thread tied on Pot Neck */}
          <path d="M30 46 Q50 49 70 46" stroke="#DC2626" strokeWidth="2.5" fill="none" />
          <path d="M30 46 Q50 49 70 46" stroke="#F8CB46" strokeWidth="1" strokeDasharray="3 3" fill="none" />

          {/* Droplet of pure melted ghee running down */}
          <path d="M48 50 C48 54, 46 58, 48 60 C50 62, 52 60, 50 56 Z" fill="#F8CB46" />
        </svg>
      );

    case 'essentials':
      return (
        <svg 
          viewBox="0 0 100 100" 
          style={svgStyle}
          className={`shrink-0 overflow-visible transition-transform duration-300 ${className}`}
        >
          <defs>
            <linearGradient id="honeyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <linearGradient id="jaggeryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#92400E" />
              <stop offset="100%" stopColor="#5F2709" />
            </linearGradient>
          </defs>
          <style>{`
            @keyframes beeFly {
              0% { transform: translate(0px, 0px) rotate(0deg); }
              30% { transform: translate(4px, -5px) rotate(8deg); }
              70% { transform: translate(-3px, -2px) rotate(-6deg); }
              100% { transform: translate(0px, 0px) rotate(0deg); }
            }
            @keyframes honeyDrip {
              0% { transform: translateY(0px) scale(0.7); opacity: 0; }
              40% { transform: translateY(4px) scale(1); opacity: 1; }
              80% { transform: translateY(16px) scale(1.1); opacity: 0.9; }
              100% { transform: translateY(22px) scale(0.3); opacity: 0; }
            }
            .anim-bee { animation: beeFly 3.5s ease-in-out infinite; transform-origin: center; }
            .anim-honey-drop { animation: honeyDrip 2.4s ease-in infinite; transform-origin: 45px 56px; }
          `}</style>

          <circle cx="50" cy="50" r="44" fill="#FFFDF2" stroke="#FDE68A" strokeWidth="2.5" />
          <ellipse cx="50" cy="82" rx="24" ry="5" fill="#78350F" opacity="0.25" />

          {/* Organic Desi Gur (Jaggery Cube) in background */}
          <rect x="52" y="52" width="22" height="22" rx="4" fill="url(#jaggeryGrad)" stroke="#451A03" strokeWidth="1.2" transform="rotate(8 52 52)" />
          
          {/* Glass Honey Pot */}
          <path d="M26 50 C26 40, 56 40, 56 50 L54 74 C54 78, 28 78, 28 74 Z" fill="#FFFBEB" stroke="#D97706" strokeWidth="1.5" />
          {/* Liquid Raw Forest Honey inside */}
          <path d="M28 54 C28 50, 54 50, 54 54 L52 73 C52 76, 30 76, 30 73 Z" fill="url(#honeyGrad)" />
          
          {/* Wooden Honey Dipper */}
          <g transform="translate(18, 22) rotate(-35)">
            <rect x="24" y="10" width="4" height="36" rx="2" fill="#B45309" stroke="#78350F" strokeWidth="0.8" />
            <ellipse cx="26" cy="38" rx="6" ry="7" fill="#D97706" stroke="#78350F" strokeWidth="0.8" />
            <line x1="20" y1="35" x2="32" y2="35" stroke="#78350F" strokeWidth="1" />
            <line x1="20" y1="38" x2="32" y2="38" stroke="#78350F" strokeWidth="1" />
            <line x1="20" y1="41" x2="32" y2="41" stroke="#78350F" strokeWidth="1" />
          </g>

          {/* Animated Honey Drop */}
          <g className="anim-honey-drop">
            <ellipse cx="44" cy="54" rx="2.5" ry="3.5" fill="#D97706" />
          </g>

          {/* Little Animated Wild Honey Bee */}
          <g className="anim-bee" transform="translate(68, 26)">
            {/* Wings */}
            <ellipse cx="-4" cy="-4" rx="3.5" ry="5" fill="#BAE6FD" opacity="0.7" transform="rotate(-30 -4 -4)" />
            <ellipse cx="4" cy="-4" rx="3.5" ry="5" fill="#BAE6FD" opacity="0.7" transform="rotate(30 4 -4)" />
            {/* Body */}
            <ellipse cx="0" cy="0" rx="5" ry="6.5" fill="#F8CB46" stroke="#1F1F1F" strokeWidth="0.8" />
            <path d="M-4.5 -1 L4.5 -1" stroke="#1F1F1F" strokeWidth="1.2" />
            <path d="M-4.5 2 L4.5 2" stroke="#1F1F1F" strokeWidth="1.2" />
          </g>
        </svg>
      );

    default:
      return null;
  }
};
