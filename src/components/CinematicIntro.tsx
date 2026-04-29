"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";

export default function CinematicIntro() {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Stage 1: Logo display
    const logoTimeout = setTimeout(() => {
      setIsAnimating(true);
    }, 1500);

    // Stage 2: Full reveal
    const revealTimeout = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    return () => {
      clearTimeout(logoTimeout);
      clearTimeout(revealTimeout);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-black transition-all duration-1000 ease-in-out ${isAnimating ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
      <div className={`flex flex-col items-center gap-8 transition-all duration-700 ${isAnimating ? "scale-110 blur-xl opacity-0" : "scale-100 blur-0 opacity-100"}`}>
        <Logo className="w-24 h-24 text-white" />
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-white font-black text-4xl tracking-[-0.05em] uppercase">Edvisr.</h1>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.5em]">Architecting Futures</p>
        </div>
      </div>
      
      {/* Decorative lines for architectural feel */}
      <div className={`absolute top-0 left-0 w-full h-px bg-white/10 transition-all duration-1000 delay-300 ${isAnimating ? "translate-y-[-100px]" : "translate-y-20"}`}></div>
      <div className={`absolute bottom-0 left-0 w-full h-px bg-white/10 transition-all duration-1000 delay-300 ${isAnimating ? "translate-y-[100px]" : "translate-y-[-80px]"}`}></div>
    </div>
  );
}
