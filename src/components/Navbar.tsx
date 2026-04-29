"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import Logo from "./Logo";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const handleScroll = () => {
      if (isMounted) setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      isMounted = false;
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // On home page, before scroll: transparent with white text
  // After scroll or on other pages: white background with dark text
  const navClass = isHome && !isScrolled
    ? "bg-transparent border-transparent"
    : "bg-white/80 backdrop-blur-xl border-gray-100 shadow-sm";

  const textClass = isHome && !isScrolled
    ? "text-white"
    : "text-gray-900";

  const linkClass = isHome && !isScrolled
    ? "text-white/60 hover:text-white"
    : "text-gray-400 hover:text-gray-900";

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${navClass}`}>
      <div className="max-w-7xl mx-auto px-8 md:px-20">
        <div className="flex justify-between items-center h-24">
          <Link href="/" className={`flex items-center gap-4 font-black text-xl tracking-tighter uppercase transition-colors ${textClass}`}>
            <Logo className="w-8 h-8" />
            Edvisr.
          </Link>
          <nav className="hidden md:flex gap-12">
            <Link href="/" className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all ${linkClass}`}>
              Archive
            </Link>
            <Link href="/predictor" className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all ${linkClass}`}>
              Predictor
            </Link>
            <Link href="/compare" className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all ${linkClass}`}>
              Compare
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
