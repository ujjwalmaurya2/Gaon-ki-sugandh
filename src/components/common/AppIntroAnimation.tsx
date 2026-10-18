import React, { useState, useEffect, useRef, useCallback } from 'react';

type IntroPhase = 'enter' | 'reveal' | 'accent' | 'exit' | 'done';

const STORAGE_KEY = 'gks_has_seen_intro';

export const AppIntroAnimation: React.FC = () => {
  const [phase, setPhase] = useState<IntroPhase>(() => {
    if (typeof window === 'undefined') return 'done';

    // Respect reduced motion preference
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return 'done';
    }

    // Check if page was reloaded (allow seeing it on explicit reload)
    const navEntries = window.performance?.getEntriesByType?.('navigation');
    const isReload = navEntries && navEntries.length > 0 && (navEntries[0] as PerformanceNavigationTiming).type === 'reload';

    // If already seen in this session and NOT a reload, skip immediately
    const hasSeen = sessionStorage.getItem(STORAGE_KEY) === 'true';
    if (hasSeen && !isReload) {
      return 'done';
    }

    return 'enter';
  });

  const timerRefs = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  const handleSkip = useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // ignore storage errors
    }
    setPhase('exit');
    const t = setTimeout(() => {
      setPhase('done');
    }, 150);
    timerRefs.current.push(t);
  }, []);

  useEffect(() => {
    if (phase === 'done') return;

    // Stage timeline
    // 0ms: enter (background fade in)
    // 80ms: reveal (logo icon & brand name scale + fade in)
    // 380ms: accent (expanding purity line & farm-fresh pill)
    // 1050ms: exit (smooth fade out and transition into homepage)
    // 1400ms: done (unmount overlay)

    const t1 = setTimeout(() => {
      setPhase('reveal');
    }, 80);

    const t2 = setTimeout(() => {
      setPhase('accent');
    }, 380);

    const t3 = setTimeout(() => {
      setPhase('exit');
    }, 1050);

    const t4 = setTimeout(() => {
      try {
        sessionStorage.setItem(STORAGE_KEY, 'true');
      } catch {
        // ignore
      }
      setPhase('done');
    }, 1400);

    timerRefs.current = [t1, t2, t3, t4];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      timerRefs.current.forEach(clearTimeout);
      timerRefs.current = [];
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleSkip]);

  if (phase === 'done') return null;

  const isExiting = phase === 'exit';

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Welcome to Gaon Ki Sugandh"
      onClick={handleSkip}
      className={`fixed inset-0 z-[60] flex flex-col items-center justify-center overflow-hidden select-none cursor-pointer transition-all duration-350 ease-out ${
        isExiting ? 'opacity-0 scale-[1.02] pointer-events-none' : 'opacity-100 scale-100'
      } bg-gradient-to-b from-[#FFFDF8] via-[#FAF9F5] to-[#F3F5F2]`}
    >
      {/* Ambient Organic Warm Glow */}
      <div 
        className={`absolute w-[320px] h-[320px] sm:w-[460px] sm:h-[460px] rounded-full bg-gradient-to-tr from-brand-yellowLight/50 via-emerald-100/35 to-brand-greenLight/45 blur-3xl pointer-events-none transition-transform duration-1000 ease-out ${
          phase === 'enter' ? 'scale-75 opacity-40' : 'scale-105 opacity-80'
        }`}
      />

      {/* Top Skip Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleSkip();
        }}
        className="absolute top-4 right-4 z-10 px-3 py-1 text-xs font-semibold text-brand-muted/80 hover:text-brand-dark bg-white/70 hover:bg-white rounded-full border border-brand-border/60 transition-all shadow-2xs"
        aria-label="Skip intro animation"
      >
        Skip ✕
      </button>

      {/* Main Centered Content */}
      <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center max-w-sm mx-auto">
        {/* Stage 2: Logo Icon Reveal */}
        <div 
          className={`relative transition-all duration-500 ease-out ${
            phase === 'enter' ? 'opacity-0 scale-90 translate-y-3' : 'opacity-100 scale-100 translate-y-0'
          }`}
        >
          {/* Subtle pulsating halo ring */}
          <div className="absolute -inset-2.5 rounded-3xl bg-brand-green/15 blur-md animate-pulse pointer-events-none" />

          {/* Existing Brand Icon */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-brand-green flex items-center justify-center text-brand-yellow shadow-xl shadow-brand-green/25 relative border border-brand-greenDark">
            <svg 
              className="w-10 h-10 sm:w-12 sm:h-12" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
            >
              <path 
                d="M12 2L4 9v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-8-7z" 
                fill="#086518" 
                stroke="#F8CB46" 
                strokeWidth="1.5"
              />
              <path 
                d="M12 8c-2 2-3 4-3 6a3 3 0 0 0 6 0c0-2-1-4-3-6z" 
                fill="#F8CB46" 
                stroke="#FFFFFF" 
                strokeWidth="1"
              />
            </svg>
          </div>
        </div>

        {/* Brand Typography */}
        <div 
          className={`text-center mt-4 transition-all duration-500 delay-100 ease-out ${
            phase === 'enter' ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-brand-green leading-none">
              Gaon Ki
            </span>
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-brand-dark leading-none">
              Sugandh
            </span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-brand-muted tracking-wide mt-1.5">
            शुद्धता हर घर तक • 100% Organic
          </p>
        </div>

        {/* Stage 3: Premium Organic Motion Detail (Purity Accent Line) */}
        <div className="w-28 sm:w-36 h-[2px] mx-auto mt-3 overflow-hidden rounded-full">
          <div 
            className={`w-full h-full bg-gradient-to-r from-transparent via-brand-green to-transparent transition-transform duration-600 ease-out ${
              phase === 'accent' || phase === 'exit' ? 'scale-x-100' : 'scale-x-0'
            }`} 
          />
        </div>

        {/* Supporting Organic Trust Badge */}
        <div 
          className={`mt-3 transition-all duration-500 delay-200 ease-out flex items-center justify-center ${
            phase === 'accent' || phase === 'exit' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/90 text-brand-greenDark text-[11px] font-bold rounded-full border border-brand-green/25 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
            <span>Direct From Certified Village Farms</span>
          </span>
        </div>
      </div>
    </div>
  );
};
